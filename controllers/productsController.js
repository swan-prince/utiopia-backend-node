const express = require('express');
const conn = require('../config/db');
const auth = require('../config/auth')
const router = express.Router();

router.route('/specific')
    .get(auth,(req,res) => {

    });

module.exports = router;