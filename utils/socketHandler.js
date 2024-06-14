const socketHandler = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        // Handle incoming chat messages
        socket.on('chatMessage', (msg) => {
            io.emit('chatMessage', msg); // Broadcast the message to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
};

module.exports = socketHandler;
