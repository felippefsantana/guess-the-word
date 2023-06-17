import { createContext, useContext, useState } from 'react';
import { usePrevious } from '../hooks/usePrevious';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [pickedWord, setPickedWord] = useState('');

  const previousWord = usePrevious(pickedWord);

  return (
    <GameContext.Provider value={{ score, setScore, pickedWord, setPickedWord, previousWord }}>
      { children }
    </GameContext.Provider>
  )
}

export const useScore = () => {
  return useContext(GameContext);
}