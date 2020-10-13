//const employeeController = require('../api/controllers/employees');
//const recordsController = require('../controllers/recordsController')
module.exports = function(app){
      // 分发模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现
      //var user = require('../service/users');
      //app.use('/user',user);
      // 文章编辑及查看路由模块
      //var post = require('../service/post');
      //app.use('/post',post);
      // 1.路由模式
      //app.route('/api/employees')
      //  .get(employeeController.listAll)
      //  .post(employeeController.create); 
      //
      //app.route('/api/employees/:id')
      //.get(employeeController.findId)
      //.put(employeeController.updateId);  
      //
      //app.route('/api/man/:manNo')
      //.get(employeeController.findManinfo)
      //
      //app.route('/api/records/:manNo/:startDate')
      //.get(recordsController.findRecordsInfo)

      //app.route('/api/records/:manNo/:time')   
      //.get(recordsController.findRecordsInfo2)     
      
      // 2.分发模式
      
      //00.登陸路由

      //00.配置版本號
      const basepath = "/v1/api"

      //00.登陸路由
      const loginRoute = require('../api/routes/login_users');
      app.use(basepath +'/users', loginRoute);     
      const loginRoute2 = require('../api/routes/login_mano');
      app.use(basepath +'/manno', loginRoute2);    

      //01.通用路由----------------------------------------------------
      //CRM數據庫
      const tablesRoute = require('../api/routes/tables_domi');
      app.use(basepath +'/domi/tables', tablesRoute);
      //PUSB數據庫
      // const tablesRouteSoly = require('../api/routes/tables_pus');
      // app.use(basepath +'/pus/tables', tablesRouteSoly);  
      //Overtime數據庫
      //const tablesRoute2 = require('../api/routes/tables_overtime');
      //app.use(basepath +'/ot/tables', tablesRoute2)
      //OAFlow數據庫
      // const tablesRouteOAFlow = require('../api/routes/tablesOAFlow');
      // app.use(basepath +'/flow/tables', tablesRouteOAFlow)

      //02.客制路由------------------------------------------------------
      const recordsRoute = require('../api/routes/records');
      app.use(basepath +'/records', recordsRoute);

      const mansRoute = require('../api/routes/mans');
      app.use(basepath +'/mans', mansRoute);

      const attendsRoute = require('../api/routes/attends');
      app.use(basepath +'/attends', attendsRoute); 

      const overtimelistRoute = require('../api/routes/overtimelist');
      app.use(basepath +'/overtimelist',overtimelistRoute);

      const employeeRoute = require('../api/routes/employees');
      app.use(basepath +'/employees', employeeRoute); 

      //獲取當前服務器時間路由
      const TimeRoute = require('../api/routes/times');
      app.use(basepath + '/times',TimeRoute);
};
