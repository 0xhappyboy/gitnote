import React from 'react';
import './App.css';
import { themeManager } from './globals/theme/ThemeManager';
import TopArea from './components/top/TopArea';
import MiddleArea from './components/center/MiddleArea';
import { BrowserRouter } from 'react-router-dom';
import NotePageIndex from './pages/NotePageIndex';

import FavoritesPage from './pages/FavoritesPage';
import TagsPage from './pages/TagsPage';
import TodoPage from './pages/TodoPage';
import AppsPage from './pages/AppsPage';

require('normalize.css');
require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

interface AppState {
  theme: 'dark' | 'light';
  activePage: string;
}

class App extends React.Component<{}, AppState> {
  private unsubscribe: (() => void) | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      theme: themeManager.getTheme(),
      activePage: 'notes'
    };
  }

  componentDidMount() {
    this.unsubscribe = themeManager.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private handleThemeChange = (theme: 'dark' | 'light'): void => {
    this.setState({ theme });
  };

  private handlePageChange = (page: string): void => {
    this.setState({ activePage: page });
  };

  render() {
    const { theme, activePage } = this.state;
    const isDark = theme === 'dark';
    return (
      <React.StrictMode>
        <BrowserRouter>
          <div
            className={isDark ? 'bp4-dark' : 'bp4-light'}
            style={{
              height: '100vh',
              width: '100vw',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: isDark ? '#000000' : '#FFFFFF'
            }}
          >
            <TopArea />
            <MiddleArea
              activePage={activePage}
              onPageChange={this.handlePageChange}
              isDark={isDark}
            >
              {activePage === 'latest' && <NotePageIndex />}
              {activePage === 'notes' && <NotePageIndex />}
              {activePage === 'favorites' && <FavoritesPage />}
              {activePage === 'tags' && <TagsPage />}
              {activePage === 'todo' && <TodoPage />}
              {activePage === 'apps' && <AppsPage />}
            </MiddleArea>
          </div>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

export default App;