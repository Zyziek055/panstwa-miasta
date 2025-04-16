import { socket } from './socket';

export function CreateGame({ onCreateGame, setPlayers }) {
  const categoriesList = [
    'Country',
    'Town',
    'Plant',
    'Car brand',
    'Clothes Brand',
    'Item',
    'Animal',
  ];

  const defaultCategories = ['Country', 'Town'];
  const [selectedCategories, setSelectedCategories] = useState(defaultCategories);
  const [nickname, setNickname] = useState('');

  const [rounds, setRounds] = useState(1); // Default value for rounds

  const toggleCategory = (category) => {
    if (defaultCategories.includes(category)) return;

    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const createGame = () => {
    if (!nickname) {
      alert('Please enter your nickname!');
      return;
    }

    console.log('Creating game with:', { nickname, categories: selectedCategories });
    
    socket.emit('createGame', { nickname, categories: selectedCategories, rounds}); //send info to the server about the game creation
    
    socket.once('gameCreated', ({ gameId, categories }) => {
      console.log('Game created:', { gameId, categories });
      const initialPlayers = [{ id: socket.id, nickname }];
      setPlayers(initialPlayers);
      setPlayersState(initialPlayers);
      
      // Call onStartGame to switch to Lobby view
      onCreateGame(gameId, categories, true); // true for isCreator
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });
  };
  return (
    <div>
      <h1>Create a New Game</h1>
      <input
        type="text"
        placeholder="Enter Your Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <h3>Select Categories:</h3>
      {categoriesList.map((category) => (
        <label key={category}>
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() =>
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((cat) => cat !== category)
                  : [...prev, category]
              )
            }
          />
          {category}
        </label>
      ))}
        <div className="rounds-select-wrapper">
          <label htmlFor="rounds" className="rounds-label">Rounds:</label>
          <select 
            id="rounds"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="rounds-select"
          >
            <option value="1">1</option>  
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      <button onClick={createGame}>Create Game</button>
    </div>
  );
}