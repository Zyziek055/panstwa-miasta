import React, { useEffect, useState } from 'react';
import { socket } from './socket';

export function CreateGame({ onStartGame, setPlayers }) {
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
  const [isCreator, setIsCreator] = useState(false);
  const [players, setPlayersState] = useState([]);

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

    socket.once('gameCreated', ({ gameId, categories, players }) => {
      console.log(`Game ${gameId} created by ${nickname}`, categories, players);
      setPlayers(players); // Update players list immediately
      onStartGame(gameId, categories, true);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });
  };

  useEffect(() => {
    if (gameCreated) {
      socket.on('updateGame', ({ players }) => {
        console.log('Updated players:', players);
        setPlayers(players);
        setPlayersState(players);
      });
    }

    socket.on('gameData', ({ players, categories }) => {
      console.log('Game data received:', { players, categories });
      setPlayers(players);
      setPlayersState(players);
      setSelectedCategories(categories);
      setGameCreated(true);
    });

    return () => {
      socket.off('updateGame');
      socket.off('gameData');
    };
  }, [gameCreated]);

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
            onChange={() =>
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((cat) => cat !== category)
                  : [...prev, category]
              )
            }
          />
          <label htmlFor={category}>{category}</label>
        </div>
      ))}
      <button onClick={createGame}>Create Game</button>
    </div>
  );
}