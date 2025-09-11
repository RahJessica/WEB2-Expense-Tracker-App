const sequelize = require('../db');
const User = require('./User');
const Income = require('./Incomes');
const Category = require('./Category');
const Receipt = require('./Receipt');
const Expense = require('./Expense'); 

User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Expense, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
Expense.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Income,
  Receipt,
  Category,
  Expense
};