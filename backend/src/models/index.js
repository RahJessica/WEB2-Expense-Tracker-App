const sequelize=require("../db")
const User=require("./User")
const Income=require("./Income")
const Category=require("./Category")
const Receipt=require("./Receipt")
const Expense=require("./Expense")

//user-income
User.hasMany(Income, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', 
});
Income.belongsTo(User, { foreignKey: 'userId' });

//user-expense
User.hasMany(Expense, { 
  foreignKey: 'userId', 
  onDelete: 'CASCADE' 
});
Expense.belongsTo(User, { foreignKey: 'userId' });

//category-expense
Category.hasMany(Expense, { 
  foreignKey: 'categoryId',
  onDelete: 'RESTRICT' 
});
Expense.belongsTo(Category, { foreignKey: 'categoryId' });

//receipt-expense
Receipt.belongsTo(Expense, { 
  foreignKey: 'expenseId', 
  onDelete: 'CASCADE' 
});
Expense.hasOne(Receipt, { foreignKey: 'expenseId' });

//user-receipt
User.hasMany(Receipt, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Receipt.belongsTo(User, { foreignKey: 'userId' });

//category-income
Category.hasMany(Income, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',  
  onUpdate: 'CASCADE'
});
Income.belongsTo(Category, { foreignKey: 'categoryId' });


module.exports={
    sequelize,
    User,
    Income,
    Receipt,
    Category, 
    Expense
}