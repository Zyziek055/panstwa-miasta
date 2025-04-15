import React, { useEffect, useState } from 'react';
import { socket } from './socket';

export function Leaderboard({ finalScores, players, resetGame }) {
    return (
        <div>
            <h1>Leaderboard</h1>
            <h3>Players and their scores:</h3>
            <ul className="player-list">
                {Object.entries(finalScores).map(([playerId, score]) => {
                    const player = players.find(p => p.id === playerId);
                    return (
                        <li key={playerId} className="player-item">
                            {player ? player.nickname : 'Unknown Player'}: {score}
                        </li>
                    );
                })}
            </ul>
            <button onClick={resetGame}>
                Exit
            </button>   
        </div>
    );
}
