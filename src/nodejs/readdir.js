// Node.js에서 파일목록 알아내기
var testFolder = './data';


var fs = require('fs');
 
fs.readdir(testFolder, function(error, filelist){
  console.log(filelist); // [ 'CSS', 'HTML', 'JavaScript']
}) 
