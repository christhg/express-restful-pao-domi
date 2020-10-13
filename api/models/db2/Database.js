//配置不同數據庫Use [database];
const mssql = require('mssql');
const moment = require('moment');
const _ = require('lodash');
const async = require('async');

//建立數據庫連線with連接池,
function Database(pool) {
    this._pool = pool;
    // let database = ''
    // async用于定义一个异步函数，该函数返回一个Promise。
    // 有問題??
    // this.changeDatabase = async (databaseName) => {
    //     let db = this
    //     let sql ='SELECT Name FROM Master..SysDatabases WHERE Name=@Name'
    //     let params = {
    //         Name: databaseName
    //     }
    //     let result = await this.exist(sql, params)
    //     if(result){
    //         this.querySql('USE '+databaseName,{})
    //         //console.log('change database to: '+databaseName)
    //         //this.database = databaseName
    //         return Promise.resolve(db);
    //     }
    //     else{
    //         //console.error('no database: '+databaseName)
    //         return Promise.reject('no database name:'+ databaseName)
    //         //throw new Error('no database name:'+ databaseName)
    //     }
    // }

    // 關閉連接池pool....有問題?? _pool.close is not a function
    // this.close = async () => {
    //     try {
    //         if(this._pool)
    //         {
    //             await this._pool;
    //             this._pool.parent.close();;//释放连接，将连接放回池中
    //             console.log(this._pool);
    //         }
    //     }
    //     catch (err) {
    //         console.error(err.message);
    //     }        
    // }
    //---------------------------------------------------------------------------



    /****************************************************************/
    /** sql语句查询
    ** @param {String} 查詢sql语句中使用参数a=@a,b=@b
    ** @param {Object} 字段参数，如 { a:value1,b:value2 }
    */
    this.querySql = async (sqls, params) => {
      const conn = await this._pool; // ensures that the pool has been created 
      console.log('DB:' + conn.config.database);
      console.log('SQL -> '+ sqls ); //+' -> '+ moment().format());
      const ps = await new mssql.PreparedStatement(conn);
      if (params !='') {
          for (let index in params) {
              if (typeof params[index] == 'number') {
                  ps.input(index, mssql.Int);
              } else if (typeof params[index] == 'string') {
                  ps.input(index, mssql.NVarChar);
              } else if (typeof params[index] == 'boolean')
                  ps.input(index, mssql.Bit)            
          }
      }

      let ret = {
            error: null,
            rows: [],
            rowSize: 0,
            affected: 0,
          // total: tot.size
            //If you're performing `INSERT`, `UPDATE` or `DELETE` in a query, 
            //you can read number of affected rows. 
            //The `rowsAffected` variable is an array of numbers. 
            //Each number represents number of affected rows by a single statement.          
      };

      return  new Promise(function(resolve,reject){
        ps.prepare(sqls, function (err) {
              if (err){
                  ret.error = err;
                  resolve(ret);
              }
              else{
                ps.execute(params, function (err, result) {
                    //console.log(ret.rows+'===='+JSON.stringify(record.recordset))
                    if(err){
                        ret.error = err;
                        reject(ret)
                    }
                    else{
                      ps.unprepare(function (err) {
                          if (err){
                              ret.error = err;
                              console.dir(err) 
                              reject(ret)
                          }
                          else{
                              if(result.recordset)
                                  ret.rows = result.recordset
                              if(result.recordsets[0])
                                  ret.rowSize = result.recordsets[0].length
                              ret.affected = result.rowsAffected
                              console.log('OK -> '+ moment().format())                
                              resolve(ret)
                          }       
                      });
                    }
                });
              }
        });
      });
    };

    //查詢結果是否存在一筆紀錄
    this.exist = async (sqls, params) => {
        var ret = await this.querySql(sqls, params);
        if(ret.rows.length >0 )
            return true
        else
            return false
    }

    /**查询所有数据(不分頁，默認1000條數據)
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.select, 需要显示列用","分隔，默认为*所有；
    ** options.top,限制查詢的條數TOP(pageSize),默認pageSize=1000
    ** options.where,条件sql ,如 a=@a and b=@b  不要用Order by 和group by 
    ** options.params,條件参数與where搭配,如 @a and @b。
    */
    this.findAll = (tableName, options) => {
      //var tableName = options.tableName;//也可以是sql語句        
      var select = options.select||'*';    
      var top = options.top||'1000';
      var where = options.where||'';
      var orderby = options.orderby||'';
      var params = options.params||'';
      
      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B';
      //---------------------------------------------------------------  
      var sql = 'SELECT TOP(' +top+ ') ' +select+' FROM ' + tableName ;
      if(where != ''){
            sql += ' WHERE ' + where;
          }
          
      //02.判斷排序
      if(orderby != ''){
        sql = sql + ' ORDER BY '+orderby
      }          
      var ret = this.querySql(sql, params);
          return ret; 
    }

    /**统计行数 
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.where,条件sql ,如 a=@a and b=@b  不要用Order by 和group by 
    ** options.params,條件参数與where搭配,如 @a and @b。
    */
    this.count = async (tableName, options) => {
      //var tableName = options.tableName;//也可以是sql語句
      var where = options.where||'';
      var params = options.params||'';

      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B';
      //---------------------------------------------------------------       
      var sql = 'SELECT COUNT(1) AS size FROM ' + tableName;
      if(where!=''){
          sql += ' WHERE ' + where;
      }
      var ret = this.querySql(sql,params);
      //ret.rows = ret.rows[0].size;
      return ret; 
    }

    /**分頁查詢 
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.where,*条件sql ,如 a=@a and b=@b  ,不要用Order by 和group by 
    ** options.params,條件参数化與where搭配,如 @a and @b。  
    ** options.index, 查询第几页
    ** options.pageSize, 每页显示数
    ** options.displayColumns, 需要显示列用","分隔，默认为*所有；
    ** options.orderColumns,需要排序order的列用","分隔，"必须有一列"
    */
    this.querySqlPage = async (tableName, options) => {
      var where = options.where||''; 
      var params = options.params||'';           
      var index = options.index||1;
      var pageSize = options.pageSize||20;
      var displayColumns = options.displayColumns||'*';
      var orderColumns = options.orderColumns;
        
      //00.判斷options的參數
        if(tableName == '')
            throw new Error('tableName is not defined')
        if(where == '')
            throw new Error('options.where is not defined')
        if(params == '')
            throw new Error('options.params is not defined')
        if(orderColumns == '')
            throw new Error('options.orderColumns is not defined')

      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B';           
      var sql = 'SELECT TOP('+pageSize+') '+displayColumns+' FROM (SELECT ROW_NUMBER() OVER (ORDER BY ' + orderColumns + ') AS RowNumber,* FROM ' + tableName;
          if(where!=''){
            sql += ' WHERE ' + where;
          }
          sql += ') AS A WHERE RowNumber > '+pageSize+'*('+index+'-1) ';
          var ret = await this.querySql(sql,params);
          return ret;
    }

    //=============================================================================
    /**返回Total條數查詢SQL語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.select,查詢欄位
    ** options.filter,查詢條件
    */
    this.setFilterTotalSql = (tableName, options) => {
      //var tableName = options.tableName||'';
      var select = options.select||'*';
      var filter = options.filter||'';//filter array[]  
      var where = '';
      if(filter != ''){       
          filter = filter.replace(/ eq /g,'=')
          filter = filter.replace(/ gt /g,'>')
          filter = filter.replace(/ lt /g,'<')
          filter = filter.replace(/ ge /g,'>=')
          filter = filter.replace(/ le /g,'<=')
          filter = filter.replace(/ ne /g,'!=')
          filter = filter.replace(/!/g,'%')
          where = filter
      }
      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B';     
      var sql = 'SELECT ' +select+' FROM ' + tableName;
      if(where != ''){
            sql += ' WHERE ' + where;
      } 
      return 'SELECT COUNT(1) AS size FROM ('+ sql +') AS A';      
    }

    /**返回查詢SQL語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.displayColumns,查詢欄位
    ** options.pageSize,查詢筆數
    ** options.where,查詢條件
    */
    this.setQuerySql = (tableName, options) => {
      //var tableName = options.tableName;    
      var select = options.displayColumns||'*';
      var top = options.top||'1000';
      var where = options.where||'';
      //00.
      if(tableName == '')
          throw new Error('tableName is not defined')
      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B';     
      var sql = 'SELECT TOP(' +top+ ') ' +select+' FROM ' + tableName;
      if(where != ''){
            sql += ' WHERE ' + where;
      }
      return sql;
    }

    /**返回添加的SQL語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,添加表
    ** options.output,設定返回的主鍵值,可為空    
    ** options.params,插入的數值{ column:value } 
    */
    this.setAddSql = (tableName, options) => {
      //let tableName = options.tableName
      let output = options.output||'';      
      let params = options.params||'';
      //00.
      if(tableName == '')
          throw new Error('options.tableName is not defined')
      if(params == '')
          throw new Error('options.params is not defined')      
      //01.判斷是表名orSQL語句
      if(!isTable(tableName)){
        throw new Error('the table is invalid,invalid object name:' + tableName)
      }
      var sql = 'INSERT INTO ' + tableName + '(';
      var val = '';

      if (params != '') {
          // for (var index in params) {
          //     sql += index + ',';
          //     if(typeof params[index] == 'number') {
          //         val += params[index] + ','
          //     }
          //     if(typeof params[index] == 'string') {
          //         val += '\'' + params[index]+ '\'' + ','
          //     }            
          // }
          for (var index in params) {
              sql += index + ',';
              val += '@'+index + ','
          }     
          if( output == ''){
              sql = sql.substring(0, sql.length - 1) + ') VALUES(';
          }else{
              sql = sql.substring(0, sql.length - 1) + ') OUTPUT INSERTED.' +output+' VALUES(';
          }      
          sql = sql+val.substring(0, val.length - 1) + ')';
          return sql;
      }
      return sql;
    }

    /**返回刪除的SQL語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,刪除表
    ** options.params,刪除的條件{ id:'a,b,c...'}
    ** options.patch,是否批次刪除,預設0=false,1=true
    ** options.id,批量刪除的主鍵,必須同時與vals存在(可選,目前不使用)
    ** options.vals,批量刪除的主鍵值vals='aaa','bbb'(可選,目前不使用) 
    */
    this.setDelSql = (tableName, options) => {
      //var tableName = options.tableName||'';
      var params = options.params||'';
      var batch = options.batch||0;
      //00.
      if(tableName == '')
          throw new Error('options.tableName is not defined')
      if(params == '')
          throw new Error('options.params|req.body is not defined')    
      //01.判斷是表名orSQL語句
      if(!isTable(tableName)){
        throw new Error('the table is invalid,invalid object name:' + tableName)
      }
      var sql = 'DELETE FROM ' + tableName;
      let where = [];
      let whereSql='';
      if ( batch == 0 ) {
          for (var index in params) {
              if(typeof params[index] == 'number') {
                  //where.push(index +'='+ params[index]);
                  where.push(index +'=@'+ index);
              }
              if(typeof params[index] == 'string') {
                  //where.push(index +'=\''+ params[index]+'\'');
                  where.push(index +'=@'+ index);
              }            
          }
          whereSql = where.join(' AND ')
          sql += ' WHERE ' + whereSql;
          return sql;                   
      }else{
          for (var index in params) {
              let arr = params[index].split(',')
              let w = ''
              if(arr.length>0){
                    arr.forEach((item)=>{
                        w += '\''+item +'\','
                    })
                    w = _.trimEnd(w,',')
                    //console.log(_.trimEnd(w,','))
                    sql += ' WHERE ' +index+ ' IN ('+ w +')'                  
              }else{
                    if(typeof params[index] == 'string')
                        sql += ' WHERE ' +index+ ' IN (\''+ params[index] +'\')'
                    if(typeof params[index] == 'number')
                        sql += ' WHERE ' +index+ ' IN ('+ params[index] +')'
              }
          } 
      }
      return sql;    
    }

    /**返回更新的SQL語句
    ** @param {String} tableName, @param {Object} options
    ** tableName,更新表
    ** options.where,設定更新的條件
    ** options.params,刪除的條件{ key:val }
    */
    this.setUpdateSql = (tableName, options) => {
      //let tableName = options.tableName||'';
      let where = options.where||'';
      let params = options.params||'';
      //
      if(tableName == '')
          throw new Error('options.tableName is not defined')
      if(where == '')
          throw new Error('options.where|req.query.filter is not defined')
      if(params == '')
          throw new Error('options.params|req.body is not defined')
      //01.判斷是表名orSQL語句
      if(!isTable(tableName)){
        throw new Error('the table is invalid,invalid object name:' + tableName)
      }          
      var sql = 'UPDATE ' + tableName + ' SET ';
      if (params != '') {
          for (var index in params) {
              var d=where.indexOf('@'+index);
              if(d==-1)
              {
                  sql += index + '=@'+index+ ',';	
              }            
          }
          sql = sql.substring(0, sql.length - 1);
          if(where!='')
          {
              sql += ' WHERE ' + where;
          }
          return sql; 
      }
      return sql;
    }

    //------------------------------------------------------------------------------------
    /**返回SQL查詢語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,查询的表名(or查詢sql語句)
    ** options.select,查詢欄位column預設是*
    ** options.filter,查詢的過濾條件,邏輯判斷使用eq,gt,lt,ge,le..模糊查詢使用'!ABC!',Ex: age eq 20 and name like '!chris!'
    ** options.top,查詢頁容量pageSize,預設是1000
    ** options.skip,查詢頁次pageIndex
    ** options.orderby,排序
    */
    this.setFilterSql = (tableName, options) => {
      //var tableName = options.tableName||'';
      var select = options.select||'*';
      var filter = options.filter||'';//filter array[]    
      var top = options.top||'1000';//預設1000筆
      var skip = options.skip||'';    
      var orderby = options.orderby||'';

      //00.
      // if(tableName == '')
      //     throw new Error('options.tableName is not defined')
      // if(filter == '')
      //     throw new Error('options.filter is not defined')
      //01.判斷是表名orSQL語句
      tableName = isTable(tableName) ? tableName : '('+tableName+') as B'; 
      //02.判斷WHERE條件
      var where = ''
      if(filter != ''){       
          filter = filter.replace(/ eq /g,'=')
          filter = filter.replace(/ gt /g,'>')
          filter = filter.replace(/ lt /g,'<')
          filter = filter.replace(/ ge /g,'>=')
          filter = filter.replace(/ le /g,'<=')
          filter = filter.replace(/ ne /g,'!=')
          filter = filter.replace(/!/g,'%')
          where = filter
      }
      //03.預設的SELECT語句
      var sql = 'SELECT TOP(' +top+ ') ' +select+' FROM ' + tableName;
      if(where != ''){
            sql += ' WHERE ' + where;
      }
      //04.判斷排序
      if(orderby != ''){
          sql = sql + ' ORDER BY '+orderby
      }
      //05.判斷分頁>> top+skip+orderby
        //方法1....適用於SQL2008以下(包含2008)
          if(top != '' && skip != '' && orderby != ''){
                if(skip <=1 )
                    skip = 1
                var sql = 'SELECT TOP('+top+') '+select+' FROM(SELECT ROW_NUMBER() OVER (ORDER BY ' + orderby + ') AS RowNumber,* FROM ' + tableName;
                if(where!=''){
                    sql += ' WHERE ' + where;
                }
                sql += ') AS A WHERE RowNumber > '+top+'*('+skip+'-1)';        
          }    
        //方法2....適用於SQL2008以上(不包含2008) >> 應該效率最好
        // if(top != '' && skip != '' && orderby != ''){
        //         if(skip <=1 )
        //             skip = 1          
        //         var sql = 'SELECT ' +select+' FROM ' + tableName;
        //         if(where != ''){
        //             sql += ' WHERE ' + where;
        //         }
        //         if(orderby != ''){
        //             sql = sql + ' ORDER BY '+orderby
        //         }
        //         sql = sql + ' offset ' +top+'*('+skip+'-1)' + ' ROWS FETCH NEXT ' +top+ ' ROWS only'
        // }        
        //06.返回SQL查詢語句
        return sql;    
    }

    //=============================================================================================================================
    /**執行Total條數SQL語句 
    ** @param {String} tableName, @param {Object} options, @param {Object} params
    ** tableName,查询的表名(or查詢sql語句)     
    ** options.select,查詢欄位
    ** options.filter,查詢條件
    ** params,查詢條件參數化
    */
    this.executeFilterTotal = async (tableName, options, params) => {       
      let conn = await this._pool;
      let sql = this.setFilterTotalSql(tableName, options); 
      let ret = {
          error: null,
          size:''
      };
      return new Promise(function (resolve, reject) {
          try {
              const request = new mssql.Request(conn)
              //request.input('input_parameter', sql.Int, value)
              if (params != "") {
                  //Add an input parameter to the prepared statement.
                  for (var index in params) {
                      if (typeof params[index] == "number") {
                          request.input(index, mssql.Int, params[index]);
                      } else if (typeof params[index] == "string") {
                          request.input(index, mssql.NVarChar, params[index]);
                      }
                  }
              }
              request.query(sql, (err, result) => {
                  if (err) {
                      ret.error = err
                      reject(err)
                  } else {
                      if(result.recordset)        
                          ret.size = result.recordset[0].size      
                      resolve(ret)
                  }
              })
          } catch (err) {
             //console.log(err)
             reject(err)
          }
      }); 
    }

    /**執行filter查詢語句+Total條數 
    ** @param {String} tableName, @param {Object} options, @param {Object} params
    ** tableName,查询的表名(or查詢sql語句)
    ** options.select,查詢欄位column預設是*
    ** options.filter,查詢的過濾條件,邏輯判斷使用eq,gt,lt,ge,le..模糊查詢使用'@ABC@',Ex: age eq 20 and name like '@chris@'
    ** options.top,查詢頁容量pageSize,預設是1000
    ** options.skip,查詢頁次pageIndex
    ** params,查詢條件參數化 
    */
    this.executeFilterSql = async (tableName, options, params) => {
      var sql = this.setFilterSql(tableName, options);
      var total = await this.executeFilterTotal(tableName, options, params);
      var ret = await this.querySql(sql, params);
          ret.total = total.size
      return ret;
    }

    /**執行新增的語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,新增表
    ** options.params,插入的數值{ key:value } 
    ** options.output,設定返回的主鍵值
    */
   this.executeAdd = async (tableName, options) => {
    let sql = this.setAddSql(tableName, options)
    var ret = this.querySql(sql, options.params);
        return ret;   
    }

    /**執行刪除的語句 
     ** @param {String} tableName, @param {Object} options
    ** tableName,刪除表
    ** options.params,刪除的條件{ id:'a,b,c...'}
    ** options.patch,是否批次刪除,預設0=false,1=true
    ** options.id,批量刪除的主鍵,必須同時與vals存在(可選,目前不使用)
    ** options.vals,批量刪除的主鍵值vals='aaa','bbb'(可選,目前不使用) 
    */
    this.executeDel = async (tableName, options) => {
        let sql = this.setDelSql(tableName, options)
        var ret = this.querySql(sql, options.params);
            return ret;   
    }    

    /**執行更新語句 
    ** @param {String} tableName, @param {Object} options
    ** tableName,更新表
    ** options.where,設定更新的條件
    ** options.params,刪除的條件{ key:val }
    */
    this.executeUpdate = async (tableName, options) => {
      let sql = this.setUpdateSql(tableName, options);
      var ret = this.querySql(sql, options.params);
          return ret;   
    }

    /**存儲過程 
    ** @param {String} procName, @param {Object} options
    ** procName, 程序名稱
    ** options.paramsIn, 參數Input ex: { SalesName: Value}
    ** options.paramsOut, 參數Output ex: { SalesYTD: 'mssql.Money'}
    ** Return code value, 代表意思
    ** 0	Successful execution.
    ** 1	Required parameter value is not specified.
    ** 2	Specified parameter value is not valid.
    ** 3	Error has occurred getting sales value.
    ** 4	NULL sales value found for the salesperson.
    */
    this.executeProc = async function (procName, options) {
      let conn = await this._pool;
      var procName = procName||'';
      var paramsIn = options.paramsIn||'';
      var paramsOut = options.paramsOut;
      if(procName == '')
          throw new Error('options.procName is not defined')
      if(paramsIn == '')
          throw new Error('options.paramsIn is not defined')    

      let ret = {
          error: null,
          rows: [],
          rowSize: 0,
          output: {},
          returnValue: 0
      };
      return new Promise(function (resolve, reject) {
          try {
              const request = new mssql.Request(conn)
              //request.input('input_parameter', sql.Int, value)
              if (paramsIn != "") {
                  //Add an input parameter to the prepared statement.
                  for (var index in paramsIn) {
                      if (typeof paramsIn[index] == "number") {
                          request.input(index, mssql.Int, paramsIn[index]);
                      } else if (typeof paramsIn[index] == "string") {
                          request.input(index, mssql.NVarChar, paramsIn[index]);
                      }
                  }
              }
              //request.output('output_parameter', sql.Int)
              if (paramsOut != "") {
                  //Add an input parameter to the prepared statement.
                  for (var index in paramsOut) {
                      request.output(index, paramsIn[index]);
                  }
              }
              // request.input('SalesPerson',mssql.NVarChar,'Blythe')
              // request.output('SalesYTD',mssql.Money)
              request.execute(procName, (err, result) => {
                  if (err) {
                      ret.err = err
                      //console.log(err)
                      reject(err)
                  } else {
                      if(result.recordset)
                          ret.rows = result.recordset
                      if(result.recordsets[0])
                          ret.rowSize = result.recordsets[0].length
                      ret.returnValue = result.returnValue
                      ret.output = result.output                    
                      resolve(ret)
                  }
              })
          } catch (err) {
              console.log(err)
              reject(err)
          }
      });
    };

    /**事務交易 
    ** @param {[sql1,sql2,...]} sqls
    ** sqls, 查詢語法集合[sql1,sql2,...]
    */
    this.executeTransactions = async (sqls) => {
      let conn = await this._pool;
      var transaction = new mssql.Transaction(conn);
      let ret = {
          error: null,
          rows: [],
          rowSize: 0,
          affected: 0
      };
      return new Promise(function (resolve, reject) {       
          transaction.begin(function(err) {
              if (err) {
                  //return console.error('Error in transaction begin', err);
                  ret.error = err
                  reject(ret)
              }    
              var request = new mssql.Request(transaction);
              var queryTasks = setUpMultipleQueries(sqls, request);  /*HERE IS THE MAGIC*/    
              async.series(queryTasks, (err, results) => {
                  // results is now equal to: {q0: [{a: 1}], q1: [{b: 2}]}
                  if (err) {
                      //console.error('Error in queries, rolling back', err);
                      ret.error = err
                      reject(ret)
                      return transaction.rollback();
                  }
                  transaction.commit(function(err) {
                      if (err) {
                          //return console.error('Error in commit', err);
                          ret.error = err
                          reject(ret)
                      }
                      console.log("Transaction commited.");
                      //console.log(results);
                      let rets = []
                      for(index in results){
                          //console.log(results[index])
                          rett = Object.assign({},ret)
                          rett.error = null
                          if(results[index].recordset)
                              rett.rows = results[index].recordset
                          if(results[index].recordsets[0])
                              rett.rowSize = results[index].recordsets[0].length
                          rett.affected = results[index].rowsAffected    
                          //console.log(rett)                   
                          rets.push(rett)
                      }
                      resolve(rets)
                  });
              });
          });   
      }) 
    }

    //多語句查詢函數
    function setUpMultipleQueries(listQuery, request){
      var requestObject= {};
      listQuery.forEach(function(query, index){
          //console.log(index);
          requestObject['q'+index] = function(callback){
                request.query(query, callback);
          };
      });
      return requestObject;
    };

    // /**
    // 定義數據庫.....目前有問題??? remark
    //  */
    // this.defineDb = async (database) => {
    //     let db = this
    //     db._pool = await this._pool
    //     db._pool.config.database = database;
    //     console.log(pool.config)
    //     return db;
    // }

    //---------------------------------------------------------------
    /**定義數據模型 
    ** @param {String} tableOrSql
    ** tableOrSql, 表or視圖or查詢語句
    */    
    this.defineModel = (tableOrSql) => {
        let db = this
        return new Model(tableOrSql, db)
    }

    /**定義express通用控制器表CRUD handle
    ** @param {} none
    ** 沒有參數,返回通用控制器的table處理CRUD handle
    */     
    this.defineTable = () => {
        let db = this
        return new Table(db)
    }
}

//建立數據庫模型with new Database().................................
function Model(tableOrSql, db) {
    this.query = tableOrSql;// 定義此查詢為table or view or sql    
    this.dbContext = db;// 數據庫上下文
    
    // this.getName = () => {
    //     return query;
    // }
    // this.getDbContext = () => {
    //     return dbContext;
    // }
    this.findAll = (options) => {
      return db.findAll(this.query, options)       
    } 
    this.executeFilterSql  = (options, params) => {
        return db.executeFilterSql(this.query, options, params)       
    }  
    let arr = _.split(this.query,' ')
    //console.log(arr.length)
    if(arr.length > 1){   
        this.executeAdd = (options) => {
            return db.executeAdd(this.query, options)       
        } 
        this.executeDel = (options) => {
            return db.executeDel(this.query,options)
        }
        this.executeUpdate = (options) => {
            return db.executeUpdate(this.query, options)
        }
    }

    //模型Model原型
    if(typeof this.getName !== 'function')
    {
      Model.prototype.getName = function()
      {
      	return this.query;
      }
    }   
    //模型Model原型
    if(typeof this.getDbContext !== 'function')
    {
      Model.prototype.getDbContext = function()
      {
      	return this.dbContext;
      }
    }          
}

//模型Table Model原型
// Model.prototype = {
//   getName: function(){ //所有对象实例都共享
//       return this.getName()
//   },
//   getDbContext: function(){
//       return this.getDbContext()
//   }
// } 

//判斷是表名orSQL語句
function isTable(tableName){
    let t = tableName.split(" ");
    if(t.length >1){
       return false
    }else{
        return true
    }
}
//建立controller通用表的路由
function Table(dbContext){
    //通用filter查詢方式
    this.filterAll = (req, res) => {
        let tableName = req.params.tableName;
        let options = {
            select: req.query.select,
            filter: req.query.filter,
            top: req.query.top,
            skip: req.query.skip,
            orderby: req.query.orderby,
        } 
        let params = req.body||'';
    
        dbContext.executeFilterSql(tableName, options, params).then( result =>{
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        })    
    }
    //查詢表資料by key
    this.findAllByKey = (req, res) => {
        let tableName = req.params.tableName;
        let key = req.params.key||'';
        let value = req.params.value||'';
        let where = '';
        if(key != '') 
            where = key+'=@key'
        //let sql = 'select * from vi_hr_emps'
        dbContext.findAll(tableName, {
            where: where,
            params: {
                key: value
            }
        }).then(result => {
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        })   
    }
    //新增
    this.add = (req, res) => {
        let tableName = req.params.tableName; 
        let params = req.body||'';
        console.log(params);

        if( params == ''){
            //不能正确解析json 格式的post参数
            var body = '', jsonStr;
            req.on('data', function (chunk) {
                body += chunk; //读取参数流转化为字符串
            });
            req.on('end', function () {
                //读取参数流结束后将转化的body字符串解析成 JSON 格式
                try {
                    jsonStr = JSON.parse(body);
                } catch (err) {
                    jsonStr = null;
                }
                jsonStr ? params = jsonStr : params = null;
            });
        }

        let options = {
            output: req.query.output,       //返回主鍵值欄位  output=id
            params: params                //新建資料 {ip:"x.x.x.x",coding:3,....}
        }

        dbContext.executeAdd(tableName, options).then(result=>{
            res.status(201).json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }
    //刪除
    this.del = (req, res) => {
        let tableName = req.params.tableName;    
        let options = {
            batch: req.query.batch,
            params: req.body      //刪除條件 { id:'a,b,c...'}
        }    
        // let sql = tables.setDelSql(options)
        // res.json(sql)
        dbContext.executeDel(tableName, options).then(result => {
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }
    //更新
    this.update = (req, res) => {
        let tableName = req.params.tableName;
        let options = {
            where: req.query.filter,     //條件
            params: req.body                //更新資料
        }
        // let sql = tables.setUpdateSql(options)
        // res.json(sql)
        dbContext.executeUpdate(tableName, options).then( result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }       
}
//單一連接connection释放数据库连接到数据....
async function doRelease(connection) {
    try {
        if(connection)
        {
            await connection.close();//释放连接，将连接放回池中
        }
    }
    catch (err) {
        console.error(err.message);
    }
}

//------------------------------------------------------------------------------------------
//匯出

exports.connect = (pool) => {
  return new Database(pool);
}
