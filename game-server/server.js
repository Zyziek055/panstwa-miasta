const { Server } = require('socket.io');
const http = require('http');

// Create a server
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Function to generate a random letter
const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

// Function to generate a unique game ID
const generateGameId = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const games = {}; // Store game data

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createGame', ({ nickname, categories }) => {
    const gameId = generateGameId();

    games[gameId] = {
      players: [{ id: socket.id, nickname }],
      categories,
      randomLetter: '',
      gameState: 'waiting',
    };

    socket.join(gameId);
    console.log(`Game ${gameId} created by ${nickname}`);

    socket.emit('gameCreated', { gameId, categories });
    io.to(gameId).emit('updateGame', { players: games[gameId].players }); // Emit the initial player list
  });

  socket.on('startGame', (gameId) => {
    const game = games[gameId];
    if (!game) {
      socket.emit('error', { message: 'Game not found!' });
      return;
    }

    game.randomLetter = generateRandomLetter();
    game.gameState = 'in-progress';

    io.to(gameId).emit('gameStarted', { randomLetter: game.randomLetter });
    console.log(`Game ${gameId} started with letter ${game.randomLetter}`);
  });

  socket.on('joinGame', ({ gameId, nickname }) => {
    const game = games[gameId];
    if (!game) {
      socket.emit('error', { message: 'Game not found!' });
      return;
    }

    game.players.push({ id: socket.id, nickname });
    socket.join(gameId);
    console.log(`Player ${nickname} joined game ${gameId}`);

    // Emit updated player list and categories
    io.to(gameId).emit('updateGame', { players: game.players });
    socket.emit('gameData', { players: game.players, categories: game.categories });
  });

  socket.on('disconnect', () => {
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