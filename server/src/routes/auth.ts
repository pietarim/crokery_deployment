import express from 'express';
import { userExtractor } from '../middleware/userExtractor';
import { registerUser, login, getAccessToken, logout } from '../controllers/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', userExtractor, logout);
router.get('/access-token', getAccessToken);

export default router;