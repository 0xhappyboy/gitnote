import React, { useState } from 'react';

interface LocalDirectorySettingsProps {
    isDark: boolean;
    noteStoragePath: string;
    backupPath: string;
    autoBackup: boolean;
    onNoteStoragePathChange: (value: string) => void;
    onBackupPathChange: (value: string) => void;
    onAutoBackupChange: (checked: boolean) => void;
}

const LocalDirectorySettings: React.FC<LocalDirectorySettingsProps> = ({
    isDark,
    noteStoragePath,
    backupPath,
    autoBackup,
    onNoteStoragePathChange,
    onBackupPathChange,
    onAutoBackupChange
}) => {
    const [backupTime, setBackupTime] = useState('02:00');
    const [autoClean, setAutoClean] = useState(true);

    const handleBackupTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBackupTime(e.target.value);
    };

    const handleAutoCleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAutoClean(e.target.checked);
    };

    const styles = {
        container: {
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            color: isDark ? '#E8E8E8' : '#1A1A1A'
        } as React.CSSProperties,
        
        settingsSection: {
            marginBottom: '24px'
        } as React.CSSProperties,
        
        sectionTitle: {
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            margin: '0 0 8px 0'
        } as React.CSSProperties,
        
        divider: {
            height: '1px',
            backgroundColor: isDark ? '#333333' : '#E1E1E1',
            margin: '8px 0'
        } as React.CSSProperties,
        
        formContent: {
            marginTop: '12px'
        } as React.CSSProperties,
        
        formGroup: {
            marginBottom: '10px'
        } as React.CSSProperties,
        
        formGroupInline: {
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        } as React.CSSProperties,
        
        formLabel: {
            display: 'block',
            fontWeight: 500,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            marginBottom: '4px'
        } as React.CSSProperties,
        
        labelInfo: {
            fontWeight: 'normal',
            color: isDark ? '#999999' : '#666666',
            marginLeft: '4px',
            fontSize: '13px'
        } as React.CSSProperties,
        
        controlGroup: {
            display: 'flex',
            width: '100%',
            maxWidth: '300px',
            gap: '4px'
        } as React.CSSProperties,
        
        formInput: {
            flex: 1,
            padding: '4px 8px',
            fontSize: '14px',
            lineHeight: 1.5,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#555555' : '#CCCCCC'}`,
            borderRadius: '3px',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
        } as React.CSSProperties,
        
        formInputFocus: {
            borderColor: isDark ? '#48AFF0' : '#137CBD',
            boxShadow: `0 0 0 1px ${isDark ? '#48AFF0' : '#137CBD'}`
        } as React.CSSProperties,
        
        browseButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 8px',
            fontSize: '14px',
            lineHeight: 1.5,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            backgroundColor: isDark ? '#3C3C3C' : '#F5F5F5',
            border: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap' as const
        } as React.CSSProperties,
        
        browseButtonHover: {
            backgroundColor: isDark ? '#4A4A4A' : '#E8E8E8'
        } as React.CSSProperties,
        
        browseButtonActive: {
            backgroundColor: isDark ? '#565656' : '#D9D9D9'
        } as React.CSSProperties,
        
        cleanButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 8px',
            fontSize: '14px',
            lineHeight: 1.5,
            color: isDark ? '#FF7373' : '#DB3737',
            backgroundColor: isDark ? '#3C3C3C' : '#F5F5F5',
            border: `1px solid ${isDark ? '#FF7373' : '#DB3737'}`,
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap' as const
        } as React.CSSProperties,
        
        cleanButtonHover: {
            backgroundColor: isDark ? '#4A2A2A' : '#F5DADA'
        } as React.CSSProperties,
        
        buttonIcon: {
            marginRight: '4px',
            fontSize: '12px'
        } as React.CSSProperties,
        
        switchContainer: {
            display: 'inline-flex',
            alignItems: 'center'
        } as React.CSSProperties,
        
        switchSlider: {
            position: 'relative',
            width: '36px',
            height: '18px',
            backgroundColor: isDark ? '#555555' : '#E1E1E1',
            borderRadius: '9px',
            marginRight: '8px',
            transition: 'background-color 0.15s ease'
        } as React.CSSProperties,
        
        switchSliderOn: {
            backgroundColor: isDark ? '#48AFF0' : '#137CBD'
        } as React.CSSProperties,
        
        switchSliderThumb: {
            position: 'absolute',
            width: '14px',
            height: '14px',
            backgroundColor: 'white',
            borderRadius: '50%',
            top: '2px',
            left: '2px',
            transition: 'transform 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        } as React.CSSProperties,
        
        switchSliderThumbOn: {
            transform: 'translateX(18px)'
        } as React.CSSProperties,
        
        switchText: {
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            fontSize: '14px'
        } as React.CSSProperties,
        
        timeSelect: {
            padding: '4px 8px',
            fontSize: '14px',
            lineHeight: 1.5,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#555555' : '#CCCCCC'}`,
            borderRadius: '3px',
            outline: 'none',
            width: '100px',
            cursor: 'pointer'
        } as React.CSSProperties,
        
        cacheSizeLabel: {
            color: isDark ? '#CCCCCC' : '#333333',
            fontSize: '13px',
            padding: '4px 0'
        } as React.CSSProperties,
        
        placeholder: {
            color: isDark ? '#999999' : '#666666'
        } as React.CSSProperties
    };

    const [inputFocus, setInputFocus] = useState({
        storage: false,
        backup: false,
        cache: false,
        backupTime: false
    });

    const [buttonHover, setButtonHover] = useState({
        browseStorage: false,
        browseBackup: false,
        browseCache: false,
        cleanCache: false
    });

    const [buttonActive, setButtonActive] = useState({
        browseStorage: false,
        browseBackup: false,
        browseCache: false,
        cleanCache: false
    });

    const handleInputFocus = (field: keyof typeof inputFocus) => () => {
        setInputFocus(prev => ({ ...prev, [field]: true }));
    };

    const handleInputBlur = (field: keyof typeof inputFocus) => () => {
        setInputFocus(prev => ({ ...prev, [field]: false }));
    };

    const handleButtonHover = (field: keyof typeof buttonHover) => (state: boolean) => {
        setButtonHover(prev => ({ ...prev, [field]: state }));
    };

    const handleButtonActive = (field: keyof typeof buttonActive) => (state: boolean) => {
        setButtonActive(prev => ({ ...prev, [field]: state }));
    };

    return (
        <div style={styles.container}>
            <div style={styles.settingsSection}>
                <h5 style={styles.sectionTitle}>工作目录设置</h5>
                <div style={styles.divider} />
                <div style={styles.formContent}>
                    <div style={styles.formGroup}>
                        <label htmlFor="storage-path" style={styles.formLabel}>
                            笔记存储目录
                        </label>
                        <div style={styles.controlGroup}>
                            <input
                                id="storage-path"
                                type="text"
                                style={{
                                    ...styles.formInput,
                                    ...(inputFocus.storage ? styles.formInputFocus : {}),
                                    color: isDark ? '#E8E8E8' : '#1A1A1A'
                                }}
                                placeholder="请选择笔记存储目录"
                                value={noteStoragePath}
                                onChange={(e) => onNoteStoragePathChange(e.target.value)}
                                onFocus={handleInputFocus('storage')}
                                onBlur={handleInputBlur('storage')}
                            />
                            <button
                                style={{
                                    ...styles.browseButton,
                                    ...(buttonHover.browseStorage ? styles.browseButtonHover : {}),
                                    ...(buttonActive.browseStorage ? styles.browseButtonActive : {})
                                }}
                                onMouseEnter={() => handleButtonHover('browseStorage')(true)}
                                onMouseLeave={() => handleButtonHover('browseStorage')(false)}
                                onMouseDown={() => handleButtonActive('browseStorage')(true)}
                                onMouseUp={() => handleButtonActive('browseStorage')(false)}
                                onTouchStart={() => handleButtonActive('browseStorage')(true)}
                                onTouchEnd={() => handleButtonActive('browseStorage')(false)}
                            >
                                <span style={styles.buttonIcon}>📁</span>
                                浏览
                            </button>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="backup-path" style={styles.formLabel}>
                            备份目录
                        </label>
                        <div style={styles.controlGroup}>
                            <input
                                id="backup-path"
                                type="text"
                                style={{
                                    ...styles.formInput,
                                    ...(inputFocus.backup ? styles.formInputFocus : {}),
                                    color: isDark ? '#E8E8E8' : '#1A1A1A'
                                }}
                                placeholder="请选择备份目录"
                                value={backupPath}
                                onChange={(e) => onBackupPathChange(e.target.value)}
                                onFocus={handleInputFocus('backup')}
                                onBlur={handleInputBlur('backup')}
                            />
                            <button
                                style={{
                                    ...styles.browseButton,
                                    ...(buttonHover.browseBackup ? styles.browseButtonHover : {}),
                                    ...(buttonActive.browseBackup ? styles.browseButtonActive : {})
                                }}
                                onMouseEnter={() => handleButtonHover('browseBackup')(true)}
                                onMouseLeave={() => handleButtonHover('browseBackup')(false)}
                                onMouseDown={() => handleButtonActive('browseBackup')(true)}
                                onMouseUp={() => handleButtonActive('browseBackup')(false)}
                                onTouchStart={() => handleButtonActive('browseBackup')(true)}
                                onTouchEnd={() => handleButtonActive('browseBackup')(false)}
                            >
                                <span style={styles.buttonIcon}>📁</span>
                                浏览
                            </button>
                        </div>
                    </div>
                    <div style={styles.formGroupInline}>
                        <label htmlFor="auto-backup" style={{...styles.formLabel, marginBottom: 0}}>
                            自动备份
                            <span style={styles.labelInfo}>(每天自动备份笔记数据)</span>
                        </label>
                        <div style={styles.switchContainer}>
                            <input
                                id="auto-backup"
                                type="checkbox"
                                checked={autoBackup}
                                onChange={(e) => onAutoBackupChange(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <label 
                                htmlFor="auto-backup"
                                style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer',
                                    userSelect: 'none' as const
                                }}
                            >
                                <div style={{
                                    ...styles.switchSlider,
                                    ...(autoBackup ? styles.switchSliderOn : {})
                                }}>
                                    <div style={{
                                        ...styles.switchSliderThumb,
                                        ...(autoBackup ? styles.switchSliderThumbOn : {})
                                    }} />
                                </div>
                                <span style={styles.switchText}>启用</span>
                            </label>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="backup-time" style={styles.formLabel}>
                            备份时间
                        </label>
                        <select
                            id="backup-time"
                            style={{
                                ...styles.timeSelect,
                                ...(inputFocus.backupTime ? styles.formInputFocus : {})
                            }}
                            value={backupTime}
                            onChange={handleBackupTimeChange}
                            onFocus={handleInputFocus('backupTime')}
                            onBlur={handleInputBlur('backupTime')}
                        >
                            <option value="00:00">00:00</option>
                            <option value="02:00">02:00</option>
                            <option value="04:00">04:00</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.settingsSection}>
                <h5 style={styles.sectionTitle}>缓存设置</h5>
                <div style={styles.divider} />
                <div style={styles.formContent}>
                    <div style={styles.formGroup}>
                        <label htmlFor="cache-path" style={styles.formLabel}>
                            缓存目录
                        </label>
                        <div style={styles.controlGroup}>
                            <input
                                id="cache-path"
                                type="text"
                                style={{
                                    ...styles.formInput,
                                    ...(inputFocus.cache ? styles.formInputFocus : {}),
                                    color: isDark ? '#E8E8E8' : '#1A1A1A'
                                }}
                                placeholder="请选择缓存目录"
                                onFocus={handleInputFocus('cache')}
                                onBlur={handleInputBlur('cache')}
                            />
                            <button
                                style={{
                                    ...styles.browseButton,
                                    ...(buttonHover.browseCache ? styles.browseButtonHover : {}),
                                    ...(buttonActive.browseCache ? styles.browseButtonActive : {})
                                }}
                                onMouseEnter={() => handleButtonHover('browseCache')(true)}
                                onMouseLeave={() => handleButtonHover('browseCache')(false)}
                                onMouseDown={() => handleButtonActive('browseCache')(true)}
                                onMouseUp={() => handleButtonActive('browseCache')(false)}
                                onTouchStart={() => handleButtonActive('browseCache')(true)}
                                onTouchEnd={() => handleButtonActive('browseCache')(false)}
                            >
                                <span style={styles.buttonIcon}>📁</span>
                                浏览
                            </button>
                            <button
                                style={{
                                    ...styles.cleanButton,
                                    ...(buttonHover.cleanCache ? styles.cleanButtonHover : {})
                                }}
                                onMouseEnter={() => handleButtonHover('cleanCache')(true)}
                                onMouseLeave={() => handleButtonHover('cleanCache')(false)}
                                onMouseDown={() => handleButtonActive('cleanCache')(true)}
                                onMouseUp={() => handleButtonActive('cleanCache')(false)}
                                onTouchStart={() => handleButtonActive('cleanCache')(true)}
                                onTouchEnd={() => handleButtonActive('cleanCache')(false)}
                            >
                                <span style={styles.buttonIcon}>🗑️</span>
                                清理
                            </button>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>缓存大小</label>
                        <div style={styles.cacheSizeLabel}>
                            当前缓存：256 MB
                        </div>
                    </div>
                    <div style={styles.formGroupInline}>
                        <label htmlFor="auto-clean" style={{...styles.formLabel, marginBottom: 0}}>
                            自动清理缓存
                            <span style={styles.labelInfo}>(超过100MB时自动清理)</span>
                        </label>
                        <div style={styles.switchContainer}>
                            <input
                                id="auto-clean"
                                type="checkbox"
                                checked={autoClean}
                                onChange={handleAutoCleanChange}
                                style={{ display: 'none' }}
                            />
                            <label 
                                htmlFor="auto-clean"
                                style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer',
                                    userSelect: 'none' as const
                                }}
                            >
                                <div style={{
                                    ...styles.switchSlider,
                                    ...(autoClean ? styles.switchSliderOn : {})
                                }}>
                                    <div style={{
                                        ...styles.switchSliderThumb,
                                        ...(autoClean ? styles.switchSliderThumbOn : {})
                                    }} />
                                </div>
                                <span style={styles.switchText}>启用</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalDirectorySettings;