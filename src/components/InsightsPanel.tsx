import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Lightbulb, DollarSign } from 'lucide-react';
import type { PromptData } from '../App';

interface InsightsPanelProps {
  prompt: PromptData;
}

export function InsightsPanel({ prompt }: InsightsPanelProps) {
  const { analysis, text } = prompt;

  // Generate insights based on analysis
  const insights = generateInsights(analysis, text);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'improvement': return TrendingUp;
      case 'cost': return DollarSign;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'improvement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cost': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Optimization Score
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {insights.score}/100
            </div>
            <div className="text-sm text-gray-600">Efficiency Score</div>
          </div>
          <div className={`p-4 rounded-full ${insights.score >= 80 ? 'bg-green-100' : insights.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
            {insights.score >= 80 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : insights.score >= 60 ? (
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              insights.score >= 80 ? 'bg-green-500' : 
              insights.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${insights.score}%` }}
          ></div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.items.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colorClasses = getInsightColor(insight.type);
          
          return (
            <div key={index} className={`border rounded-lg p-6 ${colorClasses}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-sm mb-3">{insight.description}</p>
                  {insight.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Suggestions:</p>
                      <ul className="text-sm space-y-1">
                        {insight.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insight.impact && (
                    <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
                      <strong>Potential Impact:</strong> {insight.impact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Quick Optimization Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Reduce Token Count</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Remove unnecessary adjectives</li>
              <li>• Use shorter synonyms</li>
              <li>• Combine similar instructions</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Improve Clarity</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Use clear, specific language</li>
              <li>• Add numbered lists for steps</li>
              <li>• Define technical terms</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Cost Optimization</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Consider using shorter models</li>
              <li>• Batch similar requests</li>
              <li>• Cache common responses</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Structure</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Use consistent formatting</li>
              <li>• Separate concerns clearly</li>
              <li>• Add clear sections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateInsights(analysis: any, text: string) {
  const insights = [];
  let score = 100;

  // Token efficiency analysis
  if (analysis.totalTokens > 2000) {
    insights.push({
      type: 'warning',
      title: 'High Token Count',
      description: `Your prompt uses ${analysis.totalTokens} tokens, which may result in higher costs and slower processing.`,
      suggestions: [
        'Consider breaking down complex instructions into simpler parts',
        'Remove redundant information or examples',
        'Use more concise language where possible'
      ],
      impact: `Could save ~$${((analysis.totalTokens - 1500) / 1000 * 0.03).toFixed(3)} per request with GPT-4`
    });
    score -= 15;
  }

  // Repetition analysis
  const repetitionRate = (1 - analysis.uniqueTokens / analysis.totalTokens) * 100;
  if (repetitionRate > 30) {
    insights.push({
      type: 'improvement',
      title: 'High Repetition Rate',
      description: `${repetitionRate.toFixed(1)}% of your tokens are repeated, indicating potential redundancy.`,
      suggestions: [
        'Review for repeated phrases or concepts',
        'Use pronouns instead of repeating nouns',
        'Consolidate similar instructions'
      ],
      impact: `Could reduce token count by ~${Math.floor(analysis.totalTokens * (repetitionRate / 100) * 0.5)} tokens`
    });
    score -= 10;
  }

  // Average token length analysis
  if (analysis.avgTokenLength > 8) {
    insights.push({
      type: 'warning',
      title: 'Complex Vocabulary',
      description: `Average token length of ${analysis.avgTokenLength.toFixed(1)} suggests use of complex or uncommon words.`,
      suggestions: [
        'Replace complex terms with simpler alternatives',
        'Avoid jargon unless necessary',
        'Use common words when possible'
      ],
      impact: 'Improve model understanding and reduce processing complexity'
    });
    score -= 8;
  }

  // Sentence length analysis
  if (analysis.avgTokensPerSentence > 25) {
    insights.push({
      type: 'improvement',
      title: 'Long Sentences',
      description: `Average sentence length of ${analysis.avgTokensPerSentence.toFixed(1)} tokens may affect readability.`,
      suggestions: [
        'Break long sentences into shorter ones',
        'Use bullet points for lists',
        'Separate different concepts into different sentences'
      ],
      impact: 'Improve clarity and model comprehension'
    });
    score -= 5;
  }

  // Cost efficiency
  const gpt4Cost = (analysis.totalTokens / 1000) * 0.03;
  if (gpt4Cost > 0.10) {
    insights.push({
      type: 'cost',
      title: 'High Input Cost',
      description: `This prompt costs approximately $${gpt4Cost.toFixed(3)} per request with GPT-4.`,
      suggestions: [
        'Consider using GPT-3.5 Turbo for less complex tasks',
        'Optimize prompt length to reduce costs',
        'Cache responses for repeated queries'
      ],
      impact: `Could save up to ${((gpt4Cost - 0.01) / gpt4Cost * 100).toFixed(0)}% on costs`
    });
    score -= 10;
  }

  // Positive insights
  if (analysis.totalTokens < 500) {
    insights.push({
      type: 'success',
      title: 'Efficient Token Usage',
      description: 'Your prompt is concise and cost-effective.',
      suggestions: [],
      impact: 'Low cost and fast processing'
    });
    score += 5;
  }

  if (repetitionRate < 15) {
    insights.push({
      type: 'success',
      title: 'Good Vocabulary Diversity',
      description: 'Low repetition rate indicates efficient word usage.',
      suggestions: [],
      impact: 'Optimal token efficiency'
    });
    score += 5;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  return { score, items: insights };
}