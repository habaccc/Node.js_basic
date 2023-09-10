var fs = require('fs');

/*
// readFileSync 동기적 처리방식 - readFileSync는 return값을 줌.
console.log('A');
var result = fs.readFileSync('./sample.txt', 'utf8');
console.log(result);
console.log('C');
*/
// -> A B C 로 출력됨.

// readFile 비동기적 처리방식 - readFile은 return값을 주지 않고 함수(function)를 세번째 인자로 주어야 함.)
//  -  작업을 요청하고 작업 완료를 기다리지 않고 다음 코드로 넘어감. 비동기적으로 명령을 처리하는 방법 중 하나가 콜백함수를 사용함.
console.log('A');
fs.readFile('./sample.txt', 'utf8', function(error, result){
    console.log(result);
});
console.log('C');
// -> A C B 로 출력됨.