import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    Classes,
} from '@blueprintjs/core';
import {
    Cog,
    Edit,
    Key,
    Cloud,
    Import,
    GitRepo,
    Desktop,
} from '@blueprintjs/icons';
import BasicSettings from './BasicSettings';
import GitSettings from './GitSettings';
import LocalDirectorySettings from './LocalDirectorySettings';
import DefaultSettings from './DefaultSettings';
import { themeManager } from '../../globals/theme/ThemeManager';
import { getThemeSetting, saveGitSetting, savePathSetting, savePreferenceSetting, saveThemeSetting } from '../../globals/commands/SystemCommand';

interface SettingItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

interface SystemSettingPageProps {
    isDark?: boolean;
}

const SystemSettingPage: React.FC<SystemSettingPageProps> = ({ isDark: propIsDark }) => {
    const [isDark, setIsDark] = useState<boolean>(propIsDark || themeManager.getTheme() === 'dark');
    const [selectedMenu, setSelectedMenu] = useState<string>('基本设置');
    const [theme, setTheme] = useState<string>(themeManager.getTheme() === 'dark' ? 'dark' : 'light');
    const [autoStart, setAutoStart] = useState<boolean>(true);
    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const [gitAutoCommit, setGitAutoCommit] = useState<boolean>(true);
    const [gitUsername, setGitUsername] = useState<string>('');
    const [gitEmail, setGitEmail] = useState<string>('');
    const [autoBackup, setAutoBackup] = useState<boolean>(true);
    const [noteStoragePath, setNoteStoragePath] = useState<string>('');
    const [backupPath, setBackupPath] = useState<string>('');

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const savedTheme = await getThemeSetting();
                if (savedTheme === 'dark') {
                    setIsDark(true);
                    setTheme('dark');
                } else {
                    setIsDark(false);
                    setTheme('light');
                }
            } catch (error) {
                console.error('Failed to load config:', error);
            }
        };
        loadConfig();
    }, []);

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        if (newTheme === 'light') {
            themeManager.setTheme('light');
            setIsDark(false);
        } else if (newTheme === 'dark') {
            themeManager.setTheme('dark');
            setIsDark(true);
        }
        try {
            const themeValue = newTheme === 'light' ? 'light' : 'dark';
            await saveThemeSetting(themeValue);
            console.log('主题已保存到配置文件:', themeValue);
        } catch (error) {
            console.error('保存主题设置失败:', error);
        }
    };

    const handleAutoStartChange = async (checked: boolean) => {
        setAutoStart(checked);
        await savePreferenceSetting(checked, autoUpdate);
    };

    const handleAutoUpdateChange = async (checked: boolean) => {
        setAutoUpdate(checked);
        await savePreferenceSetting(autoStart, checked);
    };

    const handleGitAutoCommitChange = async (checked: boolean) => {
        setGitAutoCommit(checked);
        await saveGitSetting(checked, gitUsername, gitEmail);
    };

    const handleGitUsernameChange = async (value: string) => {
        setGitUsername(value);
        await saveGitSetting(gitAutoCommit, value, gitEmail);
    };

    const handleGitEmailChange = async (value: string) => {
        setGitEmail(value);
        await saveGitSetting(gitAutoCommit, gitUsername, value);
    };

    const handleNoteStoragePathChange = async (value: string) => {
        setNoteStoragePath(value);
        await savePathSetting(value, backupPath, autoBackup);
    };

    const handleBackupPathChange = async (value: string) => {
        setBackupPath(value);
        await savePathSetting(noteStoragePath, value, autoBackup);
    };

    const handleAutoBackupChange = async (checked: boolean) => {
        setAutoBackup(checked);
        await savePathSetting(noteStoragePath, backupPath, checked);
    };

    const menuItems: SettingItem[] = [
        { key: '基本设置', label: '基本设置', icon: <Cog size={16} /> },
        { key: 'Git设置', label: 'Git设置', icon: <GitRepo size={16} /> },
        { key: '本地目录设置', label: '本地目录设置', icon: <Desktop size={16} /> },
        { key: '编辑器设置', label: '编辑器设置', icon: <Edit size={16} /> },
        { key: '快捷键设置', label: '快捷键设置', icon: <Key size={16} /> },
        { key: '代理设置', label: '代理设置', icon: <Cloud size={16} /> },
        { key: '导入导出', label: '导入导出', icon: <Import size={16} /> },
    ];

    const renderContent = () => {
        switch (selectedMenu) {
            case '基本设置':
                return (
                    <BasicSettings
                        isDark={isDark}
                        theme={theme}
                        autoStart={autoStart}
                        autoUpdate={autoUpdate}
                        onThemeChange={handleThemeChange}
                        onAutoStartChange={handleAutoStartChange}
                        onAutoUpdateChange={handleAutoUpdateChange}
                    />
                );
            case 'Git设置':
                return (
                    <GitSettings
                        isDark={isDark}
                        gitAutoCommit={gitAutoCommit}
                        gitUsername={gitUsername}
                        gitEmail={gitEmail}
                        onGitAutoCommitChange={handleGitAutoCommitChange}
                        onGitUsernameChange={handleGitUsernameChange}
                        onGitEmailChange={handleGitEmailChange}
                    />
                );
            case '本地目录设置':
                return (
                    <LocalDirectorySettings
                        isDark={isDark}
                        noteStoragePath={noteStoragePath}
                        backupPath={backupPath}
                        autoBackup={autoBackup}
                        onNoteStoragePathChange={handleNoteStoragePathChange}
                        onBackupPathChange={handleBackupPathChange}
                        onAutoBackupChange={handleAutoBackupChange}
                    />
                );
            default:
                return (
                    <DefaultSettings
                        isDark={isDark}
                        selectedMenu={selectedMenu}
                    />
                );
        }
    };

    return (
        <div className={isDark ? Classes.DARK : ''} style={{
            display: 'flex',
            width: '560px',
            height: '528px',
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
            overflow: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <style>
                {`
                    .bp6-button:focus,
                    .bp6-button:active,
                    .bp6-button.bp6-active,
                    .bp6-button.bp6-minimal:focus,
                    .bp6-button.bp6-minimal:active,
                    .bp6-button.bp6-minimal.bp6-active,
                    .bp6-button.bp6-minimal:hover:active {
                        outline: none !important;
                        box-shadow: none !important;
                        border: none !important;
                        background-color: transparent !important;
                    }
                    
                    .bp6-button:focus,
                    .bp6-button:active,
                    .bp6-button.bp6-active {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    
                    .bp6-input:focus,
                    .bp6-input.bp6-active {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    
                    .bp6-menu-item.bp6-active,
                    .bp6-menu-item:active {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    
                    .bp6-button.bp6-minimal:active::before,
                    .bp6-button.bp6-minimal.bp6-active::before {
                        display: none !important;
                    }
                    
                    .right-content-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: ${isDark ? '#555555 #000000' : '#CCCCCC #FFFFFF'};
                    }
                    
                    .right-content-scroll::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    
                    .right-content-scroll::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 0;
                    }
                    
                    .right-content-scroll::-webkit-scrollbar-thumb {
                        background: ${isDark ? '#555555' : '#CCCCCC'};
                        border-radius: 4px;
                        border: 2px solid ${isDark ? '#000000' : '#FFFFFF'};
                    }
                    
                    .right-content-scroll::-webkit-scrollbar-thumb:hover {
                        background: ${isDark ? '#666666' : '#999999'};
                    }
                    
                    .right-content-scroll::-webkit-scrollbar-corner {
                        background: transparent;
                    }
                    
                    .inner-content-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: ${isDark ? '#444444 transparent' : '#DDDDDD transparent'};
                    }
                    
                    .inner-content-scroll::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .inner-content-scroll::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 0;
                    }
                    
                    .inner-content-scroll::-webkit-scrollbar-thumb {
                        background: ${isDark ? '#444444' : '#DDDDDD'};
                        border-radius: 3px;
                        border: 2px solid transparent;
                        background-clip: content-box;
                    }
                    
                    .inner-content-scroll::-webkit-scrollbar-thumb:hover {
                        background: ${isDark ? '#555555' : '#CCCCCC'};
                        border: 2px solid transparent;
                        background-clip: content-box;
                    }
                    
                    .left-menu-container {
                        overflow: hidden !important;
                    }
                    
                    .menu-item-active {
                        background-color: ${isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)'} !important;
                        color: ${isDark ? '#48AFF0' : '#137CBD'} !important;
                        font-weight: 600;
                    }
                    
                    .menu-item-hover:hover {
                        background-color: ${isDark ? 'rgba(72, 175, 240, 0.1)' : 'rgba(19, 124, 189, 0.05)'} !important;
                    }
                    
                    .setting-button {
                        outline: none !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    
                    .setting-button:focus {
                        outline: none !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    .setting-input {
                        background-color: ${isDark ? '#2A2A2A' : '#FAFAFA'} !important;
                        color: ${isDark ? '#CCCCCC' : '#333333'} !important;
                        border: 1px solid ${isDark ? '#444444' : '#E1E1E1'} !important;
                    }
                    
                    .setting-input:focus {
                        outline: none !important;
                        box-shadow: none !important;
                        border: 1px solid ${isDark ? '#48AFF0' : '#137CBD'} !important;
                    }

                    .theme-card {
                        cursor: pointer;
                        border: 2px solid transparent;
                        border-radius: 8px;
                        padding: 8px;
                        transition: all 0.2s ease;
                    }
                    
                    .theme-card:hover {
                        background-color: ${isDark ? 'rgba(72, 175, 240, 0.05)' : 'rgba(19, 124, 189, 0.05)'};
                    }
                    
                    .theme-card-selected {
                        border-color: ${isDark ? '#48AFF0' : '#137CBD'} !important;
                    }
                `}
            </style>

            <div style={{
                width: '120px',
                backgroundColor: isDark ? '#000000' : '#FFFFFF',
                borderRight: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0
            }} className="left-menu-container">
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    <Menu style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        padding: '4px 0'
                    }}>
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.key}
                                text={item.label}
                                icon={item.icon}
                                onClick={() => setSelectedMenu(item.key)}
                                active={selectedMenu === item.key}
                                className={`menu-item-hover ${selectedMenu === item.key ? 'menu-item-active' : ''}`}
                                style={{
                                    padding: '8px 10px',
                                    margin: '0',
                                    borderRadius: '0',
                                    color: isDark ? '#CCCCCC' : '#333333',
                                    fontSize: '12px',
                                    minHeight: '32px'
                                }}
                            />
                        ))}
                    </Menu>
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: isDark ? '#000000' : '#FFFFFF',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '16px 16px 16px 16px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '0px',
                    paddingBottom: '0px'
                }} className="right-content-scroll">
                    <div style={{
                        maxWidth: '100%',
                        minHeight: '100%',
                        paddingRight: '4px'
                    }}>
                        <div style={{
                            overflowY: 'auto',
                            paddingRight: '4px',
                            paddingBottom: '15px'
                        }} className="inner-content-scroll">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingPage;
