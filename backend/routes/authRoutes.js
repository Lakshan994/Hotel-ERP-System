const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const c = require('../controllers/authController');
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, c.login);
// For safety, only an existing admin can register additional staff accounts.
router.post('/register', protect, allowRoles('Admin'), [
  body('fullName').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 10 }),
  body('role').optional().isIn(['Admin','Receptionist'])
], validate, c.register);
router.get('/profile', protect, c.profile);
module.exports = router;
