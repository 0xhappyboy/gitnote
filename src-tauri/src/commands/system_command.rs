use std::sync::Mutex;

use tauri::{AppHandle, PhysicalPosition, State, WebviewUrl, WebviewWindowBuilder, Window, command};

use crate::{
    context::AppState, events::system_event::emit_theme_changed, global::{WINDOW_SIZE_MANAGE, WINDOW_SIZE_MANAGE_KEY}
};

use crate::config::ConfigManager;

lazy_static::lazy_static! {
    static ref CONFIG_MANAGER: Mutex<ConfigManager> = Mutex::new(ConfigManager::new());
}

#[tauri::command]
pub async fn save_theme_setting(app: AppHandle, theme: String) -> Result<(), String> {
    {
        let mut config_manager = CONFIG_MANAGER.lock().unwrap();
        config_manager.update_theme(theme.clone())
            .map_err(|e| format!("Failed to save theme: {}", e))?;
    }
    emit_theme_changed(&app, theme.clone())
        .map_err(|e| format!("Failed to emit theme changed event: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn get_theme_setting() -> Result<String, String> {
    let config_manager = CONFIG_MANAGER.lock().unwrap();
    let config = config_manager.get_config();
    Ok(config.theme)
}

#[tauri::command]
pub async fn save_preference_setting(auto_start: bool, auto_update: bool) -> Result<(), String> {
    let mut config_manager = CONFIG_MANAGER.lock().unwrap();
    config_manager.update_auto_start(auto_start)
        .map_err(|e| format!("Failed to save auto_start: {}", e))?;
    config_manager.update_auto_update(auto_update)
        .map_err(|e| format!("Failed to save auto_update: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn save_git_setting(git_auto_commit: bool, git_username: String, git_email: String) -> Result<(), String> {
    let mut config_manager = CONFIG_MANAGER.lock().unwrap();
    config_manager.update_git_config(git_auto_commit, git_username, git_email)
        .map_err(|e| format!("Failed to save git config: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn save_path_setting(note_storage_path: String, backup_path: String, auto_backup: bool) -> Result<(), String> {
    let mut config_manager = CONFIG_MANAGER.lock().unwrap();
    config_manager.update_path_config(note_storage_path, backup_path)
        .map_err(|e| format!("Failed to save path config: {}", e))?;
    config_manager.update_auto_backup(auto_backup)
        .map_err(|e| format!("Failed to save auto_backup: {}", e))?;
    Ok(())
}