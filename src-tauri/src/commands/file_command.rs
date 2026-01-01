use tauri::command;

use crate::global::APP_CONFIG_MANAGER;

#[tauri::command]
pub async fn get_note_storage_directory_tree() -> Result<String, String> {
    use crate::files::File;
    let note_storage_path = {
        let config_manager = APP_CONFIG_MANAGER
            .lock()
            .map_err(|e| format!("Failed to lock config manager: {}", e))?;
        config_manager.get_config().note_storage_path
    };
    if note_storage_path.is_empty() {
        return Err("Note storage path is not configured".to_string());
    }
    let file_infos = File::list_dir_recursive_with_default_ignores(&note_storage_path)
        .map_err(|e| format!("Failed to list directory: {}", e))?;
    serde_json::to_string(&file_infos).map_err(|e| format!("Failed to serialize to JSON: {}", e))
}
