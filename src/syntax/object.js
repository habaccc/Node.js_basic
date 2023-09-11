// array와 object의 차이점

var members = ['habaccc', 'k8805', 'hoya'];
console.log(members[1]); // k8805
var i = 0;
while(i < members.length) {
    console.log('array loop', members[i]);
    i = i + 1;
}

// array loop habaccc
// array loop k8805
// array loop hoya

var roles = {
    'programmer':'habaccc',
    'designer':'k8805',
    'manager':'hoya'
}
console.log(roles.designer); // k8805

for(var name in roles){
    console.log('object =>', name, 'value =>', roles[name]);
}

// object => programmer
// object => designer
// object => manager