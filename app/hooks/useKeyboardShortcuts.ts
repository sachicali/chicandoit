'use client'

import { useEffect, useCallback } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.metaKey === event.metaKey &&
      !!s.shiftKey === event.shiftKey &&
      !!s.altKey === event.altKey
    )

    if (shortcut) {
      // Prevent default behavior and stop propagation
      event.preventDefault()
      event.stopPropagation()
      shortcut.action()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return shortcuts
}

export function useTaskShortcuts(
  onNewTask: () => void,
  onDeleteTask: () => void,
  onToggleComplete: () => void,
  onEscape: () => void
) {
  return useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      action: onNewTask,
      description: 'New task'
    },
    {
      key: 'n',
      metaKey: true, // For Mac users
      action: onNewTask,
      description: 'New task'
    },
    {
      key: 'Delete',
      action: onDeleteTask,
      description: 'Delete selected task'
    },
    {
      key: 'Backspace',
      action: onDeleteTask,
      description: 'Delete selected task'
    },
    {
      key: ' ',
      action: onToggleComplete,
      description: 'Toggle task completion'
    },
    {
      key: 'Escape',
      action: onEscape,
      description: 'Cancel current action'
    }
  ])
}