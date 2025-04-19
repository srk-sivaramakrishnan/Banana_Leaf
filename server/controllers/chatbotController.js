const { GoogleGenerativeAI } = require('@google/generative-ai');
const { modelInstructions, modelGeneralInstructions } = require('../utils/ChatBotInstructions');

// Combine banana leaf–specific system instructions
typeof modelInstructions !== 'string' && console.warn('Check ChatBotInstructions export');
const combinedSystemInstruction = 
  `${modelInstructions}\n\n${modelGeneralInstructions}\n\nNote: If the conversation includes a message that starts with "Selected configuration:" and an explanation, always use that provided configuration to answer follow-up questions. Do not ask for banana leaf details again.`;

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

// Initialize Gemini model for banana leaf guidance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: combinedSystemInstruction
});

// In-memory memory store
const conversationMemory = {};

async function handleGeminiPrompt(req, res, next) {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  
      // Auto-generate a session ID (timestamp-based for simplicity)
      const currentSessionId = Date.now().toString();
      const memoryKey = currentSessionId;
  
      const history = conversationMemory[memoryKey] || [];
      let combinedPrompt = history
        .map(item => `User: ${item.prompt}\nAssistant: ${item.response}`)
        .join('\n');
      if (combinedPrompt) combinedPrompt += '\n';
      combinedPrompt += `User: ${prompt}`;
  
      const result = await model.generateContent(combinedPrompt);
      const responseText = result.response.text();
  
      conversationMemory[memoryKey] = history.concat({ prompt, response: responseText });
  
      res.json({
        response: responseText,
      });
    } catch (err) {
      console.error('Gemini controller error:', err);
      next(err);
    }
  }
  

module.exports = { handleGeminiPrompt };
