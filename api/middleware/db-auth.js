let db = require('../models/db2/DbContext').dbContext1;
//let ldap_server = 'ldap://192.168.201.5';
//let companyId = 200; //公司代號,區分公司別,用戶可能具有多重公司身分

module.exports = (username,password) => {
    return new Promise((resolve,reject) =>{
      try{
            let user = {
                'name':'',
                'manno':'',
                'cardno':'',
                'uid':''
            }
            //查詢工號&卡號是否存在紀錄?
            db.querySql('SELECT * FROM [DeerHRDB].[dbo].[CardV] WHERE state=1  AND manno=@manno AND  cardno=@cardno;',{manno:username,cardno:password})
            .then( async (result) => {              
                if(result.rowSize == 1){
                  var company = result.rows[0].CompanyNo //0:deer 1:soly
                  var name = await getName(username,company) //獲取用戶名稱
                  console.log('name:::'+ name)
                  user.name = name
                  user.manno = result.rows[0].ManNO
                  user.cardno = result.rows[0].Cardno
                  user.uid = result.rows[0].UserID
                  resolve(user)
                }else{
                  reject('db users id not exist please contact admin')
                }
            }).catch( 
              err => {reject(err)}
            )        
      }catch(err){  
        reject(err);   
      }   
    })
  }

//獲取用戶名稱
let getName = async (manno,company) => {
  let result = await db.querySql('SELECT [Name] FROM [DeerHRDB].[dbo].[ManV] WHERE manno=@manno and companyno=@company',{manno:manno,company:company})
  let name = result.rows[0].Name
  return name;
}