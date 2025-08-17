import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpDown, DollarSign, Hash, Type } from 'lucide-react';
import type { PromptData } from '../App';

interface ComparisonPanelProps {
  prompts: PromptData[];
}

export function ComparisonPanel({ prompts }: ComparisonPanelProps) {
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'tokens' | 'cost' | 'efficiency'>('tokens');

  if (prompts.length < 2) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚖️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Need More Prompts
        </h3>
        <p className="text-gray-500">
          Add at least 2 prompts to start comparing their token usage and costs.
        </p>
      </div>
    );
  }

  const togglePromptSelection = (id: string) => {
    setSelectedPrompts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const promptsToCompare = selectedPrompts.length > 0 
    ? prompts.filter(p => selectedPrompts.includes(p.id))
    : prompts.slice(0, 4); // Show top 4 by default

  // Prepare data for comparison chart
  const comparisonData = promptsToCompare.map(prompt => ({
    name: prompt.name.length > 15 ? prompt.name.substring(0, 15) + '...' : prompt.name,
    fullName: prompt.name,
    tokens: prompt.analysis.totalTokens,
    words: prompt.analysis.wordCount,
    characters: prompt.text.length,
    gpt4Cost: (prompt.analysis.totalTokens / 1000) * 0.03,
    gpt35Cost: (prompt.analysis.totalTokens / 1000) * 0.0015,
    efficiency: (prompt.analysis.uniqueTokens / prompt.analysis.totalTokens) * 100,
  }));

  // Sort prompts based on selected criteria
  const sortedPrompts = [...prompts].sort((a, b) => {
    switch (sortBy) {
      case 'tokens':
        return b.analysis.totalTokens - a.analysis.totalTokens;
      case 'cost':
        return (b.analysis.totalTokens * 0.03) - (a.analysis.totalTokens * 0.03);
      case 'efficiency':
        return (b.analysis.uniqueTokens / b.analysis.totalTokens) - (a.analysis.uniqueTokens / a.analysis.totalTokens);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Prompt Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Prompts to Compare
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="tokens">Token Count</option>
              <option value="cost">Cost (GPT-4)</option>
              <option value="efficiency">Efficiency</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {sortedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPrompts.includes(prompt.id) || selectedPrompts.length === 0
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => togglePromptSelection(prompt.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 truncate">{prompt.name}</h4>
                <input
                  type="checkbox"
                  checked={selectedPrompts.includes(prompt.id) || selectedPrompts.length === 0}
                  onChange={() => {}}
                  className="text-blue-600"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <span>{prompt.analysis.totalTokens} tokens</span>
                <span>{prompt.analysis.wordCount} words</span>
                <span>${((prompt.analysis.totalTokens / 1000) * 0.03).toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Token Count Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value, name, props) => [
                value,
                name === 'tokens' ? 'Tokens' : name === 'words' ? 'Words' : 'Characters'
              ]}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            />
            <Legend />
            <Bar dataKey="tokens" fill="#3B82F6" name="Tokens" />
            <Bar dataKey="words" fill="#10B981" name="Words" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cost Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value: number, name) => [
                `$${value.toFixed(4)}`, 
                name === 'gpt4Cost' ? 'GPT-4' : 'GPT-3.5 Turbo'
              ]}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            />
            <Legend />
            <Bar dataKey="gpt4Cost" fill="#EF4444" name="GPT-4" />
            <Bar dataKey="gpt35Cost" fill="#F59E0B" name="GPT-3.5 Turbo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Metrics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Prompt</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Tokens</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Words</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Characters</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">GPT-4 Cost</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {promptsToCompare.map((prompt, index) => (
                <tr key={prompt.id} className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-900 max-w-40 truncate">
                    {prompt.name}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-700">
                    {prompt.analysis.totalTokens.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-700">
                    {prompt.analysis.wordCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-700">
                    {prompt.text.length.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-green-600 font-medium">
                    ${((prompt.analysis.totalTokens / 1000) * 0.03).toFixed(4)}
                  </td>
                  <td className="py-3 px-2 text-right text-blue-600 font-medium">
                    {((prompt.analysis.uniqueTokens / prompt.analysis.totalTokens) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Hash className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Most Efficient</h4>
          </div>
          {(() => {
            const mostEfficient = promptsToCompare.reduce((a, b) => 
              (a.analysis.uniqueTokens / a.analysis.totalTokens) > (b.analysis.uniqueTokens / b.analysis.totalTokens) ? a : b
            );
            return (
              <div>
                <p className="font-medium text-blue-600">{mostEfficient.name}</p>
                <p className="text-sm text-gray-600">
                  {((mostEfficient.analysis.uniqueTokens / mostEfficient.analysis.totalTokens) * 100).toFixed(1)}% efficiency
                </p>
              </div>
            );
          })()}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Most Cost-Effective</h4>
          </div>
          {(() => {
            const cheapest = promptsToCompare.reduce((a, b) => 
              a.analysis.totalTokens < b.analysis.totalTokens ? a : b
            );
            return (
              <div>
                <p className="font-medium text-green-600">{cheapest.name}</p>
                <p className="text-sm text-gray-600">
                  ${((cheapest.analysis.totalTokens / 1000) * 0.03).toFixed(4)} per request
                </p>
              </div>
            );
          })()}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpDown className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Token Range</h4>
          </div>
          {(() => {
            const tokens = promptsToCompare.map(p => p.analysis.totalTokens);
            const min = Math.min(...tokens);
            const max = Math.max(...tokens);
            return (
              <div>
                <p className="font-medium text-purple-600">{min.toLocaleString()} - {max.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {((max - min) / min * 100).toFixed(0)}% difference
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}