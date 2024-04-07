import express from 'express';
import { userExtractor } from '../middleware/userExtractor';
import { uploadImageController, getImage } from '../controllers/image';

const router = express.Router();

router.get('/:name', getImage);

router.post('/', userExtractor, uploadImageController);

export default router;