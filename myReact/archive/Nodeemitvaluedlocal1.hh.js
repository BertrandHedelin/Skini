"use hiphop"
"use hopscript"


var hh = require( "hiphop" );

hiphop module prg( O ) {
   loop {
      signal S = 1;

      emit S( S.preval + 1 );
      emit O( S.nowval );
      yield;
      emit O( O.preval );
      yield;
   }
}

exports.prg = new hh.ReactiveMachine( prg, "emitvaluedlocal1" );


var hh;
var __hh_module;
let prg;hh=require("hiphop");
__hh_module=require("hiphop");

prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"emitvaluedlocal1.hh.js","pos":69},"%tag":"module"},
  __hh_module.SIGNAL({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":81},"direction":"INOUT","name":"O"}),
  __hh_module.LOOP({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":90}},
    __hh_module.LOCAL({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":103},"%tag":"signal"},
      __hh_module.SIGNAL(
        {"name":"S",
          "init_func":function (){return 1;}
        }
      ),
      __hh_module.EMIT(
        {"%location":{"filename":"emitvaluedlocal1.hh.js","pos":135},
        "%tag":"emit",
        "S":"S",
        "apply":function (){return ((() => {const S=this["S"];return S.preval + 1;})());
      }
},
__hh_module.SIGACCESS({"signame":"S","pre":true,"val":true,"cnt":false})),
      __hh_module.EMIT({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":165},"%tag":"emit","O":"O","apply":function (){return ((() => {const S=this["S"];return S.nowval;})());}
},
__hh_module.SIGACCESS({"signame":"S","pre":false,"val":true,"cnt":false})),
      __hh_module.PAUSE({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":186},"%tag":"yield"}),__hh_module.EMIT({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":204},"%tag":"emit","O":"O","apply":function (){return ((() => {const O=this["O"];return O.preval;})());}
},
__hh_module.SIGACCESS({"signame":"O","pre":true,"val":true,"cnt":false})),
      __hh_module.PAUSE({"%location":{"filename":"emitvaluedlocal1.hh.js","pos":225},"%tag":"yield"}))));

exports.prg=new hh.ReactiveMachine(prg,"emitvaluedlocal1")