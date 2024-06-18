const socketHandler = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('joinChat', (username) => {
            socket.username = username;
            console.log('User joined:', username); // Debugging log
            io.emit('chatMessage', `${username} has joined the chat`);
        });

        socket.on('chatMessage', (msg) => {
            console.log('Message received:', msg); // Debugging log
            io.emit('chatMessage', msg); // Message already includes username
        });

        socket.on('disconnect', () => {
            io.emit('chatMessage', `${socket.username} has left the chat`);
        });
    });

    return io;
};

module.exports = socketHandler;
