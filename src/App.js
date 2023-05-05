import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './logo.svg';

// Word cloud options
const cloudOptions = {
  easy: [
    'The average typing speed is around 40 words per minute. To achieve a high level of productivity, aim for 60 to 70 words per minute instead.',
    'The quick brown fox jumps over the lazy dog.',
    'The five boxing wizards jump quickly.',
    'How vexingly quick daft zebras jump!',
  ],
  medium: [
    'An investment in knowledge pays the best interest.',
    'It does not matter how slowly you go as long as you do not stop.',
    'I can accept failure, everyone fails at something. But I cannot accept not trying.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  ],
  hard: [
    'If you want to go fast, go alone. If you want to go far, go together.',
    'You can never cross the ocean until you have the courage to lose sight of the shore.',
    'It always seems impossible until it is done.',
    'The best way to predict the future is to invent it.',
  ],
};

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className='correct'>{text}</span>;
  }

  if (correct === false) {
    return <span className='incorrect'>{text}</span>;
  }

  if (active) {
    return <span className='active'>{text}</span>;
  }

  return <span>{text} </span>;
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cloud, setCloud] = useState([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setCloud(cloudOptions[difficulty][Math.floor(Math.random() * cloudOptions[difficulty].length)].split(' '));
    setActiveWordIndex(0);
    setCorrectWordArray([]);
  }, [difficulty]);

  useEffect(() => {
    if (activeWordIndex === 0) {
      setStartTime(Date.now());
      intervalRef.current = setInterval(() => {
        setElapsedTime((time) => time + 1);
      }, 1000);
    }

    if (activeWordIndex === cloud.length) {
      setEndTime(Date.now());
      setIsGameOver(true);
      clearInterval(intervalRef.current);
    }
  }, [activeWordIndex, cloud.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') {
        processInput(userInput + ' ');
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  function processInput(value) {
    setActiveWordIndex((index) => {
      const newActiveIndex = index + 1;

      if (value === `${cloud[index]}`) {
        setCorrectWordArray((prevArray) => [...prevArray, true]);
        setUserInput('');
        setScore((prevScore) => prevScore + 1);
      } else {
        setCorrectWordArray((prevArray) => [...prevArray, false]);
        setScore((prevScore) => Math.max(0, prevScore - 1));
      }
      return newActiveIndex;
    });
  }

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  function handleRestart() {
    setStartTime(0);
    setEndTime(0);
    setElapsedTime(0);
    setIsGameOver(false);
    setScore(0);
    setAccuracy(0);
  }

  useEffect(() => {
    if (correctWordArray.length > 0) {
      setAccuracy(
        (correctWordArray.filter((word) => word === true).length / correctWordArray.length) * 100
      );
    }
  }, [correctWordArray]);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Typing Game</p>
        {isGameOver && (
          <div>
            <p>Game over!</p>
            <p>Your score: {score}</p>
            <p>Accuracy: {accuracy.toFixed(2)}%</p>
            <p>Time elapsed: {elapsedTime} seconds</p>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
        {!isGameOver && (
          <div>
            <p>Difficulty:</p>
            <select value={difficulty} onChange={handleDifficultyChange}>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
            <div className='word-cloud'>
              {cloud.map((word, index) => (
                <Word
                  key={index}
                  text={word}
                  active={index === activeWordIndex}
                  correct={correctWordArray[index]}
                />
              ))}
            </div>
            <div>
              <input
                type='text'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className='user-input'
              />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;





