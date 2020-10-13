const express = require('express');
const router = express.Router();
const RecordController = require('../controllers/records');

//router.get('/:manNo/:time',RecordController.findRecordsInfo2)

router.get('/deer/:manNo/:time1/:time2',RecordController.findRecordsInfoDeer)
router.get('/soly/:manNo/:time1/:time2',RecordController.findRecordsInfoSoly)

//router.post('/',RecordController.add)

module.exports = router;