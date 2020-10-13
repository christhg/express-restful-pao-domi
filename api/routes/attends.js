const express = require('express');
const router = express.Router();
const AttendsController = require('../controllers/attends');


router.post('/',AttendsController.findAll);


module.exports = router;

