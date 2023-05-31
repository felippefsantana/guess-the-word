import { useContext } from 'react';
import { ScoreContextProvider } from './contexts/ScoreContext';
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
      <ScoreContextProvider>
        <Router />
      </ScoreContextProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
