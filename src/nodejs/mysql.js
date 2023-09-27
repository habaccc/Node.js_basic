// Node.js에서 SQL 모듈의 기본 사용법

var mysql      = require('mysql'); // mysql 모듈을 mysql 변수를 이용해서 사용함.
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 함. 
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '288604',
  database : 'opentutorials',
  port     : '3306',
});
  
connection.connect(); // 접속
  
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error); // 첫번째 인자
    }
    console.log(results); // 두번째 인자
}); // sql문장을 첫번째 인자, 두번째 인자로는 콜백함수를 줌.
  
connection.end();