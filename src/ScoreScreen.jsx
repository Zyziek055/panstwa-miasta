import React, { useState} from 'react';
import { socket } from './socket'; 

export function ScoreScreen({ players, gameId, answers}) {
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className='score-scree'>
      <h2>Score Round</h2>
      <div className="players-answers">
          <div className="player-section">
            <h3>Your Answers</h3>
            {Object.entries(answers).map(([category, answer]) => (
            <div key={category} style={{ margin: '10px 0' }}>
              <span>{category}: {answer}</span>
              <select 
                onChange={(e) => handleScoreChange(socket.id, category, e.target.value)}
                style={{ marginLeft: '10px' }}
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
          socket.emit('scoreSubmit', { gameId });
          setSubmitted(true);
        }}
        disabled={submitted}
        style={{
          backgroundColor: submitted ? '#cccccc' : '#000000',
          color: 'white',
          cursor: submitted ? 'default' : 'pointer'
        }}
      >
        {submitted ? 'Points Submitted' : 'Submit Points'}
      </button>
    </div>
  )
}