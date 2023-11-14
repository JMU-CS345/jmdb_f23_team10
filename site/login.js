const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + 'movie/popular?' + API_KEY;

// Install necessary npm packages: express, mongoose, body-parser

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB (Make sure to have MongoDB server running)
mongoose.connect('mongodb://localhost:27017/jmdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a User model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input (you may want to add more validation)
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create a new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  res.json({ success: true });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  // Check if the user exists
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
