const { Server } = require('socket.io');
const http = require('http');

// Create a server
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Function to generate a unique game ID
const generateGameId = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWZ";
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

const games = {}; // Store game data

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createGame', ({ nickname, categories }) => {
    const gameId = generateGameId(); // Generate a unique game ID
    const initialPlayers = [{ id: socket.id, nickname }]; // Initialize palyers list with the creator

    // Store game data
    games[gameId] = {
      id: gameId,
      players: initialPlayers,
      categories: categories || [],
      started: false,
    };

    socket.join(gameId); // Join the game room 
    

    socket.emit('gameCreated', { gameId, categories,players: initialPlayers }); //Emit game creation event to everyone in the lobby
    console.log('OK', { gameId, categories });
  });

  socket.on('joinGame', ({ gameId, nickname }) => {
    const game = games[gameId]; // Find the game by ID

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.started) {
      socket.emit('error', { message: 'Game already started' });
      return;
    }
    console.log('joining room')
    socket.join(gameId); // Join the game room

    game.players.push({id:socket.id, nickname}); //Add player to the players list
    socket.emit('gameJoined', { gameId, players: game.players, categories: game.categories }); // Emit event to the player who joined
    socket.to(gameId).emit('playerJoined', {players: game.players}); // Notify other players in the game room
  })

  socket.on('startGame', ({ gameId }) => {
    const game = games[gameId]; // Find the game by ID

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.started) {
      socket.emit('error', { message: 'Game already started' });
      return;
    }


    const randomLetter = generateLetter();
    game.started = true; // Mark the game as started

    io.to(gameId).emit('gameStarted', { categories: game.selectedCategories, randomLetter}); // Notify all players in the game room
  });

  socket.on('submitAnswers', ({ gameId, answers }) => {
    let timeLeft = 10;
    
    const countDown = setInterval(() => {
      io.to(gameId).emit('startCountdown', { timeLeft });
      timeLeft--;
  
      if (timeLeft < 0) {
        clearInterval(countDown);
        io.to(gameId).emit('gameEnded');
      }
    }, 1000);
  });

  socket.on('timeUp', ({ gameId }) => {
    io.to(gameId).emit('gameEnded');
    delete games[gameId];
  });

  socket.on('disconnect', () => {
     
    //TODO: add server events

    console.log('A user disconnected:', socket.id);
    for (const gameId in games) {
      const game = games[gameId];
      game.players = game.players.filter((player) => player.id !== socket.id);
      if (game.players.length === 0) {
        delete games[gameId];
        console.log(`Game ${gameId} deleted as no players are left.`);
      } else {
        io.to(gameId).emit('updateGame', { players: game.players });
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});