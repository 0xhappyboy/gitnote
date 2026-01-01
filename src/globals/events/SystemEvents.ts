import { listen } from '@tauri-apps/api/event';

interface ThemeChangedEvent {
    theme: string;
    is_dark: boolean;
}

// setup theme change listener
export function setupThemeChangeListener(
    onThemeChanged: (theme: string, isDark: boolean) => void
): () => void {
    const unlisten = listen<ThemeChangedEvent>('theme-changed', (event) => {
        const { theme, is_dark } = event.payload;
        onThemeChanged(theme, is_dark);
    });
    return () => {
        unlisten.then((cleanup) => cleanup());
    };
}