# HackerPulse - Next.js

A personalized Hacker News story discovery tool that uses Julep AI workflows to find and summarize stories matching your technology interests.

## Features

- Add multiple technology interests/preferences
- Configure minimum story score and number of stories
- AI-powered story discovery and summarization
- Clean, responsive UI built with Next.js and Tailwind CSS

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Julep API credentials:
     - `JULEP_API_KEY`: Your Julep API key
     - `JULEP_TASK_ID`: Your Julep task ID for the HackerNews workflow

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push this code to a GitHub repository

2. Import the project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Configure environment variables in Vercel:
   - Add `JULEP_API_KEY`
   - Add `JULEP_TASK_ID`

4. Deploy!

## Julep Workflow Input Schema

The Julep workflow expects the following input:

```json
{
  "min_score": 50,           // Minimum HN story score
  "num_stories": 10,         // Number of stories to fetch
  "user_preferences": [      // Array of technology interests
    "AI/ML",
    "Python",
    "Startups"
  ]
}
```

## API Endpoint

- `POST /api/discover` - Triggers the Julep workflow with user preferences

Request body:
```json
{
  "min_score": 50,
  "num_stories": 10,
  "user_preferences": ["AI/ML", "Python"]
}
```

Response:
```json
{
  "final_output": [
    {
      "url": "https://example.com/article",
      "title": "Article Title",
      "hn_url": "https://news.ycombinator.com/item?id=123",
      "summary": "AI-generated summary...",
      "comments_count": 42
    }
  ]
}
```