import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername, createUser, addRefreshtoken, getUserByRefreshToken, removeRefreshtoken } from '../query/user';
import { parseString } from '../config/utils';
import crypto from 'crypto';

interface RequestWithUser extends Request {
  user?: User;
}

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

const router = express.Router();

router.get('/me', (_req, res) => {
  res.send('hello');
});

const createRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user = {
    username: parseString(username),
    password: parseString(password),
  };
  console.log(user);
  const userFromDb = await getUserByUsername(user.username);
  if (!userFromDb) {
    throw new Error('invalid username or password');
  } else {
    const passwordCorrect = await bcrypt.compare(user.password, userFromDb.passwordHash);
    if (!passwordCorrect) {
      throw new Error('invalid username or password');
    }
    const userForToken = {
      username: userFromDb.username,
      id: userFromDb.id,
      email: userFromDb.email,
    };
    const refreshToken = createRefreshToken();
    addRefreshtoken(userFromDb.id, refreshToken);

    const token = jwt.sign(userForToken, process.env.SECRET as string, { expiresIn: '2m' });
    console.log('tämä refresh token tunkataan eteenpäin', refreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none'
    });
    res.status(200).send({ token, username: userFromDb.username, id: userFromDb.id });
  }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = {
    username: parseString(username),
    passwordHash,
    email: parseString(email),
    isAdmin: false,
  };
  const savedUser = await createUser(user);
  res.status(200).json(savedUser);
};

export const extractUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.get('authorization');
  if (token && token.toLowerCase().startsWith('bearer ')) {
    const planeToken = token.substring(7);
    const decodedToken = jwt.verify(planeToken, process.env.SECRET as string) as User | string | undefined;
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new Error('401');
    } else if (typeof decodedToken === 'object') {
      req.user = decodedToken as User;
    }
  }
};

export const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log('kysely');
  const refreshToken = req.cookies.refreshToken;
  console.log('getAccessToken opened getAccessToken opened getAccessToken opened getAccessToken opened ');
  console.log(refreshToken);
  const user = await getUserByRefreshToken(refreshToken);
  console.log(user);
  /* const user = await getUserByUsername(req.user?.username as string); */
  if (!user) {
    throw new Error('invalid token');
  } else {
    const userForToken = {
      username: user.username,
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(userForToken, process.env.SECRET as string, { expiresIn: '2m' });
    res.status(200).send({ token, username: user.username, id: user.id });
  }
};

export const logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new Error('401');
  }
  const userId = req.user.id;
  await removeRefreshtoken(userId);
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true });
  res.send('logged out');
};

export default router;