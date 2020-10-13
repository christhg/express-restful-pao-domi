//數據庫DbContext:連接到Overtime
//const conn = require('./db2/Connection')
//const db = require('./db2/Database').connect(conn.Pool2)
const db = require('./db2/DbContext').dbContext2

exports.setAddSql = db.setAddSql
exports.setDelSql = db.setDelSql
exports.setUpdateSql = db.setUpdateSql
exports.setFilterSql = db.setFilterSql

exports.executeAdd =  db.executeAdd
exports.executeDel = db.executeDel
exports.executeUpdate = db.executeUpdate
exports.executeFilterSql = db.executeFilterSql

exports.executeTransactions = db.executeTransactions
exports.executeProc = db.executeProc

exports.count = db.count
exports.findAll = db.findAll
exports.querySql = db.querySql 



