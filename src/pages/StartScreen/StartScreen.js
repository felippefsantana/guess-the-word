import styles from './styles.module.css';

import { Link } from 'react-router-dom';

const StartScreen = () => {
  return (
    <div className={`${styles.startScreen} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <h1>Secret Word</h1>
        <p>Clique no botão abiaxo para começar a jogar</p>
        <Link to="/game" className="btn btn-outline-dark rounded-pill">Começar o jogo</Link>
      </div>
    </div>
  )
}

export default StartScreen