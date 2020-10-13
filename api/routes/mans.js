const express = require('express');
const router = express.Router();
const MansController = require('../controllers/mans');
const ensureToken = require('../middleware/ensure-token') //驗證token


//router.get('/', ensureToken, MansController.findAll)
router.get('/', MansController.findAll)
router.get('/:id', MansController.findMansById)  //:id 可以是工號or姓名or部門
router.get('/name/:name', MansController.findByName) //:name 模糊查詢,可以是工號or姓名or部門

module.exports = router;

