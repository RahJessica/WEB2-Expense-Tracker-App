const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Expense = sequelize.define('Expense',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
    description: {
        type: DataTypes.STRING,
    }, 
    type: {
        type: DataTypes.ENUM("one-time", "recurring"), 
        allowNull: false,
        defaultValue: "one-time", 
    },
    
} )