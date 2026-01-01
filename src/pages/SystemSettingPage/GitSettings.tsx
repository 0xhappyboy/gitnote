import React from 'react';
import { H5, Divider, FormGroup, InputGroup, Switch, HTMLSelect, Button, Intent } from '@blueprintjs/core';

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
                            onChange={(e) => onGitUsernameChange(e.target.value)}
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
                            onChange={(e) => onGitEmailChange(e.target.value)}
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
                            onChange={(e) => onGitAutoCommitChange(e.currentTarget.checked)}
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
};

export default GitSettings;