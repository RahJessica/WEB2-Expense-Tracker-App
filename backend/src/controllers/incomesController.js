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
    const incomes = await Income.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'amount', 'description', 'date'], 
      order: [['date', 'DESC']]
    });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const income = await Income.findByPk(incomeId);
    if (!income) return res.status(404).json({ error: 'Income not found' });

    if (income.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: not your income' });
    }

    await income.destroy();
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const { amount, description, categoryId, date } = req.body;

    const income = await Income.findByPk(incomeId);
    if (!income) return res.status(404).json({ error: 'Income not found' });

    if (income.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: not your income' });
    }

    const updates = {};
    if (amount !== undefined) updates.amount = amount;
    if (description !== undefined) updates.description = description;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (date !== undefined) updates.date = date;

    await income.update(updates);

    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};