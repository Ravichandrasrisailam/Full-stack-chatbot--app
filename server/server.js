    require('dotenv').config(); // Load environment variables from .env file
    const express = require('express');
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const cors = require('cors');
    const rateLimit = require('express-rate-limit');
    const { GoogleGenerativeAI } = require('@google/generative-ai');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // --- Middleware ---
    app.use(express.json()); // Body parser for JSON requests
    app.use(cors()); // Enable CORS for all routes

    // Rate limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
    app.use(limiter);

    // --- MongoDB Connection ---
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected successfully!'))
      .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if cannot connect to DB
      });

    // --- User Model ---
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });

    userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) {
        return next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    const User = mongoose.model('User', userSchema);

    // --- JWT Authentication Middleware ---
    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token == null) return res.status(401).json({ message: 'Authentication token required' });

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.error('JWT verification error:', err);
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
      });
    };

    // --- API Routes ---

    // Auth Routes
    app.post('/api/auth/register', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already taken' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration' });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
      }
    });

    // Chatbot Route (protected)
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    app.post('/api/chat', authenticateToken, async (req, res) => {
      const { contents } = req.body; // contents should be in the format { role: "user", parts: [{ text: "message" }] }

      if (!contents || !Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({ message: 'Chat content is required' });
      }

      try {
        const result = await model.generateContent({ contents });
        const response = result.response;
        const text = response.text();
        res.json({ message: text });
      } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Error getting response from AI. Please try again.' });
      }
    });
      // TEST ROUTE - Add this to confirm server is working
    app.get('/', (req, res) => {
      res.send('Backend is running!');
    });

    // --- Server Start ---
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Open your React app at http://localhost:5173`); // Assuming React runs on 5173
    });
    