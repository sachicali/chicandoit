// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod database;
mod models;
mod ai_engine;
mod communication;
mod notifications;
mod system_tray;

use tauri::{Manager, SystemTray};
use std::sync::Arc;
use tokio::sync::Mutex;
use log::{info, error};

use crate::database::Database;
use crate::ai_engine::AIEngine;
use crate::communication::CommunicationManager;
use crate::notifications::NotificationManager;
use crate::system_tray::create_system_tray;

pub struct AppState {
    pub db: Arc<Mutex<Database>>,
    pub ai_engine: Arc<Mutex<AIEngine>>,
    pub communication: Arc<Mutex<CommunicationManager>>,
    pub notifications: Arc<Mutex<NotificationManager>>,
}

#[tokio::main]
async fn main() {
    // Initialize logging
    env_logger::init();
    
    // Load environment variables
    dotenv::dotenv().ok();
    
    info!("Starting ChiCanDoIt application...");

    // Initialize database
    let db = match Database::new().await {
        Ok(database) => Arc::new(Mutex::new(database)),
        Err(e) => {
            error!("Failed to initialize database: {}", e);
            std::process::exit(1);
        }
    };

    // Initialize AI engine
    let ai_engine = Arc::new(Mutex::new(AIEngine::new()));

    // Initialize communication manager
    let communication = Arc::new(Mutex::new(CommunicationManager::new()));

    // Initialize notification manager
    let notifications = Arc::new(Mutex::new(NotificationManager::new()));

    let app_state = AppState {
        db,
        ai_engine,
        communication,
        notifications,
    };

    // Create system tray
    let system_tray = SystemTray::new().with_menu(create_system_tray());

    tauri::Builder::default()
        .manage(app_state)
        .system_tray(system_tray)
        .on_system_tray_event(system_tray::handle_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            commands::get_tasks,
            commands::create_task,
            commands::update_task,
            commands::delete_task,
            commands::get_ai_insights,
            commands::get_communication_status,
            commands::connect_service,
            commands::get_notifications,
            commands::mark_notification_read,
            commands::get_productivity_stats,
            commands::trigger_accountability_check
        ])
        .setup(|app| {
            let app_handle = app.handle();
            
            // Setup periodic tasks
            setup_periodic_tasks(app_handle);
            
            info!("ChiCanDoIt application initialized successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}fn setup_periodic_tasks(app_handle: tauri::AppHandle) {
    let app_handle_clone = app_handle.clone();
    
    // Hourly accountability check
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(3600)); // 1 hour
        
        loop {
            interval.tick().await;
            
            if let Err(e) = perform_accountability_check(&app_handle_clone).await {
                error!("Accountability check failed: {}", e);
            }
        }
    });

    // AI insights refresh every 30 minutes
    let app_handle_clone2 = app_handle.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(1800)); // 30 minutes
        
        loop {
            interval.tick().await;
            
            if let Err(e) = refresh_ai_insights(&app_handle_clone2).await {
                error!("AI insights refresh failed: {}", e);
            }
        }
    });

    // Communication sync every 15 minutes
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(900)); // 15 minutes
        
        loop {
            interval.tick().await;
            
            if let Err(e) = sync_communications(&app_handle).await {
                error!("Communication sync failed: {}", e);
            }
        }
    });
}

async fn perform_accountability_check(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let state = app_handle.state::<AppState>();
    
    // Get current tasks
    let db = state.db.lock().await;
    let tasks = db.get_all_tasks().await?;
    drop(db);
    
    // Generate accountability message
    let ai_engine = state.ai_engine.lock().await;
    let message = ai_engine.generate_accountability_message(&tasks).await?;
    drop(ai_engine);
    
    // Send notification
    let notifications = state.notifications.lock().await;
    notifications.send_accountability_notification(&message, app_handle).await?;
    drop(notifications);
    
    // Emit to frontend
    app_handle.emit_all("accountability_check", &message)?;
    
    info!("Accountability check completed");
    Ok(())
}

async fn refresh_ai_insights(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let state = app_handle.state::<AppState>();
    
    let db = state.db.lock().await;
    let tasks = db.get_all_tasks().await?;
    drop(db);
    
    let ai_engine = state.ai_engine.lock().await;
    let insights = ai_engine.generate_insights(&tasks).await?;
    drop(ai_engine);
    
    app_handle.emit_all("insights_updated", &insights)?;
    
    info!("AI insights refreshed");
    Ok(())
}

async fn sync_communications(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let state = app_handle.state::<AppState>();
    
    let communication = state.communication.lock().await;
    let activity = communication.sync_all().await?;
    drop(communication);
    
    app_handle.emit_all("communication_synced", &activity)?;
    
    info!("Communications synced");
    Ok(())
}