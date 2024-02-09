import { Model, DataTypes, Sequelize, QueryTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface RecipeLikeAttributes {
  id: number;
  userId: number;
  recipeId: number;
}

type RecipeLikeCreationAttributes = Optional<RecipeLikeAttributes, 'id'>;

class RecipeLike extends Model<RecipeLikeAttributes, RecipeLikeCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare recipeId: number;
}
RecipeLike.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id'
    },
  },
}, {
  sequelize,
  modelName: 'recipeLike',
}
);

export { RecipeLike };
