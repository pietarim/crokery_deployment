import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export const getImageByName = async (name: string) => {
};

const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, 'images');
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const imageFilter = (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');

export const getImage = async (_req, res: Response) => {

  const imageExtensions = ['.png', '.jpg', '.jpeg'];

  const { name } = _req.params;
  for (const extension of imageExtensions) {
    const imagePath = path.join(__dirname, `../../images/${name}${extension}`);
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
      return;
    }
  }
  res.status(404).send({ error: 'Image not found' });
};

export const uploadImageController = async (req, res: Response, next: NextFunction) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(new Error('Multer error'));
    } else if (err) {
      return next(new Error('Something went wrong'));
    } if (req.file) {
      res.status(201).send({ imageUri: req.file.filename });
    } else {
      return next(new Error('Something went wrong'));
    }
  });
};

export const removeImage = async (name: string) => {
  const imagePath = path.join(__dirname, `../../images/${name}.png`);
  fs.unlink(imagePath, (err) => {
    if (err) {
      throw new Error('Something went wrong');
    }
  });
};