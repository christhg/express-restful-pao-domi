const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try{
//         const decoded = jwt.verify(req.body.token,'secret');
//         req.userData = decoded;
//         next();
//     }catch(err){
//         return res.status(401).json({
//             message: 'Auth failed'
//         })
//     }
// }

const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    try{
        if(typeof bearerHeader != 'undefined'){
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            const decoded = jwt.verify(bearerToken, 'secret_key');//解析token內容
            //console.log(decoded)
            req.token = bearerToken;
            next();
        }else{
           return  res.status(403).json({
               error:'403',
               message: 'token auth failed'
           });
        }
    }catch(err){
        return  res.status(403).json({
            error:'403',
            message: 'token auth error'
        });
    }

}

module.exports = ensureToken