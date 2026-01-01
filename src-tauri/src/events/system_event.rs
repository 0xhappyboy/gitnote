use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Event};

use crate::global::APP_CONFIG_MANAGER;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeChangedEvent {
    pub theme: String,
    pub is_dark: bool,
}

impl ThemeChangedEvent {
    pub fn new(theme: String) -> Self {
        let is_dark = theme == "dark";
        Self { theme, is_dark }
    }
}

pub fn emit_theme_changed(app: &AppHandle, theme: String) -> Result<(), String> {
    let event = ThemeChangedEvent::new(theme);
    app.emit("theme-changed", event)
        .map_err(|e| format!("Failed to emit theme changed event: {}", e))
}

pub fn emit_current_theme(app: &AppHandle) -> Result<(), String> {
    let config_manager = APP_CONFIG_MANAGER.lock().unwrap();
    let config = config_manager.get_config();
    emit_theme_changed(app, config.theme)
}

pub fn update_theme_and_notify(app: &AppHandle, theme: String) -> Result<(), String> {
    {
        let mut config_manager = APP_CONFIG_MANAGER.lock().unwrap();
        config_manager
            .update_theme(theme.clone())
            .map_err(|e| format!("Failed to save theme: {}", e))?;
    }
    emit_theme_changed(app, theme)
}

pub fn setup_theme_events(app: &AppHandle) {
    if let Err(e) = emit_current_theme(app) {
        eprintln!("Failed to emit initial theme: {}", e);
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoragePathChangedEvent {
    pub note_storage_path: String,
}

impl StoragePathChangedEvent {
    pub fn new(note_storage_path: String) -> Self {
        Self { note_storage_path }
    }
}

pub fn emit_storage_path_changed(app: &AppHandle, note_storage_path: String) -> Result<(), String> {
    let event = StoragePathChangedEvent { note_storage_path };
    app.emit("storage-path-changed", event)
        .map_err(|e| format!("Failed to emit storage path changed event: {}", e))
}

pub fn update_storage_path_and_notify(
    app: &AppHandle,
    note_storage_path: String,
) -> Result<(), String> {
    let current_note_storage_path = {
        let config_manager = APP_CONFIG_MANAGER.lock().unwrap();
        config_manager.get_config().note_storage_path.clone()
    };
    {
        let mut config_manager = APP_CONFIG_MANAGER.lock().unwrap();
        config_manager
            .update_path_config(note_storage_path.clone(), current_note_storage_path)
            .map_err(|e| format!("Failed to save storage path: {}", e))?;
    }
    emit_storage_path_changed(app, note_storage_path)
}
