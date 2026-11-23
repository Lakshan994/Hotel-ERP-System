const mongoose = require('mongoose');
async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Configure backend/.env');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
module.exports = connectDB;
