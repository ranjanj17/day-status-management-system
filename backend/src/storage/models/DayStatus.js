"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateModels = exports.initDayStatusModel = exports.DayStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
const User_1 = require("./User");
class DayStatus extends sequelize_1.Model {
    id;
    date; // Stored as YYYY-MM-DD
    status;
    created_by;
    created_at;
    updated_at;
}
exports.DayStatus = DayStatus;
const initDayStatusModel = () => {
    DayStatus.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            unique: true, // Unique constraint on date
        },
        status: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        created_by: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'day_statuses',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
exports.initDayStatusModel = initDayStatusModel;
const associateModels = () => {
    User_1.User.hasMany(DayStatus, { foreignKey: 'created_by' });
    DayStatus.belongsTo(User_1.User, { foreignKey: 'created_by' });
};
exports.associateModels = associateModels;
//# sourceMappingURL=DayStatus.js.map