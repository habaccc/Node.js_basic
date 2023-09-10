// 콜백 함수 - 매개변수가 함수인 값. 비동기적 처리방식일때 사용됨.
//          - 함수(caller)의 인자(argument)로 전달되는 함수. 콜백함수를 인자로 받은 caller 함수는 콜백함수를 즉시 실행할 수도 있고 나중에 실행할 수도 있음.

/*
function a() {
    console.log('A');
}
*/
var a = function () { // 익명 함수
    console.log('A');
}

function slowfunc(callback) { 
    callback(); 
}
// slowfunc 함수는 callback을 파라미터로 받고 실행함.
// callback 파라미터는 a 변수가 가리키는 함수를 받게됨.
// slowfunc안의 callback을 호출하면 a 변수의 함수가 실행됨.

slowfunc(a);
// slowfunc는 a 변수를 받고 실행됨.