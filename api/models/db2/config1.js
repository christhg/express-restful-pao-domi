//配置數據庫連線
let config = {
    user: 'sa',
    password: 'SqlDevOps2017',  
    server: '192.168.71.153',  
    //-----------------------------------------------------------------
    // user: 'sa',
    // password: 'SqlDevOps2017',  
    // server: 'mssql2017e', //若使用容器,這裡配置容器名稱即可解析到
    //-----------------------------------------------------------------
    database: 'domitory',
    port: 1433,
    options: {
        encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        min: 5,  //連接池...初始連接5個connect
        max: 30,
        idleTimeoutMillis: 30000
    }
};

module.exports = config;