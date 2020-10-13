const employees = require("../models/employees");

exports.listAll = function(req, res) {
    //方法1: then
    employees.listAll().then( result => {
        res.json(result)
    }).catch( err => {
        res.status(500).json(err)
    });
};

exports.findId = async function(req, res) {
    var id = req.params.id
    //方法2: async/await
    var result = await employees.findId(id)
    res.json(result)
};

exports.findManinfo = async function(req, res) {
    var manNo = req.params.manNo;  
    //方法2: async/await
    var result = await employees.findManinfo(manNo)
    res.json(result)
};

exports.findManAll = async function(req, res) {
    var manNo = '';  
    //方法2: async/await
    var data = await employees.findManinfo(manNo)
    const response = {
        total: data.length,
        result: data
    }
    res.json(response)
};

exports.create = function(req, res) {
    const employee = {
        manNo: req.body.manNo,
        time: req.body.time
    }
     res.status(201).json({
         message: 'employee was created.',
         employee: employee
     });
 };

exports.update = function(req, res) {
     res.json({
         message: 'employee id was updated.'
     });
};
