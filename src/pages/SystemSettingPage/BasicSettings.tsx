import React from 'react';
import { H5, Divider, RadioGroup, Radio, FormGroup, Switch } from '@blueprintjs/core';

interface BasicSettingsProps {
    isDark: boolean;
    theme: string;
    autoStart: boolean;
    autoUpdate: boolean;
    onThemeChange: (newTheme: string) => void;
    onAutoStartChange: (checked: boolean) => void;
    onAutoUpdateChange: (checked: boolean) => void;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({
    isDark,
    theme,
    autoStart,
    autoUpdate,
    onThemeChange,
    onAutoStartChange,
    onAutoUpdateChange
}) => {
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
                        onChange={(e) => onThemeChange(e.currentTarget.value)}
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
                                onClick={() => onThemeChange('light')}
                            >
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Radio
                                        label="光明"
                                        value="light"
                                        checked={theme === 'light'}
                                        style={{ marginBottom: 8, fontWeight: 500 }}
                                        onChange={(e) => onThemeChange('light')}
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
                                onClick={() => onThemeChange('dark')}
                            >
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Radio
                                        label="黑暗"
                                        value="dark"
                                        checked={theme === 'dark'}
                                        style={{ marginBottom: 8, fontWeight: 500 }}
                                        onChange={(e) => onThemeChange('dark')}
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
                            onChange={(e) => onAutoStartChange(e.currentTarget.checked)}
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
                            onChange={(e) => onAutoUpdateChange(e.currentTarget.checked)}
                            label="启用"
                            style={{ margin: 0 }}
                        />
                    </FormGroup>
                </div>
            </div>
        </>
    );
};

export default BasicSettings;