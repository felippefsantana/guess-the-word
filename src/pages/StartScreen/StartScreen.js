import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';

import styles from './styles.module.css';

const StartScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${styles.startScreen} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <h1>Adivinhe a palavra</h1>
        <p>Clique no botão abiaxo para começar a jogar</p>
        <Link to="/game" className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill`}>Começar o jogo</Link>
      </div>
    </div>
  )
}

export default StartScreen