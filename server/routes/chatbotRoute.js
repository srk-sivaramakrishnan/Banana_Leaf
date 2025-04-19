const express = require('express');
const chatbotController = require('../controllers/chatbotController');
const {authenticateToken} = require('../auth/jwtAuthentication');
const router = express.Router();

// Route: POST /api/gemini
router.post('/generating', authenticateToken, chatbotController.handleGeminiPrompt);

module.exports = router;