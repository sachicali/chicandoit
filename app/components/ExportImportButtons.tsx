'use client'

import React, { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface Task {
  id: string
  task: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  category: string
  status: string
  createdAt?: string
}

interface ExportImportButtonsProps {
  tasks: Task[]
  onImportTasks: (tasks: Task[]) => void
  className?: string
}

export const ExportImportButtons: React.FC<ExportImportButtonsProps> = ({ 
  tasks, 
  onImportTasks,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportTasks = () => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `vici-tasks-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      toast.success(`Exported ${tasks.length} tasks successfully!`, {
        icon: '📥',
        style: {
          borderRadius: '12px',
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #10b981',
        },
      })
    } catch (error) {
      console.error('Failed to export tasks:', error)
      toast.error('Failed to export tasks. Please try again.')
    }
  }

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedTasks = JSON.parse(content)
        
        // Validate the imported data
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid file format. Expected an array of tasks.')
        }
        
        // Validate each task has required fields
        const validTasks = importedTasks.filter(task => 
          task.task && 
          typeof task.task === 'string' &&
          ['low', 'medium', 'high'].includes(task.priority) &&
          typeof task.estimatedTime === 'number' &&
          typeof task.category === 'string' &&
          typeof task.status === 'string'
        )
        
        if (validTasks.length === 0) {
          throw new Error('No valid tasks found in the file.')
        }
        
        // Generate new IDs for imported tasks to avoid conflicts
        const tasksWithNewIds = validTasks.map(task => ({
          ...task,
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString()
        }))
        
        onImportTasks(tasksWithNewIds)
        
        toast.success(`Successfully imported ${tasksWithNewIds.length} tasks!`, {
          icon: '📤',
          style: {
            borderRadius: '12px',
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #10b981',
          },
        })
        
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Failed to import tasks:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to import tasks. Please check the file format.')
      }
    }
    
    reader.readAsText(file)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={exportTasks}
        disabled={tasks.length === 0}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={tasks.length === 0 ? "No tasks to export" : "Export tasks to JSON"}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importTasks}
        className="hidden"
        id="import-tasks-input"
      />
      <label
        htmlFor="import-tasks-input"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        title="Import tasks from JSON"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </label>
    </div>
  )
}