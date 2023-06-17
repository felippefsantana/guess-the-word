import { useContext } from 'react';
import { GameContextProvider } from './contexts/GameContext';
import { ThemeContext } from './contexts/ThemeContext';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ToggleThemeButton from './components/ToggleThemeButton/ToggleThemeButton';

import Router from './router';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App position-relative ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <ToggleThemeButton />
      <GameContextProvider>
        <Router />
      </GameContextProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
