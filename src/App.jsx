import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const createGame= () => {
    // Logic to create a game
  }

  const joinGame = () => {
    // Logic to join a game
  }

  return (
    <div className="App">
      {!gameStarted ? (
        <div>
          <h1>Welcome to the Game!</h1>
          <button onClick={createGame}>Create Game</button>
          <button onClick={joinGame}>Join Game</button>

        </div>
      ) : (
        <div>
          <h1>Game in Progress...</h1>
          {/* Add your game logic here */}
        </div>
      )}
    </div>
  )
}

export default App
