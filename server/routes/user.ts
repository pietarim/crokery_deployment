import express from 'express';
import { createUser, getUsersController, updateUser } from '../controllers/user';

const router = express.Router();

router.post('/', async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});
router.put('/:id', updateUser);
router.get('/', getUsersController);

export default router;