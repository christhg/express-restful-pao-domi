/*
使用連接池 pool
https://github.com/tediousjs/tedious-connection-pool
PS F:\Chris_Workshop\03-Nodejs> npm install tedious-connection-pool --save
*/
var Request = require('tedious').Request;
var pool = require('./connPool').pool;

//acquire a connection
pool.acquire(function (err, connection) {
    if (err) {
        console.error(err);
        return;
    }

    //use the connection as normal
    var request = new Request('select top(100) * from record', function(err, rowCount) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('rowCount: ' + rowCount);
        connection.release(); //Release the connect back to the pool to be used again
    });

    var result = [];  //結果集
    request.on('row', function(columns) {
      var obj = {}  
      columns.forEach( function(column) {
        if(column.value !== null){
         var key = column.metadata.colName
         var val = column.value
          obj[key] = val
        }
      });
      result.push(obj)
      console.dir(result)
    })

    // request.on('row', function(columns) {
    //     console.log('value: ' + columns[1].value);
    // });

    request.on('done', function ( rowCount, more, rows) {
      console.dir(result)
      return result
    })
    connection.execSql(request);
});


//When you are finished with the pool, you can drain it (close all connections).
//當不須要pool時,清空連接池的所有connections
//pool.drain();

