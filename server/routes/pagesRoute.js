const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');

// Define the POST route for signup
router.post('/signup', pagesController.signUp);

// Define the POST route for signup
router.post('/signin', pagesController.signIn);

module.exports = router;
