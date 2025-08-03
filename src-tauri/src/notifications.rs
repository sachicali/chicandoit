use anyhow::Result;
use notify_rust::Notification;
use uuid::Uuid;
use chrono::Utc;
use log::{info, error};

use crate::models::{NotificationItem, NotificationType};

pub struct NotificationManager {
    enabled: bool,
}

impl NotificationManager {
    pub fn new() -> Self {
        Self {
            enabled: true,
        }
    }

    pub async fn send_accountability_notification(&self, message: &str, app_handle: &tauri::AppHandle) -> Result<()> {
        if !self.enabled {
            return Ok(());
        }

        // Create desktop notification
        let notification_result = Notification::new()
            .summary("ChiCanDoIt - Accountability Check")
            .body(message)
            .icon("productivity")
            .timeout(notify_rust::Timeout::Milliseconds(5000))
            .show();

        match notification_result {
            Ok(_) => info!("Desktop notification sent successfully"),
            Err(e) => error!("Failed to send desktop notification: {}", e),
        }

        // Create notification record
        let notification = NotificationItem {
            id: Uuid::new_v4().to_string(),
            title: "Accountability Check".to_string(),
            message: message.to_string(),
            notification_type: NotificationType::Accountability,
            is_read: false,
            created_at: Utc::now(),
            action_url: None,
        };

        // Save to database (through app state)
        if let Ok(state) = app_handle.try_state::<crate::AppState>() {
            let db = state.db.lock().await;
            if let Err(e) = db.save_notification(notification.clone()).await {
                error!("Failed to save notification to database: {}", e);
            }
        }

        // Emit to frontend
        app_handle.emit_all("notification", &notification)?;

        Ok(())
    }

    pub async fn send_task_reminder(&self, task_title: &str, due_in_minutes: i32, app_handle: &tauri::AppHandle) -> Result<()> {
        if !self.enabled {
            return Ok(());
        }

        let message = if due_in_minutes <= 0 {
            format!("⚠️ Task '{}' is overdue!", task_title)
        } else if due_in_minutes <= 30 {
            format!("⏰ Task '{}' is due in {} minutes", task_title, due_in_minutes)
        } else {
            format!("📋 Reminder: '{}' is due in {} minutes", task_title, due_in_minutes)
        };

        // Create desktop notification
        let notification_result = Notification::new()
            .summary("ChiCanDoIt - Task Reminder")
            .body(&message)
            .icon("task")
            .timeout(notify_rust::Timeout::Milliseconds(7000))
            .show();

        match notification_result {
            Ok(_) => info!("Task reminder notification sent successfully"),
            Err(e) => error!("Failed to send task reminder notification: {}", e),
        }

        // Create notification record
        let notification = NotificationItem {
            id: Uuid::new_v4().to_string(),
            title: "Task Reminder".to_string(),
            message,
            notification_type: NotificationType::TaskReminder,
            is_read: false,
            created_at: Utc::now(),
            action_url: Some(format!("app://task/{}", task_title)), // Custom app URL
        };

        // Save to database and emit to frontend
        if let Ok(state) = app_handle.try_state::<crate::AppState>() {
            let db = state.db.lock().await;
            if let Err(e) = db.save_notification(notification.clone()).await {
                error!("Failed to save task reminder notification: {}", e);
            }
        }

        app_handle.emit_all("notification", &notification)?;

        Ok(())
    }

    pub async fn send_achievement_notification(&self, achievement: &str, app_handle: &tauri::AppHandle) -> Result<()> {
        if !self.enabled {
            return Ok(());
        }

        let message = format!("🎉 Achievement unlocked: {}", achievement);

        // Create desktop notification
        let notification_result = Notification::new()
            .summary("ChiCanDoIt - Achievement!")
            .body(&message)
            .icon("achievement")
            .timeout(notify_rust::Timeout::Milliseconds(8000))
            .show();

        match notification_result {
            Ok(_) => info!("Achievement notification sent successfully"),
            Err(e) => error!("Failed to send achievement notification: {}", e),
        }

        // Create notification record
        let notification = NotificationItem {
            id: Uuid::new_v4().to_string(),
            title: "Achievement Unlocked!".to_string(),
            message,
            notification_type: NotificationType::Achievement,
            is_read: false,
            created_at: Utc::now(),
            action_url: None,
        };

        // Save to database and emit to frontend
        if let Ok(state) = app_handle.try_state::<crate::AppState>() {
            let db = state.db.lock().await;
            if let Err(e) = db.save_notification(notification.clone()).await {
                error!("Failed to save achievement notification: {}", e);
            }
        }

        app_handle.emit_all("notification", &notification)?;

        Ok(())
    }

    pub async fn send_communication_alert(&self, service: &str, count: i32, app_handle: &tauri::AppHandle) -> Result<()> {
        if !self.enabled || count == 0 {
            return Ok(());
        }

        let (icon, message) = match service {
            "gmail" => ("mail", format!("📧 {} new emails require attention", count)),
            "discord" => ("chat", format!("💬 {} new Discord messages", count)),
            "messenger" => ("message", format!("📱 {} new messages in Messenger", count)),
            _ => ("notification", format!("📢 {} new messages in {}", count, service)),
        };

        // Create desktop notification
        let notification_result = Notification::new()
            .summary("ChiCanDoIt - Communication Alert")
            .body(&message)
            .icon(icon)
            .timeout(notify_rust::Timeout::Milliseconds(4000))
            .show();

        match notification_result {
            Ok(_) => info!("Communication alert sent successfully"),
            Err(e) => error!("Failed to send communication alert: {}", e),
        }

        // Create notification record
        let notification = NotificationItem {
            id: Uuid::new_v4().to_string(),
            title: "Communication Alert".to_string(),
            message,
            notification_type: NotificationType::Communication,
            is_read: false,
            created_at: Utc::now(),
            action_url: Some(format!("app://communication/{}", service)),
        };

        // Save to database and emit to frontend
        if let Ok(state) = app_handle.try_state::<crate::AppState>() {
            let db = state.db.lock().await;
            if let Err(e) = db.save_notification(notification.clone()).await {
                error!("Failed to save communication alert: {}", e);
            }
        }

        app_handle.emit_all("notification", &notification)?;

        Ok(())
    }

    pub fn set_enabled(&mut self, enabled: bool) {
        self.enabled = enabled;
        info!("Notifications {}", if enabled { "enabled" } else { "disabled" });
    }

    pub fn is_enabled(&self) -> bool {
        self.enabled
    }
}