import React, { useEffect, useState } from 'react';

//create game component
export function Game({ selectedCategories }) {
  const [randomLetter, setRandomLetter] = useState('');
  const [showLetterScreen, setShowLetterScreen] = useState(true); // controls when to hide display letter

  //function to generate a random letter
  const generateRandomLetter = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  //draw a letter
  useEffect(() => {
    const letter = generateRandomLetter();
    console.log('Generated letter:', letter);
    setRandomLetter(generateRandomLetter());
    const timer = setTimeout(() => {
        setShowLetterScreen(false); //hide letter screen after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); //clear timer 
  } , []); 

    return (
        <div className="game">
           {/* show letter screen while shoLetterScreen is true */}
          {showLetterScreen ? (
                // Ekran z literą na pełnym ekranie
                <div className="letter-screen" style={letterScreenStyle}>
                    <h1 style={letterStyle}>{randomLetter}</h1>
                </div>
            ) : (  
              <div>
                <h1>Game Time!</h1>
                <p>Selected Categories:</p>
                <ul>
                    {selectedCategories.map((category) => (
                        <li key={category}>{category}</li>
                    ))}
                </ul>
                <h2> Random letter: {randomLetter}</h2>
                <p>Start thinking of words for the selected categories!</p>
                </div>
            )}
        </div>
    );


//random styles because otherwise its invisible
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