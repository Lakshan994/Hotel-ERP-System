require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Set a strong JWT_SECRET (32+ characters)');
  await connectDB(); // Do not accept API traffic unless the database is reachable.
  const port = Number(process.env.PORT || 5000);
  const server = app.listen(port, () => console.log(`Hotel ERP backend listening on http://localhost:${port}`));
  const shutdown = async () => { server.close(); await mongoose.disconnect(); process.exit(0); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
start().catch(err => { console.error('Backend startup failed:', err.message); process.exit(1); });
