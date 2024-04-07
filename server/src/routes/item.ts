import express from 'express';
import { addItem, getAllItems, updateItem } from '../controllers/item';

const router = express.Router();

router.post('/', async (_req, res, next) => {
  await addItem(_req, res, next);
});

router.get('/', async (_req, res, next) => {
  await getAllItems(_req, res, next);
});

router.put('/:id', async (_req, res, next) => {
  await updateItem(_req, res, next);
});

export default router;