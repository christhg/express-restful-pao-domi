//配置數據庫連線
let config = {
    user: 'sa',
    password: 'Seng1234',  
    server: '192.168.2.20',  
    database: 'PUS',
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