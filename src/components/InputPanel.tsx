import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Plus } from 'lucide-react';
import type { PromptData } from '../App';

interface InputPanelProps {
  onAnalyze: (text: string, name?: string) => void;
  prompts: PromptData[];
  selectedPromptId: string | null;
  onSelectPrompt: (id: string) => void;
  onDeletePrompt: (id: string) => void;
}

export function InputPanel({
  onAnalyze,
  prompts,
  selectedPromptId,
  onSelectPrompt,
  onDeletePrompt,
}: InputPanelProps) {
  const [inputText, setInputText] = useState('');
  const [promptName, setPromptName] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          onAnalyze(text, file.name);
          setInputText('');
          setPromptName('');
        };
        reader.readAsText(file);
      });
    },
  });

  const handleAnalyze = () => {
    if (inputText.trim()) {
      onAnalyze(inputText, promptName || undefined);
      setInputText('');
      setPromptName('');
    }
  };

  const handleLoadExample = () => {
    const examplePrompt = `You are a helpful AI assistant with expertise in data analysis and visualization. Please analyze the following dataset and provide insights:

Dataset: Sales performance data for Q1-Q4 2023
- Q1: $125,000 revenue, 450 transactions
- Q2: $145,000 revenue, 520 transactions  
- Q3: $132,000 revenue, 480 transactions
- Q4: $178,000 revenue, 610 transactions

Please provide:
1. Revenue growth analysis by quarter
2. Average transaction value trends
3. Seasonal patterns and recommendations
4. Forecasts for Q1 2024

Format your response with clear headings, bullet points, and actionable insights for the sales team.`;
    
    setInputText(examplePrompt);
    setPromptName('Example Analysis Prompt');
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Prompt
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Name (Optional)
            </label>
            <input
              type="text"
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              placeholder="e.g., Customer Support Template"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your prompt text here..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-500 mt-1">
              {inputText.length} characters
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={handleLoadExample}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Load Example
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Upload File</h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop files here...'
              : 'Drag & drop files or click to browse'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports .txt, .md, .json files
          </p>
        </div>
      </div>

      {/* Prompt Library */}
      {prompts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">
            Prompt Library ({prompts.length})
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPromptId === prompt.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onSelectPrompt(prompt.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-900">
                        {prompt.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {prompt.text.substring(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {prompt.analysis.totalTokens} tokens
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePrompt(prompt.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}