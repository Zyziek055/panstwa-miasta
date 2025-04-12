import React, { useEffect, useState } from 'react';
import { socket } from './socket';


//create game component
export function Game({ gameId, nickname, selectedCategories, randomLetter}) {
  const [selectedCategory, setSelectedCategory] = useState(selectedCategories[0]);
  const [answers, setAnswers] = useState(
    selectedCategories.reduce((acc, category) => {
      acc[category] = '';
      return acc;
    }, {})
  );
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    // Tylko jeden listener do odliczania
    socket.on('startCountdown', ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    return () => socket.off('startCountdown');
  }, []);


  const handleAnswerChange = (e, category) => {
    setAnswers(prev => ({
      ...prev,
      [category]: e.target.value
    }));
  };

  const categoryOnClick = (category) => {
    setSelectedCategory(category);
  };

    return (
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
          socket.emit('submitAnswers', { gameId, answers });
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

//random styles because otherwise the letters invisible
const letterScreenStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#000',
  color: '#fff',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 1000,
};

const letterStyle = {
  fontSize: '10rem',
  fontWeight: 'bold',
};