const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:8090' : '';

const chatBubble = document.getElementById('chatBubble');
const originalContent = chatBubble.dataset.originalContent;
let isInputMode = false;

chatBubble.addEventListener('click', function () {
    if (!isInputMode) {
        isInputMode = true;
        chatBubble.innerHTML = '<input type="text" id="chatInput" placeholder="What do you want to know?">';
        document
            .getElementById('chatInput')
            .focus();
    }
});

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && isInputMode) {
        const input = document.getElementById('chatInput');
        const message = input.value;
        if (message) {
            chatBubble.innerHTML = 'Processing...';
            sendMessageToWorker(message);
        }
    }
});

function sendMessageToWorker(message) {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const animalParam = isDarkMode ? 'frog' : 'chicken';
    const waitText = isDarkMode ? 'Ribbit' : 'Cluck';
    chatBubble.textContent = waitText;
    chatBubble.classList.add('waiting');

    const eventSource = new EventSource(`${baseUrl}/ai?message=${encodeURIComponent(message)}&animal=${animalParam}`);

    eventSource.onmessage = (event) => {
        if (chatBubble.classList.contains('waiting')) {
            chatBubble.textContent = '';
            chatBubble.classList.remove('waiting');
        }

        const data = event.data;
        if (data !== '[DONE]') {
            try {
                const parsed = JSON.parse(data);
                if (parsed.response) {
                    chatBubble.textContent += parsed.response;
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                chatBubble.textContent += data;
            }
        } else {
            eventSource.close();
            isInputMode = false;
        }
    };

    eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        isInputMode = false;
        if (!chatBubble.textContent) {
            chatBubble.textContent = originalContent;
        }
    };
}