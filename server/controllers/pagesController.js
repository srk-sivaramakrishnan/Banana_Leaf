const { db } = require('../config/firebaseAdmin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup controller for creating a new user account
const signUp = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate that all required fields are provided
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        // Check if a user with the given email already exists using a query
        const existingUsers = await db.collection('users').where('email', '==', email).get();
        if (!existingUsers.empty) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        // Hash password with bcrypt (using 10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the new user data
        const newUser = {
            name,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Write the new user document to Firestore with an auto-generated ID
        const userDocRef = await db.collection('users').add(newUser);

        // Generate a JWT token for the new user
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the response in JSON format including the generated document id if needed
        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: userDocRef.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Signin controller for authenticating an existing user
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate that email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }

        // Fetch user by email from Firestore
        const userQuery = await db.collection('users').where('email', '==', email).get();
        if (userQuery.empty) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token for the user
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token and user info
        return res.status(200).json({
            message: 'Signin successful',
            token,
            user: {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            }
        });
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Get User Data on Navbar
const getUser = async (req, res) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // 2. Extract token
        const token = authHeader.split(' ')[1];

        // 3. Decode and verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // 4. Extract user identifier from decoded token
        // Assuming token payload contains email or userId
        const userEmail = decoded.email; // or decoded.userId if you use uid in token

        if (!userEmail) {
            return res.status(400).json({ error: 'Invalid token payload: no email' });
        }

        // 5. Query Firestore for user by email
        const userQuery = await db.collection('users').where('email', '==', userEmail).get();

        if (userQuery.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        // 6. Return only name and email
        res.status(200).json({
            user: {
                id: userDoc.id,
                name: userData.name || null,
                email: userData.email || null,
            },
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};


module.exports = {
    signUp,
    signIn,
    getUser,
};


