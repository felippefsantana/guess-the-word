import { createContext, useContext, useState } from 'react';

export const ScoreContext = createContext();

export const ScoreContextProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      { children }
    </ScoreContext.Provider>
  )
}

export const useScore = () => {
  return useContext(ScoreContext);
}