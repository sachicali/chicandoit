class NotificationSystem {
  constructor(io) {
    this.io = io;
    this.notifications = [];
  }

  sendAccountabilityNotification(message) {
    const notification = {
      id: Date.now().toString(),
      type: 'accountability',
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    this.io.emit('notification', notification);
    
    // Also send desktop notification if supported
    this.sendDesktopNotification('ChiCanDoIt - Accountability Check', message);
    
    console.log(`📢 Accountability notification sent: ${message}`);
    return notification;
  }

  sendTaskReminder(task) {
    const message = `Reminder: "${task.task}" is still pending. Priority: ${task.priority}`;
    const notification = {
      id: Date.now().toString(),
      type: 'reminder',
      message,
      taskId: task.id,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    this.io.emit('notification', notification);
    
    return notification;
  }

  sendProgressUpdate(stats) {
    const message = `Daily Progress: ${stats.completedTasks}/${stats.totalTasks} tasks completed (${stats.completionRate}%)`;
    const notification = {
      id: Date.now().toString(),
      type: 'progress',
      message,
      stats,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    this.io.emit('notification', notification);
    
    return notification;
  }  sendDesktopNotification(title, body) {
    // This would typically integrate with a desktop notification service
    // For now, we'll just log it
    console.log(`🔔 Desktop Notification: ${title} - ${body}`);
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.io.emit('notificationUpdated', notification);
    }
  }

  getNotifications(limit = 10) {
    return this.notifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.io.emit('notificationsCleared');
  }

  scheduleReminder(task, reminderTime) {
    const now = new Date();
    const reminder = new Date(reminderTime);
    const delay = reminder.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.sendTaskReminder(task);
      }, delay);
      
      console.log(`⏰ Reminder scheduled for task "${task.task}" at ${reminder.toLocaleString()}`);
    }
  }

  sendCommunicationAlert(service, data) {
    let message = '';
    
    switch (service) {
      case 'email':
        message = `📧 ${data.unreadCount} new emails require attention`;
        break;
      case 'discord':
        message = `💬 New Discord activity detected`;
        break;
      case 'messenger':
        message = `📱 New messages in Messenger`;
        break;
    }

    const notification = {
      id: Date.now().toString(),
      type: 'communication',
      service,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    this.io.emit('notification', notification);
    
    return notification;
  }
}

module.exports = NotificationSystem;