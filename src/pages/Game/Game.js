import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreContext } from '../../contexts/ScoreContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { wordsList } from '../../data/words';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleQuestion, faEnvelope, faEye, faForward } from '@fortawesome/free-solid-svg-icons';

import styles from './styles.module.css';

const guessesQty = 5;

const Game = () => {
  const { score, setScore } = useContext(ScoreContext);
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  
  const letterInputRef = useRef(null);

  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [letter, setLetter] = useState('');
  const [tips, setTips] = useState([]);

  const pickWordAndCategory = useCallback(() => {
    const item = words[Math.floor(Math.random() * words.length)];
    const word = item.word;
    const categories = item.categories;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const tips = item.tips;

    return { word, category, tips };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category, tips } = pickWordAndCategory();
    setPickedWord(word);
    setPickedCategory(category);
    setTips(tips);

    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setLetters(wordLetters);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const guessedLetter = letter.trim().toLowerCase();
    const normalizedLetter = normalizeLetter(guessedLetter);
    const wordNormalizedLetters = letters.map(letter => normalizeLetter(letter));

    if (
      !normalizedLetter 
      || guessedLetters.includes(normalizedLetter) 
      || wrongLetters.includes(normalizedLetter)
    ) return;

    if (wordNormalizedLetters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const normalizeLetter = (letter) => {
    const normalized = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalized.toLowerCase();
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    verifyLetter(letter);

    setLetter('');
    letterInputRef.current.focus();
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      navigate('/gameover');
    }
  }, [guesses, navigate]);

  useEffect(() => {
    const wordNormalizedLetters = letters.map(letter => normalizeLetter(letter));
    const uniqueLetters = [...new Set(wordNormalizedLetters)];

    if (uniqueLetters.length && guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      setGuesses(guessesQty);
      setTimeout(() => {
        startGame();
      }, 1500);
    }
  }, [guessedLetters, letters, startGame, setScore]);

  useEffect(() => {
    const initializeGame = () => {
      startGame();
    }

    initializeGame();
  }, [startGame]);

  return (
    <div className={`${styles.game} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        <p className={styles.points}>Pontuação: <span className="text-success"><b>{score}</b></span></p>
        <h1>Adivinhe a palavra:</h1>
        <h3 className={styles.tip}>
          Dica sobre a palavra: <span><b>{ pickedCategory }</b></span>
        </h3>
        <p>Você ainda tem <span className="text-warning"><b>{ guesses }</b></span> tentativa(s).</p>

        <div className={`${styles.wordContainer} d-flex justify-content-center flex-wrap m-3 p-3`}>
          {letters.map((letter, i) => (
            guessedLetters.includes(normalizeLetter(letter)) ? (
              <span key={i} className={`${styles.letter} fs-1 border rounded`}>{letter}</span>
            ) : (
              <span key={i} className={`${styles.blankSquare} fs-1 border rounded`}></span>
            )
          ))}
        </div>

        <div className={`${styles.letterContainer} mb-3`}>
          <p>Tente adivinhar uma letra da palavra:</p>
          <form className="d-flex justify-content-center align-items-center" onSubmit={handleSubmit}>
            <input 
              type="text"
              name="letter"
              className={`${styles.letter} form-control text-center fs-1 border rounded me-3`}
              maxLength="1"
              autoComplete="off"
              onChange={(e) => setLetter(e.target.value)}
              value={letter}
              ref={letterInputRef}
            />
            <button className="btn btn-success rounded-pill fs-3 px-5">Jogar!</button>
          </form>
        </div>

        <div className={`${styles.wrongLetterContainer} mb-5`}>
          <p>Letras já utilizadas:</p>
          {wrongLetters.map((letter, i) => (
            <span key={i}>{letter}, </span>
          ))}
        </div>

        <div className={`${styles.helpersContainer}`}>
          <h4 className="mb-4">Ajudas <FontAwesomeIcon icon={faCircleInfo} /></h4>
          <div className="d-flex justify-content-center align-item-center gap-4">
            <button className="btn btn-outline-warning rounded align-top fs-3">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </button>
            <button className="btn btn-outline-danger rounded fs-3">
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'} rounded fs-3`}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game