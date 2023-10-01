var mysql = require('mysql');
var db = mysql.createConnection({ // mysql 연결
    host:'127.0.0.1',
    user:'root',
    password:'288604',
    database:'opentutorials',
    port:'3306',
  });
  db.connect();
  module.exports = db; // 외부에서 쓸 수 있도록 export