const express = require('express');
const router = express.Router();
const { createIncome, getIncomes } = require('../controllers/incomesController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/', createIncome);
router.get('/', getIncomes);

module.exports = router;