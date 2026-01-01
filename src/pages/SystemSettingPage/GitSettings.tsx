import React from 'react';

interface GitSettingsProps {
    isDark: boolean;
    gitAutoCommit: boolean;
    gitUsername: string;
    gitEmail: string;
    onGitAutoCommitChange: (checked: boolean) => void;
    onGitUsernameChange: (value: string) => void;
    onGitEmailChange: (value: string) => void;
}

const GitSettings: React.FC<GitSettingsProps> = ({
    isDark,
    gitAutoCommit,
    gitUsername,
    gitEmail,
    onGitAutoCommitChange,
    onGitUsernameChange,
    onGitEmailChange
}) => {
    const styles = {
        container: {
            marginBottom: '16px'
        },
        title: {
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            fontSize: '14px',
            marginBottom: '8px',
            fontWeight: '600' as const,
            marginTop: '0px'
        },
        divider: {
            backgroundColor: isDark ? '#333333' : '#E1E1E1',
            margin: '8px 0',
            height: '1px',
            border: 'none'
        },
        formGroup: {
            marginBottom: '10px'
        },
        label: {
            display: 'block',
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            fontSize: '13px',
            marginBottom: '6px',
            fontWeight: '500' as const
        },
        input: {
            width: '100%',
            maxWidth: '280px',
            padding: '6px 10px',
            fontSize: '13px',
            border: `1px solid ${isDark ? '#444' : '#CCC'}`,
            borderRadius: '3px',
            backgroundColor: isDark ? '#2A2A2A' : '#FFF',
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        },
        inputFocus: {
            border: `1px solid ${isDark ? '#48AFF0' : '#137CBD'}`,
            boxShadow: `0 0 0 1px ${isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.2)'}`
        },
        switchContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
        },
        switchLabel: {
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            fontSize: '13px',
            fontWeight: '500' as const
        },
        switch: {
            position: 'relative' as const,
            display: 'inline-block',
            width: '36px',
            height: '20px'
        },
        switchInput: {
            opacity: 0,
            width: 0,
            height: 0
        },
        switchSlider: {
            position: 'absolute' as const,
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? '#444' : '#CCC',
            transition: '.4s',
            borderRadius: '34px'
        },
        switchSliderBefore: {
            position: 'absolute' as const,
            content: '""',
            height: '16px',
            width: '16px',
            left: '2px',
            bottom: '2px',
            backgroundColor: 'white',
            transition: '.4s',
            borderRadius: '50%'
        },
        select: {
            width: '120px',
            padding: '6px 10px',
            fontSize: '13px',
            border: `1px solid ${isDark ? '#444' : '#CCC'}`,
            borderRadius: '3px',
            backgroundColor: isDark ? '#2A2A2A' : '#FFF',
            color: isDark ? '#E8E8E8' : '#1A1A1A',
            outline: 'none',
            cursor: 'pointer'
        },
        selectFocus: {
            border: `1px solid ${isDark ? '#48AFF0' : '#137CBD'}`,
            boxShadow: `0 0 0 1px ${isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.2)'}`
        },
        buttonGroup: {
            marginTop: '16px',
            display: 'flex',
            gap: '8px'
        },
        button: {
            padding: '6px 12px',
            fontSize: '12px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
        },
        primaryButton: {
            backgroundColor: isDark ? '#137CBD' : '#137CBD',
            color: 'white',
            border: `1px solid ${isDark ? '#106BA3' : '#106BA3'}`
        },
        defaultButton: {
            backgroundColor: isDark ? '#404854' : '#F5F8FA',
            color: isDark ? '#E8E8E8' : '#182026',
            border: `1px solid ${isDark ? '#293742' : '#D8E1E8'}`
        },
        buttonActive: {
            transform: 'translateY(1px)',
            filter: 'brightness(0.9)'
        }
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        Object.assign(e.target.style, styles.inputFocus);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        Object.assign(e.target.style, styles.input);
    };

    const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
        Object.assign(e.target.style, styles.selectFocus);
    };

    const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
        Object.assign(e.target.style, styles.select);
    };

    return (
        <>
            <div style={styles.container}>
                <h5 style={styles.title}>Git配置</h5>
                <hr style={styles.divider} />
                <div style={{ marginTop: '12px' }}>
                    <div style={styles.formGroup}>
                        <label htmlFor="git-username" style={styles.label}>
                            Git用户名
                        </label>
                        <input
                            id="git-username"
                            type="text"
                            placeholder="请输入Git用户名"
                            value={gitUsername}
                            onChange={(e) => onGitUsernameChange(e.target.value)}
                            style={styles.input}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="git-email" style={styles.label}>
                            Git邮箱
                        </label>
                        <input
                            id="git-email"
                            type="email"
                            placeholder="请输入Git邮箱"
                            value={gitEmail}
                            onChange={(e) => onGitEmailChange(e.target.value)}
                            style={styles.input}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <div style={styles.switchContainer}>
                            <label htmlFor="git-auto-commit" style={styles.switchLabel}>
                                自动提交更改
                            </label>
                            <label style={styles.switch}>
                                <input
                                    id="git-auto-commit"
                                    type="checkbox"
                                    checked={gitAutoCommit}
                                    onChange={(e) => onGitAutoCommitChange(e.target.checked)}
                                    style={styles.switchInput}
                                />
                                <span style={{
                                    ...styles.switchSlider,
                                    backgroundColor: gitAutoCommit
                                        ? (isDark ? '#48AFF0' : '#137CBD')
                                        : (isDark ? '#444' : '#CCC')
                                }}>
                                    <span style={{
                                        ...styles.switchSliderBefore,
                                        transform: gitAutoCommit ? 'translateX(16px)' : 'translateX(0)'
                                    }} />
                                </span>
                            </label>
                            <span style={{ fontSize: '12px', color: isDark ? '#8A8A8A' : '#666' }}>
                                (编辑后自动提交到Git仓库)
                            </span>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="commit-interval" style={styles.label}>
                            提交间隔
                        </label>
                        <select
                            id="commit-interval"
                            defaultValue="30"
                            style={styles.select}
                            onFocus={handleSelectFocus}
                            onBlur={handleSelectBlur}
                        >
                            <option value="15">15分钟</option>
                            <option value="30">30分钟</option>
                            <option value="60">60分钟</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h5 style={styles.title}>远程仓库配置</h5>
                <hr style={styles.divider} />
                <div style={{ marginTop: '12px' }}>
                    <div style={styles.formGroup}>
                        <label htmlFor="git-repo-url" style={styles.label}>
                            远程仓库URL
                        </label>
                        <input
                            id="git-repo-url"
                            type="text"
                            placeholder="https://github.com/username/repo.git"
                            style={styles.input}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="git-branch" style={styles.label}>
                            分支
                        </label>
                        <select
                            id="git-branch"
                            defaultValue="main"
                            style={styles.select}
                            onFocus={handleSelectFocus}
                            onBlur={handleSelectBlur}
                        >
                            <option value="main">main</option>
                            <option value="master">master</option>
                            <option value="develop">develop</option>
                        </select>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            style={{ ...styles.button, ...styles.primaryButton }}
                            onMouseDown={(e) => Object.assign(e.currentTarget.style, styles.buttonActive)}
                            onMouseUp={(e) => Object.assign(e.currentTarget.style, { ...styles.button, ...styles.primaryButton })}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...styles.button, ...styles.primaryButton })}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                🔗 测试连接
                            </span>
                        </button>
                        <button
                            style={{ ...styles.button, ...styles.defaultButton }}
                            onMouseDown={(e) => Object.assign(e.currentTarget.style, styles.buttonActive)}
                            onMouseUp={(e) => Object.assign(e.currentTarget.style, { ...styles.button, ...styles.defaultButton })}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...styles.button, ...styles.defaultButton })}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                🔄 同步到远程
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GitSettings;