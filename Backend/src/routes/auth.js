import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', authController.register, (req, res) => {
  console.log('Đã vào register route');
  res.send('ok');
});
router.post('/login', authController.login);
router.get('/user', authMiddleware, authController.getUser);

export default router;
