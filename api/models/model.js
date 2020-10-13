const conn = require('./db2/Connection')
const db = require('./db2/Database').connect(conn.Pool1)
const db2 = require('./db2/DbContext').dbContextDeer

exports.define = (tableNameOrSql) => {
  return db.defineModel(tableNameOrSql);
}

exports.dbContext = () => {
  return db;
}