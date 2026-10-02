import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
  declare id: number;
  declare email: string;
  declare password_hash: string;
  declare created_at: Date;
  declare updated_at: Date;
}

export const initUserModel = () => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
