use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub theme: String,
    pub auto_start: bool,
    pub auto_update: bool,
    pub git_auto_commit: bool,
    pub git_username: String,
    pub git_email: String,
    pub auto_backup: bool,
    pub note_storage_path: String,
    pub backup_path: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            auto_start: true,
            auto_update: true,
            git_auto_commit: true,
            git_username: String::new(),
            git_email: String::new(),
            auto_backup: true,
            note_storage_path: String::new(),
            backup_path: String::new(),
        }
    }
}

impl AppConfig {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn load() -> std::io::Result<Self> {
        let config_path = Self::config_path();
        if config_path.exists() {
            let content = fs::read_to_string(config_path)?;
            let config: AppConfig = serde_json::from_str(&content)?;
            Ok(config)
        } else {
            Ok(Self::default())
        }
    }
    
    pub fn save(&self) -> std::io::Result<()> {
        let config_path = Self::config_path();
        let content = serde_json::to_string_pretty(self)?;
        fs::write(config_path, content)?;
        Ok(())
    }
    
    fn config_path() -> PathBuf {
        let mut path = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
        path.push("luminliquid");
        if !path.exists() {
            fs::create_dir_all(&path).unwrap_or_default();
        }
        path.push("config.json");
        path
    }
}

pub struct ConfigManager {
    config: AppConfig,
}

impl ConfigManager {
    pub fn new() -> Self {
        let config = AppConfig::load().unwrap_or_default();
        Self { config }
    }
    
    pub fn get_config(&self) -> AppConfig {
        self.config.clone()
    }
    
    pub fn update_theme(&mut self, theme: String) -> std::io::Result<()> {
        self.config.theme = theme;
        self.config.save()
    }
    
    pub fn update_auto_start(&mut self, auto_start: bool) -> std::io::Result<()> {
        self.config.auto_start = auto_start;
        self.config.save()
    }
    
    pub fn update_auto_update(&mut self, auto_update: bool) -> std::io::Result<()> {
        self.config.auto_update = auto_update;
        self.config.save()
    }
    
    pub fn update_git_config(&mut self, git_auto_commit: bool, git_username: String, git_email: String) -> std::io::Result<()> {
        self.config.git_auto_commit = git_auto_commit;
        self.config.git_username = git_username;
        self.config.git_email = git_email;
        self.config.save()
    }
    
    pub fn update_path_config(&mut self, note_storage_path: String, backup_path: String) -> std::io::Result<()> {
        self.config.note_storage_path = note_storage_path;
        self.config.backup_path = backup_path;
        self.config.save()
    }
    
    pub fn update_auto_backup(&mut self, auto_backup: bool) -> std::io::Result<()> {
        self.config.auto_backup = auto_backup;
        self.config.save()
    }
}