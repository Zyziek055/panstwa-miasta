import { useState } from 'react'
import {CreateGame} from './CreateGame'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessgae, setErrorMessage] = useState('');

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

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
          {gameMode === 'create' && <CreateGame />}
          {gameMode === 'join' && <JoinGame />}
        </div>
      )}
    </div>
  )
}

export default App
