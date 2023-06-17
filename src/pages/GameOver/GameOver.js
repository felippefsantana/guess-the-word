import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../contexts/GameContext';
import { ThemeContext } from '../../contexts/ThemeContext';

import styles from './styles.module.css';

const GameOver = () => {
  const { theme } = useContext(ThemeContext);
  const {
    score,
    setScore,
    pickedWord,
    setPickedWord
  } = useContext(GameContext);
  const navigate = useNavigate();

  const retry = () => {
    setScore(0);
    setPickedWord('');
    navigate('/');
  }

  return (
    <div className={`${styles.gameOver} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <h1>Fim de Jogo!</h1>
        <h2 className="mb-4">A sua pontuação foi: <span className="text-success">{ score }</span></h2>
        <h3 className="mb-4">A palavra era: <span className="text-warning">{pickedWord}</span></h3>
        <button className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill`} onClick={retry}>Tentar novamente</button>
      </div>
    </div>
  )
}

export default GameOver