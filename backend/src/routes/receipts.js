const express = require('express');
const router = express.Router();
const { createReceipt, getReceipts, deleteReceipt } = require('../controllers/receiptsController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/new', createReceipt);       
router.get('/', getReceipts);             
router.delete('/:id', deleteReceipt);     
const upload = require('../middlewares/upload.js'); // <== importe multer
router.post('/new', upload.single('file'), createReceipt);  // <== ajoute upload.single('file')

module.exports = router;