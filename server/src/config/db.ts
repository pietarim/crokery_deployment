const { Sequelize } = require('sequelize');
import config from './config';

export const sequelize = new Sequelize(config.databaseUrl);