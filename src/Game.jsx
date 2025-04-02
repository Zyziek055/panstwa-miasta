import React from 'react';

//create game component
export function Game({ selectedCategories }) {
    return (
        <div className="game">
            <h1>Game Time!</h1>
            <p>Selected Categories:</p>
            <ul>
                {selectedCategories.map((category) => (
                    <li key={category}>{category}</li>
                ))}
            </ul>
            <p>Start thinking of words for the selected categories!</p>
        </div>
    );
}