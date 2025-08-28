const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Receipt = sequelize.define('Receipt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: {
      max: 5 * 1024 * 1024,   //5Mb
    }
  },
  expenseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
}

})

module.exports = Receipt;
