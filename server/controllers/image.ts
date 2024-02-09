import multer from 'multer';
import { Request, Response } from 'express';
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

const imageFilter = (_req: Request, file: any, cb: any) => {
  if (!file.originalname.match(/\.(png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');

export const getImage = async (_req: Request, res: Response) => {

  const imageExtensions = ['.png', '.jpg', '.jpeg'];

  const { name } = _req.params;
  for (const extension of imageExtensions) {
    const imagePath = path.join(__dirname, `../images/${name}${extension}`);
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
      return;
    }
  }
  res.status(404).send({ error: 'Image not found' });
};

export const uploadImageController = async (req: Request, res: Response) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      throw new Error('Multer error');
    } else if (err) {
      throw new Error('Something went wrong');
    } if (req.file) {
      res.status(201).send({ imageUri: req.file.filename });
    } else {
      throw new Error('Something went wrong');
    }
  });
};

export const removeImage = async (name: string) => {
  const imagePath = path.join(__dirname, `../images/${name}.png`);
  fs.unlink(imagePath, (err) => {
    if (err) {
      throw new Error('Something went wrong');
    }
  });
};