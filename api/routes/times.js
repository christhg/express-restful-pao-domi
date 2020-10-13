const express = require('express');
const router = express.Router();
const onTime = require('../utils/ontime');

router.get('/', (req, res) => {
    var nowTime = onTime();
    console.log('time: ' + nowTime)
    res.json({"now":nowTime});
 })

module.exports = router;

