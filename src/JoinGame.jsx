import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socket  = io('http://localhost:3000'); // Connect to server

export function JoinGame({ onGameJoined }) {
  const [gameId, setGameId] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const joinGame = () => {
    if (!gameId || !nickname) {
      alert('Please enter both Game ID and Nickname!');
      return;
    }
  
    console.log('Emitting joinGame with:', { gameId, nickname });
    socket.emit('joinGame', { gameId, nickname });
  
    socket.on('gameData', ({ players, categories }) => {
      console.log('Game data received:', { players, categories });
      onGameJoined(gameId, players, categories); // Przełącz widok na Lobby
    });
  
    socket.on('error', ({ message }) => {
      console.error('Error received:', message);
      setErrorMessage(message);
    });
  };

    return (
      <div>
          <h1>Join a Game</h1>
          <input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
          />
          <input
              type="text"
              placeholder="Enter Your Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={joinGame}>Join Game</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
  );
}