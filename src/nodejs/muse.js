// var M = {
//     v:'v',
//     f:function(){
//         console.log(this.v);
//     }
// }

// 모듈 (mpart.js를 이용함.)
var part = require('./mpart.js');
// console.log(part); // { v: 'v', f: [Function: f] }
part.f();