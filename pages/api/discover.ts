import { NextApiRequest, NextApiResponse } from 'next';
import { Julep } from '@julep/sdk';

interface WorkflowInput {
  min_score: number;
  num_stories: number;
  user_preferences: string[];
}

interface Story {
  url: string;
  title: string;
  hn_url: string;
  summary: string;
  comments_count: number;
}

interface WorkflowOutput {
  final_output: Story[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { min_score = 50, num_stories = 10, user_preferences } = req.body as WorkflowInput;

  if (!user_preferences || user_preferences.length === 0) {
    return res.status(400).json({ error: 'User preferences are required' });
  }

  try {
    // Check environment variables
    if (!process.env.JULEP_API_KEY) {
      console.error('Missing JULEP_API_KEY environment variable');
      return res.status(500).json({ error: 'Server configuration error: Missing API key' });
    }
    
    if (!process.env.JULEP_TASK_ID) {
      console.error('Missing JULEP_TASK_ID environment variable');
      return res.status(500).json({ error: 'Server configuration error: Missing task ID' });
    }

    const client = new Julep({
      apiKey: process.env.JULEP_API_KEY,
      environment: 'production'
    });

    const TASK_ID = process.env.JULEP_TASK_ID;

    console.log('Creating Julep execution with input:', {
      min_score,
      num_stories,
      user_preferences
    });

    // Create execution
    const execution = await client.executions.create(TASK_ID, {
      input: {
        min_score,
        num_stories,
        user_preferences
      }
    });

    console.log('Execution created:', execution.id);

    // Poll for execution completion
    let executionResult = await client.executions.get(execution.id);
    const maxWaitTime = 600000; // 10 minutes
    const startTime = Date.now();
    
    while (
      executionResult.status !== 'succeeded' && 
      executionResult.status !== 'failed' &&
      (Date.now() - startTime) < maxWaitTime
    ) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      executionResult = await client.executions.get(execution.id);
      console.log(`Execution status: ${executionResult.status} (elapsed: ${Date.now() - startTime}ms)`);
    }

    if (executionResult.status === 'failed') {
      console.error('Julep execution failed:', executionResult);
      return res.status(500).json({ error: 'Workflow execution failed' });
    }

    if (executionResult.status !== 'succeeded') {
      console.error('Julep execution timed out');
      return res.status(500).json({ error: 'Workflow execution timed out' });
    }

    console.log('Execution succeeded, output:', JSON.stringify(executionResult.output, null, 2));

    // Return the output directly (assuming it matches our expected format)
    const output = executionResult.output as WorkflowOutput;
    
    if (!output.final_output || !Array.isArray(output.final_output)) {
      console.error('Invalid output format:', output);
      return res.status(500).json({ error: 'Invalid workflow output format' });
    }

    return res.status(200).json(output);
  } catch (error) {
    console.error('Error processing discovery request:', error);
    return res.status(500).json({ 
      error: 'Failed to process discovery request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}