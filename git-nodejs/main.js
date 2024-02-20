// index.js
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const db = require('./dbConnection');
const signUp = require('./signUp');
const feed = require('./feed')

const app = express();
const port = 3000;

app.use(express.json());

// Use cors middleware
app.use(cors());

// Use routes
app.use('/', signUp);
app.use('/',feed)


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
