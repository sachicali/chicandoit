'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'
import { sendNotification } from '@tauri-apps/api/notification'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Settings, Minimize2, Maximize2, X, Plus, Calendar, Clock, 
  TrendingUp, CheckCircle2, Circle, AlertCircle, Zap, Brain, 
  BarChart3, Hash, ListTodo, Sparkles, Trophy, Keyboard, Filter
} from 'lucide-react'
import Logo from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { TaskItem } from '../components/TaskItem'
import { TaskForm } from '../components/TaskForm'
import { LoadingSpinner, LoadingCard } from '../components/LoadingSpinner'
import { LazyWrapper } from '../components/LazyWrapper'
import { PerformanceMonitor } from '../components/PerformanceMonitor'
import { ExportImportButtons } from '../components/ExportImportButtons'
import { useKeyboardShortcuts, useTaskShortcuts } from '../hooks/useKeyboardShortcuts'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { useTheme } from '../hooks/useTheme'
import { useCache } from '../hooks/useCache'

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
  
  // Enhanced state management
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [showShortcuts, setShowShortcuts] = useState(false)
  
  // Drag and drop
  const { getDragProps, getDropProps, isDragging } = useDragAndDrop<Task>()
  
  // Theme
  const { resolvedTheme } = useTheme()

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

  // Enhanced task management functions
  const createTask = async (taskData: any) => {
    setIsCreatingTask(true)
    try {
      await invoke('create_task', { task: taskData })
      toast.success('Added to your conquest list', {
        style: {
          background: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          color: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
          border: '1px solid #10b981',
        },
      })
      setShowAddTask(false)
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task')
    } finally {
      setIsCreatingTask(false)
    }
  }

  const updateTaskData = async (taskData: any) => {
    if (!editingTask) return
    
    try {
      await invoke('update_task', { id: editingTask.id, request: taskData })
      toast.success('Nice, updated that for you')
      setEditingTask(null)
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Couldn\'t update that. Give it another shot?')
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      // Add confirmation dialog
      if (!confirm('Really delete this? (You can\'t undo it)')) return
      
      await invoke('delete_task', { id: taskId })
      toast.success('Gone! One less thing to worry about')
      setSelectedTaskId(null)
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task')
    }
  }

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
    // You might want to save the new order to the backend here
  }, [])

  const updateTask = async (taskId: string, updates: any) => {
    try {
      await invoke('update_task', { id: taskId, request: updates })
      toast.success('Task updated!')
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Couldn\'t update that. Give it another shot?')
    }
  }

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
    updateTask(task.id, { status: newStatus })
  }

  // Handle imported tasks
  const handleImportTasks = async (importedTasks: Task[]) => {
    try {
      // Create each imported task
      for (const task of importedTasks) {
        await invoke('create_task', { request: task })
      }
      toast.success(`Imported ${importedTasks.length} tasks successfully!`)
      loadTasks()
      loadProductivityStats()
    } catch (error) {
      console.error('Failed to import tasks:', error)
      toast.error('Failed to import some tasks. Please try again.')
    }
  }

  // Keyboard shortcuts
  const handleNewTask = useCallback(() => {
    setShowAddTask(true)
    setEditingTask(null)
  }, [])

  const handleDeleteTask = useCallback(() => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId)
    }
  }, [selectedTaskId])

  const handleToggleComplete = useCallback(() => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId)
      if (task) {
        toggleTaskStatus(task)
      }
    }
  }, [selectedTaskId, tasks])

  const handleEscape = useCallback(() => {
    if (showAddTask || editingTask) {
      setShowAddTask(false)
      setEditingTask(null)
    } else {
      setSelectedTaskId(null)
    }
  }, [showAddTask, editingTask])

  // Setup keyboard shortcuts
  useTaskShortcuts(handleNewTask, handleDeleteTask, handleToggleComplete, handleEscape)

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return task.status !== 'Completed'
      case 'completed':
        return task.status === 'Completed'
      default:
        return true
    }
  })

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
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center animate-fadeIn">
          <div className="relative">
            <div className="mx-auto animate-pulse">
              <Logo size="lg" showText={false} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mt-8">Vici</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3">Preparing your productivity dashboard...</p>
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
            color: resolvedTheme === 'dark' ? '#ffffff' : '#1f2937',
            borderRadius: '12px',
            border: resolvedTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: resolvedTheme === 'dark' 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }} 
      />
        {/* Enhanced Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Logo size="sm" className="hidden sm:flex" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}!
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} • Time to conquer
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden lg:block">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <ThemeToggle />
                
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  title="Keyboard shortcuts"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
                
                <button
                  onClick={triggerAccountabilityCheck}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">How's it going?</span>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Panel */}
            {showShortcuts && (
              <div className="mt-4 p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800 backdrop-blur-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">New task</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium">Ctrl+N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Delete task</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium">Del</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Toggle complete</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Cancel/Escape</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium">Esc</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">On your list</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalTasks}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                  <ListTodo className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Crushed</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{completedTasks}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Progress</span>
                      <span className="text-slate-900 dark:text-white font-bold">{Math.round(completionRate)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Urgent stuff</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{highPriorityTasks}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Time to victory</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{estimatedHoursLeft.toFixed(1)}h</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            {/* Enhanced Tabs with Filters */}
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 gap-4">
                <div className="flex gap-6 sm:gap-8">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'tasks' 
                        ? 'text-violet-600 dark:text-violet-400 border-violet-600 dark:border-violet-400' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Tasks
                    <span className="ml-2 text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {filteredTasks.length}
                    </span>
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
                    <span className="ml-2 text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {insights.length}
                    </span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                  {activeTab === 'tasks' && (
                    <>
                      {/* Task Filters */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button
                          onClick={() => setFilter('all')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            filter === 'all'
                              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilter('pending')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            filter === 'pending'
                              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => setFilter('completed')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            filter === 'completed'
                              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Done
                        </button>
                      </div>

                      {/* Export/Import Buttons */}
                      <ExportImportButtons 
                        tasks={tasks}
                        onImportTasks={handleImportTasks}
                        className="ml-2"
                      />

                      <button
                        onClick={() => {
                          setShowAddTask(true)
                          setEditingTask(null)
                        }}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 transform hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Task</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
              {activeTab === 'tasks' ? (
                <div className="space-y-4">
                  {/* Task Form */}
                  <TaskForm
                    isVisible={showAddTask || !!editingTask}
                    onSubmit={editingTask ? updateTaskData : createTask}
                    onCancel={() => {
                      setShowAddTask(false)
                      setEditingTask(null)
                    }}
                    initialData={editingTask || undefined}
                    isEditing={!!editingTask}
                    isLoading={isCreatingTask}
                  />

                  {/* Loading State */}
                  {loading && (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <LoadingCard key={i} />
                      ))}
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {!loading && filteredTasks.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ListTodo className="w-12 h-12 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        {filter === 'all' ? 'Your conquest list is empty' : 
                         filter === 'pending' ? 'No pending tasks' : 
                         'No completed tasks yet'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                        {filter === 'all' ? 'Ready to add your first victory? Start by creating a task below.' :
                         filter === 'pending' ? 'Great job! All your tasks are completed.' :
                         'Complete some tasks to see them here.'}
                      </p>
                      {filter === 'all' && (
                        <button
                          onClick={() => setShowAddTask(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          <Plus className="w-5 h-5" />
                          Add Your First Task
                        </button>
                      )}
                    </div>
                  )}

                  {/* Task List with Drag & Drop */}
                  {!loading && filteredTasks.length > 0 && (
                    <div className={`space-y-2 ${isDragging ? 'select-none' : ''}`}>
                      {filteredTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          isSelected={selectedTaskId === task.id}
                          onToggleStatus={toggleTaskStatus}
                          onDelete={deleteTask}
                          onEdit={setEditingTask}
                          onSelect={setSelectedTaskId}
                          dragProps={getDragProps(task, index)}
                          dropProps={getDropProps(index, filteredTasks, reorderTasks)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Task Summary */}
                  {!loading && filteredTasks.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 backdrop-blur-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-3xl font-black text-violet-600 dark:text-violet-400">
                            {tasks.filter(t => t.status !== 'Completed').length}
                          </div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Remaining</div>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            {completedTasks}
                          </div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</div>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                            {highPriorityTasks}
                          </div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">High Priority</div>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                            {estimatedHoursLeft.toFixed(1)}h
                          </div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Time Left</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain className="w-12 h-12 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">AI Insights Coming Soon</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Complete a few tasks and I'll show you some patterns and insights about your productivity.</p>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <div key={index} className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{insight.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{insight.message}</p>
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
    </div>
  )
}