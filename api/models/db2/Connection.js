// npm ls mssql 
// mssql@4.3.0
// 參考 https://gitee.com/xslasd/codes/52aqgyzk079dmxrsb83lh23
//***************************************************************************
//連接池
//连接池中的连接不需要关闭，连接池的作用就是存储可用的连接对象，
//从而下次用客户端连接上来，系统就不用花时间建立新的连接，
//而是直接从连接池中取出可用连接， 因为省去了创建新连接的时间，
//这样就极大的提高的系统的效率。
//***************************************************************************
const mssql = require('mssql');
const async = require('async');
//數據庫配置
const config1 = require('./config1')
//const config2 = require('./config2')


//連接池配置
const connPool1 = new mssql.ConnectionPool(config1).connect()
.then(pool => {
    console.log('Connected to mssql -> '+config1.server+':'+config1.database)
    return pool
  })
.catch(err => 
    console.log('Database Connection Failed! Network Error! ', err)
)
//
// const connPool2 = new mssql.ConnectionPool(config2).connect()
// .then(pool => {
//     console.log('Connected to mssql -> '+config2.server+':'+config2.database)
//     return pool
//   })
// .catch(err => 
//     console.log('Database Connection Failed! Network Error! ', err)
// );
//


// const connPool1 = new mssql.ConnectionPool(config1).connect(onError);
// const connPool2 = new mssql.ConnectionPool(config2).connect(onError);
//--------------------------------------------------------------------------
//onError()
// function onError(err){
//     if (err) {
//         console.log('mssql connect err:'+ err);
//     }else{
//         console.log('mssql init connect pool: ok ');
//     }
// }

//exports
// exports.Pool1 = connPool1;//數據庫1,連接池
// exports.Pool2 = connPool2;//數據庫2,連接池


module.exports = {
        Pool1:connPool1,
        //Pool2:connPool2,
};

