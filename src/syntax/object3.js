// 객체 지향
var o = {
    v1:'v1',
    v2:'v2',
    f1:function (){
        console.log(this.v1); // this라는 약속된 값을 통해서 함수가 속해있는 객체를 참조할 수 있음.
    },
    f2:function (){
        console.log(this.v2);
    }
}

o.f1();
o.f2();