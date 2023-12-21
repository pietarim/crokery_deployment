import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface ErrorWithMessage extends Error { // replace Error with right type
  message: string;
}

export const errorHandler: ErrorRequestHandler = (error: ErrorWithMessage, _req: Request, res: Response, next: NextFunction) => {
  console.log('error handler opened');
  console.log(error.message);
  if (error.message === 'Saving recipe failed') {
    return res.status(500).json({
      error: 'Saving recipe failed',
    });
  }
  if (error.message === '404') {
    return res.status(404).json({
      error: 'Not found',
    });
  }
  if (error.message === 'jwt expired' || error.message === 'jwt malformed') {
    return res.status(401).json(error.message);
  }
  if (error.message === '401') {
    return res.status(401).json({
      error: 'invalid token',
    });
  } return res.status(500).json({
    error: 'Something went wrong',
  });
  next(error);
};