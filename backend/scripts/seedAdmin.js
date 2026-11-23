require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
async function main() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and a 10+ character ADMIN_PASSWORD in backend/.env');
  }
  await connectDB();
  if (await User.exists({ email: ADMIN_EMAIL.toLowerCase() })) {
    console.log('Admin email already exists; nothing changed.');
  } else {
    await User.create({ fullName: ADMIN_NAME, email: ADMIN_EMAIL, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'Admin' });
    console.log('Admin created. Log in with ADMIN_EMAIL and ADMIN_PASSWORD.');
  }
}
main().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
