const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  modelInstructions,
  modelGeneralInstructions
} = require('../utils/ChatBotInstructions');

// Validate imports
if (typeof modelInstructions !== 'string' || typeof modelGeneralInstructions !== 'string') {
  console.warn('Check that modelInstructions and modelGeneralInstructions are exported as strings.');
}

// Combine system instructions
const combinedSystemInstruction = `
${modelInstructions}

${modelGeneralInstructions}

Note: If the conversation includes a message that starts with "Selected configuration:" and an explanation, always use that provided configuration to answer follow-up questions. Do not ask for banana leaf details again.
`.trim();

// Ensure API key is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: combinedSystemInstruction
});

// In-memory conversation store (per session)
const conversationMemory = {};

async function handleGeminiPrompt(req, res, next) {
  try {
    const { prompt, sessionId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Use provided sessionId or default to timestamp
    const memoryKey = sessionId || Date.now().toString();
    const history = conversationMemory[memoryKey] || [];

    // Construct prompt with history
    let combinedPrompt = history
      .map(item => `User: ${item.prompt}\nAssistant: ${item.response}`)
      .join('\n');

    if (combinedPrompt) combinedPrompt += '\n';
    combinedPrompt += `User: ${prompt}`;

    // Call Gemini model
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();

    // Save to memory
    conversationMemory[memoryKey] = history.concat({ prompt, response: responseText });

    // Send response
    res.json({
      sessionId: memoryKey,
      response: responseText
    });

  } catch (err) {
    console.error('Gemini controller error:', err);
    next(err);
  }
}

module.exports = { handleGeminiPrompt };
