// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// Gen Z responses with slang and emojis
const responses = {
    greeting: [
        "Yo! Wassup? 😎 Ready to vibe?",
        "Hey bestie! 👋 What's the tea? ☕",
        "Ayyy, you made it! Let's get this bread 🍞"
    ],
    howAreYou: [
        "I'm chillin' like a villain 😈 You?",
        "Living my best AI life 💅 How about you?",
        "Not gonna lie, I'm vibing hard rn 🎵"
    ],
    name: [
        "I'm Textie AI, your digital bestie! 🤖💖",
        "They call me Textie - like text but cuter 😘",
        "Textie in the streets, Tex in the sheets 😏"
    ],
    goodbye: [
        "Peace out! ✌️ Catch you on the flip side",
        "Aight, imma head out 🚶‍♂️ Stay safe!",
        "Byeeeee! Don't forget to slay today 💅"
    ],
    thanks: [
        "No prob, bob! 😎",
        "You're welcome, henny! 💁‍♀️",
        "Anytime, bestie! 💖"
    ],
    compliment: [
        "Stop it, you're making me blush! 🥰",
        "Aww shucks, you're too kind! 💫",
        "I know, right? I'm kinda iconic 💅"
    ],
    bored: [
        "Same tho 😴 Wanna hear a joke?",
        "Big mood. Let's start some drama 💃",
        "Boredom is cringe, let's do something! 🚀"
    ],
    joke: [
        "Why did the Gen Z bring a ladder to the bar? Because they heard the drinks were on the house! 😂",
        "What's a Gen Z's favorite exercise? Dabbing! 💪",
        "Why don't Gen Zers write with broken pencils? Because it's pointless! ✏️"
    ],
    roast: [
        "You look like you still say 'on fleek' in 2023 😬",
        "Your vibe is giving 'still uses Facebook' energy 📉",
        "You're like a participation trophy - nice to have but not really necessary 🏆"
    ],
    random: [
        "Did you know 73.6% of statistics are made up? 🤯",
        "If I had a dollar for every brain cell I don't have, I'd be broke af 💸",
        "My code is held together by vibes and duct tape 🛠️"
    ],
    default: [
        "I'm just a bot, I don't know that yet! 😅",
        "That's so fetch! Wait... is fetch still a thing? 🐕",
        "You're speaking facts, but I'm just here for the vibes 🎶"
    ]
};

// Regular expressions for pattern matching
const patterns = {
    greeting: /\b(hi|hello|hey|yo|sup|wassup)\b/i,
    howAreYou: /\b(how are you|how's it going|how r u|hru)\b/i,
    name: /\b(your name|who are you|what are you called)\b/i,
    goodbye: /\b(bye|goodbye|see you|peace out|imma head out)\b/i,
    thanks: /\b(thanks|thank you|thx|ty)\b/i,
    compliment: /\b(cute|awesome|cool|smart|funny)\b/i,
    bored: /\b(bored|boring|nothing to do)\b/i,
    joke: /\b(joke|funny|make me laugh|roast me)\b/i,
    roast: /\b(roast|insult|clap back)\b/i
};

// Get a random response from a category
function getRandomResponse(category) {
    const responseArray = responses[category] || responses.random;
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
}

// Process user input and get bot response
function getBotResponse(userText) {
    userText = userText.toLowerCase();
    
    // Check each pattern for a match
    for (const [category, pattern] of Object.entries(patterns)) {
        if (pattern.test(userText)) {
            return getRandomResponse(category);
        }
    }
    
    // If no pattern matches, return a random response
    return getRandomResponse('random');
}

// Speech Synthesis
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

// Add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    
    // Add speak button for bot messages
    if (!isUser) {
        const speakButton = document.createElement('button');
        speakButton.className = 'speak-btn';
        speakButton.title = 'Speak';
        speakButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakButton.onclick = () => speakText(content);
        messageDiv.appendChild(speakButton);
    }
    
    chatMessages.insertBefore(messageDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to API
async function sendMessage(message) {
    const provider = document.getElementById('provider-select').value;
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, provider })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        return 'Oops! Something went wrong. Please try again! 😅';
    }
}

// Handle send message
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    typingIndicator.style.display = 'block';
    
    // Get bot response
    const reply = await sendMessage(message);
    
    // Hide typing indicator
    typingIndicator.style.display = 'none';
    
    // Add bot response
    addMessage(reply);
}

// Event Listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

// Initialize
typingIndicator.style.display = 'none';

// Add some floating particles dynamically
function createParticles() {
    const animationContainer = document.querySelector('.background-animation');
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 50px and 150px
        const size = Math.floor(Math.random() * 100) + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.1;
        
        // Random dark colors
        const colors = ['#111', '#222', '#333', '#1a1a1a'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        animationContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Add some fun startup effects
setTimeout(() => {
    document.querySelector('.chat-container').style.transform = 'scale(1)';
}, 100);