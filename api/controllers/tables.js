/*
*通用表的CRUD
*/
function Table(dbContext){
    //通用表-查詢方式filter
    this.filterAll = (req, res) => {
        let tableName = req.params.tableName;
        let options = {
            select: req.query.select,
            filter: req.query.filter,
            top: req.query.top,
            skip: req.query.skip,
            orderby: req.query.orderby,
        } 
        let params = req.body||'';
    
        dbContext.executeFilterSql(tableName, options, params).then( result =>{
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        })    
    }
    //通用表-查詢資料by key
    this.findAllByKey = (req, res) => {
        let tableName = req.params.tableName;
        let key = req.params.key||'';
        let value = req.params.value||'';
        let where = '';
        if(key != '') 
            where = key+'=@key'
        //let sql = 'select * from vi_hr_emps'
        dbCotext.findAll(tableName, {
            where: where,
            params: {
                key: value
            }
        }).then(result => {
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        })   
    }
    //通用表-新增
    this.add = (req, res) => {
        let tableName = req.params.tableName;
        let options = {
            output: req.query.output,       //返回主鍵值欄位  output=id
            params: req.body                //新建資料 {ip:"x.x.x.x",coding:3,....}
        }

        dbCotext.executeAdd(tableName, options).then(result=>{
            res.status(201).json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }
    //通用表-刪除
    this.del = (req, res) => {
        let tableName = req.params.tableName;    
        let options = {
            batch: req.query.batch,
            params: req.body      //刪除條件 { id:'a,b,c...'}
        }    
        // let sql = tables.setDelSql(options)
        // res.json(sql)
        dbCotext.executeDel(tableName, options).then(result => {
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }
    //通用表-更新
    this.update = (req, res) => {
        let tableName = req.params.tableName;
        let options = {
            where: req.query.filter,     //條件
            params: req.body                //更新資料
        }
        // let sql = tables.setUpdateSql(options)
        // res.json(sql)
        dbCotext.executeUpdate(tableName, options).then( result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.status(500).json(err)
        }) 
    }       
}

exports.defineTable = (dbContext) => {
    return new Table(dbContext)
}



