import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


//create game component
export function Game({ gameId, nickname, selectedCategories }) {
  const [randomLetter, setRandomLetter] = useState('');
  const [showLetterScreen, setShowLetterScreen] = useState(true); // controls when to hide display letter
  const [selectedCategory, setSelectedCategory] = useState(selectedCategories[0]);
  const [answers, setAnswers] = useState(
    selectedCategories.reduce((acc, category) => {
      acc[category] = '';
      return acc;
    }, {})
  );

  

  //TODO: add functionality to show letter screen for 3 seconds and then hide it
  //TODO: functioanlity
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

        <button>
          Submit answers
        </button>
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