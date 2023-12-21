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

const upload = multer({ storage }).single('image');

export const uploadImageController = async (req: Request, res: Response) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      throw new Error('Multer error');
      /* res.status(500).send('Something went wrong'); */
    } else if (err) {
      console.log(err);
      /* res.status(500).send('Something went wrong'); */
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
}


/* export const addImageController = async (req: Request, res: Response) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../images');
    },
    filename: function (_req, file, cb) {
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage }).single('image');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      throw new Error('Multer error');
      res.status(500).send('Something went wrong');
    } else if (err) {
      console.log(err);
      res.status(500).send('Something went wrong');
      throw new Error('Something went wrong');
    } else {
      res.status(201).send('Image uploaded');
    }
  });
}; */
