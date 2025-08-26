const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController.js');
const { authenticate } = require('../middlewares/authentification.js');

router.use(authenticate);

router.get('/', getDashboard);

module.exports = router;