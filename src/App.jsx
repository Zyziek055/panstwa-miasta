import { useState } from 'react'
import {CreateGame} from './CreateGame'
import { Game } from './Game'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessgae, setErrorMessage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gameId, setGameId] = useState('');

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

  const startGame = (gameId, categories) => {
      setGameId(gameId);
      setSelectedCategories(categories);
      setGameMode('game');
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>Welcome to the Game!</h1>
          <button onClick={() => {setGameMode('create'); setGameStarted(true);} }>Create Game</button>
          <button onClick={() => {setGameMode('join'); setGameStarted(true);} }>Join Game</button>

        </div>
      ) : (
        <div>
          {gameMode === 'create' && <CreateGame onStartGame={startGame} />}
          {gameMode === 'game' && <Game gameId={gameId} selectedCategories={selectedCategories} />}
          {gameMode === 'join' && <JoinGame />}
        </div>
      )}
    </div>
  )
}

export default App
