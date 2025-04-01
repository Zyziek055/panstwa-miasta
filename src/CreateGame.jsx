import React, {useState} from 'react';

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

    const [selectedCategories, setSelectedCategories] = useState([]);

    const toggleCategory = (category) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((cat) => cat !== category);
            } else {
                return [...prev, category];
            }
        });
    }

    return (
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
            <button onClick={() => console.log(selectedCategories)}>Create Game</button>
        </div>
    );
}