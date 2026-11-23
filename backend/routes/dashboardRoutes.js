const r = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
r.get('/', protect, require('../controllers/dashboardController').overview);
module.exports = r;
