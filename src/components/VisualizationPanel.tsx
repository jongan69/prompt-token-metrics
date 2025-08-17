import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { PromptData } from '../App';

interface VisualizationPanelProps {
  prompt: PromptData;
}

export function VisualizationPanel({ prompt }: VisualizationPanelProps) {
  const { analysis } = prompt;

  // Token length distribution
  const tokenLengthData = analysis.tokenLengthDistribution.map((count, length) => ({
    length: length + 1,
    count,
  })).filter(item => item.count > 0);

  // Top tokens for bar chart
  const topTokensData = analysis.topTokens.slice(0, 10).map(token => ({
    token: token.token.length > 10 ? token.token.substring(0, 10) + '...' : token.token,
    frequency: token.frequency,
    fullToken: token.token,
  }));

  // Character type distribution
  const charTypeData = [
    { name: 'Letters', value: prompt.text.match(/[a-zA-Z]/g)?.length || 0, color: '#3B82F6' },
    { name: 'Numbers', value: prompt.text.match(/[0-9]/g)?.length || 0, color: '#10B981' },
    { name: 'Special', value: analysis.specialCharCount, color: '#F59E0B' },
    { name: 'Whitespace', value: analysis.whitespaceCount, color: '#6B7280' },
  ];

  // Cost comparison data
  const costData = [
    { model: 'GPT-4', cost: (analysis.totalTokens / 1000) * 0.03 },
    { model: 'GPT-3.5', cost: (analysis.totalTokens / 1000) * 0.0015 },
    { model: 'Claude Opus', cost: (analysis.totalTokens / 1000) * 0.015 },
    { model: 'Claude Sonnet', cost: (analysis.totalTokens / 1000) * 0.003 },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Token Length Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Token Length Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tokenLengthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="length" 
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
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Tokens and Character Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tokens */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Frequent Tokens
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTokensData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="token"
                stroke="#6B7280"
                tick={{ fontSize: 10 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value, name, props) => [
                  value,
                  `"${props.payload.fullToken}"`
                ]}
              />
              <Bar 
                dataKey="frequency" 
                fill="#10B981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Character Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Character Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {charTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cost Comparison Across Models
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="model" 
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
              formatter={(value: number) => [`$${value.toFixed(4)}`, 'Input Cost']}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Statistical Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(...analysis.tokenLengthDistribution.map((_, i) => i + 1).filter((_, i) => analysis.tokenLengthDistribution[i] > 0))}
            </div>
            <div className="text-sm text-gray-600">Longest Token</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.min(...analysis.tokenLengthDistribution.map((_, i) => i + 1).filter((_, i) => analysis.tokenLengthDistribution[i] > 0))}
            </div>
            <div className="text-sm text-gray-600">Shortest Token</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.avgTokenLength.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Token Length</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {((analysis.uniqueTokens / analysis.totalTokens) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Uniqueness</div>
          </div>
        </div>
      </div>
    </div>
  );
}