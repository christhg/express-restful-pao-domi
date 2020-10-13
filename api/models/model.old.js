const conn = require('./db2/Connection')
const db = require('./db2/Database').connect(conn.Pool1)

//原先是定義此模型為表單模型，不允許SQL語句
// function isTable(tableOrSql){
//   var t = tableOrSql.split(" ");
//   if(t.length >1){
//      throw new Error('you define the table of model,but the table is invalid,invalid object name:' + this.query)
//   }
// }
function Model(tableOrSql) {
    this.query = tableOrSql;// 定義此查詢為table or sql    
    this.rawQuery = db.querySql// 定義使用原生查詢方式
    this.findAll = (options) => {
      //isTable(this.query) --允許SQL語句...方便定義模型時,可以使用SQL創建VIEW,再去查詢
      return db.findAll(this.query, options)       
    } 
    //this.executeAdd = db.executeAdd;
    // this.executeDel = db.executeDel;
    // this.executeUpdate = db.executeUpdate;
    // this.executeFilterSql = db.executeFilterSql;
    // this.executeTransactions = db.executeTransactions;
    // this.executeProc = db.executeProc      
}
Model.prototype = {
  getName: function(){ //所有对象实例都共享
      return this.query; 
  }
}
exports.define = (tableName) => {
  return new Model(tableName)
}
