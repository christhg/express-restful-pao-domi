const db = require('./db2/DbContext').dbContext1


/**查詢刷卡紀錄 
** @param {String} manno, @param {DataTime} time1,@param {DateTime} time2
** manno=工號,time1=起始日期,time2=結束日期
*/
exports.findRecordsInfoDeer = (manno, time1, time2) => {
    let params = { 
        ManNO : manno,
        Time1 : time1,
        Time2: time2
    }
    let sql = 
    'SELECT TOP(200) r.PKID,r.CardNO,r.MchNO,r.[Time],m.Name,m.ManNO \
    FROM Record r,Card_Log c,Man m \
    WHERE m.ManNO=c.ManNO AND c.Cardno=r.CardNO \
    AND m.ManNO in (@ManNO) \
    AND r.[Time] between @Time1 and @Time2\
    ORDER BY r.Time DESC';
    
    return dbDeer.querySql(sql, params);
}

exports.findRecordsInfoSoly = (manno, time1, time2) => {
    let params = { 
        ManNO : manno,
        Time1 : time1,
        Time2: time2
    }
    let sql = 
    'SELECT TOP(200) r.PKID,r.CardNO,r.MchNO,r.[Time],m.Name,m.ManNO \
    FROM Record r,Card_Log c,Man m \
    WHERE m.ManNO=c.ManNO AND c.Cardno=r.CardNO \
    AND m.ManNO in (@ManNO) \
    AND r.[Time] between @Time1 and @Time2\
    ORDER BY r.Time DESC';
    
    return dbSoly.querySql(sql, params);
}

exports.findRecordsInfo2 = (manno, time) => {
    let params = { 
        ManNO : manno,
        Time : time 
    }
    let sql = 
    'SELECT TOP(200) r.PKID,r.CardNO,r.MchNO,r.Time,m.Name,m.ManNO \
    FROM Record r,Card_Log c,Man m \
    WHERE m.ManNO=c.ManNO AND c.Cardno=r.CardNO AND m.ManNO in (@ManNO) \
    AND convert(varchar(10),r.Time,120)=@Time \
    ORDER BY Time DESC';
    return dbDeer.querySql(sql, params);
    // return db.findAll(sql, {
    //     params: {
    //         ManNO : manno,
    //         Time : time            
    //     }
    // });
}

exports.findRecordsInfo = (startDate, manNo) => {
    let options = {
        procName: 'usp_GetRecordInfo',
        paramsIn: {
            StartDate: startDate,
            manNO : manNo            
        },
        paramsOut: {}
    }
    return dbDeer.queryProc(options);
}

exports.getCustomersByTags = (Tag1, Tag2) => {
    let options = {
        procName: 'uspGetCostomerByTags',
        paramsIn: {
            Tag1 : Tag1,
            Tag2 : Tag2,            
            Tag3 : Tag3,
            Tag4 : Tag4,
            Tag5 : Tag5,
            Tag6 : Tag6,
        },
        paramsOut: {}
    }
    return db.queryProc(options);
}

