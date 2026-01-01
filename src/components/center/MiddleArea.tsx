import React from 'react';
import {
  Button
} from '@blueprintjs/core';
import { handleOpenSystemSettingWindow } from '../../globals/commands/WindowsCommand';

interface MiddleAreaProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
  isDark: boolean;
}

const MiddleArea: React.FC<MiddleAreaProps> = ({
  children,
  activePage,
  onPageChange,
  isDark
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: isDark ? '#000000' : '#FFFFFF'
      }}
    >
      <div
        style={{
          width: '50px',
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderRight: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}
        >
          <Button
            minimal
            icon="history"
            title="Latest"
            onClick={() => onPageChange('latest')}
            active={activePage === 'latest'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'latest'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="document"
            title="Notes"
            onClick={() => onPageChange('notes')}
            active={activePage === 'notes'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'notes'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="star"
            title="Favorites"
            onClick={() => onPageChange('favorites')}
            active={activePage === 'favorites'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'favorites'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="tag"
            title="Tags"
            onClick={() => onPageChange('tags')}
            active={activePage === 'tags'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'tags'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="tick-circle"
            title="Todo"
            onClick={() => onPageChange('todo')}
            active={activePage === 'todo'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'todo'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="applications"
            title="Apps"
            onClick={() => onPageChange('apps')}
            active={activePage === 'apps'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: activePage === 'apps'
                ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                : 'transparent',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '20px'
          }}
        >
          <Button
            minimal
            icon="refresh"
            title="Refresh"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
          <Button
            minimal
            icon="cog"
            title="Settings"
            onClick={handleOpenSystemSettingWindow}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              color: isDark ? '#E8E8E8' : '#333333'
            }}
          />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MiddleArea;