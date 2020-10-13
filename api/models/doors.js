const db = require('./db2/DbContext').dbContext1
//跨數據庫主機查詢201.16
//門禁數據庫:ACS數據庫資料
const sql = "SELECT * FROM OPENDATASOURCE ('SQLOLEDB','Data Source=192.168.201.16;User ID=hruser;Password=supersystem' ).ACS.dbo.V_IO_Infor";
const model = db.defineModel(sql);

exports.findAllByManno = (manno, time1, time2) => {
    let options = {
        where: 'manno=@manno and dtime between @time1 and @time2 order by dtime desc',
        params: {
            manno: manno,
            time1: time1,
            time2: time2
        }
    }
    return model.findAll(options); 
}