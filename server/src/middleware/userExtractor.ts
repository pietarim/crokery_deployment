import express, { Request, Response, NextFunction } from 'express';
import { parseUser } from '../config/utils';
import { TokenUser } from '../types/types';
import jwt from 'jsonwebtoken';

interface RequestWithToken extends Request {
  user: TokenUser;
}

export const userExtractor = (req, res: Response, next: NextFunction) => {
  const authentication = req.get('authorization');
  if (authentication && authentication.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authentication.substring(7);
      const decodedToken = jwt.verify(token, process.env.SECRET as string);
      const reqWithUser = req as RequestWithToken;
      reqWithUser.user = parseUser(decodedToken);
      /* req.user = parseUser(decodedToken); */
      if (!reqWithUser.user) {
        return res.status(401).json({ error: 'token invalid' });
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ error: 'token missing or invalid' });
  }
};