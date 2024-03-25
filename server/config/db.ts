const { Sequelize } = require('sequelize');
import config from '../config/config';

export const sequelize = new Sequelize(config.databaseUrl);