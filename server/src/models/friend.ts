import { Model, DataTypes, Sequelize, QueryTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface FriendAtributes {
  user_id1: number;
  user_id2: number;
}

class Friend extends Model {
  declare user_id1: number;
  declare user_id2: number;
}

Friend.init({
  user_id1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  user_id2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  sequelize,
  modelName: 'friend',
  timestamps: false
});

export { Friend };