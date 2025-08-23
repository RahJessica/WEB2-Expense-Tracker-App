const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Receipt = sequelize.define('Receipt', {
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
  userId: {                 // Clé étrangère vers User
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {             // Clé étrangère vers Category
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'Receipts',
  timestamps: true,
});

module.exports = Receipt;
