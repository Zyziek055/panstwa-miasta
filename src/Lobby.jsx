import React, { useEffect, useCallback } from 'react';
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

  // Create a stable callback function
  const handlePlayerJoined = useCallback(({ players }) => {
    console.log('Received playerJoined event with players:', players);
    setPlayers(players);
  }, [setPlayers]);

  useEffect(() => {
    // Set up socket listener
    socket.on('playerJoined', handlePlayerJoined);

    // Cleanup function to remove listeners
    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('updateGame', handlePlayerJoined);
    };
  }, [gameId, handlePlayerJoined]);

  //TODO: add functionalities etc

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