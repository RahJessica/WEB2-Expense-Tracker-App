const { Income, Receipt, Category } = require('../models/index.js');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    const { categoryId } = req.query; 

    const incomeWhere = { userId: req.user.id };
    const expenseWhere = { userId: req.user.id };

    if (categoryId) {
      incomeWhere.categoryId = categoryId;
      expenseWhere.categoryId = categoryId;
    }

    const totalIncome = await Income.sum('amount', { where: incomeWhere }) || 0;
    const totalExpenses = await Receipt.sum('amount', { where: expenseWhere }) || 0;
    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      filter: categoryId ? `Category ${categoryId}` : "All categories"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};