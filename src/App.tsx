import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { VisualizationPanel } from './components/VisualizationPanel';
import { InsightsPanel } from './components/InsightsPanel';
import { ComparisonPanel } from './components/ComparisonPanel';
import { TokenAnalyzer, type AnalysisResult } from './utils/tokenAnalyzer';

export interface PromptData {
  id: string;
  name: string;
  text: string;
  analysis: AnalysisResult;
}

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const handleTextAnalysis = (text: string, name?: string) => {
    const analyzer = new TokenAnalyzer();
    const analysis = analyzer.analyze(text);
    
    const newPrompt: PromptData = {
      id: Date.now().toString(),
      name: name || `Prompt ${prompts.length + 1}`,
      text,
      analysis
    };

    setPrompts(prev => [...prev, newPrompt]);
    setSelectedPromptId(newPrompt.id);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    if (selectedPromptId === id) {
      setSelectedPromptId(prompts.length > 1 ? prompts[0]?.id : null);
    }
  };

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);

  const tabs = [
    { id: 'analyze', label: 'Analysis', icon: '📊' },
    { id: 'visualize', label: 'Charts', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'compare', label: 'Compare', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <InputPanel
              onAnalyze={handleTextAnalysis}
              prompts={prompts}
              selectedPromptId={selectedPromptId}
              onSelectPrompt={setSelectedPromptId}
              onDeletePrompt={handleDeletePrompt}
            />
          </div>

          {/* Main Analysis Panel */}
          <div className="lg:col-span-2">
            {selectedPrompt ? (
              <>
                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'analyze' && (
                    <AnalysisPanel prompt={selectedPrompt} />
                  )}
                  {activeTab === 'visualize' && (
                    <VisualizationPanel prompt={selectedPrompt} />
                  )}
                  {activeTab === 'insights' && (
                    <InsightsPanel prompt={selectedPrompt} />
                  )}
                  {activeTab === 'compare' && (
                    <ComparisonPanel prompts={prompts} />
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Prompt Selected
                </h3>
                <p className="text-gray-500">
                  Enter or upload a prompt to start analyzing its token structure and costs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;