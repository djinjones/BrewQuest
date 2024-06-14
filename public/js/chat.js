document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    // Prompt for username on joining the chat
    const username = prompt('Enter your username');
    socket.emit('joinChat', username);
  
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
      socket.emit('chatMessage', message);
      messageInput.value = '';
    });
  
    // Function to toggle chat window visibility
    document.getElementById('chat-icon').addEventListener('click', function() {
      const chatWindow = document.getElementById('chat-window');
      chatWindow.classList.toggle('hidden');
    });
  });
  