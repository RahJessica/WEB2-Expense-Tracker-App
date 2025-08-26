const express = require('express');
const router = express.Router();
const { createIncome, getIncomes, deleteIncome } = require('../controllers/incomesController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/new', createIncome);
router.get('/', getIncomes);
router.delete('/delete/:id', deleteIncome);

module.exports = router;