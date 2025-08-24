const { Income } = require('../models/index.js');

exports.createIncome = async (req, res) => {
  try {
    const { amount, description, categoryId } = req.body;

    const income = await Income.create({
      amount,
      description,
      categoryId,
      userId: req.user.id
    });

    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { userId: req.user.id } });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};