const db = require('./dbContext1')

exports.listAll = () => {
    let sql = 'select top 1000 m.manno as empno,m.name,m.zwei,d.deptname as department,m.home from man m,depart d where m.deptno = d.deptno'
    return db.querySql(sql, {});
}

exports.findId = (id) => {
    var params = { ManNo : id }
    let sql = 'select m.manno as empno,m.name,m.zwei,d.deptname as department,m.home from man m,depart d where m.deptno = d.deptno and manno=@ManNo';
    return db.querySql(sql, params);
}

//使用存儲過程usp_GetManCardInfo
exports.findManinfo = (manNo) => {
    let procName = 'usp_GetManCardInfo'
    let options = {
        paramsIn: { ManNo : manNo },
        paramsOut: {}
    }
    return db.executeProc(procName, options);
}
