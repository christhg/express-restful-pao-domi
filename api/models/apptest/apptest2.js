/*
* 測試使用http擷取http資料
*/
const http = require('http')
// 用于请求的选项
var options = {
   host: '192.168.201.120',
   port: '3000',
   path: '/v1/api/records/deer/D79298/2018-05-01/2018-05-21'  
};
 
// 处理响应的回调函数
var callback = function(response){
   // 不断更新数据
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // 数据接收完成
      console.log(body);
   });
}
// 向服务端发送请求
for(var i=0;i<50;i++){
    let req = http.request(options, callback);
    req.end();
}