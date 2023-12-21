import express from 'express';
import path from 'path';
import { userExtractor } from '../middleware/userExtractor';
import { uploadImageController } from '../controllers/image';
import multer from 'multer';

const router = express.Router();

router.get('/:name', (_req, res) => {
  const { name } = _req.params;
  const imagePath = path.join(__dirname, `../images/${name}.png`); // TODO: handle different file types
  res.sendFile(imagePath);
});

/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});


const upload = multer({ storage: storage }); */

router.post('/', userExtractor, uploadImageController);

export default router;