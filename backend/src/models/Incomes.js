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
  source: {
    type: DataTypes.STRING,
    allowNull:false,
    defaultValue: 'unknown'
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
      references: {
        model: "Categories",
        key: "id"
      }
    }
}, {
  tableName: 'Incomes',
  timestamps: true,
});

module.exports = Income;
