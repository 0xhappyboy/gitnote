import React from 'react';
import {
  Button,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import { themeManager } from '../../globals/theme/ThemeManager';
import { withRouter } from '../../WithRouter';
import { handleCloseWindow, handleDragWindowMouseDown, handleMaximizeWindow, handleMinimizeWindow, handleRecoveryWindow } from '../../globals/commands/WindowsCommand';
import { setupThemeChangeListener } from '../../globals/events/SystemEvents';
import { getThemeSetting } from '../../globals/commands/SystemCommand';

interface MenuItemData {
  key: string;
  label: string;
  children?: MenuItemData[];
}

interface TopMenuBarState {
  theme: 'dark' | 'light';
  windowWidth: number;
  isMaximized: boolean;
  activeMenu: string | null;
  menuPosition: { x: number; y: number } | null;
  themeUnlisten: (() => void) | null;
}

interface TopMenuBarProps {
  navigate?: (path: string, options?: any) => void;
  title?: string;
}

class TopMenuBar extends React.Component<TopMenuBarProps, TopMenuBarState> {
  private unsubscribe: (() => void) | null = null;
  private menuRefs: Map<string, HTMLDivElement> = new Map();

  constructor(props: TopMenuBarProps) {
    super(props);
    this.state = {
      theme: themeManager.getTheme(),
      windowWidth: window.innerWidth,
      isMaximized: false,
      activeMenu: null,
      menuPosition: null,
      themeUnlisten: null,
    };
  }

  isNotDragElement = (element: HTMLElement): boolean => {
    const interactiveSelectors = [
      'button', 'input', 'select', 'textarea', 'a', 'span',
      '[role="button"]', '[contenteditable="true"]'
    ];
    return interactiveSelectors.some(selector =>
      element.matches?.(selector) || element.closest?.(selector)
    );
  };

  handleDragWindowMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (this.isNotDragElement(event.target as HTMLElement)) {
      return;
    }
    if (event.button === 0) {
      handleDragWindowMouseDown(event);
    }
  }

  handleMinimizeWindowButtonClick = () => {
    handleMinimizeWindow();
  }

  handleMaximizeOrRecoveryWindowButtonClick = () => {
    if (this.state.isMaximized) {
      handleRecoveryWindow();
      this.setState({ isMaximized: false });
    } else {
      handleMaximizeWindow();
      this.setState({ isMaximized: true });
    }
  }

  handleCloseWindowButtonClick = () => {
    handleCloseWindow();
  }

  toPage = (page: string) => {
    this.props.navigate?.(page);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  handleThemeChange = (theme: 'dark' | 'light'): void => {
    this.setState({ theme });
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleDocumentClick);
    this.unsubscribe = themeManager.subscribe(this.handleThemeChange);
    const themeUnlisten = setupThemeChangeListener((theme: string, isDark: any) => {
      this.handleThemeChange(theme as 'dark' | 'light');
    });
    this.setState({ themeUnlisten });
    this.loadSavedTheme();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleDocumentClick);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.state.themeUnlisten) {
      this.state.themeUnlisten();
    }
  }

  private loadSavedTheme = async (): Promise<void> => {
    try {
      const savedTheme = await getThemeSetting();
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.handleThemeChange(savedTheme as 'dark' | 'light');
      }
    } catch (error) {
      this.handleThemeChange(themeManager.getTheme());
    }
  };


  handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isMenuButton = target.closest('.menu-button');
    if (!isMenuButton) {
      this.closeAllMenus();
    }
  }

  applyTheme = (theme: 'dark' | 'light') => {
    const html = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      html.classList.add('bp4-dark');
      html.classList.remove('bp4-light');
      body.style.backgroundColor = '#000000';
      body.style.color = '#F5F8FA';
    } else {
      html.classList.add('bp4-light');
      html.classList.remove('bp4-dark');
      body.style.backgroundColor = '#FFFFFF';
      body.style.color = '#182026';
    }
  };

  menuItems: MenuItemData[] = [
  ];

  handleMenuClick = (menuKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const buttonElement = event.currentTarget as HTMLButtonElement;
    const rect = buttonElement.getBoundingClientRect();
    this.setState(prevState => ({
      activeMenu: prevState.activeMenu === menuKey ? null : menuKey,
      menuPosition: {
        x: rect.left,
        y: rect.bottom
      }
    }));
  };

  closeAllMenus = () => {
    this.setState({
      activeMenu: null,
      menuPosition: null
    });
  };

  renderDropdownMenu = (items: MenuItemData[]) => (
    <Menu
      style={{
        minWidth: '120px',
        fontSize: '12px',
        margin: '0',
        padding: '0',
        backgroundColor: this.state.theme === 'dark' ? '#1C2127' : '#FFFFFF',
        color: this.state.theme === 'dark' ? '#F5F8FA' : '#182026',
        border: this.state.theme === 'dark' ? '1px solid #394B59' : '1px solid #DCE0E5',
        borderRadius: '2px',
        boxShadow: this.state.theme === 'dark'
          ? '0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      {items.map((item) => (
        <MenuItem
          key={item.key}
          text={item.label}
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            backgroundColor: 'transparent',
            color: this.state.theme === 'dark' ? '#F5F8FA' : '#182026'
          }}
          onClick={() => {
            this.closeAllMenus();
            console.log(`Clicked: ${item.label}`);
          }}
        />
      ))}
    </Menu>
  );

  renderAbsoluteMenu = () => {
    const { activeMenu, menuPosition, theme } = this.state;
    if (!activeMenu || !menuPosition) return null;
    const menuItems = activeMenu === 'more'
      ? this.menuItems.slice(this.getVisibleMenuItems().length)
      : this.menuItems.find(item => item.key === activeMenu)?.children || [];
    return (
      <div
        style={{
          position: 'fixed',
          left: menuPosition.x,
          top: menuPosition.y,
          zIndex: 1000,
          minWidth: '120px'
        }}
      >
        <Menu
          style={{
            minWidth: '120px',
            fontSize: '12px',
            margin: '0',
            padding: '0',
            backgroundColor: theme === 'dark' ? '#1C2127' : '#FFFFFF',
            color: theme === 'dark' ? '#F5F8FA' : '#182026',
            border: theme === 'dark' ? '1px solid #394B59' : '1px solid #DCE0E5',
            borderRadius: '2px',
            boxShadow: theme === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              text={item.label}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: theme === 'dark' ? '#F5F8FA' : '#182026'
              }}
              onClick={() => {
                this.closeAllMenus();
                console.log(`Clicked: ${item.label}`);
              }}
            />
          ))}
        </Menu>
      </div>
    );
  };

  getVisibleMenuItems = () => {
    const { windowWidth } = this.state;
    const rightControlsWidth = 90;
    const availableWidth = windowWidth - rightControlsWidth;
    const itemWidth = 45;
    const maxVisibleItems = Math.floor(availableWidth / itemWidth);
    return this.menuItems.slice(0, Math.max(3, Math.min(10, maxVisibleItems)));
  };

  shouldShowCenterTitle = () => {
    const { windowWidth } = this.state;
    return windowWidth > 700;
  };

  static defaultProps = {
    title: '✏️ GitNote',
  }

  render() {
    const { theme, activeMenu } = this.state;
    const visibleMenuItems = this.getVisibleMenuItems();
    const showCenterTitle = this.shouldShowCenterTitle();
    const { title } = this.props;

    return (
      <>
        <div
          onMouseDown={(event) => { this.handleDragWindowMouseDown(event) }}
          className={`custom-top-navbar ${theme === 'dark' ? 'bp4-dark' : 'bp4-light'}`}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            width: '100%',
            minWidth: '400px',
            backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme === 'dark' ? '1px solid #333333' : '1px solid #E1E1E1',
            position: 'relative'
          }}
        >
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            paddingLeft: '8px',
            overflow: 'hidden',
            minWidth: '150px'
          }}>
            {visibleMenuItems.map((item) => (
              <div key={item.key} style={{ position: 'relative', display: 'inline-block' }}>
                <Button
                  minimal
                  text={item.label}
                  onClick={(e: React.MouseEvent) => this.handleMenuClick(item.key, e)}
                  style={{
                    fontSize: '12px',
                    padding: '0 10px',
                    height: '30px',
                    minHeight: '30px',
                    lineHeight: '30px',
                    margin: '0 1px',
                    borderRadius: '0',
                    border: 'none',
                    outline: 'none',
                    color: theme === 'dark' ? '#F5F8FA' : '#182026',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    backgroundColor: activeMenu === item.key ?
                      (theme === 'dark' ? '#394B59' : '#DCE0E5') : 'transparent'
                  }}
                  className="menu-button"
                />
              </div>
            ))}
            {visibleMenuItems.length < this.menuItems.length && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Button
                  minimal
                  text="..."
                  onClick={(e: React.MouseEvent) => this.handleMenuClick('more', e)}
                  style={{
                    fontSize: '12px',
                    padding: '0 8px',
                    height: '30px',
                    minHeight: '30px',
                    lineHeight: '30px',
                    margin: '0 1px',
                    borderRadius: '0',
                    border: 'none',
                    outline: 'none',
                    color: theme === 'dark' ? '#F5F8FA' : '#182026',
                    backgroundColor: activeMenu === 'more' ?
                      (theme === 'dark' ? '#394B59' : '#DCE0E5') : 'transparent'
                  }}
                  className="menu-button"
                />
              </div>
            )}
          </div>
          {showCenterTitle && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#F5F8FA' : '#182026',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 1
            }}>
              {title}
            </div>
          )}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            paddingRight: '8px',
            minWidth: '90px',
            backgroundColor: 'inherit',
            zIndex: 2,
            position: 'relative',
            justifyContent: 'flex-end'
          }}>
            <Button
              minimal
              onClick={() => this.handleMinimizeWindowButtonClick()}
              icon="minus"
              style={{
                height: '30px',
                width: '28px',
                minHeight: '30px',
                minWidth: '28px',
                padding: 0,
                margin: '0 1px',
                color: theme === 'dark' ? '#F5F8FA' : '#182026',
                border: 'none',
                outline: 'none'
              }}
            />
            <Button
              minimal
              onClick={() => this.handleMaximizeOrRecoveryWindowButtonClick()}
              icon={this.state.isMaximized ? "minimize" : "square"}
              style={{
                height: '30px',
                width: '28px',
                minHeight: '30px',
                minWidth: '28px',
                padding: 0,
                margin: '0 1px',
                color: theme === 'dark' ? '#F5F8FA' : '#182026',
                border: 'none',
                outline: 'none'
              }}
            />
            <Button
              minimal
              onClick={() => this.handleCloseWindowButtonClick()}
              icon="cross"
              style={{
                height: '30px',
                width: '28px',
                minHeight: '30px',
                minWidth: '28px',
                padding: 0,
                margin: '0 1px',
                color: theme === 'dark' ? '#F5F8FA' : '#182026',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>
        {this.renderAbsoluteMenu()}
      </>
    );
  }
}

export default withRouter(TopMenuBar);