//通用的表單orSQL的RESTful查詢方式
// const model = require('./model')
// const table1 = model.define('man')
// const table2 = model.define('view_OAMan')

//const connPool1 = require('./db2/dbConnect1');
//const connPool2 = require('./db2/dbConnect2');
//const db1 = require('./db2/Database').connect(connPool1);
//const db2 = require('./db2/Database').connect(connPool2);

const db1 = require('../db2/DbContext').dbContext1
const db2 = require('../db2/DbContext').dbContext2
const model1 = db1.defineModel('man')
const model2 = db1.defineModel('select * from view_OAMan')
const model3 = db2.defineModel('overtimebill')


console.log(model1.query);
console.log(model2.getName());
console.log(model3.getName());

// model1.findAll({
//     where: 'manno=@manno',
//     params: {
//         manno: 'D80077'
//     }        
// }).then( result => {
//     console.log('man');
//     console.log(model1.getName());
//     console.log(result);
//})

model3.findAll({
    where: "BillNum='OverTime-2009-04-0011'"
}).then(result=>{
    console.log('overtimebill');
    console.log(model3.getName());
    console.log(result);
})

// for(var i=0;i<50;i++){
//     //00.
//     console.log(i)
//     //01.
//     db1.findAll('man',{
//         select: 'manno',
//         where: 'manno=@manno',
//         params: {
//             manno: 'D00012'
//         }      
//     }).then(result=>{
//         console.log('man')
//         console.log(result);
//     })  
//     //02.
//     db2.findAll('overtimebill',{
//         where: 'pkid=@pkid',
//         params: {
//             pkid: 1
//         }      
//     }).then(result=>{
//         console.log('overtimebill')
//         console.log(result);
//     })
// }

  

// model2.findAll({
//     where: 'manno=@manno',
//     params: {
//         manno: 'D00012'
//     }      
// }).then( result =>{
//     console.log('view_OAMan');
//     console.log(model2.getName());
//     console.log(result);
// })




//
// var peopleDynamicProto = function(name,age,state){
//     this.name = name;
//     this.age = age;
//     this.state = state;
//     if(typeof this.print !== 'function')
//     {
//       peopleDynamicProto.prototype.print = function()
//       {
//       	console.log(this.name + this.age + this.state);
//       }
//     }
//   };

//   var p1 = new peopleDynamicProto('john',20,'newyou');
//   var p2 = new peopleDynamicProto('wendy',25,'la');

//   p1.print();
//   p2.print();
//   p1.print();

//   console.log(p1.hasOwnProperty('name'));