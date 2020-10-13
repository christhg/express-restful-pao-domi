let LdapAuth = require('ldapauth-fork');
let db = require('../models/db.old/db1');
let ldap_server = 'ldap://192.168.201.5';
let companyId = 200; //公司代號,區分公司別,用戶可能具有多重公司身分


 
var ldap = new LdapAuth({
  url: ldap_server,
  bindDN: 'cn=ldap,ou=others,dc=deer-group,dc=com,dc=cn',
  bindCredentials: 'ldap',
  searchBase: 'CN=Users,DC=deer-group,DC=com,DC=cn',
  searchFilter: '(sAMAccountName={{username}})',
  reconnect: true,
  idleTimeout: 10
});

module.exports = (username,password) => {
  return new Promise((resolve,reject) =>{
    try{
      ldap.authenticate(username, password, function(err, result) {
        if (err) {
          //console.log(err);   
          ldap.close(function(err) { 
            console.log(err);  
          })       
          reject({message:err}); 
        }else{
          let user = {
            companyName: '',  //result.company,
            department: result.physicalDeliveryOfficeName,
            name: result.cn,
            title: result.title,          
            telephone: result.telephoneNumber,
            displayName: result.displayName,
            mail: result.mail,
            //dn: result.dn,
            account: result.sAMAccountName,
            uid:'',
            empNo:'',
            deptNo:'',
          }
          //resolve(user)
          db.querySql('select companyName,empno,empname,userid,deptno from [OAFlow].[dbo].[view_EmpUsers] where CompanyID=@CompanyID and loginid=@loginid',{CompanyID:companyId,loginid:username})
          .then(result => {              
              if(result.rowSize == 1){
                user.companyName = result.rows[0].companyName
                user.uid = result.rows[0].userid
                user.empNo = result.rows[0].empno
                user.deptNo = result.rows[0].deptno
                //console.log(result)
                resolve(user)
              }else{
                reject('db users id not exist please contact admin')
              }
          })
          ldap.close(function(err) { 
            console.log(err);  
          })    
        }
      });            
    }catch(err){
      //console.log(err);
      ldap.close(function(err) { 
        console.log(err);  
      })   
      reject(err);   
    }   
  })
}