import React, { useEffect, useState } from 'react';
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
  const[players, setPlayers] = useState([]); // state to store players
  const [isCreator, setIsCreator] = useState(false); // Czy gracz jest założycielem gry


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
        onStartGame(gameId, categories);
      });

    socket.on('error', ({ message }) => {
      alert(message);
    });
  };

  return (
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
  );
}