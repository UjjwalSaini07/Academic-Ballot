const mongoose = require("mongoose");

let dbStatus = {
  connected: false,
  error: null,
  connectionTime: null
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    dbStatus = {
      connected: true,
      error: null,
      connectionTime: new Date().toISOString()
    };
    console.log("MongoDB Connected");
  } catch (err) {
    dbStatus = {
      connected: false,
      error: err.message,
      connectionTime: null
    };
    console.error("DB Error:", err.message);
  }
};

const getDbStatus = () => dbStatus;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
