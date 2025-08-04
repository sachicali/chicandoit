'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, X, Clock, Hash, Flag } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

interface TaskFormData {
  task: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  category: string
}

interface TaskFormProps {
  isVisible: boolean
  onSubmit: (task: TaskFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<TaskFormData>
  isEditing?: boolean
  isLoading?: boolean
}

const CATEGORIES = [
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'personal', label: 'Personal', emoji: '🏠' },
  { value: 'health', label: 'Health', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'social', label: 'Social', emoji: '👥' }
]

const PRIORITIES = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30' },
  { value: 'high', label: 'High Priority', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30' }
]

export function TaskForm({ 
  isVisible, 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isEditing = false,
  isLoading = false 
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    task: '',
    priority: 'medium',
    estimatedTime: 30,
    category: 'work',
    ...initialData
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})
  const taskInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && taskInputRef.current) {
      taskInputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }))
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {}

    if (!formData.task.trim()) {
      newErrors.task = 'Task description is required'
    } else if (formData.task.trim().length < 3) {
      newErrors.task = 'Task description must be at least 3 characters'
    } else if (formData.task.trim().length > 200) {
      newErrors.task = 'Task description must be less than 200 characters'
    }

    if (formData.estimatedTime < 5) {
      newErrors.estimatedTime = 'Estimated time must be at least 5 minutes'
    } else if (formData.estimatedTime > 480) {
      newErrors.estimatedTime = 'Estimated time cannot exceed 8 hours (480 minutes)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      if (!isEditing) {
        setFormData({
          task: '',
          priority: 'medium',
          estimatedTime: 30,
          category: 'work'
        })
      }
      setErrors({})
    } catch (error) {
      console.error('Failed to submit task:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      task: '',
      priority: 'medium',
      estimatedTime: 30,
      category: 'work',
      ...initialData
    })
    setErrors({})
    onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-900/80 dark:to-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6 shadow-sm backdrop-blur-sm">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {isEditing ? (
              <>
                <Hash className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                Edit Task
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                Add New Task
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Description */}
        <div className="space-y-1">
          <label htmlFor="task-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            What needs to be done? *
          </label>
          <input
            id="task-input"
            ref={taskInputRef}
            type="text"
            placeholder="e.g., Review quarterly reports, Call dentist, Buy groceries..."
            value={formData.task}
            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            className={`
              w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-lg 
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
              transition-all duration-200 text-sm sm:text-base
              ${errors.task 
                ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/10' 
                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
              }
            `}
            disabled={isLoading}
            maxLength={200}
          />
          {errors.task && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.task}
            </p>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {formData.task.length}/200 characters
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Priority */}
          <div className="space-y-1">
            <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <Flag className="w-4 h-4 inline mr-1" />
              Priority
            </label>
            <select
              id="priority-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:text-white transition-all duration-200"
              disabled={isLoading}
            >
              {PRIORITIES.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Time */}
          <div className="space-y-1">
            <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 inline mr-1" />
              Time (minutes)
            </label>
            <input
              id="time-input"
              type="number"
              min="5"
              max="480"
              step="5"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 30 })}
              className={`
                w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 
                dark:text-white transition-all duration-200 tabular-nums
                ${errors.estimatedTime 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-gray-300 dark:border-slate-600'
                }
              `}
              disabled={isLoading}
            />
            {errors.estimatedTime && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.estimatedTime}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <Hash className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              id="category-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:text-white transition-all duration-200"
              disabled={isLoading}
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Time Buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick time selection:
          </label>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60, 120, 240].map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setFormData({ ...formData, estimatedTime: time })}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${formData.estimatedTime === time
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }
                `}
                disabled={isLoading}
              >
                {time < 60 ? `${time}m` : `${time / 60}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={isLoading || !formData.task.trim()}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {isEditing ? 'Update Task' : 'Add Task'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-xs">Enter</kbd> to submit</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-xs">Esc</kbd> to cancel</span>
          </div>
        </div>
      </form>
    </div>
  )
}