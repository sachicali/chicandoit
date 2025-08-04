'use client'

import { useState, useCallback } from 'react'

export interface DragItem {
  id: string
  index: number
}

export function useDragAndDrop<T extends { id: string }>() {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)

  const handleDragStart = useCallback((item: T, index: number) => {
    setDraggedItem({ id: item.id, index })
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((
    e: React.DragEvent, 
    targetIndex: number, 
    items: T[], 
    onReorder: (newItems: T[]) => void
  ) => {
    e.preventDefault()
    
    if (!draggedItem) return

    const draggedIndex = draggedItem.index
    if (draggedIndex === targetIndex) return

    const newItems = [...items]
    const [draggedItemObj] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItemObj)

    onReorder(newItems)
    setDraggedItem(null)
  }, [draggedItem])

  const getDragProps = (item: T, index: number) => ({
    draggable: true,
    onDragStart: () => handleDragStart(item, index),
    onDragEnd: handleDragEnd,
    className: draggedItem?.id === item.id ? 'opacity-50 transform rotate-2' : ''
  })

  const getDropProps = (index: number, items: T[], onReorder: (items: T[]) => void) => ({
    onDragOver: handleDragOver,
    onDrop: (e: React.DragEvent) => handleDrop(e, index, items, onReorder)
  })

  return {
    draggedItem,
    getDragProps,
    getDropProps,
    isDragging: draggedItem !== null
  }
}