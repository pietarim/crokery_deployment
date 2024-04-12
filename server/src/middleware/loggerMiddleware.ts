import { Response, NextFunction } from 'express';

export const loggerMiddleware = (req, res: Response, next: NextFunction) => {
  console.log(`Request Method: ${req.method}, Endpoint: ${req.path}`);
  if (req.body && Object.keys(req.body).length !== 0) {
    if (req.body.password) {
      const bodyWithoutPassword = { ...req.body, password: '*****' };
      console.log('Request Body:', bodyWithoutPassword);
    } else {
      console.log('Request Body:', req.body);
    }
  } else {
    console.log('Request Body: None');
  } if (req.file) {
    console.log('Request File:', req.file);
  }
  next();
};