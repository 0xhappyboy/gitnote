import React from 'react';

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
    const styles = {
        container: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        section: {
            marginBottom: '24px'
        },
        sectionTitle: {
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '8px',
            marginTop: 0
        },
        divider: {
            height: '1px',
            backgroundColor: isDark ? '#333333' : '#E1E1E1',
            margin: '8px 0',
            border: 'none'
        },
        themeOptions: {
            display: 'flex',
            gap: '20px',
            marginTop: '16px'
        } as React.CSSProperties,
        themeCard: {
            cursor: 'pointer',
            borderRadius: '8px',
            padding: '8px',
            width: '150px',
            transition: 'all 0.2s ease',
            position: 'relative' as const
        },
        themePreview: {
            width: '100%',
            height: '80px',
            borderRadius: '6px',
            border: '1px solid',
            overflow: 'hidden' as const,
            position: 'relative' as const,
            marginTop: '8px'
        },
        previewWindow: {
            position: 'absolute' as const,
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            borderRadius: '4px',
            border: '1px solid'
        },
        windowHeader: {
            height: '16px',
            borderBottom: '1px solid',
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px'
        },
        windowDot: {
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            marginRight: '4px'
        },
        windowContent: {
            padding: '6px',
            fontSize: '8px',
            fontFamily: 'monospace'
        },
        contentLine: {
            height: '4px',
            borderRadius: '1px',
            marginBottom: '3px'
        },
        themeDescription: {
            fontSize: '11px',
            marginTop: '6px',
            textAlign: 'center' as const
        },
        radioContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
        },
        radioInput: {
            display: 'none'
        },
        radioCustom: {
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: '2px solid',
            marginRight: '8px',
            position: 'relative' as const,
            display: 'inline-block'
        },
        radioText: {
            fontSize: '13px',
            fontWeight: 500
        },
        formGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
        },
        formLabel: {
            fontSize: '13px'
        },
        mainLabel: {
            fontWeight: 500,
            color: isDark ? '#E8E8E8' : '#1A1A1A'
        },
        labelInfo: {
            color: isDark ? '#8A8A8A' : '#666666',
            marginLeft: '4px',
            fontSize: '12px'
        },
        switchContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        switchInput: {
            display: 'none'
        },
        switchLabel: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
        },
        switchSlider: {
            width: '38px',
            height: '20px',
            borderRadius: '10px',
            position: 'relative' as const,
            marginRight: '8px',
            transition: 'background-color 0.2s'
        },
        switchSliderBefore: {
            content: '""',
            position: 'absolute' as const,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            top: '2px',
            left: '2px',
            transition: 'transform 0.2s',
            backgroundColor: '#FFFFFF'
        },
        switchText: {
            fontSize: '13px',
            color: isDark ? '#E8E8E8' : '#1A1A1A'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <h5 style={styles.sectionTitle}>主题设置</h5>
                <hr style={styles.divider} />
                <div style={styles.themeOptions}>
                    <div
                        style={{
                            ...styles.themeCard,
                            border: `2px solid ${theme === 'light' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5'
                        }}
                        onClick={() => onThemeChange('light')}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <div style={styles.radioContainer}>
                                <input
                                    type="radio"
                                    id="theme-light"
                                    name="theme"
                                    checked={theme === 'light'}
                                    onChange={() => onThemeChange('light')}
                                    style={styles.radioInput}
                                />
                                <label htmlFor="theme-light" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{
                                        ...styles.radioCustom,
                                        borderColor: isDark ? '#48AFF0' : '#137CBD',
                                        backgroundColor: theme === 'light' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                                    }}>
                                        {theme === 'light' && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '4px',
                                                left: '4px',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FFFFFF'
                                            }} />
                                        )}
                                    </span>
                                    <span style={styles.radioText}>光明</span>
                                </label>
                            </div>
                        </div>
                        <div style={{
                            ...styles.themePreview,
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E1E1E1'
                        }}>
                            <div style={{
                                ...styles.previewWindow,
                                backgroundColor: '#F5F5F5',
                                borderColor: '#E1E1E1'
                            }}>
                                <div style={{
                                    ...styles.windowHeader,
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E1E1E1'
                                }}>
                                    <div style={{ ...styles.windowDot, backgroundColor: '#FF5F56' }} />
                                    <div style={{ ...styles.windowDot, backgroundColor: '#FFBD2E' }} />
                                    <div style={{ ...styles.windowDot, backgroundColor: '#27C93F' }} />
                                </div>
                                <div style={styles.windowContent}>
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '60%',
                                        height: '6px',
                                        backgroundColor: '#137CBD',
                                        marginBottom: '4px',
                                        borderRadius: '2px'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '80%',
                                        backgroundColor: '#E1E1E1'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '70%',
                                        backgroundColor: '#E1E1E1'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '40%',
                                        backgroundColor: '#E1E1E1',
                                        marginBottom: 0
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div style={{
                            ...styles.themeDescription,
                            color: isDark ? '#8A8A8A' : '#666666'
                        }}>
                            明亮舒适的界面
                        </div>
                    </div>

                    <div
                        style={{
                            ...styles.themeCard,
                            border: `2px solid ${theme === 'dark' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5'
                        }}
                        onClick={() => onThemeChange('dark')}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <div style={styles.radioContainer}>
                                <input
                                    type="radio"
                                    id="theme-dark"
                                    name="theme"
                                    checked={theme === 'dark'}
                                    onChange={() => onThemeChange('dark')}
                                    style={styles.radioInput}
                                />
                                <label htmlFor="theme-dark" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{
                                        ...styles.radioCustom,
                                        borderColor: isDark ? '#48AFF0' : '#137CBD',
                                        backgroundColor: theme === 'dark' ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                                    }}>
                                        {theme === 'dark' && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '4px',
                                                left: '4px',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FFFFFF'
                                            }} />
                                        )}
                                    </span>
                                    <span style={styles.radioText}>黑暗</span>
                                </label>
                            </div>
                        </div>
                        <div style={{
                            ...styles.themePreview,
                            backgroundColor: '#000000',
                            borderColor: '#444444'
                        }}>
                            <div style={{
                                ...styles.previewWindow,
                                backgroundColor: '#1A1A1A',
                                borderColor: '#333333'
                            }}>
                                <div style={{
                                    ...styles.windowHeader,
                                    backgroundColor: '#000000',
                                    borderColor: '#333333'
                                }}>
                                    <div style={{ ...styles.windowDot, backgroundColor: '#FF5F56' }} />
                                    <div style={{ ...styles.windowDot, backgroundColor: '#FFBD2E' }} />
                                    <div style={{ ...styles.windowDot, backgroundColor: '#27C93F' }} />
                                </div>
                                <div style={styles.windowContent}>
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '60%',
                                        height: '6px',
                                        backgroundColor: '#48AFF0',
                                        marginBottom: '4px',
                                        borderRadius: '2px'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '80%',
                                        backgroundColor: '#333333'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '70%',
                                        backgroundColor: '#333333'
                                    }} />
                                    <div style={{
                                        ...styles.contentLine,
                                        width: '40%',
                                        backgroundColor: '#333333',
                                        marginBottom: 0
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div style={{
                            ...styles.themeDescription,
                            color: isDark ? '#8A8A8A' : '#666666'
                        }}>
                            夜间使用更护眼
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h5 style={styles.sectionTitle}>偏好设置</h5>
                <hr style={styles.divider} />
                <div style={{ marginTop: '12px' }}>
                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>
                            <span style={styles.mainLabel}>
                                开机自动启动
                                <span style={styles.labelInfo}>(启动时自动打开应用)</span>
                            </span>
                        </div>
                        <div style={styles.switchContainer}>
                            <input
                                type="checkbox"
                                id="auto-start"
                                checked={autoStart}
                                onChange={(e) => onAutoStartChange(e.target.checked)}
                                style={styles.switchInput}
                            />
                            <label htmlFor="auto-start" style={styles.switchLabel}>
                                <span style={{
                                    ...styles.switchSlider,
                                    backgroundColor: autoStart ? (isDark ? '#48AFF0' : '#137CBD') : (isDark ? '#333333' : '#E1E1E1')
                                }}>
                                    <span style={{
                                        ...styles.switchSliderBefore,
                                        transform: autoStart ? 'translateX(18px)' : 'translateX(0)'
                                    }} />
                                </span>
                                <span style={styles.switchText}>启用</span>
                            </label>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>
                            <span style={styles.mainLabel}>
                                自动检查更新
                                <span style={styles.labelInfo}>(自动检查新版本并提醒)</span>
                            </span>
                        </div>
                        <div style={styles.switchContainer}>
                            <input
                                type="checkbox"
                                id="auto-update"
                                checked={autoUpdate}
                                onChange={(e) => onAutoUpdateChange(e.target.checked)}
                                style={styles.switchInput}
                            />
                            <label htmlFor="auto-update" style={styles.switchLabel}>
                                <span style={{
                                    ...styles.switchSlider,
                                    backgroundColor: autoUpdate ? (isDark ? '#48AFF0' : '#137CBD') : (isDark ? '#333333' : '#E1E1E1')
                                }}>
                                    <span style={{
                                        ...styles.switchSliderBefore,
                                        transform: autoUpdate ? 'translateX(18px)' : 'translateX(0)'
                                    }} />
                                </span>
                                <span style={styles.switchText}>启用</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicSettings;