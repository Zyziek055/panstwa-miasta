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