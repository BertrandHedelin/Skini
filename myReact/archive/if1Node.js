/*"use hopscript"
"use hiphop"

var hh = require( "hiphop" );

hiphop module prg( in I1, O1, in I2, O2 ) {
   loop {
      if( I1.now ) emit O1();
      if( I2.nowval > 2 ) emit O2();
      yield;
   }
}

exports.prg = new hh.ReactiveMachine( prg, "if1" );*/

"use strict";
var hh;

var __hh_module;
let prg;
hh=require("hiphop")
;__hh_module=require("hiphop");

prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"if1.hh.js","pos":68},"%tag":"module"},
   __hh_module.SIGNAL({"%location":{"filename":"if1.hh.js","pos":80},"direction":"IN","name":"I1"}),
   __hh_module.SIGNAL({"%location":{"filename":"if1.hh.js","pos":87},"direction":"INOUT","name":"O1"}),
   __hh_module.SIGNAL({"%location":{"filename":"if1.hh.js","pos":91},"direction":"IN","name":"I2"}),
   __hh_module.SIGNAL({"%location":{"filename":"if1.hh.js","pos":98},"direction":"INOUT","name":"O2"}),__hh_module.LOOP({"%location":{"filename":"if1.hh.js","pos":108}},__hh_module.IF({"%location":{"filename":"if1.hh.js","pos":121},"%tag":"if","apply":function (){return ((() => {const I1=this.I1;return I1.now;})());}
},
__hh_module.SIGACCESS({"signame":"I1","pre":false,"val":false,"cnt":false}),
__hh_module.EMIT({"%location":{"filename":"if1.hh.js","pos":139},"%tag":"emit","O1":"O1"})),
   __hh_module.IF(
      {"%location":{"filename":"if1.hh.js","pos":151},
      "%tag":"if",
      "apply":function (){
         return ((() => {const I2=this.I2;return I2.nowval > 2;})());
      }
},
__hh_module.SIGACCESS({"signame":"I2","pre":false,"val":true,"cnt":false}),
__hh_module.EMIT({"%location":{"filename":"if1.hh.js","pos":176},"%tag":"emit","O2":"O2"})),
   __hh_module.PAUSE({"%location":{"filename":"if1.hh.js","pos":188},"%tag":"yield"})));

exports.prg=new hh.ReactiveMachine(prg,"if1");