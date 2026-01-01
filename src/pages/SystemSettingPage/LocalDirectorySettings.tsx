import React from 'react';
import {
    H5,
    Divider,
    FormGroup,
    InputGroup,
    Switch,
    HTMLSelect,
    ControlGroup,
    Button,
    Intent,
    Label
} from '@blueprintjs/core';

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
                                onChange={(e) => onNoteStoragePathChange(e.target.value)}
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
                                onChange={(e) => onBackupPathChange(e.target.value)}
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
                            onChange={(e) => onAutoBackupChange(e.currentTarget.checked)}
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
};

export default LocalDirectorySettings;