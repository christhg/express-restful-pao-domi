//const Model = require('./model');
const db = require('./db2/DbContext').dbContext1; //Model.dbContext();//獲取數據庫上下文

exports.getTurnoverRate = (year, month) => {
    let procName = '[dbo].[Chris.usp_GetTurnoverRate]'
    let options = {
        paramsIn: {
            currentYear: year,
            currentMonth : month            
        },
        paramsOut: {}
    }
    return db.executeProc(procName, options);
}

exports.getGenderCount = () => {
    let sql = "SELECT dbo.ufnGetGenderCount(1) as 'man',dbo.ufnGetGenderCount(0) as 'woman' ";
    return db.querySql(sql, {});
}