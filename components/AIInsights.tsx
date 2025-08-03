import React from 'react';
import { Brain, Lightbulb, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  insights: any[];
}

const AIInsights = ({ insights }: AIInsightsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 text-purple-600 mr-2" />
          AI Insights
        </h3>
      </div>
      
      <div className="p-6">
        {insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-purple-800 leading-relaxed">{insight}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-800 mb-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Next Analysis</span>
              </div>
              <p className="text-xs text-blue-700">
                AI will analyze your productivity patterns again in{' '}
                {60 - new Date().getMinutes()} minutes
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              AI insights will appear here once you start adding tasks and connecting your accounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;