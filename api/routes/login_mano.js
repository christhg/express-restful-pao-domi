/*
使用工號 manno / 卡號 cardno 認證
用途: 手機APP端認證通過後,可以考勤打卡
*/
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dbAuth  = require('../middleware/db-auth');


router.post('/login',(req, res, next) => {
    let username = req.body.user
    let password = req.body.pass

    dbAuth(username,password).then(result=>{
        //console.log('result:::'+result.uid)

        //存入用戶uid訊息
        const user = result
        // const user = {
        //     'company': result.company,
        //     'manno': result.manno,
        //     'cardno':result.cardno,
        //     'uid':result.uid
        // } 
        const token = jwt.sign({ user }, 'secret_key',{ expiresIn: "1h" });
        res.json({
            error: null,              
            token: token,
            user: user        
        })        
    }).catch(error=>{
        res.status(404).json({
            error: '404',
            token:'',         
            user:''
          }) 
    });
})
    
module.exports = router;


/*
提交...工號/卡號...認證通過後返回結果...
{
    "error": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im1hbm5vIjoiRDc5Mjk4IiwiY2FyZG5vIjo1NTIwMSwidWlkIjoxMDMsImNvbXBhbnkiOiIwIn0sImlhdCI6MTU2ODE2OTg3NSwiZXhwIjoxNTY4MTczNDc1fQ.Pulg8KPDlL7T-MWQ09FcoZbKv8_6Fvx6ad2LfCr34MI",
    "user": {
        "manno": "D79298",
        "cardno": 55201,
        "uid": 103,
        "company": "0"
    }
}

*/