document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    console.log('Username from window:', window.username);  
    // Prompt for username on joining the chat
    socket.emit('joinChat', window.username);
  
    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
      const chatSection = document.getElementById('chat-section');
      const newMessage = document.createElement('div');
      newMessage.textContent = msg;
      chatSection.appendChild(newMessage);
    });
  
    // Emit chat message event
    document.getElementById('chat-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const messageInput = document.getElementById('message-input');
      const message = messageInput.value;
      socket.emit('chatMessage', `${window.username}: ${message}`); // Include username in message
      messageInput.value = '';
    });
  
    // Function to toggle chat window visibility
    document.getElementById('chat-icon').addEventListener('click', function() {
      const chatWindow = document.getElementById('chat-window');
      chatWindow.classList.toggle('hidden');
    });
  });
  