import React from 'react';
import { Clock, DollarSign, Hash, Type, Percent, FileText } from 'lucide-react';
import type { PromptData } from '../App';

interface AnalysisPanelProps {
  prompt: PromptData;
}

export function AnalysisPanel({ prompt }: AnalysisPanelProps) {
  const { analysis, text } = prompt;

  const stats = [
    {
      icon: Hash,
      label: 'Total Tokens',
      value: analysis.totalTokens.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Type,
      label: 'Characters',
      value: text.length.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: FileText,
      label: 'Words',
      value: analysis.wordCount.toLocaleString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Percent,
      label: 'Avg Token Length',
      value: analysis.avgTokenLength.toFixed(1),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const costEstimates = [
    { model: 'GPT-4', inputCost: 0.03, outputCost: 0.06 },
    { model: 'GPT-3.5 Turbo', inputCost: 0.0015, outputCost: 0.002 },
    { model: 'Claude 3 Opus', inputCost: 0.015, outputCost: 0.075 },
    { model: 'Claude 3 Sonnet', inputCost: 0.003, outputCost: 0.015 },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Token Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sentences</span>
              <span className="font-medium">{analysis.sentenceCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paragraphs</span>
              <span className="font-medium">{analysis.paragraphCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Tokens/Sentence</span>
              <span className="font-medium">{analysis.avgTokensPerSentence.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unique Tokens</span>
              <span className="font-medium">{analysis.uniqueTokens}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repetition Rate</span>
              <span className="font-medium">
                {((1 - analysis.uniqueTokens / analysis.totalTokens) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Cost Estimates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Cost Estimates (Input)
          </h3>
          <div className="space-y-3">
            {costEstimates.map((model) => {
              const cost = (analysis.totalTokens / 1000) * model.inputCost;
              return (
                <div key={model.model} className="flex justify-between items-center">
                  <span className="text-gray-600">{model.model}</span>
                  <span className="font-medium text-green-600">
                    ${cost.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              * Based on {analysis.totalTokens} tokens. Output costs vary by response length.
            </p>
          </div>
        </div>
      </div>

      {/* Character Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Character Analysis
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {analysis.specialCharCount}
            </div>
            <div className="text-sm text-gray-600">Special Characters</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {analysis.whitespaceCount}
            </div>
            <div className="text-sm text-gray-600">Whitespace</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {((analysis.specialCharCount / text.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Special Char %</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {((analysis.whitespaceCount / text.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Whitespace %</div>
          </div>
        </div>
      </div>

      {/* Token Frequency Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Most Frequent Tokens
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.topTokens.slice(0, 6).map((token, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-mono text-sm text-gray-800 truncate mr-2">
                "{token.token}"
              </span>
              <span className="text-sm font-medium text-gray-600">
                {token.frequency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}