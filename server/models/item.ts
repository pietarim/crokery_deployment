import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export enum ItemCategory {
  Meat = 'meat',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Dairy = 'dairy',
  Grain = 'grain',
  Other = 'other',
  Spice = 'spice',
  Premade = 'premade',
  FrozenPremade = 'frozen premade',
  Candy = 'candy',
  Sauce = 'sauce',
  Fish = 'fish',
  Seafood = 'seafood',
  Baking = 'baking',
  Ice_cream = 'ice cream',
}

/* const ItemTypeValues = [
  'meat', 'vegetable', 'spice', 'other', 'rice',
  'premade', 'frozen_premade', 'candy', 'sauce',
  'fish', 'seafood', 'dairy', 'fruit', 'baking',
  'ice cream', 'grain'
] as const; */

const ItemTypeValues = Object.values(ItemCategory);

export type ItemType = `${ItemCategory}`;

interface ItemAttributes {
  id: number;
  name: string;
  type: ItemType;
  unitSize: number;
  brand: string;
  price: number;
  pricePerUnit: number;
}

type ItemCreationAttributes = Optional<ItemAttributes, 'id'>;

class Item extends Model<ItemAttributes, ItemCreationAttributes> {
  declare id: number;
  declare name: string;
  declare type: ItemType;
  declare unitSize: number;
  declare brand: string;
  declare price: number;
  declare pricePerUnit: number;
}
Item.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM,
    values: ItemTypeValues,
    allowNull: false
  },
  unitSize: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  brand: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL
  }

}, {
  sequelize,
  modelName: 'item',
});

export { Item };