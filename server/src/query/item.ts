import { Item } from '../models/item';
import { NewItem } from '../types/types';

export const getItems = async () => {
  const items = await Item.findAll({
    order: [
      ['type', 'ASC'],
      ['name', 'ASC']
    ],
    raw: true
  });
  return items;
};

export const createItem = async (item: NewItem) => {
  const savedItem = await Item.create(item);
  return savedItem;
};

export const updateItemQuery = async (item: NewItem, id: number) => {
  await Item.update(item, {
    where: {
      id
    }
  });
};