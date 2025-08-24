const sequelize=require("../db")
const User=require("./User")
const Income=require("./Incomes")
const Category=require("./Category")
const Receipt=require("./Receipt")

User.hasMany(Income, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', 
});
Income.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Receipt, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Receipt.belongsTo(User, { foreignKey: 'userId' });


Category.hasMany(Income, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',  
  onUpdate: 'CASCADE'
});
Income.belongsTo(Category, { foreignKey: 'categoryId' });


Category.hasMany(Receipt, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',  
  onUpdate: 'CASCADE'
});
Receipt.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports={
    sequelize,
    User,
    Income,
    Receipt,
    Category
}