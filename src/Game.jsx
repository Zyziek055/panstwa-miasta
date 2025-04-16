import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { ScoreScreen } from './ScoreScreen';


//create game component
export function Game({ gameId, selectedCategories, randomLetter, players, onGameEnded }) {
  const [selectedCategory, setSelectedCategory] = useState(selectedCategories[0]);
  const [answers, setAnswers] = useState(
    selectedCategories.reduce((acc, category) => {
      acc[category] = '';
      return acc;
    }, {})
  );
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameState, setGameState] = useState('game'); // 'game' or 'score'
  
  useEffect(() => {
    socket.on('startCountdown', ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    socket.on('roundEnded', () => {
      console.log('round ended, this players answers are: ', answers);
      setGameState('score'); // Switch to score screen
    });

    socket.on('nextRound', () => {
      setAnswers(
        selectedCategories.reduce((acc, category) => {
          acc[category] = '';
          return acc;
        }, {})
      );
      setSubmitted(false);
      setGameState('game'); // Switch back to game screen
    });

    socket.on('gameEnded', ({scores}) => {
      onGameEnded(scores); 
    });

    return () => {
      socket.off('startCountdown');
      socket.off('roundEnded');
      socket.off('nextRound');
    }


  }, [answers]);


  const handleAnswerChange = (e, category) => {
    setAnswers(prev => ({
      ...prev,
      [category]: e.target.value
    }));
  };

  const categoryOnClick = (category) => {
    setSelectedCategory(category);
  };

  if (gameState === 'score') {
    return <ScoreScreen 
      gameId={gameId} 
      players={players} 
      answers={answers} 
    />;
  } else return (
      <div className="game">
          <h1>Game started!</h1>
          <p>Letter: {randomLetter}</p>
        <div>
          <div>
            {selectedCategories.map((category) => (
              <button 
                key={category} 
                onClick={() => categoryOnClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Input field that appears when category is selected */}
          {selectedCategory && (
            <div >
              <label>
                <input
                  type="text"
                  value={answers[selectedCategory]}
                  onChange={(e) => handleAnswerChange(e, selectedCategory)}
                  placeholder={`Enter ${selectedCategory}`}
                />
              </label>
            </div>

          )}
        </div>


      <button
        onClick={() => {
          socket.emit('submitAnswers', { gameId });
          setSubmitted(true);
        }}
        disabled={submitted}
      >
        {submitted ? 'Answers Submitted' : 'Submit Answers'}
      </button>

      {timeLeft > 0 && <div>Time left: {timeLeft} seconds</div>}
    </div>
  );
}