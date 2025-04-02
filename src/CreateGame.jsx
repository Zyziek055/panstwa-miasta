import React, {use, useState} from 'react';
import { useNavigate } from 'react-router-dom'; //this will be used to navigate to the game page

export function CreateGame() {
    const categoriesList = [
        'Country',
        'Town',
        'Plant',
        'Car brand',
        'Clothes Brand',
        'Item',
        'Animal'
    ]

    //make town and country default categories
    const defaultCategories = ['Country', 'Town'];
    const [selectedCategories,  setSelectedCategories] = useState(defaultCategories);
    navigate = useNavigate(); //initialize navigate


    //function to handle category selection
    const toggleCategory = (category) => {
        //If its default, do nothing
        if (defaultCategories.includes(category)) return;
        
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((cat) => cat !== category);
            } else {
                return [...prev, category];
            }
        });
    }

    //function to start the game
    const startGame = () => {
        setSelectedCategories(selectedCategories);
        navigate('/game');
    };

    return (
        //map categories to make checkbox list 
        <div className="create-game">
            <h1>Create Game</h1>
            <div className="categories">
                {categoriesList.map((category) => (
                    <div key={category} className="category">
                        <input
                            type="checkbox"
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category}>{category}</label>
                    </div>
                ))}
            </div>
            {/* Initiate new game */}
            <button onClick={startGame}>Create Game</button> 
        </div>
    );
}