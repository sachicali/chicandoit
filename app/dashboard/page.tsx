'use client'

import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'
import { sendNotification } from '@tauri-apps/api/notification'
// Import window API only on client side
import toast, { Toaster } from 'react-hot-toast'
import { 
  Settings, Minimize2, Maximize2, X, Plus, Calendar, Clock, 
  TrendingUp, CheckCircle2, Circle, AlertCircle, Zap, Brain, 
  BarChart3, Hash, ListTodo, Sparkles, Trophy
} from 'lucide-react'
import Logo from '../components/Logo'

interface Task {
  id: string
  task: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  category: string
  status: string
  createdAt?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [communications, setCommunications] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [productivityStats, setProductivityStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'insights'>('tasks')
  
  // New task form state
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    task: '',
    priority: 'medium' as const,
    estimatedTime: 30,
    category: 'work'
  })

  useEffect(() => {
    // Only initialize if Tauri is available
    if (typeof window !== 'undefined' && window.__TAURI__) {
      initializeApp()
      setupEventListeners()
    } else {
      setLoading(false)
    }
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  const initializeApp = async () => {
    try {
      await Promise.all([
        loadTasks(),
        loadInsights(),
        loadCommunications(),
        loadNotifications(),
        loadProductivityStats(),
      ])
      setLoading(false)
    } catch (error) {
      console.error('Failed to initialize app:', error)
      toast.error('Failed to load application data')
      setLoading(false)
    }
  }

  const setupEventListeners = async () => {
    await listen('notification', (event: any) => {
      const notification = event.payload
      showNotificationToast(notification)
      setNotifications(prev => [notification, ...prev])
    })

    await listen('task_updated', () => {
      loadTasks()
      loadProductivityStats()
    })

    await listen('communication_update', (event: any) => {
      setCommunications(event.payload)
    })
  }

  const showNotificationToast = (notification: any) => {
    toast(notification.message, {
      duration: 5000,
      icon: '🔔',
      style: {
        background: 'rgb(var(--card-rgb))',
        color: 'rgb(var(--foreground-rgb))',
        border: '1px solid rgb(var(--border-rgb))',
      },
    })

    if (Notification.permission === 'granted') {
      sendNotification({
        title: notification.title,
        body: notification.message,
      })
    }
  }

  const loadTasks = async () => {
    try {
      const tasksData = await invoke('get_tasks')
      setTasks(tasksData as Task[])
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }

  const loadInsights = async () => {
    try {
      const insightsData = await invoke('get_ai_insights')
      setInsights(Array.isArray(insightsData) ? insightsData : [])
    } catch (error) {
      console.error('Failed to load insights:', error)
    }
  }

  const loadCommunications = async () => {
    try {
      const communicationsData = await invoke('get_communication_status')
      setCommunications(Array.isArray(communicationsData) ? communicationsData : [])
    } catch (error) {
      console.error('Failed to load communications:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const notificationsData = await invoke('get_notifications')
      setNotifications(Array.isArray(notificationsData) ? notificationsData : [])
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const loadProductivityStats = async () => {
    try {
      const statsData = await invoke('get_productivity_stats')
      setProductivityStats(statsData)
    } catch (error) {
      console.error('Failed to load productivity stats:', error)
    }
  }

  const createTask = async () => {
    if (!newTask.task.trim()) return
    
    try {
      await invoke('create_task', { task: newTask })
      toast.success('Task created!', {
        style: {
          background: 'rgb(var(--card-rgb))',
          color: 'rgb(var(--foreground-rgb))',
          border: '1px solid rgb(var(--success-rgb))',
        },
      })
      setNewTask({ task: '', priority: 'medium', estimatedTime: 30, category: 'work' })
      setShowAddTask(false)
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task')
    }
  }

  const updateTask = async (taskId: string, updates: any) => {
    try {
      await invoke('update_task', { id: taskId, request: updates })
      toast.success('Task updated!')
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
    }
  }

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
    updateTask(task.id, { status: newStatus })
  }

  const triggerAccountabilityCheck = async () => {
    try {
      const message = await invoke('trigger_accountability_check')
      toast(message as string, {
        duration: 8000,
        icon: '💪',
        style: {
          background: 'rgb(var(--primary-rgb))',
          color: 'white',
        },
      })
    } catch (error) {
      console.error('Failed to trigger accountability check:', error)
      toast.error('Failed to trigger accountability check')
    }
  }

  // Window controls
  const minimizeWindow = async () => {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      const { appWindow } = await import('@tauri-apps/api/window')
      await appWindow.minimize()
    }
  }
  
  const maximizeWindow = async () => {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      const { appWindow } = await import('@tauri-apps/api/window')
      const maximized = await appWindow.isMaximized()
      if (maximized) {
        await appWindow.unmaximize()
        setIsMaximized(false)
      } else {
        await appWindow.maximize()
        setIsMaximized(true)
      }
    }
  }
  
  const closeWindow = async () => {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      const { appWindow } = await import('@tauri-apps/api/window')
      await appWindow.close()
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20 pattern-grid">
        <div className="text-center animate-fadeIn">
          <div className="relative">
            <div className="mx-auto animate-pulse">
              <Logo size="lg" showText={false} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mt-8">Vici</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3">Preparing your victory dashboard...</p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'Completed').length
  const estimatedHoursLeft = tasks
    .filter(t => t.status !== 'Completed')
    .reduce((sum, t) => sum + (t.estimatedTime || 0), 0) / 60

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800'
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800'
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-950 dark:border-slate-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }} />
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <div className="text-3xl font-light text-gray-900 dark:text-white tabular-nums">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <button
                  onClick={triggerAccountabilityCheck}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all duration-200 transform hover:scale-105"
                >
                  <Trophy className="w-4 h-4" />
                  Victory Check
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedTasks}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-gray-700 dark:text-gray-300">{Math.round(completionRate)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{highPriorityTasks}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Hours Left</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{estimatedHoursLeft.toFixed(1)}h</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between px-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'tasks' 
                        ? 'text-violet-600 dark:text-violet-400 border-violet-600 dark:border-violet-400' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'insights' 
                        ? 'text-violet-600 dark:text-violet-400 border-violet-600 dark:border-violet-400' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    AI Insights
                  </button>
                </div>
                
                {activeTab === 'tasks' && (
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'tasks' ? (
                <div className="space-y-3">
                  {showAddTask && (
                    <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="What needs to be done?"
                          value={newTask.task}
                          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all duration-200"
                          autoFocus
                        />
                        <div className="flex gap-3">
                          <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all duration-200"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Minutes"
                            value={newTask.estimatedTime}
                            onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 30 })}
                            className="w-24 px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                          />
                          <select
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all duration-200"
                          >
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="health">Health</option>
                            <option value="learning">Learning</option>
                          </select>
                          <button
                            onClick={createTask}
                            className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddTask(false)}
                            className="px-4 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No tasks yet. Create your first task to get started!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all ${
                          task.status === 'Completed' ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTaskStatus(task)}
                            className="flex-shrink-0"
                          >
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              task.status === 'Completed' ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.task}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.estimatedTime}min
                              </span>
                              <span className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {task.category}
                              </span>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">AI insights will appear here once you start adding tasks.</p>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <div key={index} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
  )
}