/*"use hiphop"
"use hopscript"

var hh = require( "hiphop" );

hiphop module prg( in I, out O ) {
   signal L;
   
   fork {
      abort( L.now ) {
	 loop {
	    emit O();
	    yield;
	 }
      }
   } par {
      await( I.now );
      emit L();
   }
}

exports.prg = new hh.ReactiveMachine( prg, "abortpar" );*/

"use strict";
var __hh_module;
let prg;

__hh_module=require("../hiphop/hiphop.js");

prg = __hh_module.MACHINE({
   "id":"prg","%location":{"filename":"abort-par.hh.js","pos":68},"%tag":"module"},

   __hh_module.SIGNAL({"%location":{"filename":"abort-par.hh.js","pos":80},"direction":"IN","name":"I"}),
   __hh_module.SIGNAL({"%location":{"filename":"abort-par.hh.js","pos":86},"direction":"OUT","name":"O"}),
   __hh_module.LOCAL({"%location":{"filename":"abort-par.hh.js","pos":99},"%tag":"signal"},
      __hh_module.SIGNAL({"name":"L"}),
      __hh_module.FORK({"%location":{"filename":"abort-par.hh.js","pos":116},"%tag":"fork"},
         __hh_module.SEQUENCE({"%location":{"filename":"abort-par.hh.js","pos":116},"%tag":"fork"},
            __hh_module.ABORT({
                  "%location":{"filename":"abort-par.hh.js","pos":129},
                  "%tag":"abort",
                  "immediate":false,
                  "apply":function (){return ((() => {const L=this["L"];return L.now;})());
               }
            },
            __hh_module.SIGACCESS({
               "signame":"L",
               "pre":false,
               "val":false,
               "cnt":false
            }),


__hh_module.LOOP({"%location":{"filename":"abort-par.hh.js","pos":148}},
   __hh_module.EMIT({"%location":{"filename":"abort-par.hh.js","pos":165},"%tag":"emit","O":"O"}),
   __hh_module.PAUSE({"%location":{"filename":"abort-par.hh.js","pos":175},"%tag":"yield"})))),
         __hh_module.SEQUENCE({"%location":{"filename":"abort-par.hh.js","pos":199},"%tag":"par"},
            __hh_module.AWAIT({
               "%location":{"filename":"abort-par.hh.js","pos":211},
               "%tag":"await",
               "immediate":false,
               "apply":function (){return ((() => {const I=this["I"];return I.now;})());
            }
},
__hh_module.SIGACCESS({"signame":"I","pre":false,"val":false,"cnt":false})),
            __hh_module.EMIT({"%location":{"filename":"abort-par.hh.js","pos":238},"%tag":"emit","L":"L"})))));


module.exports=prg;

prg.addEventListener( "O", () => console.log("signal O") );

prg.react();
console.log("1")
prg.react("I");
console.log("2")
prg.react("I");
console.log("3")
prg.react();
