import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const GameOver = () => {
  return (
    <div className={`${styles.gameOver} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <h1>Fim de Jogo!</h1>
        <h2>A sua pontuação foi: <span>1000</span></h2>
        <Link to="/" className="btn btn-outline-dark rounded-pill">Tentar novamente</Link>
        {/* <button className="btn btn-outline-dark rounded-pill">Tentar novamente</button> */}
      </div>
    </div>
  )
}

export default GameOver