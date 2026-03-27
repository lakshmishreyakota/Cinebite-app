const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Pass io to res.locals for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO tracking
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database Connection Options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebite');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database Connection Error: ${err.message}`);
    // If it fails with SSL alert, it might be Atlas firewall or TLS version issues
    if (err.message.includes('tlsv1 alert internal error')) {
      console.warn('WARNING: Your network or IP whitelist might be blocking MongoDB Atlas. Trying local fallback if configured...');
    }
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/food', require('./routes/food.routes'));
app.use('/api/orders', require('./routes/order.routes'));

app.get('/', (req, res) => {
  res.send('CineBite API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
