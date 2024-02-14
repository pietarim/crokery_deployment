import { Sequelize } from 'sequelize';
import { items } from '../seeders/items';
import { Item } from "../models";
import config from '../config/config';

const sequelize = new Sequelize(config.databaseUrl, {});

const seedProductionItems = async () => {
  try {
    await sequelize.authenticate();
    await Item.bulkCreate(items);
    console.log('Items seeded');
  } catch (error) {
    console.error('Unable to seed items:', error);
  }
};

seedProductionItems();