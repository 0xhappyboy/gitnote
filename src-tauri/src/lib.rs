use crate::commands::file_command::get_note_storage_directory_tree;
use crate::commands::system_command::*;
use crate::events::system_event::setup_theme_events;
use crate::{
    commands::windows_command::{
        close_window, drag_window, maximize_window, minimize_window, open_system_setting_window,
        recovery_window,
    },
    context::AppState,
};
pub mod commands;
pub mod config;
pub mod context;
pub mod events;
pub mod files;
pub mod global;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {})
        .invoke_handler(tauri::generate_handler![
            minimize_window,
            maximize_window,
            recovery_window,
            close_window,
            drag_window,
            open_system_setting_window,
            save_path_setting,
            save_git_setting,
            save_preference_setting,
            get_theme_setting,
            save_theme_setting,
            get_note_storage_directory_tree
        ])
        .setup(|app| {
            setup_theme_events(&app.handle());
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
