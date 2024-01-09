const express = require('express');
const router = express.Router();

const {
    sendEmail,
    onRegisterEmail,
} = require('../controllers/emailController');

router.post('/send', sendEmail);
router.post('/registerToConf', onRegisterEmail)
module.exports = router;