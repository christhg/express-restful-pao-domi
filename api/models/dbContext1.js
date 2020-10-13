//數據庫DbContext:連接到DeerHRDB
//const conn = require('./db2/Connection')
//const db = require('./db2/Database').connect(conn.Pool1)
const db = require('./db2/DbContext').dbContext1

exports.defineModel = db.defineModel

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



