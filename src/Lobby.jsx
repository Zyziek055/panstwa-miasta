import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export function Lobby({ gameId, players, setPlayers, selectedCategories, setSelectedCategories, isCreator, onStartGame }) {
  useEffect(() => {
    console.log('Lobby mounted for gameId:', gameId);

    socket.on('updateGame', ({ players }) => {
      console.log('Received updateGame with players:', players);
      setPlayers(players); // Update players state
    });

    // Listen for gameData to update categories
    socket.on('gameData', ({ players, categories }) => {
      console.log('Received gameData with players and categories:', { players, categories });
      setPlayers(players); // Update players state
      setSelectedCategories(categories); // Update categories state
    });

    return () => {
      console.log('Lobby unmounted');
      socket.off('updateGame');
      socket.off('gameData'); // Clean up gameData listener
    };
  }, [gameId]); // Add gameId as a dependency

  return (
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
        <button onClick={onStartGame}>Start Game</button>
      )}
    </div>
  );
}