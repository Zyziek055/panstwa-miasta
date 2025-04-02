import { useState } from 'react'
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'
import { Game } from './Game'
import { Lobby } from './Lobby';

import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gameId, setGameId] = useState('');
  const [players, setPlayers] = useState([]); 

  const startGame = (gameId, categories) => {
    console.log('Starting game with ID:', gameId, 'and categories:', categories);
    setGameId(gameId);
    setSelectedCategories(categories);
    setGameMode('waiting'); // Przełącz widok na Lobby
  };

  const joinGame = (gameId, players, categories) => {
    setGameId(gameId);
    setPlayers(players);
    setSelectedCategories(categories);
    setGameMode('waiting'); 
  };

  return (
    <div>
      WILKOMMEN
        {gameMode === '' && (
            <div>
                <button onClick={() => setGameMode('create')}>Create Game</button>
                <button onClick={() => setGameMode('join')}>Join Game</button>
            </div>
        )}
        {gameMode === 'create' && (
          <CreateGame
            onStartGame={startGame}
          />
        )}
        {gameMode === 'join' && <JoinGame onGameJoined={joinGame} />}
        {gameMode === 'waiting' && (
          <Lobby
            gameId={gameId}
            players={players}
            selectedCategories={selectedCategories}
            isCreator={false} // Gracz dołączający
            onStartGame={() => startGame(gameId, selectedCategories)} // Tylko założyciel może rozpocząć grę
          />
        )}
        {gameMode === 'game' && (
            <Game gameId={gameId} nickname={nickname} selectedCategories={selectedCategories} />
        )}
    </div>
);
}

export default App
