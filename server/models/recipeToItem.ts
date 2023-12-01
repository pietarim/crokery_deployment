import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface RecipeToItemAttributes {
  id: number;
  recipeId: number;
  itemId: number;
  amount: string;
}

type RecipeToItemCreationAttributes = Optional<RecipeToItemAttributes, 'id'>;

class RecipeToItem extends Model<RecipeToItemAttributes, RecipeToItemCreationAttributes> {
  declare id: number;
  declare recipeId: number;
  declare itemId: number;
  declare amount: string;
}
RecipeToItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id'
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'incredients',
      key: 'id'
    },
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'recipeToItem',
});

export { RecipeToItem };