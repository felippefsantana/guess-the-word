import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleQuestion, faEye, faForward } from '@fortawesome/free-solid-svg-icons';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

import { ScoreContext } from '../../contexts/ScoreContext';
import { ThemeContext } from '../../contexts/ThemeContext';

import { wordsList } from '../../data/words';

import styles from './styles.module.css';

const guessesQty = 5;

const Game = () => {
  // Contexts
  const { score, setScore } = useContext(ScoreContext);
  const { theme } = useContext(ThemeContext);

  // Hook useNavigate
  const navigate = useNavigate();

  // Framer Motion lib
  const count = useMotionValue(score);
  const rounded = useTransform(count, latest => Math.round(latest));

  // References
  const letterInputRef = useRef(null);
  const showRandomWordTipButtonRef = useRef(null);
  const showRandomWordLettersButtonRef = useRef(null);
  const skipWordButtonRef = useRef(null);

  // States
  const [hasSkipedWord, setHasSkipedWord] = useState(false);
  const [hasShowedRandomLetter, setHasShowedRandomLetter] = useState(false);
  const [countScoreToEnableRandomLetterHelp, setCountScoreToEnableRandomLetterHelp] = useState(0);
  const [countScoreToEnableSkipHelp, setCountScoreToEnableSkipHelp] = useState(0);

  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [letter, setLetter] = useState('');
  const [wordTips, setWordTips] = useState([]);

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
    toast.dismiss();

    const { word, category, tips } = pickWordAndCategory();
    setPickedWord(word);
    setPickedCategory(category);
    setWordTips(tips);

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
      || !isLetter(normalizedLetter)
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

  const isLetter = (letter) => {
    return /[a-z]/i.test(letter);
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

  const handleShowRandomWordTip = () => {
    const randomTip = wordTips[Math.floor(Math.random() * wordTips.length)];
    toast.info(randomTip, {
      position: 'top-center',
      toastId: 'help-tip'
    });
  }

  const handleShowRandomWordLetters = () => {
    if (!hasShowedRandomLetter) {
      const wordNormalizedLetters = letters.map(letter => normalizeLetter(letter));
      const uniqueLetters = [...new Set(wordNormalizedLetters)];
  
      const filteredLetters = uniqueLetters.filter(letter => !guessedLetters.includes(letter));
      const randomLetter = filteredLetters[Math.floor(Math.random() * filteredLetters.length)];
      verifyLetter(randomLetter);
      showRandomWordLettersButtonRef.current.setAttribute("disabled", true);
      setHasShowedRandomLetter(true);
      setScore((actualScore) => actualScore - 50 < 0 ? 0 : actualScore - 50);
    }
  }

  const handleSkipWord = () => {
    if (!hasSkipedWord) {
      startGame();
      skipWordButtonRef.current.setAttribute("disabled", true);
      setHasSkipedWord(true);
      setScore((actualScore) => actualScore - 200 < 0 ? 0 : actualScore - 200);
    }
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
        if (hasShowedRandomLetter) {
          setCountScoreToEnableRandomLetterHelp((actualScore) => (actualScore += 100));
        }
        if (hasSkipedWord) {
          setCountScoreToEnableSkipHelp((actualScore) => (actualScore += 100));
        }
        startGame();
      }, 1500);
    }
  }, [guessedLetters, letters, startGame, setScore, hasShowedRandomLetter, hasSkipedWord]);

  useEffect(() => {
    if (Number.isInteger(countScoreToEnableRandomLetterHelp / 300)) {
      setHasShowedRandomLetter(false);
      showRandomWordLettersButtonRef.current.removeAttribute('disabled');
    }

    if (Number.isInteger(countScoreToEnableSkipHelp / 1000)) {
      setHasSkipedWord(false);
      skipWordButtonRef.current.removeAttribute('disabled');
    }
  }, [countScoreToEnableRandomLetterHelp, countScoreToEnableSkipHelp]);

  useEffect(() => {
    const initializeGame = () => {
      startGame();
    }

    initializeGame();
  }, [startGame]);

  useEffect(() => {
    const controls = animate(count, score);

    return controls.stop;
  }, [count, score]);

  const previousPickedWordRef = useRef('');

  useEffect(() => {
    previousPickedWordRef.current = pickedWord;
  }, [pickedWord]);

  return (
    <div className={`${styles.game} d-flex justify-content-center align-items-center`}>
      <div className="text-center">
        {'Actual word' + pickedWord}<br />
        {'Prev word' + previousPickedWordRef.current}<br />
        <p className={styles.points}>Pontuação: <span className="text-success"><motion.b>{rounded}</motion.b></span></p>
        <h1>Adivinhe a palavra:</h1>
        <h3 className={styles.tip}>
          Dica sobre a palavra: <span><b>{ pickedCategory }</b></span>
        </h3>
        <p>Você ainda tem <span className="text-warning"><b>{ guesses }</b></span> tentativa(s).</p>

        <div className={`${styles.wordContainer} d-flex justify-content-center flex-wrap m-3 p-3`}>
          {letters.map((letter, i) => (
            guessedLetters.includes(normalizeLetter(letter)) ? (
              <span key={i} className={`${styles.letter} fs-1 border rounded border border-secondary`}>{letter}</span>
            ) : (
              <span key={i} className={`${styles.blankSquare} fs-1 border rounded border border-secondary`}></span>
            )
          ))}
        </div>

        <div className={`${styles.letterContainer} mb-3`}>
          <p>Tente adivinhar uma letra da palavra:</p>
          <form className="d-flex justify-content-center align-items-center" onSubmit={handleSubmit}>
            <input 
              type="text"
              name="letter"
              className={`${styles.letter} form-control text-center fs-1 border border-secondary rounded me-3`}
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
          <h4 className="mb-4">Ajudas&nbsp;
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip style={{position:"fixed"}}>
                  Vocẽ pode escolher uma das três ajudas para progredir durante o jogo. Algumas só podem ser usadas uma vez e consomem pontos.
                </Tooltip>
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </OverlayTrigger>
          </h4>
          <div className="d-flex justify-content-center align-item-center gap-4">
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip style={{position:"fixed"}}>
                  Mostra uma dica aleatória sobre palavra. Não consome pontuação.
                </Tooltip>
              }
            >
              <button
                className="btn btn-outline-warning rounded align-top fs-3"
                onClick={handleShowRandomWordTip}
                ref={showRandomWordTipButtonRef}
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </button>
            </OverlayTrigger>


            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip style={{position:"fixed"}}>
                  Revela uma letra aleatória da palavra, porém consome 50 ponto. Esta ajuda é regarregada a cada 300 pontos ganhos.
                </Tooltip>
              }
            >
              <button
                className="btn btn-outline-danger rounded fs-3"
                onClick={handleShowRandomWordLetters}
                ref={showRandomWordLettersButtonRef}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </OverlayTrigger>


            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip style={{position:"fixed"}}>
                  Pula esta tentativa e vai para a próxima palavra, porém consome 200 pontos. Só é possível usar uma vez no início do jogo e a cada 1000 pontos ganhos.
                </Tooltip>
              }
            >
              <button
                className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'} rounded fs-3`}
                onClick={handleSkipWord}
                ref={skipWordButtonRef}
              >
                <FontAwesomeIcon icon={faForward} />
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game