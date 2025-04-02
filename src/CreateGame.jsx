import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to server

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
  const [isCreator, setIsCreator] = useState(false); // Czy gracz jest założycielem gry
  const [players, setPlayersState] = useState([]); // Define players state

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

    socket.once('gameCreated', ({ gameId, categories }) => {
      console.log(`Game ${gameId} created by ${nickname}, with categories: ${categories}`);
      setGameId(gameId); // Save the generated gameId
      setGameCreated(true);
      const initialPlayers = [{ id: socket.id, nickname }]; // Include the creator in the players list
      setPlayers(initialPlayers); // Update players state via prop
      setPlayersState(initialPlayers); // Update local players state
      setIsCreator(true); // Set the creator flag

      // Emit an update to ensure the creator sees themselves in the player list
      socket.emit('updateGame', { gameId, players: initialPlayers });
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });
  };

  useEffect(() => {
    if (gameCreated) {
      socket.on('updateGame', ({ players }) => {
        console.log('Updated players:', players);
        setPlayers(players); // Update players state via prop
        setPlayersState(players); // Update local players state
      });
    }

    return () => {
      socket.off('updateGame');
    };
  }, [gameCreated]);

  useEffect(() => {
    socket.on('gameData', ({ players, categories }) => {
      console.log('Game data received:', { players, categories });
      setPlayers(players);
      setPlayersState(players);
      setSelectedCategories(categories);
      setGameCreated(true);
    });

    return () => {
      socket.off('gameData'); // Clean up the event listeners
    };
  }, []);

  useEffect(() => {
    console.log('Game created:', gameCreated);
    console.log('Players:', players);
    console.log('Categories:', selectedCategories);
  }, [gameCreated, players, selectedCategories]);

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
          <h3>Players in the game:</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.nickname}</li>
            ))}
          </ul>
          <h3>Selected categories:</h3>
          <ul>
            {selectedCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
          {isCreator && (
            <button onClick={() => onStartGame(gameId, selectedCategories)}>Start Game</button>
          )}
        </div>
      )}
    </div>
  );
}