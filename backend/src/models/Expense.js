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
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    createAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }, 
    updateAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

}, {
  tableName: 'expenses',

  validate: {
    validateDates() {
      if (this.type === 'one-time') {
        if (!this.date) {
          throw new Error('One-time expenses must have a date.');
        }
        if (this.startDate || this.endDate) {
          throw new Error('One-time expenses cannot have startDate or endDate.');
        }
      }

      if (this.type === 'recurring') {
        if (!this.startDate) {
          throw new Error('Recurring expenses must have a startDate.');
        }
        if (this.date) {
          throw new Error('Recurring expenses cannot have a one-time date.');
        }
        if (this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
          throw new Error('End date cannot be before start date.');
        }
      }
    }
  }
});

module.exports = Expense;

