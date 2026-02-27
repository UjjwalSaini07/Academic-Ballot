const mongoose = require("mongoose");

let dbStatus = {
  connected: false,
  error: null,
  connectionTime: null
};

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if already connected
  if (mongoose.connection.readyState === 1) {
    dbStatus = {
      connected: true,
      error: null,
      connectionTime: mongoose.connection.connInfo?.connectionTime || new Date().toISOString()
    };
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('open', () => resolve(mongoose.connection));
      mongoose.connection.once('error', (err) => reject(err));
    });
  }

  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI not configured. Set MONGO_URI or MONGODB_URI environment variable.");
    }
    
    await mongoose.connect(mongoUri);
    dbStatus = {
      connected: true,
      error: null,
      connectionTime: new Date().toISOString()
    };
    console.log("MongoDB Connected");
    return mongoose.connection;
  } catch (err) {
    dbStatus = {
      connected: false,
      error: err.message,
      connectionTime: null
    };
    console.error("DB Error:", err.message);
    throw err;
  }
};

const getDbStatus = () => dbStatus;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
