use tauri::State;
use crate::{AppState, models::*};
use anyhow::Result;

#[tauri::command]
pub async fn get_tasks(state: State<'_, AppState>) -> Result<Vec<Task>, String> {
    let db = state.db.lock().await;
    db.get_all_tasks().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_task(
    state: State<'_, AppState>,
    request: CreateTaskRequest,
) -> Result<Task, String> {
    let task = Task::new(request);
    let db = state.db.lock().await;
    db.create_task(task).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task(
    state: State<'_, AppState>,
    id: String,
    request: UpdateTaskRequest,
) -> Result<Task, String> {
    let db = state.db.lock().await;
    
    let mut task = db.get_task_by_id(&id).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Task not found".to_string())?;
    
    task.update(request);
    db.update_task(task).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_task(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, String> {
    let db = state.db.lock().await;
    db.delete_task(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_ai_insights(state: State<'_, AppState>) -> Result<Vec<String>, String> {
    let db = state.db.lock().await;
    let tasks = db.get_all_tasks().await.map_err(|e| e.to_string())?;
    drop(db);

    let ai_engine = state.ai_engine.lock().await;
    ai_engine.generate_insights(&tasks).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_communication_status(state: State<'_, AppState>) -> Result<Vec<CommunicationActivity>, String> {
    let communication = state.communication.lock().await;
    communication.get_status().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn connect_service(
    state: State<'_, AppState>,
    service: String,
) -> Result<String, String> {
    let communication = state.communication.lock().await;
    communication.connect_service(&service).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_notifications(
    state: State<'_, AppState>,
    limit: Option<i32>,
) -> Result<Vec<NotificationItem>, String> {
    let db = state.db.lock().await;
    db.get_notifications(limit.unwrap_or(20)).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_notification_read(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, String> {
    let db = state.db.lock().await;
    db.mark_notification_read(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_productivity_stats(state: State<'_, AppState>) -> Result<ProductivityStats, String> {
    let db = state.db.lock().await;
    db.get_productivity_stats().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn trigger_accountability_check(
    state: State<'_, AppState>,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    let db = state.db.lock().await;
    let tasks = db.get_all_tasks().await.map_err(|e| e.to_string())?;
    drop(db);

    let ai_engine = state.ai_engine.lock().await;
    let message = ai_engine.generate_accountability_message(&tasks).await.map_err(|e| e.to_string())?;
    drop(ai_engine);

    // Send notification
    let notifications = state.notifications.lock().await;
    notifications.send_accountability_notification(&message, &app_handle).await.map_err(|e| e.to_string())?;
    drop(notifications);

    // Emit to frontend
    app_handle.emit_all("accountability_check", &message).map_err(|e| e.to_string())?;

    Ok(message)
}