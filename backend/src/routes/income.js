const express = require('express');
const router = express.Router();
const { createIncome, getIncomes, deleteIncome, updateIncome } = require('../controllers/incomesController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/new', createIncome);
router.get('/incomes', getIncomes);
router.delete('/delete/:id', deleteIncome);
router.put('/:id', updateIncome);

module.exports = router;