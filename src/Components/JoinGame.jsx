import React, { useState } from 'react';


export function JoinGame({ onGameJoined, socket }) {
  const [gameId, setGameId] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



 const joinGame = () => {
  if (!nickname) {
    alert('Please enter your nickname!');
    return;
  }

  if (!gameId) {
    alert('Please enter your nickname!');
    return;
  }
  
  socket.emit('joinGame', {gameId, nickname});

  socket.on('gameJoined', ({ gameId, players, categories }) => {
    console.log('Game joined:', { gameId, players, categories });
    onGameJoined(gameId, nickname, players, categories);
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