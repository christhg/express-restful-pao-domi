/*
使用AD的帳密登入驗證
說明：目前存在ldap-auth認證模組...會因為read ECONNRESET錯誤shutdown...先停用
      後續是否改用其他模組
*/
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//因使用ldap-auth模組, Error: read ECONNRESET 先取消ldap認證
//const authLdap  = require('../middleware/ldap-auth');

router.post('/login',(req, res, next) => {
    let username = req.body.user
    let password = req.body.pass

    if(username === 'admin' && password === '86623456'){
        const user = { mail : 'sengyi@deer-group.com.cn' } //存入用戶訊息
        const token = jwt.sign({ user }, 'secret_key',{ expiresIn: "1h" });
        res.json({
            error: null,              
            token: token,
            user: user        
        }) 
    }else{
        res.status(404).json({
          error: '404',
          token:'',         
          user:''
        })        
    }
    // authLdap(username,password).then(result => {
    //     //res.json(result)
    //     const user = { mail : result.mail } //存入用戶訊息
    //     const token = jwt.sign({ user }, 'secret_key',{ expiresIn: "1h" });
    //     res.json({
    //         error: null,              
    //         token: token,
    //         user: result        
    //     })        
    // }).catch(err=>{
    //     res.status(404).json({
    //       error: err,
    //       token:'',         
    //       user:''
    //     })
    // })
})
    
//     if(req.body.user === 'admin' && req.body.pass === 'admin'){
//         const user = { id : 3 }
//         const token = jwt.sign({ user }, 'secret',{ expiresIn: "1h" });
//         res.json({
//             message: 'Auth successful',
//             token: token
//         })
//     }else{
//         res.status(404).json({
//             message: 'Auth failed,user doesn\'t exist or password is wrong.',
//             token: null
//         })
//     }
// })


// var app = express();
// app.use(passport.initialize())
// app.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
//     let username = req.body.user
//     let password = req.body.pass
//     res.send({status: 'ok'});
//   });


module.exports = router;