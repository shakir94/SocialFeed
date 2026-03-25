const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');

dotenv.config();

const app = express();

// ── CORS — open to all origins (JWT auth doesn't need credentials) ──
app.use(cors());
app.options('*', cors());

// ── Body parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Social App API is running 🚀' });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Connect to MongoDB and start server ──────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
