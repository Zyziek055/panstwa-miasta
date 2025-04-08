import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socket  = io('http://localhost:3000'); // Connect to server

export function JoinGame({ onGameJoined }) {
  const [gameId, setGameId] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 //TODO: handle join game

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