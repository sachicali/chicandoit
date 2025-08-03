const OpenAI = require('openai');

class AIAnalysisEngine {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? 
      new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
    this.insights = [];
    this.lastAnalysis = null;
  }

  async generateInsights(tasks, communications) {
    if (!this.openai) {
      return this.generateFallbackInsights(tasks, communications);
    }

    try {
      const prompt = this.buildAnalysisPrompt(tasks, communications);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI productivity coach that analyzes tasks and communication patterns to provide actionable insights. Keep responses concise and actionable."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const aiInsights = response.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3);

      this.insights = aiInsights;
      this.lastAnalysis = new Date();
      
      return aiInsights;
    } catch (error) {
      console.error('AI analysis failed:', error.message);
      return this.generateFallbackInsights(tasks, communications);
    }
  }

  buildAnalysisPrompt(tasks, communications) {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    
    return `Analyze this productivity data and provide 3 brief, actionable insights:
    
    Tasks Status:
    - Total tasks: ${totalTasks}
    - Completed: ${completedTasks}
    - High priority pending: ${highPriorityTasks}
    
    Communication Activity:
    - Unread emails: ${communications.email?.unreadCount || 0}
    - Discord messages: ${communications.discord?.messageCount || 0}
    
    Focus on task completion strategies and communication management.`;
  }  generateFallbackInsights(tasks, communications) {
    const insights = [];
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
    
    if (totalTasks === 0) {
      insights.push("Start by adding your daily tasks to track your progress effectively.");
    } else {
      const completionRate = (completedTasks / totalTasks) * 100;
      if (completionRate >= 80) {
        insights.push(`Excellent progress! You've completed ${completionRate.toFixed(0)}% of your tasks.`);
      } else if (completionRate >= 50) {
        insights.push(`Good momentum! Focus on completing the remaining ${totalTasks - completedTasks} tasks.`);
      } else {
        insights.push(`${highPriorityTasks} high-priority tasks need attention. Consider tackling these first.`);
      }
    }

    if (communications.email?.unreadCount > 5) {
      insights.push(`${communications.email.unreadCount} unread emails may be distracting. Schedule focused email time.`);
    }

    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      insights.push("Peak productivity hours: 9-11 AM. Use this time for your most challenging tasks.");
    } else if (currentHour >= 14 && currentHour <= 16) {
      insights.push("Post-lunch productivity dip is normal. Consider lighter tasks or a short break.");
    }

    this.insights = insights.slice(0, 3);
    this.lastAnalysis = new Date();
    return this.insights;
  }

  async generateAccountabilityMessage(tasks, communications) {
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    if (!this.openai) {
      return this.generateFallbackAccountabilityMessage(pendingTasks, completedTasks);
    }

    try {
      const prompt = `Generate a brief, encouraging accountability message based on:
      - ${completedTasks.length} completed tasks
      - ${pendingTasks.length} pending tasks
      - Current time: ${new Date().toLocaleTimeString()}
      
      Keep it motivating and specific to their progress.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a supportive productivity coach. Create brief, encouraging check-in messages."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      return this.generateFallbackAccountabilityMessage(pendingTasks, completedTasks);
    }
  }  generateFallbackAccountabilityMessage(pendingTasks, completedTasks) {
    const messages = [
      `Great job completing ${completedTasks.length} tasks! ${pendingTasks.length} more to go - you've got this! 💪`,
      `Time check! You've finished ${completedTasks.length} tasks. Which one will you tackle next?`,
      `Progress update: ${completedTasks.length}/${completedTasks.length + pendingTasks.length} tasks done. Keep up the momentum! 🚀`,
      `Accountability moment: Focus on your next priority task. You're making solid progress! ✨`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  async generateDailySummary(tasks) {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const highPriorityCompleted = tasks.filter(t => t.priority === 'high' && t.status === 'completed').length;
    
    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      highPriorityCompleted,
      message: total > 0 ? 
        `You completed ${completed} out of ${total} tasks today (${Math.round((completed / total) * 100)}%). ${
          completed >= total * 0.8 ? 'Excellent productivity!' : 
          completed >= total * 0.5 ? 'Good progress made!' : 
          'Tomorrow is a new opportunity to improve!'
        }` : 
        'No tasks were added today. Consider planning your tasks for better productivity.'
    };
  }

  async getLatestInsights() {
    return {
      insights: this.insights,
      lastAnalysis: this.lastAnalysis
    };
  }

  async analyzeProductivityPatterns(historicalTasks) {
    // Analyze patterns in task completion times, categories, priorities
    const patterns = {
      mostProductiveHours: [],
      preferredTaskTypes: [],
      averageCompletionTime: 0,
      productivityTrends: []
    };
    
    return patterns;
  }
}

module.exports = AIAnalysisEngine;