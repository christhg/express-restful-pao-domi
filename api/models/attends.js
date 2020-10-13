const Model = require('./model');
const db = Model.dbContext();//獲取數據庫上下文

exports.findAll = (params) => {
    let sql = 
    'SELECT TOP(1000) a.[ManNO],m.[Name],c.[Cardno],a.[BrushDate],a.[Atday],a.[RestDay],a.[OverTime1],\
    a.[OverTime2],a.[OverTime3],a.[Time1],a.[Time2],a.[Time3],a.[Time4],a.[Time5],a.[Time6],a.[memo],a.[AddTime] \
    FROM [Attend] a,[Man] m,[Card] c WHERE m.manno = a.manno AND a.manno = c.manno AND c.state =1 \
    AND a.ManNO in (@manno) \
    AND brushdate between @brushdateS and @brushdateE';
    //return  table.querySql(sql, params)
    return db.querySql(sql, params)
}
