import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

//create game component
export function Game({ gameId, nickname, selectedCategories }) {
  const [randomLetter, setRandomLetter] = useState('');
  const [showLetterScreen, setShowLetterScreen] = useState(true); // controls when to hide display letter
  //TODO: add functionality to show letter screen for 3 seconds and then hide it
  //TODO: functioanlity

    return (
        <div className="game">
           {/* show letter screen while shoLetterScreen is true */}
          {showLetterScreen ? (
                <div className="letter-screen" style={letterScreenStyle}>
                    <h1 style={letterStyle}>{randomLetter}</h1>
                </div>
            ) : (  
              <div>
                <h1>Game Time!</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedCategories.map((category) => (
                    <button key={category} onClick={() => console.log(category)}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
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