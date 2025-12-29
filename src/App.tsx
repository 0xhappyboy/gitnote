import React from 'react';
import './App.css';
import { themeManager } from './globals/theme/ThemeManager';
import TopArea from './components/top/TopArea';
import MiddleArea from './components/center/MiddleArea';
import BottomArea from './components/bottom/BottomArea';
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom';
import NotePageIndex from './pages/NotePageIndex';

require('normalize.css');
require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

class App extends React.Component {
  componentDidMount() {
    themeManager.getTheme();
  }
  render() {
    return (
      <React.StrictMode>
        <BrowserRouter>
          <TopArea />
          <MiddleArea >
            <Routes>
              <Route path="/" element={<NotePageIndex />} />
            </Routes>
          </MiddleArea>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

export default App;