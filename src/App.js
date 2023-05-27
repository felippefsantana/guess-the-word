import Router from './router';

import { ScoreContextProvider } from './contexts/ScoreContext';

function App() {
  return (
    <div className="App">
      <ScoreContextProvider>
        <Router />
      </ScoreContextProvider>
    </div>
  );
}

export default App;
