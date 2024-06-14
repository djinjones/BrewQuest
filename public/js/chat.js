document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    // Emit the chatMessage event
    socket.emit('chatMessage', message);

    // Clear the input field
    messageInput.value = '';
});
