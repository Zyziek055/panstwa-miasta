import React, { useEffect } from 'react';
import { socket } from './socket';

export function Lobby({ 
  gameId, 
  players, // Add default empty array
  setPlayers, 
  selectedCategories = [], // Add default empty array
  setSelectedCategories, 
  isCreator, 
  onStartGame 
}) {
  useEffect(() => {
    console.log('Lobby mounted for gameId:', gameId, 'Current players:', players);

    function handleUpdateGame(data) {
      console.log('Received updateGame in Lobby:', data.players);
      setPlayers(data.players);
    }

    function handleGameData(data) {
      console.log('Received gameData:', data);
      setPlayers(data.players);
      setSelectedCategories(data.categories);
    }

    // Setup listeners
    socket.on('updateGame', handleUpdateGame);
    socket.on('gameData', handleGameData);

    // Cleanup
    return () => {
      socket.off('updateGame', handleUpdateGame);
      socket.off('gameData', handleGameData);
    };
  }, [gameId, setPlayers, setSelectedCategories]);

  return (
    <div>
      <h1>Waiting for players...</h1>
      <p>Game ID: {gameId}</p>
      <h3>Players in the game:</h3>
      <ul>
        {(players || []).map((player) => (
          <li key={player.id}>{player.nickname}</li>
        ))}
      </ul>
      <h3>Selected categories:</h3>
      <ul>
        {(selectedCategories || []).map((category) => (
          <li key={category}>{category}</li>
        ))}
      </ul>
      {isCreator && (
        <button onClick={onStartGame}>Start Game</button>
      )}
    </div>
  );
}