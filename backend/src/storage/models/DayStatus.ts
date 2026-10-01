import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';

export class DayStatus extends Model {
  public id!: number;
  public date!: string; // Stored as YYYY-MM-DD
  public status!: string;
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export const initDayStatusModel = () => {
  DayStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true, // Unique constraint on date
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'day_statuses',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};

export const associateModels = () => {
  User.hasMany(DayStatus, { foreignKey: 'created_by' });
  DayStatus.belongsTo(User, { foreignKey: 'created_by' });
};
