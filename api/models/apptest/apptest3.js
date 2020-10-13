/*
* 測試使用fetch擷取http資料
*/
const fetch = require('node-fetch');

//使用fetch擷取http資料
for(var i=0;i<100;i++){
   setTimeout(function() {
   fetch('http://192.168.201.120:3000/v1/api/records/deer/D79298/2018-05-19/2018-05-21')
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err));
   }, 500*i);
}
    

////POST
// const body = { a: 1 };
 
// fetch('https://httpbin.org/post', {
//         method: 'post',
//         body:    JSON.stringify(body),
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => console.log(json));