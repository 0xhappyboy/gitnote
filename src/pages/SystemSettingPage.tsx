import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    Classes,
    H5,
    FormGroup,
    InputGroup,
    Switch,
    RadioGroup,
    Radio,
    Button,
    Divider,
    HTMLSelect,
    ControlGroup,
    Intent,
    Label
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
import { themeManager } from '../globals/theme/ThemeManager';
import { getThemeSetting, saveGitSetting, savePathSetting, savePreferenceSetting, saveThemeSetting } from '../globals/commands/SystemCommand';

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
                    <>
                        <div style={{ marginBottom: 24 }}>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                主题设置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 16 }}>
                                <RadioGroup
                                    label="选择主题"
                                    selectedValue={theme}
                                    onChange={(e) => handleThemeChange(e.currentTarget.value)}
                                    style={{ fontSize: '13px' }}
                                >
                                    <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                border: `2px solid ${theme === 'light' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                                                borderRadius: '8px',
                                                padding: '8px',
                                                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                                                width: '150px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => handleThemeChange('light')}
                                        >
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Radio
                                                    label="光明"
                                                    value="light"
                                                    checked={theme === 'light'}
                                                    style={{ marginBottom: 8, fontWeight: 500 }}
                                                    onChange={(e) => handleThemeChange('light')}
                                                />
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '80px',
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '6px',
                                                border: '1px solid #E1E1E1',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    right: '8px',
                                                    bottom: '8px',
                                                    backgroundColor: '#F5F5F5',
                                                    borderRadius: '4px',
                                                    border: '1px solid #E1E1E1'
                                                }}>
                                                    <div style={{
                                                        height: '16px',
                                                        backgroundColor: '#FFFFFF',
                                                        borderBottom: '1px solid #E1E1E1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 4px'
                                                    }}>
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#FF5F56',
                                                            marginRight: '4px'
                                                        }} />
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#FFBD2E',
                                                            marginRight: '4px'
                                                        }} />
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#27C93F'
                                                        }} />
                                                    </div>
                                                    <div style={{
                                                        padding: '6px',
                                                        fontSize: '8px',
                                                        color: '#333333',
                                                        fontFamily: 'monospace'
                                                    }}>
                                                        <div style={{
                                                            width: '60%',
                                                            height: '6px',
                                                            backgroundColor: '#137CBD',
                                                            marginBottom: '4px',
                                                            borderRadius: '2px'
                                                        }} />
                                                        <div style={{
                                                            width: '80%',
                                                            height: '4px',
                                                            backgroundColor: '#E1E1E1',
                                                            marginBottom: '3px',
                                                            borderRadius: '1px'
                                                        }} />
                                                        <div style={{
                                                            width: '70%',
                                                            height: '4px',
                                                            backgroundColor: '#E1E1E1',
                                                            marginBottom: '3px',
                                                            borderRadius: '1px'
                                                        }} />
                                                        <div style={{
                                                            width: '40%',
                                                            height: '4px',
                                                            backgroundColor: '#E1E1E1',
                                                            borderRadius: '1px'
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                color: isDark ? '#8A8A8A' : '#666666',
                                                fontSize: '11px',
                                                marginTop: '6px',
                                                textAlign: 'center'
                                            }}>
                                                明亮舒适的界面
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                border: `2px solid ${theme === 'dark' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                                                borderRadius: '8px',
                                                padding: '8px',
                                                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                                                width: '150px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => handleThemeChange('dark')}
                                        >
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Radio
                                                    label="黑暗"
                                                    value="dark"
                                                    checked={theme === 'dark'}
                                                    style={{ marginBottom: 8, fontWeight: 500 }}
                                                    onChange={(e) => handleThemeChange('dark')}
                                                />
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '80px',
                                                backgroundColor: '#000000',
                                                borderRadius: '6px',
                                                border: '1px solid #444444',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    right: '8px',
                                                    bottom: '8px',
                                                    backgroundColor: '#1A1A1A',
                                                    borderRadius: '4px',
                                                    border: '1px solid #333333'
                                                }}>
                                                    <div style={{
                                                        height: '16px',
                                                        backgroundColor: '#000000',
                                                        borderBottom: '1px solid #333333',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 4px'
                                                    }}>
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#FF5F56',
                                                            marginRight: '4px'
                                                        }} />
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#FFBD2E',
                                                            marginRight: '4px'
                                                        }} />
                                                        <div style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#27C93F'
                                                        }} />
                                                    </div>
                                                    <div style={{
                                                        padding: '6px',
                                                        fontSize: '8px',
                                                        color: '#CCCCCC',
                                                        fontFamily: 'monospace'
                                                    }}>
                                                        <div style={{
                                                            width: '60%',
                                                            height: '6px',
                                                            backgroundColor: '#48AFF0',
                                                            marginBottom: '4px',
                                                            borderRadius: '2px'
                                                        }} />
                                                        <div style={{
                                                            width: '80%',
                                                            height: '4px',
                                                            backgroundColor: '#333333',
                                                            marginBottom: '3px',
                                                            borderRadius: '1px'
                                                        }} />
                                                        <div style={{
                                                            width: '70%',
                                                            height: '4px',
                                                            backgroundColor: '#333333',
                                                            marginBottom: '3px',
                                                            borderRadius: '1px'
                                                        }} />
                                                        <div style={{
                                                            width: '40%',
                                                            height: '4px',
                                                            backgroundColor: '#333333',
                                                            borderRadius: '1px'
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                color: isDark ? '#8A8A8A' : '#666666',
                                                fontSize: '11px',
                                                marginTop: '6px',
                                                textAlign: 'center'
                                            }}>
                                                夜间使用更护眼
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                偏好设置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 12 }}>
                                <FormGroup
                                    label="开机自动启动"
                                    labelInfo="(启动时自动打开应用)"
                                    labelFor="auto-start"
                                    inline
                                    style={{ marginBottom: 10 }}
                                >
                                    <Switch
                                        id="auto-start"
                                        checked={autoStart}
                                        onChange={async (e) => {
                                            setAutoStart(e.currentTarget.checked);
                                            await savePreferenceSetting(e.currentTarget.checked, autoUpdate);
                                        }}
                                        label="启用"
                                        style={{ margin: 0 }}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="自动检查更新"
                                    labelInfo="(自动检查新版本并提醒)"
                                    labelFor="auto-update"
                                    inline
                                    style={{ marginBottom: 10 }}
                                >
                                    <Switch
                                        id="auto-update"
                                        checked={autoUpdate}
                                        onChange={async (e) => {
                                            setAutoUpdate(e.currentTarget.checked);
                                            await savePreferenceSetting(autoStart, e.currentTarget.checked);
                                        }}
                                        label="启用"
                                        style={{ margin: 0 }}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </>
                );
            case 'Git设置':
                return (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                Git配置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 12 }}>
                                <FormGroup
                                    label="Git用户名"
                                    labelFor="git-username"
                                    style={{ marginBottom: 10 }}
                                >
                                    <InputGroup
                                        id="git-username"
                                        placeholder="请输入Git用户名"
                                        value={gitUsername}
                                        onChange={async (e) => {
                                            setGitUsername(e.target.value);
                                            await saveGitSetting(gitAutoCommit, e.target.value, gitEmail);
                                        }}
                                        style={{ width: '100%', maxWidth: '280px' }}
                                        small
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="Git邮箱"
                                    labelFor="git-email"
                                    style={{ marginBottom: 10 }}
                                >
                                    <InputGroup
                                        id="git-email"
                                        placeholder="请输入Git邮箱"
                                        value={gitEmail}
                                        onChange={async (e) => {
                                            setGitEmail(e.target.value);
                                            await saveGitSetting(gitAutoCommit, gitUsername, e.target.value);
                                        }}
                                        style={{ width: '100%', maxWidth: '280px' }}
                                        small
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="自动提交更改"
                                    labelInfo="(编辑后自动提交到Git仓库)"
                                    labelFor="git-auto-commit"
                                    inline
                                    style={{ marginBottom: 10 }}
                                >
                                    <Switch
                                        id="git-auto-commit"
                                        checked={gitAutoCommit}
                                        onChange={async (e) => {
                                            setGitAutoCommit(e.currentTarget.checked);
                                            await saveGitSetting(e.currentTarget.checked, gitUsername, gitEmail);
                                        }}
                                        label="启用"
                                        style={{ margin: 0 }}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="提交间隔"
                                    labelFor="commit-interval"
                                    style={{ marginBottom: 10 }}
                                >
                                    <HTMLSelect
                                        id="commit-interval"
                                        defaultValue="30"
                                        style={{ width: '120px' }}
                                        fill={false}
                                        small
                                    >
                                        <option value="15">15分钟</option>
                                        <option value="30">30分钟</option>
                                        <option value="60">60分钟</option>
                                    </HTMLSelect>
                                </FormGroup>
                            </div>
                        </div>

                        <div>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                远程仓库配置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 12 }}>
                                <FormGroup
                                    label="远程仓库URL"
                                    labelFor="git-repo-url"
                                    style={{ marginBottom: 10 }}
                                >
                                    <InputGroup
                                        id="git-repo-url"
                                        placeholder="https://github.com/username/repo.git"
                                        style={{ width: '100%', maxWidth: '320px' }}
                                        small
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="分支"
                                    labelFor="git-branch"
                                    style={{ marginBottom: 10 }}
                                >
                                    <HTMLSelect
                                        id="git-branch"
                                        defaultValue="main"
                                        style={{ width: '120px' }}
                                        fill={false}
                                        small
                                    >
                                        <option value="main">main</option>
                                        <option value="master">master</option>
                                        <option value="develop">develop</option>
                                    </HTMLSelect>
                                </FormGroup>
                                <div style={{ marginTop: 16, display: 'flex', gap: '8px' }}>
                                    <Button
                                        intent={Intent.PRIMARY}
                                        icon="link"
                                        small
                                        style={{ padding: '4px 12px' }}
                                    >
                                        测试连接
                                    </Button>
                                    <Button
                                        icon="updated"
                                        small
                                        style={{ padding: '4px 12px' }}
                                    >
                                        同步到远程
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case '本地目录设置':
                return (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                工作目录设置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 12 }}>
                                <FormGroup
                                    label="笔记存储目录"
                                    labelFor="storage-path"
                                    style={{ marginBottom: 10 }}
                                >
                                    <ControlGroup style={{ width: '100%', maxWidth: '300px' }}>
                                        <InputGroup
                                            id="storage-path"
                                            placeholder="请选择笔记存储目录"
                                            value={noteStoragePath}
                                            onChange={async (e) => {
                                                setNoteStoragePath(e.target.value);
                                                await savePathSetting(e.target.value, backupPath, autoBackup);
                                            }}
                                            style={{ flex: 1 }}
                                            small
                                        />
                                        <Button
                                            icon="folder-open"
                                            small
                                            style={{ padding: '4px 8px' }}
                                        >
                                            浏览
                                        </Button>
                                    </ControlGroup>
                                </FormGroup>
                                <FormGroup
                                    label="备份目录"
                                    labelFor="backup-path"
                                    style={{ marginBottom: 10 }}
                                >
                                    <ControlGroup style={{ width: '100%', maxWidth: '300px' }}>
                                        <InputGroup
                                            id="backup-path"
                                            placeholder="请选择备份目录"
                                            value={backupPath}
                                            onChange={async (e) => {
                                                setBackupPath(e.target.value);
                                                await savePathSetting(noteStoragePath, e.target.value, autoBackup);
                                            }}

                                            style={{ flex: 1 }}
                                            small
                                        />
                                        <Button
                                            icon="folder-open"
                                            small
                                            style={{ padding: '4px 8px' }}
                                        >
                                            浏览
                                        </Button>
                                    </ControlGroup>
                                </FormGroup>
                                <FormGroup
                                    label="自动备份"
                                    labelInfo="(每天自动备份笔记数据)"
                                    labelFor="auto-backup"
                                    inline
                                    style={{ marginBottom: 10 }}
                                >
                                    <Switch
                                        id="auto-backup"
                                        checked={autoBackup}
                                        onChange={async (e) => {
                                            setAutoBackup(e.currentTarget.checked);
                                            await savePathSetting(noteStoragePath, backupPath, e.currentTarget.checked);
                                        }}
                                        label="启用"
                                        style={{ margin: 0 }}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="备份时间"
                                    labelFor="backup-time"
                                    style={{ marginBottom: 10 }}
                                >
                                    <HTMLSelect
                                        id="backup-time"
                                        defaultValue="02:00"
                                        style={{ width: '100px' }}
                                        fill={false}
                                        small
                                    >
                                        <option value="00:00">00:00</option>
                                        <option value="02:00">02:00</option>
                                        <option value="04:00">04:00</option>
                                    </HTMLSelect>
                                </FormGroup>
                            </div>
                        </div>

                        <div>
                            <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                                缓存设置
                            </H5>
                            <Divider style={{
                                backgroundColor: isDark ? '#333333' : '#E1E1E1',
                                margin: '8px 0'
                            }} />
                            <div style={{ marginTop: 12 }}>
                                <FormGroup
                                    label="缓存目录"
                                    labelFor="cache-path"
                                    style={{ marginBottom: 10 }}
                                >
                                    <ControlGroup style={{ width: '100%', maxWidth: '300px' }}>
                                        <InputGroup
                                            id="cache-path"
                                            placeholder="请选择缓存目录"
                                            style={{ flex: 1 }}
                                            small
                                        />
                                        <Button
                                            icon="folder-open"
                                            small
                                            style={{ padding: '4px 8px' }}
                                        >
                                            浏览
                                        </Button>
                                        <Button
                                            intent={Intent.DANGER}
                                            icon="trash"
                                            small
                                            style={{ padding: '4px 8px' }}
                                        >
                                            清理
                                        </Button>
                                    </ControlGroup>
                                </FormGroup>
                                <FormGroup label="缓存大小" style={{ marginBottom: 10 }}>
                                    <Label style={{
                                        color: isDark ? '#CCCCCC' : '#333333',
                                        fontSize: '13px'
                                    }}>
                                        当前缓存：256 MB
                                    </Label>
                                </FormGroup>
                                <FormGroup
                                    label="自动清理缓存"
                                    labelInfo="(超过100MB时自动清理)"
                                    labelFor="auto-clean"
                                    inline
                                    style={{ marginBottom: 10 }}
                                >
                                    <Switch
                                        id="auto-clean"
                                        defaultChecked={true}
                                        label="启用"
                                        style={{ margin: 0 }}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </>
                );

            default:
                return (
                    <div>
                        <H5 style={{ color: isDark ? '#E8E8E8' : '#1A1A1A', fontSize: '14px', marginBottom: 8 }}>
                            {selectedMenu}
                        </H5>
                        <Divider style={{
                            backgroundColor: isDark ? '#333333' : '#E1E1E1',
                            margin: '8px 0'
                        }} />
                        <div style={{
                            marginTop: 12,
                            color: isDark ? '#8A8A8A' : '#666666',
                            fontSize: '13px'
                        }}>
                            这里是 {selectedMenu} 的配置页面
                        </div>
                    </div>
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