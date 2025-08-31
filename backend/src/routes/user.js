const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/usersController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.post('/new', createUser);
router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);

router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router;