var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); //啟用日誌 HTTP request logger middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors'); 

//var index = require('./routes/index');
//var users = require('./routes/users');


var app = express();
app.use(cors()); //啟用跨域查詢
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//啟用日誌
app.use(bodyParser.json());//用于处理 JSON, Raw, Text 和 URL 编码的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
app.use(express.static(path.join(__dirname, 'public')));//设置静态文件路径
app.use('/api/ui/',express.static(path.join(__dirname, 'dist')));//设置静态文件路径

//app.use('/', index);
//app.use('/users', users);
//註冊統一路由
var routes = require('./routes/index');// import route
routes(app);//register route
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
});

module.exports = app;
