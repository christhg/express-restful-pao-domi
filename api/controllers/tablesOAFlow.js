const db = require('../models/db2/DbContext').dbContextOAFlow
const table = db.defineTable();

exports.filterAll = table.filterAll
exports.findAllByKey = table.findAllByKey
exports.add = table.add
exports.del = table.del
exports.update = table.update


