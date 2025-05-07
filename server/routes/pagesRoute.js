const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const { authenticateToken } = require('../auth/jwtAuthentication');

// Define the POST route for signup
router.post('/signup', pagesController.signUp);

// Define the POST route for signup
router.post('/signin', pagesController.signIn);

router.get('/get-user', authenticateToken, pagesController.getUser )

module.exports = router;
