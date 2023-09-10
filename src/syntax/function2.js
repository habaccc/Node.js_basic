console.log(Math.round(1.6)); // 2  //Math.round ... 자바스크립트에 내장되어있는 객체 (반올림 해줌.)
console.log(Math.round(1.4)); // 1

function sum(first, second) { // parameter - 아규먼트를 파라미터 안에 넣음.
    console.log('a');
    return first+second; // b는 출력되지 않음 - return을 만나면 함수가 종료됨.
    console.log('b');
}

console.log(sum(2, 4)); // sum(2, 4) - argument
