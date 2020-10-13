const db = require('../models/db2/DbContext').dbContext1
const table = db.defineTable();

exports.filterAll = table.filterAll
exports.findAllByKey = table.findAllByKey
exports.add = table.add
exports.del = table.del
exports.update = table.update

//----------------------------------------------------------------------
//引入model加班單
const overtimelist = require('../models/overtimelist');

//查詢待審清單
exports.findWaitingList = (req,res) => {
    let time1 = req.params.time1
    let time2 = req.params.time2
    overtimelist.findWaitingList(time1,time2).then(result => {
        res.json(result)
    })
}
//獲取加班單明細資料
exports.findOvertimeItem = (req,res) => {
    let billnum = req.params.billnum;
    overtimelist.findAllByBillNum(billnum).then(result=>{
        res.json(result)
    })
}
//獲取加班單明細資料by工號
exports.findOvertimeItemByManno = (req, res) => {
    let manno = req.params.manno
    overtimelist.findAllByManno(manno).then(result => {
        res.json(result)
    })
}


