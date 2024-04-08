"use strict";
function foo(evt){{console.log("foo called by",evt.type,"with value",evt.nowval);}}

var __hh_module;
var m;
let prg;

var hh=require("./hiphop");

__hh_module=require("./hiphop");

prg = 
	__hh_module.MODULE({"id":"prg","%location":{"filename":"test.js","pos":173},"%tag":"module"},
	__hh_module.SIGNAL({"%location":{"filename":"test.js","pos":185},"direction":"IN","name":"I"}),
	__hh_module.SIGNAL({"%location":{"filename":"test.js","pos":191},"direction":"OUT","name":"O"}),
	__hh_module.AWAIT({"%location":{"filename":"test.js","pos":205},"%tag":"await","immediate":true,"apply":function (){return ((() => {const I=this["I"];return I.now;})());}
},
__hh_module.SIGACCESS({"signame":"I","pre":false,"val":false,"cnt":false})),
__hh_module.EMIT({"%location":{"filename":"test.js","pos":241},"%tag":"emit","O":"O","apply":function (){return ((() => {const I=this["I"];return I.nowval;})());}

},
__hh_module.SIGACCESS({"signame":"I","pre":false,"val":true,"cnt":false})));


m=new hh.ReactiveMachine(prg,"awaitvalued");

m.addEventListener("O",foo);
exports.prg=m;

m.inputAndReact({"I":1});