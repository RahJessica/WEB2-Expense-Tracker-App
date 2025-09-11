const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { createReceipt, getReceipts, deleteReceipt, downloadReceipt } = require('../controllers/receiptsController.js');
const { authenticate } = require('../middlewares/authentification.js');

const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.use(authenticate); 

router.post('/new', upload.single('file'), createReceipt);    
router.get('/', getReceipts);             
router.delete('/:id', deleteReceipt);    
router.get('/download/:id', downloadReceipt);

module.exports = router;