# 使用nodejs寫restful api採用express
0. 使用express-demo目錄copy
1. 使用express配置服務器
2. 添加api目錄為restful的工作目錄...api代碼皆在此
3. 修改app.js註冊統一路由routes/index.js
4. 運行: npm start

# 添加swagger-ui
* 將swagger-ui\dist 目錄copy 到此
* 編輯app.js靜態路徑指向到dist

# 說明
- copy from express-restful
- db連線在config1.js到sql主機:192.168.2.20,只留通用型資料表crud即可
- db:domitory 宿舍管理資料庫