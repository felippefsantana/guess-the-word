import { createContext, useContext, useState } from 'react';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [pickedWord, setPickedWord] = useState('');

  return (
    <GameContext.Provider value={{ score, setScore, pickedWord, setPickedWord }}>
      { children }
    </GameContext.Provider>
  )
}

export const useScore = () => {
  return useContext(GameContext);
}