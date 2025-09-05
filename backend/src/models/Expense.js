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
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW, 
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    userId: {                 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {             
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'expenses',
  timestamps: true,
  validate: {
    validateDates() {
      if (this.type === 'one-time' && this.endDate) {
        throw new Error('One-time expenses cannot have an endDate.');
      }
      if (this.type === 'recurring') {
        if (this.endDate && new Date(this.endDate) < new Date(this.date)) {
        throw new Error('End date cannot be before the start date.');
        }
      }
    }
  },
 
});

module.exports = Expense;

