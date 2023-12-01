import { Model, DataTypes, Sequelize, QueryTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface RecipeAttributes {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  imageUri?: string;
  global: boolean;
}

type RecipeCreationAttributes = Optional<RecipeAttributes, 'id'>;

class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public ownerId!: number;
  public global!: boolean;
  public imageUri?: string;
}
Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(1000)
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    },
  },
  imageUri: {
    type: DataTypes.TEXT
  },
  global: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'recipe',
}
);

export { Recipe };