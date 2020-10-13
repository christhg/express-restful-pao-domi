const express = require('express');
const router = express.Router();
const EmployeesController = require('../controllers/employees');
const ensureToken = require('../middleware/ensure-token') //驗證token

router.get('/', EmployeesController.listAll)
router.get('/:id', EmployeesController.findId)
router.get('/maninfo/:manNo', EmployeesController.findManinfo)
router.post('/', ensureToken, EmployeesController.create)

module.exports = router;