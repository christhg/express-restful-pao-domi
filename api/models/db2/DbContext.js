//01.數據庫連結池
const connPool = require('./Connection')
//02.數據庫上下文

const dbContext1 = require('./Database').connect(connPool.Pool1)
//const dbContext2 = require('./Database').connect(connPool.Pool2)
//const dbContext3 = require('./Database').connect(connPool.Pool3)
//const dbContext4 = require('./Database').connect(connPool.Pool4)

//03.匯出dbContext
exports.dbContext1 = dbContext1
//exports.dbContext2 = dbContext2
//exports.dbContextOAFlow = dbContext3
//exports.dbContextDeer = dbContext1
//exports.dbContextSoly = dbContext4


