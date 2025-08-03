const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const TaskManager = require('./domains/TaskManager');
const CommunicationIntegrator = require('./domains/CommunicationIntegrator');
const AIAnalysisEngine = require('./domains/AIAnalysisEngine');
const NotificationSystem = require('./domains/NotificationSystem');

class ChiCanDoItServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    // Initialize domain services
    this.taskManager = new TaskManager();
    this.communicationIntegrator = new CommunicationIntegrator();
    this.aiEngine = new AIAnalysisEngine();
    this.notificationSystem = new NotificationSystem(this.io);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupScheduledTasks();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Task Management Routes
    this.app.get('/api/tasks', async (req, res) => {
      try {
        const tasks = await this.taskManager.getAllTasks();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/tasks', async (req, res) => {
      try {
        const task = await this.taskManager.createTask(req.body);
        this.io.emit('taskCreated', task);
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.put('/api/tasks/:id', async (req, res) => {
      try {
        const task = await this.taskManager.updateTask(req.params.id, req.body);
        this.io.emit('taskUpdated', task);
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }    // AI Analysis Routes
    this.app.get('/api/insights', async (req, res) => {
      try {
        const tasks = await this.taskManager.getAllTasks();
        const communications = await this.communicationIntegrator.getRecentActivity();
        const insights = await this.aiEngine.generateInsights(tasks, communications);
        res.json(insights);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Communication Integration Routes
    this.app.get('/api/communications/status', async (req, res) => {
      try {
        const status = await this.communicationIntegrator.getConnectionStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/communications/connect/:service', async (req, res) => {
      try {
        const result = await this.communicationIntegrator.connectService(
          req.params.service, 
          req.body
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('requestUpdate', async () => {
        try {
          const tasks = await this.taskManager.getAllTasks();
          const insights = await this.aiEngine.getLatestInsights();
          socket.emit('dataUpdate', { tasks, insights });
        } catch (error) {
          socket.emit('error', error.message);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }  setupScheduledTasks() {
    // Hourly accountability check
    cron.schedule('0 * * * *', async () => {
      console.log('Running hourly accountability check...');
      await this.performAccountabilityCheck();
    });

    // Communication sync every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      console.log('Syncing communications...');
      await this.communicationIntegrator.syncAll();
    });

    // Daily summary at end of day
    cron.schedule('0 22 * * *', async () => {
      console.log('Generating daily summary...');
      await this.generateDailySummary();
    });
  }

  async performAccountabilityCheck() {
    try {
      const tasks = await this.taskManager.getAllTasks();
      const communications = await this.communicationIntegrator.getRecentActivity();
      const accountabilityMessage = await this.aiEngine.generateAccountabilityMessage(
        tasks, 
        communications
      );
      
      this.notificationSystem.sendAccountabilityNotification(accountabilityMessage);
      this.io.emit('accountabilityCheck', accountabilityMessage);
    } catch (error) {
      console.error('Accountability check failed:', error);
    }
  }

  async generateDailySummary() {
    try {
      const tasks = await this.taskManager.getAllTasks();
      const summary = await this.aiEngine.generateDailySummary(tasks);
      this.io.emit('dailySummary', summary);
    } catch (error) {
      console.error('Daily summary generation failed:', error);
    }
  }

  start() {
    const PORT = process.env.PORT || 3001;
    this.server.listen(PORT, () => {
      console.log(`🚀 ChiCanDoIt server running on port ${PORT}`);
      console.log(`📊 Dashboard available at http://localhost:3000`);
      console.log(`🤖 AI Analysis Engine: ${process.env.AI_ANALYSIS_ENABLED ? 'Enabled' : 'Disabled'}`);
    });
  }
}

// Start the server
const server = new ChiCanDoItServer();
server.start();