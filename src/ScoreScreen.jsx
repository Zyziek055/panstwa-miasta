import React, { useState} from 'react';
import { socket } from './socket'; 

export function ScoreScreen({ players, gameId, answers}) {
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (playerId, category, score) => {
    setScores(prevScores => {
      // Inicjalizuj obiekt dla gracza jeśli nie istnieje
      const playerScores = prevScores[playerId] || {};
      
      const newScores = {
        ...prevScores,
        [playerId]: {
          ...playerScores,
          [category]: Number(score) // Konwertuj na liczbę
        }
      };
      return newScores;
    });
  };
  
  return (
    <div className='score-screen'>
      <div className="players-answers">
        <div className="player-section">
          <h3>Your Answers</h3>
          {Object.entries(answers).map(([category, answer]) => (
            <div key={category} className="rounds-select-wrapper">
              <span className="rounds-label">{category}: {answer}</span>
              <select 
                onChange={(e) => handleScoreChange(socket.id, category, e.target.value)}
                className="rounds-select"
              >
                <option value="0">0 points</option>
                <option value="5">5 points</option>
                <option value="10">10 points</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          socket.emit('scoreSubmit', { gameId, scores});
          setSubmitted(true);
        }}
        disabled={submitted}
      >
        {submitted ? 'Points Submitted' : 'Submit Points'}
      </button>
    </div>
  )
}