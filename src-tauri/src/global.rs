use std::{collections::HashMap, sync::Mutex};

use lazy_static::lazy_static;

use crate::config::ConfigManager;

pub const WINDOW_SIZE_MANAGE_KEY: &str = "maximize_previous_window_size";

lazy_static! {
    // k:width v:width
    pub static ref WINDOW_SIZE_MANAGE: Mutex<HashMap<String, (u32, u32)>> =
        Mutex::new(HashMap::new());
    pub static ref APP_CONFIG_MANAGER: Mutex<ConfigManager> = Mutex::new(ConfigManager::new());
}
