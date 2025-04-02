import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to server

export function CreateGame({ onStartGame }) {
  const categoriesList = [
    'Country',
    'Town',
    'Plant',
    'Car brand',
    'Clothes Brand',
    'Item',
    'Animal',
  ];

  const defaultCategories = ['Country', 'Town'];
  const [selectedCategories, setSelectedCategories] = useState(defaultCategories);
  const [nickname, setNickname] = useState('');
  const [gameCreated, setGameCreated] = useState(false);
  const [gameId, setGameId] = useState('');

  const toggleCategory = (category) => {
    if (defaultCategories.includes(category)) return;

    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const createGame = () => {
    if (!nickname) {
      alert('Please enter your nickname!');
      return;
    }

    socket.emit('createGame', { nickname, categories: selectedCategories });

    socket.once('gameCreated', ({ gameId, nickname, categories }) => {
        console.log(`Game ${gameId} created by ${nickname}, with categories: ${categories}`);
        setGameId(gameId); // Save the generated gameId
        setGameCreated(true);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });
  };

  return (
    <div>
      {!gameCreated ? (
        <div>
          <h1>Create a New Game</h1>
          <input
            type="text"
            placeholder="Enter Your Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <h3>Select Categories:</h3>
          {categoriesList.map((category) => (
            <div key={category}>
              <input
                type="checkbox"
                id={category}
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
          <button onClick={createGame}>Create Game</button>
        </div>
      ) : (
        <div>
          <h1>Waiting for players...</h1>
          <p>Game ID: {gameId}</p>
          <button onClick={() => onStartGame(gameId, selectedCategories)}>Start Game</button>
        </div>
      )}
    </div>
  );
}