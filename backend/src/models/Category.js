const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false       
  },
  description: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Category;
