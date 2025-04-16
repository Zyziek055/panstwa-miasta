import React, { useEffect, useCallback } from 'react';
import { socket } from './socket';

export function Lobby({ 
  gameId, 
  players, 
  setPlayers, 
  selectedCategories = [], // Add default empty array
  isCreator, 
  onStartGame
}) {

  const handleStartGameClick = () => {
    socket.emit('startGame', { gameId });
} ;
  
  // Create a stable callback function
  const handlePlayerJoined = useCallback(({ players }) => {
    console.log('Received playerJoined event with players:', players);
    setPlayers(players);
  }, [setPlayers]); //this function will be recreated only when setPlayers changes!

  const handleGameStarted = useCallback(({ categories }) => {
    console.log('Game started with categories:', categories);
    // Handle game start logic here, e.g., redirect to the game screen
  })

  //Use effect is a function that runs when the component renders 
  //For example we set socket listeres there
  useEffect(() => {
    // Set up socket listener
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('gameStarted', onStartGame)

    // Cleanup function to remove listeners
    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('updateGame', handlePlayerJoined);
    };
  }, [gameId, handlePlayerJoined, onStartGame]);


  return (
    <div>
      <h1>Waiting for players...</h1>
      <p className="game-id">Game ID: {gameId}</p>
  
      <h3>Players in the game:</h3>
      <ul className="player-list">
        {(players || []).map((player) => (
          <li key={player.id} className="player-item">
            {player.nickname}
          </li>
        ))}
      </ul>
  
      <h3>Selected categories:</h3>
      <ul className="category-list">
        {(selectedCategories || []).map((category) => (
          <li key={category} className="category-item">
            {category}
          </li>
        ))}
      </ul>
  
      {isCreator && (
        <button onClick={handleStartGameClick}>Start Game</button>
      )}
    </div>
  );  
}