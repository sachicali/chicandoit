import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/api/notification';
import { appWindow } from '@tauri-apps/api/window';
import toast, { Toaster } from 'react-hot-toast';
import TaskManager from './components/TaskManager';
import AIInsights from './components/AIInsights';
import CommunicationPanel from './components/CommunicationPanel';
import NotificationCenter from './components/NotificationCenter';
import ProgressDashboard from './components/ProgressDashboard';
import SettingsPanel from './components/SettingsPanel';
import { Target, Settings, Minimize2, Maximize2, X } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [productivityStats, setProductivityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    initializeApp();
    setupEventListeners();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Load initial data
      await Promise.all([
        loadTasks(),
        loadInsights(),
        loadCommunications(),
        loadNotifications(),
        loadProductivityStats(),
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.error('Failed to initialize application');
      setLoading(false);
    }
  };

  const setupEventListeners = async () => {
    // Listen for accountability checks
    await listen('accountability_check', (event) => {
      toast(event.payload, {
        duration: 8000,
        icon: '💪',
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      });
      // Also send native notification
      sendNotification({
        title: 'ChiCanDoIt - Accountability Check',
        body: event.payload,
      });
    });

    // Listen for insights updates
    await listen('insights_updated', (event) => {
      setInsights(event.payload);
      toast.success('AI insights updated');
    });

    // Listen for communication sync
    await listen('communication_synced', (event) => {
      setCommunications(event.payload);
    });

    // Listen for notifications
    await listen('notification', (event) => {
      setNotifications(prev => [event.payload, ...prev]);
      toast(event.payload.message, {
        icon: getNotificationIcon(event.payload.notification_type),
        duration: 5000,
      });
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Accountability': return '💪';
      case 'TaskReminder': return '⏰';
      case 'Achievement': return '🎉';
      case 'Communication': return '📢';
      default: return '🔔';
    }
  };  // Data loading functions
  const loadTasks = async () => {
    try {
      const tasksData = await invoke('get_tasks');
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const loadInsights = async () => {
    try {
      const insightsData = await invoke('get_ai_insights');
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const loadCommunications = async () => {
    try {
      const commData = await invoke('get_communication_status');
      setCommunications(commData);
    } catch (error) {
      console.error('Failed to load communications:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifData = await invoke('get_notifications', { limit: 20 });
      setNotifications(notifData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadProductivityStats = async () => {
    try {
      const stats = await invoke('get_productivity_stats');
      setProductivityStats(stats);
    } catch (error) {
      console.error('Failed to load productivity stats:', error);
    }
  };

  // Task operations
  const createTask = async (taskData) => {
    try {
      const newTask = await invoke('create_task', { request: taskData });
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
      // Refresh stats
      loadProductivityStats();
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await invoke('update_task', { 
        id: taskId, 
        request: updates 
      });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task updated!');
      // Refresh stats
      loadProductivityStats();
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await invoke('delete_task', { id: taskId });
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
      // Refresh stats
      loadProductivityStats();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Communication operations
  const connectService = async (service) => {
    try {
      const result = await invoke('connect_service', { service });
      toast.success(result);
      // Refresh communication status
      loadCommunications();
    } catch (error) {
      console.error(`Failed to connect ${service}:`, error);
      toast.error(`Failed to connect ${service}`);
    }
  };

  // Manual accountability check
  const triggerAccountabilityCheck = async () => {
    try {
      const message = await invoke('trigger_accountability_check');
      toast(message, {
        duration: 8000,
        icon: '💪',
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Failed to trigger accountability check:', error);
      toast.error('Failed to trigger accountability check');
    }
  };

  // Window controls
  const minimizeWindow = async () => {
    await appWindow.minimize();
  };

  const maximizeWindow = async () => {
    const maximized = await appWindow.isMaximized();
    if (maximized) {
      await appWindow.unmaximize();
      setIsMaximized(false);
    } else {
      await appWindow.maximize();
      setIsMaximized(true);
    }
  };

  const closeWindow = async () => {
    await appWindow.close();
  };  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ChiCanDoIt</h1>
          <p className="text-lg text-gray-600">Loading your productivity dashboard...</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Custom Title Bar */}
      <div className="flex items-center justify-between h-8 bg-gray-900 text-white text-sm select-none" data-tauri-drag-region>
        <div className="flex items-center px-4">
          <Target className="w-4 h-4 mr-2 text-blue-400" />
          <span className="font-medium">ChiCanDoIt - AI Productivity Tracker</span>
        </div>
        
        <div className="flex">
          <button
            onClick={minimizeWindow}
            className="px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={maximizeWindow}
            className="px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={closeWindow}
            className="px-4 py-2 hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChiCanDoIt
                </h1>
                <p className="text-gray-600">AI-Powered Productivity Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              
              <button
                onClick={triggerAccountabilityCheck}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                💪 Check-in Now
              </button>
              
              <NotificationCenter notifications={notifications} />
              
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Dashboard */}
          <div className="lg:col-span-4 mb-8">
            <ProgressDashboard 
              tasks={tasks}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              productivityStats={productivityStats}
            />
          </div>
          
          {/* Task Manager */}
          <div className="lg:col-span-2">
            <TaskManager 
              tasks={tasks}
              onCreateTask={createTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <AIInsights insights={insights} />
            <CommunicationPanel 
              communications={communications}
              onConnect={connectService}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;