const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, deleteCategory } = require('../controllers/categoriesController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.post('/', createCategory);         
router.get('/', getCategories);           
router.get('/:id', getCategoryById);     
router.delete('/:id', deleteCategory);    

module.exports = router;