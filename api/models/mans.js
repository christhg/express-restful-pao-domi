const Model = require('./model.js')
const sqls = 
'select m.manNo,m.name,m.sex,m.zwei,d.deptname as departName,m.inTime,m.home \
from man m,depart d \
where m.deptno = d.deptno and m.state=1';
//Model.define(sqls) //定義模型,可以為表名or視圖名orSQL語句
const repo = Model.define(sqls)

exports.findAll = () => {
    return repo.findAll({ top: 200 });    
}

exports.findAllByManno = (id) => {  
    let options ={
        where:'manno=@manNo or name like @name or departName like @dept',
        params: {
            manNo: id,
            name: '%'+id+'%',
            dept: '%'+id+'%'
        }
    }
    return repo.findAll(options);
}

exports.findId = (id) => {
    let options = {
        where: 'manno=@manno',
        params: {
            manno: id
        }
    }
    return repo.findAll(options);
}

exports.findAllByName = (name) => {
    let options = {
        where: 'name like @name',
        params: {
            name: '%'+name+'%'
        }
    }
    return repo.findAll(options);
}