import React, { useState } from 'react';
import { io } from 'socket.io-client';


export function JoinGame({ onGameJoined, socket }) {
  const [gameId, setGameId] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 //TODO: handle join game

 const joinGame = () => {
  if (!nickname) {
    alert('Please enter your nickname!');
    return;
  }

  if (!gameId) {
    alert('Please enter your nickname!');
    return;
  }
  
  socket.emit('joinGame', {gameId, nickname}); //Send info to the server thgat player wants to join the game

  socket.on('gameJoined', ({ gameId, players, categories }) => {
    console.log('Game joined:', { gameId, players, categories });
    onGameJoined(gameId, nickname, players, categories); // Call the function to update the game state in App.jsx
  });
 }
 




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