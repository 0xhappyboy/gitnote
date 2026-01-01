import React from 'react';
import { handleOpenSystemSettingWindow } from '../../globals/commands/WindowsCommand';
import { setupThemeChangeListener } from '../../globals/events/SystemEvents';
import { IconMap } from '../../globals/icons';
import { getThemeSetting } from '../../globals/commands/SystemCommand';

interface MiddleAreaProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
  isDark: boolean;
}

class MiddleArea extends React.Component<MiddleAreaProps> {
  private themeUnlisten: (() => void) | null = null;
  private isDark: boolean;

  constructor(props: MiddleAreaProps) {
    super(props);
    this.isDark = props.isDark;
  }

  componentDidMount() {
    this.loadSavedTheme();
    this.themeUnlisten = setupThemeChangeListener((theme: string, isDark: any) => {
      this.isDark = isDark;
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.themeUnlisten) {
      this.themeUnlisten();
    }
  }

  private loadSavedTheme = async (): Promise<void> => {
    try {
      const savedTheme = await getThemeSetting();
      if (savedTheme === 'dark') {
        this.setState({ isDark: true });
      } else if (savedTheme === 'light') {
        this.setState({ isDark: false });
      }
    } catch (error) {
      this.setState({ isDark: this.props.isDark });
    }
  };

  render() {
    const { children, activePage, onPageChange } = this.props;
    const isDark = this.isDark;
    const topButtons = [
      { id: 'latest', icon: 'history', title: 'Latest' },
      { id: 'notes', icon: 'document', title: 'Notes' },
      { id: 'favorites', icon: 'star', title: 'Favorites' },
      { id: 'tags', icon: 'tag', title: 'Tags' },
      { id: 'todo', icon: 'tick-circle', title: 'Todo' },
      { id: 'apps', icon: 'applications', title: 'Apps' },
    ];
    const bottomButtons = [
      { id: 'refresh', icon: 'refresh', title: 'Refresh' },
      { id: 'settings', icon: 'cog', title: 'Settings' },
    ];
    const colors = {
      light: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E1E1E1',
        iconColor: '#666666',
        activeIconColor: '#137CBD',
        hoverBg: 'rgba(0, 0, 0, 0.04)',
        activeBg: 'rgba(19, 124, 189, 0.1)',
        activeHoverBg: 'rgba(19, 124, 189, 0.15)'
      },
      dark: {
        backgroundColor: '#000000',
        borderColor: '#333333',
        iconColor: '#CCCCCC',
        activeIconColor: '#48AFF0',
        hoverBg: 'rgba(255, 255, 255, 0.08)',
        activeBg: 'rgba(72, 175, 240, 0.2)',
        activeHoverBg: 'rgba(72, 175, 240, 0.3)'
      }
    };
    const themeColors = isDark ? colors.dark : colors.light;
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: themeColors.backgroundColor
        }}
      >
        <div
          style={{
            width: '50px',
            backgroundColor: themeColors.backgroundColor,
            borderRight: `1px solid ${themeColors.borderColor}`,
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
            {topButtons.map(button => {
              const isActive = activePage === button.id;
              const IconComponent = IconMap[button.icon as keyof typeof IconMap];
              const iconColor = isActive ? themeColors.activeIconColor : themeColors.iconColor;

              return (
                <button
                  key={button.id}
                  title={button.title}
                  onClick={() => onPageChange(button.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? themeColors.activeBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isActive
                      ? themeColors.activeHoverBg
                      : themeColors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isActive
                      ? themeColors.activeBg
                      : 'transparent';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClickCapture={(e) => {
                    (e.target as HTMLElement).blur();
                  }}
                >
                  {IconComponent && <IconComponent color={iconColor} size={16} />}
                </button>
              );
            })}
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
            {bottomButtons.map(button => {
              const isSettings = button.id === 'settings';
              const IconComponent = IconMap[button.icon as keyof typeof IconMap];
              return (
                <button
                  key={button.id}
                  title={button.title}
                  onClick={isSettings ? handleOpenSystemSettingWindow : undefined}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClickCapture={(e) => {
                    (e.target as HTMLElement).blur();
                  }}
                >
                  {IconComponent && <IconComponent color={themeColors.iconColor} size={16} />}
                </button>
              );
            })}
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
  }
}

export default MiddleArea;