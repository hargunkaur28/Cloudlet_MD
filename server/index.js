const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notifications');
const folderRoutes = require('./routes/folderRoutes');
const trashRoutes = require('./routes/trashRoutes');
const setupCronJobs = require('./utils/cron');

dotenv.config();

// Setup Cron Jobs
setupCronJobs();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for secure cookies behind Render/Heroku/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean); // Remove null/undefined

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to true for debugging if origin is weird, or be strict: callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/trash', trashRoutes);

app.get('/', (req, res) => res.send('Mini Drive API is running'));

// Database & Server Startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
