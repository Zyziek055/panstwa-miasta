const { Server } = require('socket.io');
const http = require('http');
const { Socket } = require('dgram');

//create a server
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let games = {}; //this will store data about the games

//function to generate a random letter
const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

// Function to generate a unique game ID
const generateGameId = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`; // Generuje 4-cyfrowe ID
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createGame', ({ nickname, categories }) => {
    const gameId = generateGameId(); // Generate a unique game ID

    games[gameId] = {
      players: [{ id: socket.id, nickname, words: {} }],
      categories,
      randomLetter: '',
      gameState: 'waiting',
    };

    socket.join(gameId);
    console.log(`Game ${gameId} created by ${nickname}`);
    socket.emit('gameCreated', { gameId, nickname, categories });
  });

  socket.on('startGame', (gameId) => {
    const game = games[gameId];
    if (!game) {
      socket.emit('error', 'Game not found!');
      return;
    }

    game.randomLetter = generateRandomLetter();
    game.gameState = 'in-progress';

    io.to(gameId).emit('gameStarted', { randomLetter: game.randomLetter });
    console.log(`Game ${gameId} started with letter ${game.randomLetter}`);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});