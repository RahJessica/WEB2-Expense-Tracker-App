const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/new', createExpense);         
router.get('/expenses', getExpenses);                
router.put('/edit/:id', updateExpense);     
router.delete('/delete/:id', deleteExpense);

module.exports = router;