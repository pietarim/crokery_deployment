import express from 'express';
import { createUser, getUsersController, updateUser } from '../controllers/user';

const router = express.Router();

router.post('/', createUser);
router.put('/:id', updateUser);
router.get('/', getUsersController);

export default router;