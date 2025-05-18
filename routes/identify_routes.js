const express = require('express');
const router = express.Router();
const { identifyContact } = require('../controllers/identify_controller');

router.post('/identify', identifyContact);

module.exports = router;