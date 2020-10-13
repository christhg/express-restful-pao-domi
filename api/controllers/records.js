
/*
* 刷卡紀錄表
* 1.使用post方法紀錄卡號,刷卡時間


*/
const records = require("../models/records");

exports.findRecordsInfoDeer = function(req, res) {
    //方法2: async/await
    var obj = req.params;
    records.findRecordsInfoDeer(obj.manNo, obj.time1, obj.time2).then(result => {
        res.json(result)
     }).catch( err => {
         console.log(err)
        res.status(500).json(err)        
    });
 };

 exports.findRecordsInfoSoly = function(req, res) {
    //方法2: async/await
    var obj = req.params;
    records.findRecordsInfoSoly(obj.manNo, obj.time1, obj.time2).then(result => {
        res.json(result)
     }).catch( err => {
         console.log(err)
        res.status(500).json(err)        
    });
 };

exports.findRecordsInfo2 = function(req, res) {
    //方法2: async/await
    var obj = req.params;
    records.findRecordsInfo2(obj.manNo, obj.time).then(result => {
        res.json(result)
     }).catch( err => {
         console.log(err)
        res.status(500).json(err)        
    });
 };

exports.findRecordsInfo = function(req, res) {
     //方法1: then
     var obj = req.params;
     records.findRecordsInfo(obj.startDate,obj.manNo).then(result => {
        res.json(result)
     }).catch( err => {
        res.status(500).json(err)
    });
}

exports.getCustomersByTags = function(req, res) {
    //方法1: then
    var obj = req.params;
    records.findRecordsInfo(obj.Tag1,obj.Tag2).then(result => {
       res.json(result)
    }).catch( err => {
       res.status(500).json(err)
   });
}

exports.add = function(req, res) {
    const record = {
        manNo: req.body.manNo,
        time: req.body.time
    }
    records.add(record).then(result => {
        result.message = 'record was created'
        res.status(201).json(result)
     }).catch( err => {
        res.status(500).json(err)
    }); 
}

