/*
使用連接池 pool
https://github.com/tediousjs/tedious-connection-pool

installation:
PS F:\Chris_Workshop\03-Nodejs> npm install tedious-connection-pool --save

Description
The only difference from the regular tedious API is how the connection is obtained and released. 
Rather than creating a connection and then closing it when finished, acquire a connection from the pool 
and release it when finished. Releasing resets the connection and makes in available for another use.
Once the Tedious Connection object has been acquired, the tedious API can be used with the connection as normal.
*/
var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 10,
    log: true
};

var connectionConfig = {
    userName: 'sa',
    password: 'sa',
    server: '192.168.201.120',
    options: { database: 'DeerHRDB' } 
};

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error(err);
});

//export方法1:
//exports.pool = pool;

//export方法2:
module.exports = {
    pool:pool
}