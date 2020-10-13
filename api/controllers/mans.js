const Man = require("../models/mans");

exports.findMansById = function(req, res){
    let id = req.params.id;
    Man.findAllByManno(id).then(result => {
        res.json(result)
    }).catch( err => {
        res.status(500).json(err)
    });
}

exports.findAll = function(req, res) {
    Man.findAll().then( result => {
        res.json(result)
    }).catch( err => {
        res.status(500).json(err)
    });
}

exports.findId = function(req, res) {
    Man.findId(req.params.manNo).then( result => {
        res.json(result)
    }).catch( err => {
        res.status(500).json(err)
    });
}

exports.findByName = function(req, res) {
    Man.findAllByName(req.params.name).then( result => {        
        res.json(result)
    }).catch( err => {
        res.status(500).json(err)
    });
}