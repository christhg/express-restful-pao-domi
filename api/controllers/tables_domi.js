//const tables = require("../models/dbContext1");
const db = require('../models/db2/DbContext').dbContext1
const tables = db.defineTable();

module.exports = tables;

// //通用filter查詢方式
// exports.filterAll = (req,res) => {    
//     let tableName = req.params.tableName;
//     let options = {
//         select: req.query.select,
//         filter: req.query.filter,
//         top: req.query.top,
//         skip: req.query.skip,
//         orderby: req.query.orderby,
//     } 
//     let params = req.body||'';
//     // let sql = tables.setFilterSql(tableName, options);
//     // res.json(sql); 
  
//     tables.executeFilterSql(tableName, options, params).then( result =>{
//         res.json(result)
//     }).catch(err => {
//         res.status(500).json(err)
//     }) 

// }
// //查詢表資料by key
// exports.findAllByKey = (req,res) => {
//     let tableName = req.params.tableName;
//     let key = req.params.key||'';
//     let value = req.params.value||'';
//     let where = '';
//     if(key != '') 
//         where = key+'=@key'
//     //let sql = 'select * from vi_hr_emps'
//     tables.findAll(tableName, {
//         where: where,
//         params: {
//             key: value
//         }
//     }).then(result => {
//         res.json(result)
//     }).catch(err => {
//         res.status(500).json(err)
//     }) 

//     // **返回sql語句-------------------
//     // res.json({
//     //     sql: tables.setQuerySql(opt) 
//     // })    
// }
// //新增
// exports.add = (req,res) => {
//     let tableName = req.params.tableName;
//     let options = {
//         output: req.query.output,       //返回主鍵值欄位  output=id
//         params: req.body                //新建資料 {ip:"x.x.x.x",coding:3,....}
//     }

//     tables.executeAdd(tableName, options).then(result=>{
//         res.status(201).json(result)
//     }).catch(err => {
//         res.status(500).json(err)
//     }) 


//     //let sql = tables.setAddSql(options)
//     //res.json(sql)

//     // tables.executeTransaction([sql]).then(result=>{
//     //     res.json(result)
//     // })


// }
// //刪除
// exports.del = (req,res) => {
//     let tableName = req.params.tableName;    
//     let options = {
//         batch: req.query.batch,
//         params: req.body      //刪除條件 { id:'a,b,c...'}
//     }
    
//     // let sql = tables.setDelSql(options)
//     // res.json(sql)

//     tables.executeDel(tableName, options).then(result => {
//         res.json(result)
//     }).catch(err => {
//         res.status(500).json(err)
//     }) 
// }
// //更新
// exports.update = (req,res) => {
//     let tableName = req.params.tableName;
//     let options = {
//         where: req.query.filter,     //條件
//         params: req.body                //更新資料
//     }
//     // let sql = tables.setUpdateSql(options)
//     // res.json(sql)
//     tables.executeUpdate(tableName, options).then( result => {
//         console.log(result)
//         res.json(result)
//     }).catch(err => {
//         res.status(500).json(err)
//     }) 
// }



