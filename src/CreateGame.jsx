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
  }
  //TODO : Add functionality
  
  ;

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