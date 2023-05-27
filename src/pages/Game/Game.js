import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const Game = () => {
  return (
    <div className={`${styles.game} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <p className={styles.points}>Pontuação: <span className="text-success"><b>0</b></span></p>
        <h1>Adivinhe a palavra:</h1>
        <h3 className={styles.tip}>
          Dica sobre a palavra: <span><b>Dica</b></span>
        </h3>
        <p>Você ainda tem [X] tentativa(s).</p>

        <div className={`${styles.wordContainer} d-flex m-3 p-3`}>
          <span className={`${styles.blankSquare} fs-1 border rounded`}>t</span>
          <span className={`${styles.blankSquare} fs-1 border rounded`}></span>
          <span className={`${styles.letter} fs-1 border rounded`}></span>
          <span className={`${styles.blankSquare} fs-1 border rounded`}>t</span>
          <span className={`${styles.blankSquare} fs-1 border rounded`}>e</span>
        </div>

        <div className={styles.letterContainer}>
          <p>Tente adivinhar uma letra da palavra:</p>
          <form className="d-flex justify-content-center align-items-center">
            <input 
              type="text"
              name="letter"
              className={`${styles.letter} text-center fs-1 border rounded me-3`}
              maxlength="1"
            />
            <Link to="/gameover" className="btn btn-success rounded-pill fs-3 px-5">Jogar!</Link>
            {/* <button className="btn btn-success rounded-pill fs-3 px-5">Jogar!</button> */}
          </form>
        </div>

        <div className={styles.wrongLetterContainer}>
          <p>Letras já utilizadas:</p>
          <span>a, </span>
          <span>i, </span>
          <span>c</span>
        </div>
      </div>
    </div>
  )
}

export default Game