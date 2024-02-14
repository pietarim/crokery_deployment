require('express-async-errors');
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import config from './config/config';
import { userRouter, recipeRouter, itemRouter, imageRouter, authRouter } from './routes';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import path from 'path';

const { Model, DataTypes, Sequelize, QueryTypes } = require('sequelize');

const app = express();
app.use(cookieParser());
const port = config.port;

const buildPath = path.join(__dirname, '/dist');
app.use(express.static(buildPath));

const sequelize = new Sequelize(config.databaseUrl, {});

const loggerMiddleware = (req: any, res: any, next: any) => {
  console.log(`Request Method: ${req.method}, Endpoint: ${req.path}`);
  if (req.body && Object.keys(req.body).length !== 0) {
    console.log('Request Body:', req.body);
  } else {
    console.log('Request Body: None');
  }
  next();
};

const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

const url = config.url;
console.log(`Tässä on url suoraan .env filestä: ${process.env.SERVER_URL}`);

const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:3001', 'http://localhost:5173', url, 'https://grocerylist.today'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Error: This origin is not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(loggerMiddleware);
app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/images', imageRouter);
app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/items', itemRouter);
app.use('/api/recipeLikes', recipeRouter);
app.use('/api/auth', authRouter);
app.use(errorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Tässä on url jos toimii: ${url}`);
});
