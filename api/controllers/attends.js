//出勤
const attends = require('../models/attends');

exports.findAll = (req, res) => {
    attends.findAll({
        manno: req.body.manno||'',
        brushdateS: req.body.brushdateS,
        brushdateE: req.body.brushdateE
    }).then(result=>{
        res.json(result)
    })
}
