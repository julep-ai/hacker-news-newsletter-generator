import { useState } from 'react';
import { Search, Loader2, Settings, Zap, Plus, X } from 'lucide-react';

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

export default function Home() {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [currentPreference, setCurrentPreference] = useState('');
  const [minScore, setMinScore] = useState(50);
  const [numStories, setNumStories] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WorkflowOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const techSuggestions = [
    'AI/ML', 'Python', 'JavaScript', 'React', 'Node.js', 'Rust',
    'Go', 'Kubernetes', 'Docker', 'Web3', 'Blockchain', 'DevOps',
    'Cloud Computing', 'AWS', 'Security', 'Startups', 'Open Source'
  ];

  const addPreference = () => {
    if (currentPreference.trim() && !preferences.includes(currentPreference.trim())) {
      setPreferences([...preferences, currentPreference.trim()]);
      setCurrentPreference('');
    }
  };

  const removePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (preferences.length === 0) {
      setError('Please add at least one technology interest');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          min_score: minScore,
          num_stories: numStories,
          user_preferences: preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch stories: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo-removebg.png" alt="Hacker News" className="w-12 h-12 rounded-xl" />
              <h1 className="text-3xl font-bold text-gray-900">Hacker News</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover HackerNews stories and insights based on your interests
            </p>
            
            {/* Julep Branding - More prominent */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-base text-gray-600">Powered by</span>
              <a href="https://dashboard.julep.ai/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="/julep.svg" alt="Julep" className="h-7" />
              </a>
              <div className="flex items-center gap-3 text-sm">
                <a href="https://dashboard.julep.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Dashboard
                </a>
                <span className="text-gray-400">|</span>
                <a href="https://docs.julep.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Build Your Own Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Own AI Agent</h3>
              <p className="text-gray-700 mb-3">
                Want to create your own AI-powered Hacker News agent? Learn how with our step-by-step tutorial.{' '}
                <a 
                  href="https://docs.julep.ai/tutorials/hacker-news-newsletter" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  📚 Follow the Tutorial
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </p>
              <div className="text-sm text-gray-600">
                For quick deployment, visit the <a href="https://dashboard.julep.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Julep Dashboard</a> → Templates tab → HN Newsletter Generator
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Discovery Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Preferences Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Interests
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentPreference}
                  onChange={(e) => setCurrentPreference(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                  placeholder="Enter a technology interest..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addPreference}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {techSuggestions.filter(s => !preferences.includes(s)).slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setCurrentPreference(suggestion);
                      addPreference();
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>

              {/* Selected preferences */}
              {preferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferences.map((pref, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      <span>{pref}</span>
                      <button
                        type="button"
                        onClick={() => removePreference(index)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minScore" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Story Score
                </label>
                <input
                  id="minScore"
                  type="number"
                  min="1"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only include stories with at least this many points
                </p>
              </div>

              <div>
                <label htmlFor="numStories" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stories
                </label>
                <input
                  id="numStories"
                  type="number"
                  min="1"
                  max="50"
                  value={numStories}
                  onChange={(e) => setNumStories(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum number of stories to analyze
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading || preferences.length === 0}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-orange-600 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {isLoading ? 'Discovering Stories...' : 'Discover Stories'}
            </button>
          </div>
        </form>

        {/* Results */}
        {results && results.final_output && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Personalized Stories
              </h2>
              <p className="text-gray-600">
                Found {results.final_output.length} stories matching your interests
              </p>
            </div>

            <div className="space-y-4">
              {results.final_output.map((story, index) => (
                <div
                  key={`${story.hn_url}-${index}`}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {story.title}
                    </a>
                  </h3>
                  
                  <p className="text-gray-700 mb-4">{story.summary}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <a
                      href={story.hn_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-600 transition-colors"
                    >
                      {story.comments_count} comments on HN
                    </a>
                    <span>•</span>
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Read article →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}