const socketHandler = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('joinChat', (username) => {
            socket.username = username;
            io.emit('chatMessage', `${username} has joined the chat`);
        });

        socket.on('chatMessage', (msg) => {
            io.emit('chatMessage', `${socket.username}: ${msg}`);
        });

        socket.on('disconnect', () => {
            io.emit('chatMessage', `${socket.username} has left the chat`);
        });
    });

    return io;
};

module.exports = socketHandler;
