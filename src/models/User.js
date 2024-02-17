import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { min: 3 }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { min: 8 }
  }
}, { timestamps: true });

export default User;
