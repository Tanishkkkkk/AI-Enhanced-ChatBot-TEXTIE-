const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the parent directory
app.use(express.static('../'));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message, provider } = req.body;
    
    try {
        let apiResponse;
        if (provider === 'openai') {
            // OpenAI API call
            apiResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: "You are Textie AI, a Gen Z chatbot that speaks in modern slang and emojis. Keep responses fun and engaging! IMPORTANT: Respond directly without showing your thinking process. Never start with phrases like 'Let me think' or 'I will analyze'. Just give the final response."
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } else if (provider === 'cohere') {
            // Cohere logic (unchanged)
        } else if (provider === 'local') {
            // Local model (LMStudio) logic
            apiResponse = await axios.post(
                'http://127.0.0.1:1234/v1/chat/completions',
                {
                    messages: [
                        {
                            role: 'system',
                            content: "You are Textie AI, a Gen Z chatbot that speaks in modern slang and emojis. Keep responses fun and engaging! IMPORTANT: Respond directly without showing your thinking process. Never start with phrases like 'Let me think' or 'I will analyze'. Just give the final response."
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } else {
            res.status(400).json({ error: 'Unknown provider' });
            return;
        }

        const botReply = apiResponse.data.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to get response from AI',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 