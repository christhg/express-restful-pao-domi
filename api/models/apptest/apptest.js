const db1 = require('../db2/DbContext').dbContext1

db1.findAll('man',{
    select: 'manno',
    where: 'manno=@manno',
    params: {
        manno: 'D00012'
    }      
}).then(result=>{
    console.log(result);
}).catch( err => {
    console.error(err);
})

db1.querySqlPage('record',{
    where: 'cardno=@cardno',
    params: {
        cardno: '55201'
    },
    orderColumns: 'time'
}).then(result => {
    console.log(result);
}).catch( err => {
    console.error(err);
})

// db2.findAll('overtimebill',{
//     where: 'pkid=@pkid',
//     params: {
//         pkid: 1
//     }      
// }).then(result=>{
//     //console.log('overtimebill')
//     console.log(result);
// }).catch( err => {
//     console.error(err);
// })

// db2.exist('select * from overtimebill where pkid=1',{})
// .then( result => {
//     console.log(result)
// }).catch( err => {
//     console.error(err);
// })

// db1.changeDatabase('Overtime').then( db => {
//     //console.log(result)
//     db.findAll('overtimebill',{
//         where: 'pkid=@pkid',
//         params: {
//             pkid: 1
//         }      
//     }).then(res =>{
//         //console.log('overtimebill')
//         console.log(res);
//     }).catch( err => {
//         console.error(err);
//     })
// }).catch(err => {
//     console.log(err)
// })

// db1.findAll('overtimebill',{
//     where: 'pkid=@pkid',
//     params: {
//         pkid: 1
//     }      
// }).then(result=>{
//     console.log('overtimebill')
//     console.log(result);
// })


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
//         //console.log('man')
//         console.log(result);
//     })  
//     //02.
//     // db2.findAll('overtimebill',{
//     //     where: 'pkid=@pkid',
//     //     params: {
//     //         pkid: 1
//     //     }      
//     // }).then(result=>{
//     //     console.log('overtimebill')
//     //     console.log(result);
//     // })
// }