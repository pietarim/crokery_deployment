import { Model, DataTypes, Sequelize, QueryTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  refreshToken?: string | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare refreshToken: string | null;
  declare isAdmin: boolean;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user',
});

export { User };