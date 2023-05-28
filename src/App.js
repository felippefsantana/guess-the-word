import { useContext } from 'react';
import { ScoreContextProvider } from './contexts/ScoreContext';
import { ThemeContext } from './contexts/ThemeContext';

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
    </div>
  );
}

export default App;
