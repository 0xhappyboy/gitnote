use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize)]
pub enum FileType {
    File,
    Directory,
}

#[derive(Debug, Serialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub file_type: FileType,
    pub extension: Option<String>,
    pub size: u64,
    pub modified: u64,
    pub children: Vec<FileInfo>,
    pub depth: usize,
}

pub struct File {}

impl File {
    pub fn list_dir_recursive(
        path: &str,
        ignore_list: Option<Vec<&str>>,
    ) -> Result<Vec<FileInfo>, String> {
        let root_path = Path::new(path);
        if !root_path.exists() {
            return Err(format!("Path does not exist: {}", path));
        }
        if !root_path.is_dir() {
            return Err(format!("Path is not a directory: {}", path));
        }
        let ignore_set: HashSet<String> = ignore_list
            .unwrap_or_default()
            .into_iter()
            .map(|s| s.to_lowercase())
            .collect();
        fn scan_dir(
            dir: &Path,
            depth: usize,
            ignore_set: &HashSet<String>,
        ) -> Result<Vec<FileInfo>, std::io::Error> {
            let mut items = Vec::new();
            for entry in fs::read_dir(dir)? {
                let entry = entry?;
                let path = entry.path();
                let file_name = path
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();
                if ignore_set.contains(&file_name.to_lowercase()) {
                    continue;
                }
                let metadata = entry.metadata()?;
                let is_dir = metadata.is_dir();
                let file_type = if is_dir {
                    FileType::Directory
                } else {
                    FileType::File
                };
                let extension = path
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .map(|s| s.to_string());
                let mut file_info = FileInfo {
                    name: file_name.clone(),
                    path: path.to_string_lossy().to_string(),
                    file_type,
                    extension: extension.clone(),
                    size: metadata.len(),
                    modified: metadata
                        .modified()
                        .unwrap_or(std::time::SystemTime::UNIX_EPOCH)
                        .duration_since(std::time::SystemTime::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_secs(),
                    children: Vec::new(),
                    depth,
                };
                if is_dir {
                    file_info.children = scan_dir(&path, depth + 1, ignore_set)?;
                }
                items.push(file_info);
            }
            items.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
            Ok(items)
        }
        let result = scan_dir(root_path, 0, &ignore_set)
            .map_err(|e| format!("Failed to list directory: {}", e))?;
        Ok(result)
    }

    pub fn list_dir_recursive_simple(path: &str) -> Result<Vec<FileInfo>, String> {
        Self::list_dir_recursive(path, None)
    }

    pub fn list_dir_recursive_with_default_ignores(path: &str) -> Result<Vec<FileInfo>, String> {
        let default_ignores = vec![
            ".git",
            "node_modules",
            ".DS_Store",
            "Thumbs.db",
            ".idea",
            ".vscode",
            "target",
            "__pycache__",
            ".pytest_cache",
            "venv",
            "env",
            ".env",
            ".env.local",
            ".env.development.local",
            ".env.test.local",
            ".env.production.local",
        ];
        Self::list_dir_recursive(path, Some(default_ignores))
    }
}
