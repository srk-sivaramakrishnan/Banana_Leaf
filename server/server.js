const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const pagesRoute = require('./routes/pagesRoute');
// const adminRoute = require('./routes/adminRoutes');
// const clientRoute = require('./routes/clientRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); 

// Routes
app.use('/pages', pagesRoute);
// app.use('/admin', adminRoute);
// app.use('/client', clientRoute);

// Handle 404 (Not Found)
app.use((req, res, next) => {
  return res.status(404).send('404 Not Found');
});

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Connected to Firebase Successfully...');
});
