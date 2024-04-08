require('express-async-errors');
/* import dotenv from 'dotenv';
dotenv.config(); */
require('dotenv').config();
import express from 'express';
import config from './config/config';
import { userRouter, recipeRouter, itemRouter, imageRouter, authRouter } from './routes';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import cookieParser from 'cookie-parser';
import path from 'path';

const { Sequelize } = require('sequelize');

const app = express();
const port = config.port;

app.use(cookieParser());

const buildPath = path.join(__dirname, '/dist');
app.use(express.static(buildPath));

const sequelize = new Sequelize(config.databaseUrl, {});

const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

const allowedOrigins = config.allowedCorsOrigins;

app.use(loggerMiddleware);

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
});
