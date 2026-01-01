import { invoke } from '@tauri-apps/api/core';

const SAVE_THEME_SETTING = "save_theme_setting";
const GET_THEME_SETTING = "get_theme_setting";
const SAVE_PREFERENCE_SETTING = "save_preference_setting";
const SAVE_GIT_SETTING = "save_git_setting";
const SAVE_PATH_SETTING = "save_path_setting";

export async function saveThemeSetting(theme: string): Promise<void> {
    await invoke(SAVE_THEME_SETTING, { theme });
}

export async function getThemeSetting(): Promise<string> {
    return await invoke(GET_THEME_SETTING);
}

export async function savePreferenceSetting(autoStart: boolean, autoUpdate: boolean): Promise<void> {
    await invoke(SAVE_PREFERENCE_SETTING, { autoStart, autoUpdate });
}

export async function saveGitSetting(gitAutoCommit: boolean, gitUsername: string, gitEmail: string): Promise<void> {
    await invoke(SAVE_GIT_SETTING, { gitAutoCommit, gitUsername, gitEmail });
}

export async function savePathSetting(noteStoragePath: string, backupPath: string, autoBackup: boolean): Promise<void> {
    await invoke(SAVE_PATH_SETTING, { noteStoragePath, backupPath, autoBackup });
}