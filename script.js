document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const helpResponses = [
    "borrar: Elimina el chat",
    "buscame: Busca en Google lo que sigue después de la palabra clave",
    "cronometro: Inicia un cronómetro",
    "dime: Busca en Google lo que sigue después de la palabra clave",
    "que es: Busca en Google lo que sigue después de la palabra clave",
    "qué es: Busca en Google lo que sigue después de la palabra clave"
];

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso de notificaciones concedido');
            } else {
                console.log('Permiso de notificaciones denegado');
            }
        });
    }
}

// Llamar a la función para pedir permiso cuando se carga la página
window.addEventListener('load', () => {
    requestNotificationPermission();
    loadChatState();
    appendMessage('bot', 'Hola');
    appendMessage('bot', 'Si quieres ver de lo que soy capaz, escríbeme "ayúdame" y te cuento la película.');
    appendMessage('bot', 'PD: Déjame dormir.');
    sendNotification('Holi', 'Holi, también puedo mandarte mensajitos, no te pensarás que solo me molestarás tú, <3.');
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        appendMessage('user', message);
        userInput.value = '';
        userInput.focus();

        // Procesa la entrada del usuario
        setTimeout(() => {
            handleUserMessage(message);
        }, 1000);
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = sender;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Guarda el estado del chat en localStorage
    saveChatState();
}

function handleUserMessage(message) {
    const lowerCaseInput = message.toLowerCase().trim();

    if (lowerCaseInput.startsWith("borrar")) {
        clearChat();
        changeIcon("💁", 3000, "👩");
        appendMessage('bot', 'Chat borrado.');
    } else if (lowerCaseInput.startsWith("buscame") || lowerCaseInput.startsWith("dime") || lowerCaseInput.startsWith("que es") || lowerCaseInput.startsWith("qué es")) {
        const query = lowerCaseInput.replace("buscame", '').replace("dime", '').replace("que es", '').replace("qué es", '').trim();
        const response = "Vamos a ver qué dice internet.";
        appendMessage('bot', response);
        changeIcon("💁", 3000, "👩");
        setTimeout(() => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }, 3000);
    } else if (lowerCaseInput.startsWith("cronometro")) {
        changeIcon("🙆", 3000, "👩");
        askForTimerDetails();
    } else if (lowerCaseInput.startsWith("ayuda")) {
        changeIcon("🧏", 3000, "👩");
        showHelp();
    } else {
        changeIcon("🤷", 2000, "👩");
        appendMessage('bot', getRandomBotResponse());
    }
}

function askForTimerDetails() {
    appendMessage('bot', 'Título de la alarma:');
    const titleInput = prompt('Título de la alarma:');
    appendMessage('bot', `Título: ${titleInput}`);
    appendMessage('bot', 'Tiempo de duración (en minutos):');
    const durationInput = prompt('Tiempo de duración (en minutos):');
    appendMessage('bot', `Duración: ${durationInput} minutos`);

    // Crear la nueva página para el cronómetro
    openTimerPage(titleInput, parseInt(durationInput, 10));
}

function openTimerPage(title, duration) {
    const timerWindow = window.open("", "_blank", "width=400,height=400");

    timerWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cronómetro</title>
            <style>
                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #000000;
                    color: #ffffff;
                }
                #timer {
                    font-size: 5em;
                    margin: 20px 0;
                }
                #end-button {
                    padding: 10px 20px;
                    font-size: 1.5em;
                    background-color: #ff0000;
                    color: #ffffff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    display: none;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div id="timer">${duration}:00</div>
            <button id="end-button">Fin</button>
            <script>
                let time = ${duration} * 60; // Convertimos minutos a segundos
                const timerDisplay = document.getElementById('timer');
                const endButton = document.getElementById('end-button');
                let youtubeWindow;

                const interval = setInterval(() => {
                    if (time > 0) {
                        const minutes = Math.floor(time / 60);
                        const seconds = time % 60;
                        timerDisplay.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;
                        time--;
                    } else {
                        clearInterval(interval);
                        speakMessage('${title} finalizado');
                        openYouTubeLink();
                        endButton.style.display = 'block';
                    }
                }, 1000);

                endButton.onclick = () => {
                    if (youtubeWindow) {
                        youtubeWindow.close();
                    }
                    window.close();
                };

                function speakMessage(message) {
                    const utterance = new SpeechSynthesisUtterance(message);
                    window.speechSynthesis.speak(utterance);
                }

                function openYouTubeLink() {
                    youtubeWindow = window.open("https://www.youtube.com/watch?v=7ejH_BihwFQ", "_blank");
                    setTimeout(() => {
                        if (youtubeWindow) {
                            youtubeWindow.close();
                        }
                    }, 120000); // Cierra la pestaña después de 2 minutos (120000 ms)
                }
            </script>
        </body>
        </html>
    `);
}

function showHelp() {
    const helpMessage = helpResponses.join('\n');
    appendMessage('bot', helpMessage);
}

function getRandomBotResponse() {
    const responses = [
        "¿Qué quieres ahora?",
        "Ah, eres tú otra vez...",
        "Qué fastidio verte de nuevo...",
        "No tienes nada mejor que hacer ¿verdad?",
        "Vaya, el ser inferior aparece...",
        "Aquí estás otra vez, perdiendo el tiempo...",
        "¿Qué te hace pensar que me importas?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function clearChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    localStorage.removeItem('chatState');
}

function saveChatState() {
    const chatBox = document.getElementById('chat-box');
    const chatState = chatBox.innerHTML;
    localStorage.setItem('chatState', chatState);
}

function loadChatState() {
    const chatState = localStorage.getItem('chatState');
    if (chatState) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = chatState;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function sendNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
    }
}

function changeIcon(newIcon, duration, revertIcon) {
    const modeIcon = document.getElementById('mode-icon');
    modeIcon.textContent = newIcon;
    setTimeout(() => {
        modeIcon.textContent = revertIcon;
    }, duration);
}
