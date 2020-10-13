const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  port: 1434,
  dialect: 'mssql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  sync: { force: false },
  //isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  // SQLite only
  //storage: 'path/to/database.sqlite',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});