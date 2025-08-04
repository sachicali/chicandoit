'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseOptimizedWebSocketOptions {
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  messageBufferSize?: number
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
}

interface WebSocketMessage {
  type: string
  payload: any
  timestamp: number
}

export function useOptimizedWebSocket(
  url: string | null,
  options: UseOptimizedWebSocketOptions = {}
) {
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    messageBufferSize = 100,
    onOpen,
    onClose,
    onError
  } = options

  const ws = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageBufferRef = useRef<WebSocketMessage[]>([])
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  const clearTimeouts = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const startHeartbeat = useCallback(() => {
    clearTimeouts()
    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
      }
    }, heartbeatInterval)
  }, [heartbeatInterval, clearTimeouts])

  const connect = useCallback(() => {
    if (!url || ws.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus('connecting')
    
    try {
      ws.current = new WebSocket(url)
      
      ws.current.onopen = () => {
        setConnectionStatus('connected')
        reconnectAttemptsRef.current = 0
        startHeartbeat()
        onOpen?.()
      }
      
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = {
            type: 'message',
            payload: JSON.parse(event.data),
            timestamp: Date.now()
          }
          
          // Add to buffer (keep only recent messages)
          messageBufferRef.current.push(message)
          if (messageBufferRef.current.length > messageBufferSize) {
            messageBufferRef.current.shift()
          }
          
          setLastMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
      ws.current.onclose = () => {
        setConnectionStatus('disconnected')
        clearTimeouts()
        onClose?.()
        
        // Attempt reconnection if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval * reconnectAttemptsRef.current) // Exponential backoff
        }
      }
      
      ws.current.onerror = (error) => {
        setConnectionStatus('error')
        onError?.(error)
      }
    } catch (error) {
      setConnectionStatus('error')
      console.error('WebSocket connection failed:', error)
    }
  }, [url, onOpen, onClose, onError, startHeartbeat, maxReconnectAttempts, reconnectInterval, messageBufferSize])

  const disconnect = useCallback(() => {
    clearTimeouts()
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    setConnectionStatus('disconnected')
  }, [clearTimeouts])

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  const sendBufferedMessage = useCallback((message: any) => {
    const success = sendMessage(message)
    if (!success) {
      // Store message to send when connection is restored
      messageBufferRef.current.push({
        type: 'outgoing',
        payload: message,
        timestamp: Date.now()
      })
    }
    return success
  }, [sendMessage])

  const getMessageHistory = useCallback(() => {
    return [...messageBufferRef.current]
  }, [])

  // Auto-connect when URL changes
  useEffect(() => {
    if (url) {
      connect()
    }
    
    return () => {
      disconnect()
    }
  }, [url, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [clearTimeouts])

  return {
    connectionStatus,
    lastMessage,
    sendMessage,
    sendBufferedMessage,
    connect,
    disconnect,
    getMessageHistory,
    reconnectAttempts: reconnectAttemptsRef.current
  }
}