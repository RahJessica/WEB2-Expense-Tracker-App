const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {                 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {             
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'Incomes',
  timestamps: true,
});

module.exports = Income;
