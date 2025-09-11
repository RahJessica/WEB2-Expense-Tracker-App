const { Expense } = require('../models'); 

exports.createExpense = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);          
    console.log("REQ.BODY:", req.body); 

    const { amount, description, type, date, startDate, endDate, categoryId } = req.body;

    const expense = await Expense.create({
      amount,
      description,
      type: type || 'one-time',
      date: type === 'one-time' ? date || null : null,
      startDate: type === 'recurring' ? startDate || null : null,
      endDate: type === 'recurring' ? endDate || null : null,
      categoryId: categoryId || null,
      userId: req.user.id
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    await expense.update(req.body);
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    await expense.destroy();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
