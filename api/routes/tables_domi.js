//定義domitory數據庫的通用路由
const express = require('express');
const router = express.Router();
const TablesController = require('../controllers/tables_domi');
const ensureToken = require('../middleware/ensure-token') //驗證

router.get('/:tableName',TablesController.filterAll);
router.get('/:tableName/:value/:key',TablesController.findAllByKey);

router.post('/:tableName',TablesController.add);
router.put('/:tableName', ensureToken, TablesController.update);
router.delete('/:tableName', ensureToken, TablesController.del);

module.exports = router;    