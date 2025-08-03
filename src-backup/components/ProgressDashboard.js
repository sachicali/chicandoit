import React from 'react';
import { BarChart3, TrendingUp, Clock, Target, Zap, Award } from 'lucide-react';

const ProgressDashboard = ({ tasks, completedTasks, totalTasks, productivityStats }) => {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => 
    (t.priority === 'High' || t.priority === 'Critical') && t.status !== 'Completed'
  ).length;
  
  // Calculate estimated time remaining
  const pendingTime = tasks
    .filter(t => t.status !== 'Completed')
    .reduce((total, task) => total + (task.estimated_time || 0), 0);

  const getProgressColor = () => {
    if (progressPercentage >= 80) return 'from-green-500 to-emerald-600';
    if (progressPercentage >= 50) return 'from-blue-500 to-indigo-600';
    if (progressPercentage >= 25) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getProgressMessage = () => {
    if (totalTasks === 0) return "Add your first task to get started on your productivity journey!";
    if (progressPercentage === 100) return "Outstanding! All tasks completed! You're on fire! 🔥";
    if (progressPercentage >= 80) return "Almost there! You're crushing your goals! 💪";
    if (progressPercentage >= 50) return "Great momentum! Keep the energy flowing! ⚡";
    return "Every expert was once a beginner. Let's build momentum! 🚀";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Success is the sum of small efforts repeated day in and day out.",
      "The way to get started is to quit talking and begin doing.",
      "Don't watch the clock; do what it does. Keep going.",
      "The future depends on what you do today.",
      "Productivity is never an accident. It's always the result of commitment to excellence."
    ];
    return quotes[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % quotes.length];
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold mb-2">Daily Progress</h2>
            <p className="text-blue-100 text-lg">{getProgressMessage()}</p>
            <p className="text-blue-200 text-sm italic">"{getMotivationalQuote()}"</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-2">{completedTasks}<span className="text-3xl text-blue-200">/{totalTasks}</span></div>
            <div className="text-blue-100 text-lg">Tasks Completed</div>
            {progressPercentage > 0 && (
              <div className="bg-white/20 rounded-full px-4 py-1 mt-2">
                <span className="text-sm font-semibold">{Math.round(progressPercentage)}% Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Overall Progress
            </span>
            <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${getProgressColor()} shadow-lg`}
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent to-white/30"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-blue-200" />
              <span className="text-xs text-blue-200 font-medium">PENDING</span>
            </div>
            <p className="text-2xl font-bold">{pendingTasks}</p>
            <p className="text-blue-100 text-sm">Tasks Left</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-red-300" />
              <span className="text-xs text-red-200 font-medium">PRIORITY</span>
            </div>
            <p className="text-2xl font-bold">{highPriorityTasks}</p>
            <p className="text-blue-100 text-sm">High Priority</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-green-300" />
              <span className="text-xs text-green-200 font-medium">TIME</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(pendingTime / 60)}<span className="text-sm">h</span></p>
            <p className="text-blue-100 text-sm">Est. Left</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-6 h-6 text-purple-300" />
              <span className="text-xs text-purple-200 font-medium">RATE</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(progressPercentage)}<span className="text-sm">%</span></p>
            <p className="text-blue-100 text-sm">Complete</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-yellow-300" />
              <span className="text-xs text-yellow-200 font-medium">STREAK</span>
            </div>
            <p className="text-2xl font-bold">{productivityStats?.weekly_progress?.length || 0}</p>
            <p className="text-blue-100 text-sm">Days Active</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">🤖</div>
              <span className="text-xs text-orange-200 font-medium">NEXT</span>
            </div>
            <p className="text-2xl font-bold">{60 - new Date().getMinutes()}<span className="text-sm">m</span></p>
            <p className="text-blue-100 text-sm">AI Check</p>
          </div>
        </div>

        {/* Achievement Badges */}
        {progressPercentage >= 100 && (
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="font-bold text-white">Perfect Day Achievement!</p>
            <p className="text-yellow-100 text-sm">You completed all your tasks today!</p>
          </div>
        )}

        {progressPercentage >= 80 && progressPercentage < 100 && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <p className="font-bold text-white">Superstar Performance!</p>
            <p className="text-green-100 text-sm">You're having an excellent productive day!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;