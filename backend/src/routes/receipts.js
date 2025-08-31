const express = require('express');
const router = express.Router();
const { createReceipt, getReceipts, deleteReceipt } = require('../controllers/receiptsController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/new', createReceipt);       
router.get('/', getReceipts);             
router.delete('/:id', deleteReceipt);     

module.exports = router;