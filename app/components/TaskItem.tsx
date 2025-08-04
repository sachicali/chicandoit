'use client'

import React, { useState } from 'react'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Hash, 
  GripVertical, 
  Trash2, 
  Edit3,
  MoreHorizontal 
} from 'lucide-react'

interface Task {
  id: string
  task: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  category: string
  status: string
  createdAt?: string
}

interface TaskItemProps {
  task: Task
  index: number
  isSelected?: boolean
  onToggleStatus: (task: Task) => void
  onDelete?: (taskId: string) => void
  onEdit?: (task: Task) => void
  onSelect?: (taskId: string) => void
  dragProps?: any
  dropProps?: any
  className?: string
}

export function TaskItem({
  task,
  index,
  isSelected = false,
  onToggleStatus,
  onDelete,
  onEdit,
  onSelect,
  dragProps = {},
  dropProps = {},
  className = ''
}: TaskItemProps) {
  const [showActions, setShowActions] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': 
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'medium': 
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      default: 
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return
    onSelect?.(task.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggleStatus(task)
    }
  }

  return (
    <div 
      {...dropProps}
      className={`group relative transition-all duration-200 ${className}`}
    >
      <div
        {...dragProps}
        className={`
          bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 
          rounded-lg p-4 transition-all duration-200 cursor-pointer
          hover:shadow-md hover:shadow-violet-500/5
          focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500
          ${task.status === 'Completed' ? 'opacity-60' : ''}
          ${isSelected ? 'ring-2 ring-violet-500/30 border-violet-500 bg-violet-50/50 dark:bg-violet-950/20' : ''}
          ${dragProps.className || ''}
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Task: ${task.task}. Status: ${task.status}. Priority: ${task.priority}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing" />
          </div>

          {/* Status Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleStatus(task)
            }}
            className="flex-shrink-0 transition-colors duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-full"
            aria-label={task.status === 'Completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'Completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400" />
            )}
          </button>
          
          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm sm:text-base leading-snug transition-all duration-200 ${
              task.status === 'Completed' 
                ? 'line-through text-gray-500 dark:text-gray-500' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.task}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="tabular-nums">{task.estimatedTime}min</span>
              </span>
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span className="capitalize">{task.category}</span>
              </span>
              {task.createdAt && (
                <span className="hidden sm:inline text-gray-500 dark:text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Priority Badge */}
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200
            ${getPriorityColor(task.priority)}
          `}>
            {task.priority}
          </span>

          {/* Actions Menu */}
          {(showActions || isSelected) && (onDelete || onEdit) && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(task)
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 transition-all duration-200"
                  title="Edit task"
                  aria-label="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(task.id)
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-all duration-200"
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Focus indicator */}
        <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
      </div>
    </div>
  )
}