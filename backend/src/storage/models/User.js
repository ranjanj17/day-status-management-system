"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserModel = exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class User extends sequelize_1.Model {
    id;
    email;
    password_hash;
    created_at;
    updated_at;
}
exports.User = User;
const initUserModel = () => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
exports.initUserModel = initUserModel;
//# sourceMappingURL=User.js.map