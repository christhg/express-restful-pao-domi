const db = require('./db2/DbContext').dbContext1;

const sql = 
'select b.billnum,m.manno,m.Name,b.ManDeptName,b.zwu,b.memo,b.TimeSpan1_From,b.TimeSpan1_To,b.TimeSpan2_From,b.TimeSpan2_To,b.TimeSpan3_From,b.TimeSpan3_To,b.OverTimeLength,b.OverTimeStyle \
from overtimeitem b,[DeerHRDB].[dbo].[Man] m \
where b.manno = m.manno';
const model = db.defineModel(sql);


const sqlWaiting =
"SELECT d.billnum,d.title,d.description,d.applytime,d.cname 'apply_name',d.departname 'apply_depart',e.cname 'approve_name',e.departname 'approve_depart' FROM \
(SELECT a.billnum,a.title,a.description,a.applytime,c.cname,c.departname,b.actorRefid \
FROM OvertimeBill a, \
Action b, \
OPENDATASOURCE ('SQLOLEDB','Data Source=192.168.201.91;User ID=hruser;Password=supersystem' ).TestDeerInContact.dbo.ViewGetRefidInfo c \
WHERE a.writerRefid=c.refid \
AND a.billnum = b.billnum \
AND b.actionstyle=0 \
AND a.Flag=0 AND a.UsefulState=1 \
) d \
LEFT JOIN OPENDATASOURCE ('SQLOLEDB','Data Source=192.168.201.91;User ID=hruser;Password=supersystem' ).TestDeerInContact.dbo.ViewGetRefidInfo e \
ON d.actorRefid=e.refid";

const modelWaiting = db.defineModel(sqlWaiting);

//查詢待審核的加班單清單byApplyTime
exports.findWaitingList = (time1,time2) => {
    let options = {
        where: 'ApplyTime between @time1 and @time2',
        orderby: 'billnum desc',
        params: {
            time1:time1,
            time2:time2
        }
    }
    return modelWaiting.findAll(options);
}
//查詢加班單申請明細by單號(billNum)
exports.findAllByBillNum = (id) => {
    let options = {
        where: 'billnum=@billnum or manno=@manno',
        params: {
            billnum: id,
            manno: id
        }
    }
    return model.findAll(options);
}

//查詢加班單申請明細by工號(manno)
exports.findAllByManno = (manno) => {
    let options = {
        where: 'manno=@manno',
        params: {
            manno: manno
        }
    }
    return model.findAll(options); 
}