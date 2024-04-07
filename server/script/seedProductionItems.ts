import { Sequelize } from 'sequelize';
import { items } from '../seeders/items';
import { Item } from "../src/models";
import config from '../src/config/config';

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