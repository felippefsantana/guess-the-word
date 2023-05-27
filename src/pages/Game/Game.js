import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wordsList } from '../../data/words';

import styles from './styles.module.css';

const guessesQty = 5;

const Game = () => {
  const navigate = useNavigate();
  
  const letterInputRef = useRef(null);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  const [letter, setLetter] = useState('');

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category } = pickWordAndCategory();
    let wordLetters = word.split('');

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) return;

    if (letters.includes(normalizedLetter)) {
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
    const uniqueLetters = [...new Set(letters)];

    if (uniqueLetters.length && guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      setGuesses(guessesQty);
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  useEffect(() => {
    const initializeGame = () => {
      startGame();
    };
  
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
        <p>Você ainda tem <b>{ guesses }</b> tentativa(s).</p>

        <div className={`${styles.wordContainer} d-flex m-3 p-3`}>
          {letters.map((letter, i) => (
            guessedLetters.includes(letter) ? (
              <span key={i} className={`${styles.letter} fs-1 border rounded`}>{letter}</span>
            ) : (
              <span key={i} className={`${styles.blankSquare} fs-1 border rounded`}></span>
            )
          ))}
        </div>

        <div className={styles.letterContainer}>
          <p>Tente adivinhar uma letra da palavra:</p>
          <form className="d-flex justify-content-center align-items-center" onSubmit={handleSubmit}>
            <input 
              type="text"
              name="letter"
              className={`${styles.letter} text-center fs-1 border rounded me-3`}
              maxLength="1"
              onChange={(e) => setLetter(e.target.value)}
              value={letter}
              ref={letterInputRef}
            />
            <button className="btn btn-success rounded-pill fs-3 px-5">Jogar!</button>
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