const fs = require('fs').promises;
const path = require('path');

class TaskManager {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'tasks.json');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
    }
  }

  async getAllTasks() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async saveTasks(tasks) {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    const tasks = await this.getAllTasks();
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }  async updateTask(taskId, updates) {
    const tasks = await this.getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  async deleteTask(taskId) {
    const tasks = await this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) {
      throw new Error('Task not found');
    }
    
    await this.saveTasks(filteredTasks);
    return { success: true };
  }

  async getTasksByStatus(status) {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === status);
  }

  async getTasksByPriority(priority) {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.priority === priority);
  }

  async getTasksForToday() {
    const tasks = await this.getAllTasks();
    const today = new Date().toDateString();
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toDateString();
      return taskDate === today;
    });
  }

  async getProductivityStats() {
    const tasks = await this.getAllTasks();
    const completed = tasks.filter(task => task.status === 'completed').length;
    const total = tasks.length;
    
    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: tasks.filter(task => task.status === 'pending').length,
      inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }
}

module.exports = TaskManager;