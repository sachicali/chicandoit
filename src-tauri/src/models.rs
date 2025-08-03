use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: Priority,
    pub status: TaskStatus,
    pub category: String,
    pub estimated_time: i32,      // in minutes
    pub actual_time: Option<i32>, // in minutes
    pub due_date: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "priority", rename_all = "lowercase")]
pub enum Priority {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "task_status", rename_all = "lowercase")]
pub enum TaskStatus {
    Pending,
    InProgress,
    Completed,
    Paused,
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTaskRequest {
    pub title: String,
    pub description: Option<String>,
    pub priority: Priority,
    pub category: String,
    pub estimated_time: i32,
    pub due_date: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTaskRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub priority: Option<Priority>,
    pub status: Option<TaskStatus>,
    pub category: Option<String>,
    pub estimated_time: Option<i32>,
    pub actual_time: Option<i32>,
    pub due_date: Option<DateTime<Utc>>,
}

impl Task {
    pub fn new(request: CreateTaskRequest) -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4().to_string(),
            title: request.title,
            description: request.description,
            priority: request.priority,
            status: TaskStatus::Pending,
            category: request.category,
            estimated_time: request.estimated_time,
            actual_time: None,
            due_date: request.due_date,
            created_at: now,
            updated_at: now,
            completed_at: None,
        }
    }

    pub fn update(&mut self, request: UpdateTaskRequest) {
        if let Some(title) = request.title {
            self.title = title;
        }
        if let Some(description) = request.description {
            self.description = Some(description);
        }
        if let Some(priority) = request.priority {
            self.priority = priority;
        }
        if let Some(status) = request.status {
            // Set completed_at when task is completed
            if status == TaskStatus::Completed && self.status != TaskStatus::Completed {
                self.completed_at = Some(Utc::now());
            }
            self.status = status;
        }
        if let Some(category) = request.category {
            self.category = category;
        }
        if let Some(estimated_time) = request.estimated_time {
            self.estimated_time = estimated_time;
        }
        if let Some(actual_time) = request.actual_time {
            self.actual_time = Some(actual_time);
        }
        if let Some(due_date) = request.due_date {
            self.due_date = Some(due_date);
        }

        self.updated_at = Utc::now();
    }

    pub fn is_overdue(&self) -> bool {
        match self.due_date {
            Some(due_date) => Utc::now() > due_date && self.status != TaskStatus::Completed,
            None => false,
        }
    }

    pub fn days_until_due(&self) -> Option<i64> {
        self.due_date
            .map(|due_date| (due_date - Utc::now()).num_days())
    }
}

impl PartialEq for TaskStatus {
    fn eq(&self, other: &Self) -> bool {
        std::mem::discriminant(self) == std::mem::discriminant(other)
    }
}
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct AIInsight {
    pub id: String,
    pub message: String,
    pub insight_type: InsightType,
    pub confidence: f32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "insight_type", rename_all = "lowercase")]
pub enum InsightType {
    ProductivityTip,
    TaskPrioritization,
    TimeManagement,
    PatternRecognition,
    Accountability,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductivityStats {
    pub total_tasks: i32,
    pub completed_tasks: i32,
    pub pending_tasks: i32,
    pub overdue_tasks: i32,
    pub completion_rate: f32,
    pub average_completion_time: Option<f32>, // in minutes
    pub most_productive_hours: Vec<i32>,
    pub common_categories: Vec<String>,
    pub weekly_progress: Vec<DailyProgress>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyProgress {
    pub date: chrono::NaiveDate,
    pub completed: i32,
    pub created: i32,
    pub total_time: i32, // in minutes
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommunicationActivity {
    pub service: String,
    pub message_count: i32,
    pub unread_count: i32,
    pub last_activity: Option<DateTime<Utc>>,
    pub mentions: i32,
    pub keywords_detected: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct NotificationItem {
    pub id: String,
    pub title: String,
    pub message: String,
    pub notification_type: NotificationType,
    pub is_read: bool,
    pub created_at: DateTime<Utc>,
    pub action_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "notification_type", rename_all = "lowercase")]
pub enum NotificationType {
    Accountability,
    TaskReminder,
    Deadline,
    Achievement,
    Communication,
    Insight,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppSettings {
    pub accountability_interval: i32, // minutes
    pub enable_notifications: bool,
    pub work_hours_start: chrono::NaiveTime,
    pub work_hours_end: chrono::NaiveTime,
    pub auto_start: bool,
    pub minimize_to_tray: bool,
    pub theme: AppTheme,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum AppTheme {
    Light,
    Dark,
    Auto,
}
