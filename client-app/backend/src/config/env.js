const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/client_school_db',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30m',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOW_BALANCE_THRESHOLD: parseInt(process.env.LOW_BALANCE_THRESHOLD, 10) || 5000,
  AUTH_LIMIT_MAX: parseInt(process.env.AUTH_LIMIT_MAX, 10) || 30,
};
