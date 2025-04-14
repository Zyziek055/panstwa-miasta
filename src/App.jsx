import { useState } from 'react';
import { CreateGame } from './CreateGame';
import { JoinGame } from './JoinGame';
import { Game } from './Game';
import { Lobby } from './Lobby'; 

import './App.css';
import { socket } from './socket';

function App() {
  const [gameMode, setGameMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gameId, setGameId] = useState('');
  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [randomLetter, setRandomLetter] = useState(''); 
  const [finalScores, setFinalScores] = useState({}); // Store final scores for leaderboard



  //TODO: understand it lol
  const createGame = (gameId, categories, isCreator = false) => {
    setGameId(gameId);
    setSelectedCategories(categories);
    setIsCreator(isCreator);
    setGameMode('waiting');
  };


  const handleGameJoined = (gameId, nickname, players, categories) => {
    console.log('Game joined:', { gameId, nickname, players, categories });
    setGameId(gameId);
    setNickname(nickname); // Ustawiamy nickname
    setPlayers(players);
    setSelectedCategories(categories);
    setGameMode('waiting');
  };

  const onGameStarted = ({randomLetter}) => {
    console.log('Game started with random letter:', randomLetter);
    setRandomLetter(randomLetter);
    setGameMode('game');
  }

  const onGameEnded = (scores) => {
    setFinalScores(scores);
    setGameMode('leaderboard');
  }

  return (
    <div>
      {gameMode === '' && (
        <div>
          <h1>WILKOMMEN</h1>
          <button onClick={() => {
            setGameMode('create')
            console.log("Game mode changed to 'create'")}
          }>Create Game</button>
          <button onClick={() => {
            setGameMode('join');
            console.log("Game mode changed to 'join'")
              }
            }>Join Game</button>
        </div>
      )}
      {gameMode === 'create' && (
        <CreateGame
          onCreateGame={createGame}
          setPlayers={setPlayers} // Pass setPlayers to CreateGame
        />
      )}
      {gameMode === 'waiting' && (
        <Lobby
          gameId={gameId}
          players={players} // Pass players to Lobby
          setPlayers={setPlayers} // Pass setPlayers to Lobby
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          isCreator={isCreator}
          onStartGame={onGameStarted}
        />
      )}
      {gameMode === 'join' && (
        <JoinGame
          onGameJoined={handleGameJoined}
          socket={socket} // Pass socket to JoinGame 
        />
      )}
      {gameMode === 'game' && (
        <Game gameId={gameId} nickname={nickname} selectedCategories={selectedCategories} randomLetter={randomLetter} players={players} onGameEnded={onGameEnded}/>
      )}
      {gameMode === 'leaderboard' && (
        <div>
          END
        </div>
      )}
    </div>
  );
}

export default App;
