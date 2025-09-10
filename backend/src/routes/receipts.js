const express = require('express');
const router = express.Router();
const { createReceipt, getReceipts, deleteReceipt } = require('../controllers/receiptsController.js');
const { authenticate } = require('../middlewares/authentification.js');
const upload = require('../middlewares/upload.js'); 

router.use(authenticate);

router.post('/new', upload.single('file'), createReceipt);    
router.get('/', getReceipts);             
router.delete('/:id', deleteReceipt);     

module.exports = router;