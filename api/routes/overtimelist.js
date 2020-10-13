const express = require('express');
const router = express.Router();
const TablesController = require('../controllers/tables_overtime');


router.get('/:billnum',TablesController.findOvertimeItem);
//獲取加班單明細
router.get('/list/:manno',TablesController.findOvertimeItemByManno)
//獲取待審加班單清單
router.get('/waitinglist/:time1/:time2',TablesController.findWaitingList)


module.exports = router;

