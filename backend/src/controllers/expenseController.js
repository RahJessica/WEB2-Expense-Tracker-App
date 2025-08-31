const { Expense } = require('../models/index.js');

exports.createExpense = async (req, res) => {
  try {
    const { amount, description, type, date, startDate, endDate, categoryId } = req.body;

    const expense = await Expense.create({
      amount,
      description,
      type: type || "one-time",
      date: type === "one-time" ? date : null,
      startDate: type === "recurring" ? startDate : null,
      endDate: type === "recurring" ? endDate : null,
      categoryId,
      userId: req.user.id
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'amount', 'description', 'type', 'date', 'startDate', 'endDate', 'categoryId'],
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    if (expense.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    const { amount, description, type, date, startDate, endDate, categoryId } = req.body;
    await expense.update({
      amount: amount ?? expense.amount,
      description: description ?? expense.description,
      type: type ?? expense.type,
      date: type === "one-time" ? date : expense.date,
      startDate: type === "recurring" ? startDate : expense.startDate,
      endDate: type === "recurring" ? endDate : expense.endDate,
      categoryId: categoryId ?? expense.categoryId
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    if (expense.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    await expense.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};