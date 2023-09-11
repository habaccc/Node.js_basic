// array, object

// var i = if(true){console.log(1)}; 
// var w = while(true){console.log(1)};
// Java Script에서  값이 될 수 없음.

var f = function() {
    console.log(1+1);
    console.log(1+2);
}
console.log(f);
f();
// Java Script에서는 function(함수)이 값이 될 수 있음.

var a = [f];
a[0]();

var o = {
    func:f
}
o.func();
