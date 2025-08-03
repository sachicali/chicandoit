import React, { useState } from 'react';
import { Bell, BellOff, X, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications }: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications || []);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const clearAll = () => {
    setLocalNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'accountability':
        return '💪';
      case 'reminder':
        return '⏰';
      case 'progress':
        return '📊';
      case 'communication':
        return '📢';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {unreadCount > 0 ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {localNotifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  You'll receive updates about your tasks and productivity here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {localNotifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg" role="img" aria-label={notification.type}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {localNotifications.length > 10 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Showing 10 of {localNotifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;