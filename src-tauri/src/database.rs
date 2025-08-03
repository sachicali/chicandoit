use anyhow::Result;
use chrono::Utc;
use log::info;
use sqlx::{Row, SqlitePool};

use crate::models::*;

pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Result<Self> {
        // Create app data directory
        let app_dir = dirs::config_dir()
            .ok_or_else(|| anyhow::anyhow!("Could not find config directory"))?
            .join("ChiCanDoIt");

        tokio::fs::create_dir_all(&app_dir).await?;

        let db_path = app_dir.join("app.db");
        let database_url = format!("sqlite://{}?mode=rwc", db_path.display());

        info!("Initializing database at: {}", database_url);

        let pool = SqlitePool::connect(&database_url).await?;

        let db = Self { pool };
        db.run_migrations().await?;

        Ok(db)
    }

    async fn run_migrations(&self) -> Result<()> {
        info!("Running database migrations...");

        // Create tasks table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
                status TEXT NOT NULL CHECK (status IN ('pending', 'inprogress', 'completed', 'paused', 'cancelled')),
                category TEXT NOT NULL,
                estimated_time INTEGER NOT NULL,
                actual_time INTEGER,
                due_date DATETIME,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                completed_at DATETIME
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Create AI insights table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS ai_insights (
                id TEXT PRIMARY KEY,
                message TEXT NOT NULL,
                insight_type TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at DATETIME NOT NULL
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Create notifications table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                notification_type TEXT NOT NULL,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at DATETIME NOT NULL,
                action_url TEXT
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Create communication_activity table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS communication_activity (
                id TEXT PRIMARY KEY,
                service TEXT NOT NULL,
                message_count INTEGER NOT NULL DEFAULT 0,
                unread_count INTEGER NOT NULL DEFAULT 0,
                last_activity DATETIME,
                mentions INTEGER NOT NULL DEFAULT 0,
                keywords_detected TEXT, -- JSON array
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        info!("Database migrations completed successfully");
        Ok(())
    } // Task operations
    pub async fn get_all_tasks(&self) -> Result<Vec<Task>> {
        let rows = sqlx::query_as::<_, Task>("SELECT * FROM tasks ORDER BY created_at DESC")
            .fetch_all(&self.pool)
            .await?;

        Ok(rows)
    }

    pub async fn get_task_by_id(&self, id: &str) -> Result<Option<Task>> {
        let task = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = ?")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;

        Ok(task)
    }

    pub async fn create_task(&self, task: Task) -> Result<Task> {
        sqlx::query(
            r#"
            INSERT INTO tasks (
                id, title, description, priority, status, category,
                estimated_time, actual_time, due_date, created_at, updated_at, completed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&task.id)
        .bind(&task.title)
        .bind(&task.description)
        .bind(&task.priority)
        .bind(&task.status)
        .bind(&task.category)
        .bind(task.estimated_time)
        .bind(task.actual_time)
        .bind(task.due_date)
        .bind(task.created_at)
        .bind(task.updated_at)
        .bind(task.completed_at)
        .execute(&self.pool)
        .await?;

        Ok(task)
    }

    pub async fn update_task(&self, task: Task) -> Result<Task> {
        sqlx::query(
            r#"
            UPDATE tasks SET
                title = ?, description = ?, priority = ?, status = ?, category = ?,
                estimated_time = ?, actual_time = ?, due_date = ?, updated_at = ?, completed_at = ?
            WHERE id = ?
            "#,
        )
        .bind(&task.title)
        .bind(&task.description)
        .bind(&task.priority)
        .bind(&task.status)
        .bind(&task.category)
        .bind(task.estimated_time)
        .bind(task.actual_time)
        .bind(task.due_date)
        .bind(task.updated_at)
        .bind(task.completed_at)
        .bind(&task.id)
        .execute(&self.pool)
        .await?;

        Ok(task)
    }

    pub async fn delete_task(&self, id: &str) -> Result<bool> {
        let result = sqlx::query("DELETE FROM tasks WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn get_tasks_by_status(&self, status: TaskStatus) -> Result<Vec<Task>> {
        let tasks = sqlx::query_as::<_, Task>(
            "SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC",
        )
        .bind(status)
        .fetch_all(&self.pool)
        .await?;

        Ok(tasks)
    }

    pub async fn get_overdue_tasks(&self) -> Result<Vec<Task>> {
        let now = Utc::now();
        let tasks = sqlx::query_as::<_, Task>(
            "SELECT * FROM tasks WHERE due_date < ? AND status != 'completed' ORDER BY due_date ASC"
        )
        .bind(now)
        .fetch_all(&self.pool)
        .await?;

        Ok(tasks)
    }

    pub async fn get_productivity_stats(&self) -> Result<ProductivityStats> {
        let total_tasks: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM tasks")
            .fetch_one(&self.pool)
            .await?;

        let completed_tasks: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tasks WHERE status = 'completed'")
                .fetch_one(&self.pool)
                .await?;

        let pending_tasks: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
                .fetch_one(&self.pool)
                .await?;

        let overdue_tasks: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM tasks WHERE due_date < ? AND status != 'completed'",
        )
        .bind(Utc::now())
        .fetch_one(&self.pool)
        .await?;

        let completion_rate = if total_tasks > 0 {
            (completed_tasks as f32 / total_tasks as f32) * 100.0
        } else {
            0.0
        };

        // Calculate average completion time
        let avg_completion_time: Option<f64> = sqlx::query_scalar(
            "SELECT AVG(actual_time) FROM tasks WHERE status = 'completed' AND actual_time IS NOT NULL"
        )
        .fetch_optional(&self.pool)
        .await?
        .flatten();

        Ok(ProductivityStats {
            total_tasks: total_tasks as i32,
            completed_tasks: completed_tasks as i32,
            pending_tasks: pending_tasks as i32,
            overdue_tasks: overdue_tasks as i32,
            completion_rate,
            average_completion_time: avg_completion_time.map(|t| t as f32),
            most_productive_hours: vec![], // TODO: Implement based on completion times
            common_categories: vec![],     // TODO: Implement category analysis
            weekly_progress: vec![],       // TODO: Implement weekly progress tracking
        })
    } // AI Insights operations
    pub async fn save_ai_insight(&self, insight: AIInsight) -> Result<()> {
        sqlx::query(
            "INSERT INTO ai_insights (id, message, insight_type, confidence, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&insight.id)
        .bind(&insight.message)
        .bind(&insight.insight_type)
        .bind(insight.confidence)
        .bind(insight.created_at)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_recent_insights(&self, limit: i32) -> Result<Vec<AIInsight>> {
        let insights = sqlx::query_as::<_, AIInsight>(
            "SELECT * FROM ai_insights ORDER BY created_at DESC LIMIT ?",
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        Ok(insights)
    }

    // Notification operations
    pub async fn save_notification(&self, notification: &NotificationItem) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO notifications (id, title, message, notification_type, is_read, created_at, action_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            "#
        )
        .bind(&notification.id)
        .bind(&notification.title)
        .bind(&notification.message)
        .bind(&notification.notification_type)
        .bind(notification.is_read)
        .bind(notification.created_at)
        .bind(&notification.action_url)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_notifications(&self, limit: i32) -> Result<Vec<NotificationItem>> {
        let notifications = sqlx::query_as::<_, NotificationItem>(
            "SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?",
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;

        Ok(notifications)
    }

    pub async fn mark_notification_read(&self, id: &str) -> Result<bool> {
        let result = sqlx::query("UPDATE notifications SET is_read = TRUE WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn get_unread_notification_count(&self) -> Result<i64> {
        let count = sqlx::query_scalar("SELECT COUNT(*) FROM notifications WHERE is_read = FALSE")
            .fetch_one(&self.pool)
            .await?;

        Ok(count)
    }

    // Communication activity operations
    pub async fn save_communication_activity(&self, activity: CommunicationActivity) -> Result<()> {
        let keywords_json = serde_json::to_string(&activity.keywords_detected)?;
        let now = Utc::now();

        sqlx::query(
            r#"
            INSERT OR REPLACE INTO communication_activity 
            (id, service, message_count, unread_count, last_activity, mentions, keywords_detected, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM communication_activity WHERE service = ?), ?), ?)
            "#
        )
        .bind(&activity.service) // Using service as ID for UPSERT behavior
        .bind(&activity.service)
        .bind(activity.message_count)
        .bind(activity.unread_count)
        .bind(activity.last_activity)
        .bind(activity.mentions)
        .bind(keywords_json)
        .bind(&activity.service) // For COALESCE
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_communication_activity(&self) -> Result<Vec<CommunicationActivity>> {
        let rows = sqlx::query("SELECT * FROM communication_activity ORDER BY updated_at DESC")
            .fetch_all(&self.pool)
            .await?;

        let mut activities = Vec::new();
        for row in rows {
            let keywords_json: String = row.get("keywords_detected");
            let keywords_detected: Vec<String> =
                serde_json::from_str(&keywords_json).unwrap_or_default();

            activities.push(CommunicationActivity {
                service: row.get("service"),
                message_count: row.get("message_count"),
                unread_count: row.get("unread_count"),
                last_activity: row.get("last_activity"),
                mentions: row.get("mentions"),
                keywords_detected,
            });
        }

        Ok(activities)
    }
}
