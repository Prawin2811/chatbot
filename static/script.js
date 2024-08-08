



document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('clear-btn').addEventListener('click', clearChat);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const messageText = inputElement.value.trim();

    if (messageText === '') return;

    addMessageToChat('user', messageText);
    inputElement.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        addMessageToChat('bot', data.response);
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('bot', 'Sorry, something went wrong.');
    }
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);

    // Scroll to the bottom if not manually scrolled up
    chatBox.scrollTop = chatBox.scrollHeight; 
}

function clearChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';  // Clear all messages in the chat box
}
