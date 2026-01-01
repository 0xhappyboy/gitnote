import React from 'react';
import { H5, Divider } from '@blueprintjs/core';

interface DefaultSettingsProps {
    isDark: boolean;
    selectedMenu: string;
}

const DefaultSettings: React.FC<DefaultSettingsProps> = ({ isDark, selectedMenu }) => {
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
};

export default DefaultSettings;