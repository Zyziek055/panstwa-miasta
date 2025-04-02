import { useState } from 'react';
import { CreateGame } from './CreateGame';
import { JoinGame } from './JoinGame';
import { Game } from './Game';
import { Lobby } from './Lobby'; // Import Lobby component
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gameId, setGameId] = useState('');
  const [players, setPlayers] = useState([]);

  const startGame = (gameId, categories) => {
    setGameId(gameId);
    setSelectedCategories(categories);
    setGameMode('game');
  };

  const joinGame = (gameId, nickname, players, categories) => {
    setGameId(gameId);
    setNickname(nickname);
    setPlayers(players); // Update players state
    setSelectedCategories(categories); // Update categories state
    setGameMode('waiting');
  };

  return (
    <div>
      <h1>WILKOMMEN</h1>
      {gameMode === '' && (
        <div>
          <button onClick={() => setGameMode('create')}>Create Game</button>
          <button onClick={() => setGameMode('join')}>Join Game</button>
        </div>
      )}
      {gameMode === 'create' && (
        <CreateGame
          onStartGame={startGame}
          setPlayers={setPlayers} // Pass setPlayers to CreateGame
        />
      )}
      {gameMode === 'waiting' && (
        <Lobby
          gameId={gameId}
          players={players} // Pass players to Lobby
          setPlayers={setPlayers} // Pass setPlayers to Lobby
          selectedCategories={selectedCategories}
          isCreator={gameMode === 'create'}
          onStartGame={startGame}
        />
      )}
      {gameMode === 'join' && (
        <JoinGame
          onGameJoined={(gameId, nickname, players, categories) =>
            joinGame(gameId, nickname, players, categories)
          }
        />
      )}
      {gameMode === 'game' && (
        <Game gameId={gameId} nickname={nickname} selectedCategories={selectedCategories} />
      )}
    </div>
  );
}

export default App;
