require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.static('public'));

app.post('/api/roast', async (req, res) => {
    try {
        const { image } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const prompt = "Look at this person's outfit. Roast their style playfully but ruthlessly in exactly 2 to 3 sentences. Be creative.";
        
        const imageParts = [{ inlineData: { data: image, mimeType: "image/jpeg" } }];
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        res.json({ roast: text });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to generate roast." });
    }
});

app.listen(port, () => {
    console.log(`🌲 AI Outfit Roaster running securely at http://localhost:${port}`);
});