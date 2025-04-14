import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { ScoreScreen } from './ScoreScreen';


//create game component
export function Game({ gameId, nickname, selectedCategories, randomLetter, players}) {
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
  const [allAnswers, setAllAnswers] = useState({}); // Store all answers from players
  
  useEffect(() => {
    // Tylko jeden listener do odliczania
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
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedCategories.map((category) => (
              <button 
                key={category} 
                onClick={() => categoryOnClick(category)}
                style={{
                  backgroundColor: selectedCategory === category ? 'green' : 'black'
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Input field that appears when category is selected */}
          {selectedCategory && (
            <div style={{ marginTop: '20px' }}>
              <label>
                {selectedCategory}: 
                <input
                  type="text"
                  value={answers[selectedCategory]}
                  onChange={(e) => handleAnswerChange(e, selectedCategory)}
                  placeholder={`Enter ${selectedCategory}`}
                  style={{ marginLeft: '10px' }}
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
        style={{
          backgroundColor: submitted ? '#cccccc' : '#000000',
          color: 'white',
          cursor: submitted ? 'default' : 'pointer'
        }}
      >
        {submitted ? 'Answers Submitted' : 'Submit Answers'}
      </button>

      {timeLeft > 0 && <div>Time left: {timeLeft} seconds</div>}
    </div>
  );
}