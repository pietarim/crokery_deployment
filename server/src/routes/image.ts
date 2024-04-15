import express from 'express';
import { userExtractor } from '../middleware/userExtractor';
import { uploadImageController, getImage } from '../controllers/image';
import bodyParser from 'body-parser';

const router = express.Router();

router.get('/:name', getImage);

router.post('/', userExtractor, bodyParser.raw({ limit: "10mb", type: "image/*" }), uploadImageController);

export default router;