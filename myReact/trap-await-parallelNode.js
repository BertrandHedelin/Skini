"use hiphop"
"use hopscript"

const hh = require( "hiphop" );
hiphop module prg( A, B ) {
   signal toto;

   await count( 3,  A.now || B.now );
/*   TRAP1: fork {
      await( A.now );
      hop { console.log( "A" ) }
      break TRAP1;
   } par {
      await( B.now );
      hop { console.log( "B" ) }
      break TRAP1;
   }
   */
   hop { console.log( "end" ) } ;
}
const m = new hh.ReactiveMachine( prg );

m.react();
m.inputAndReact( "B" );


/*"use strict";
var hh;
var m;

let prg;
hh=require("../hiphop/hiphop.js");

prg=hh.MODULE(
   {"id":"prg","%location":{"filename":"trap-await-parallel.hh.js","pos":71},"%tag":"module"},
   hh.SIGNAL(
      {"%location":{"filename":"trap-await-parallel.hh.js","pos":83},"direction":"INOUT","name":"A"}),
   hh.SIGNAL(
      {"%location":{"filename":"trap-await-parallel.hh.js","pos":86},"direction":"INOUT","name":"B"}),

   hh.TRAP(
      {
         "EXIT":"EXIT",
         "%location":{"filename":"trap-await-parallel.hh.js","pos":95},
         "%tag":"EXIT"
      },

      hh.FORK(
         {"%location":{"filename":"trap-await-parallel.hh.js","pos":101},"%tag":"fork"},
         hh.SEQUENCE(
            {"%location":{"filename":"trap-await-parallel.hh.js","pos":101},"%tag":"fork"},
            hh.AWAIT(
               {"%location":{"filename":"trap-await-parallel.hh.js","pos":114},
               "%tag":"await",
               "immediate":false,
               "apply":function (){
                  return ((() => {const A=this["A"];return A.now;})());
               }
            },
            hh.SIGACCESS({"signame":"A","pre":false,"val":false,"cnt":false})),
            hh.ATOM({"%location":{"filename":"trap-await-parallel.hh.js","pos":136},"%tag":"hop","apply":function (){console.log("A");}
            }),

            hh.EXIT(
               {
                  "EXIT":"EXIT",
                  "%location":{"filename":"trap-await-parallel.hh.js","pos":175},
                  "%tag":"break"
               })
            ),

            hh.SEQUENCE({"%location":{"filename":"trap-await-parallel.hh.js","pos":186},"%tag":"par"},
               hh.AWAIT({"%location":{"filename":"trap-await-parallel.hh.js","pos":198},"%tag":"await","immediate":false,"apply":function (){return ((() => {const B=this["B"];return B.now;})());}
               },
               hh.SIGACCESS({"signame":"B","pre":false,"val":false,"cnt":false})),
               hh.ATOM({"%location":{"filename":"trap-await-parallel.hh.js","pos":220},"%tag":"hop","apply":function (){console.log("B");}
               }),

               hh.EXIT(
                  {
                     "EXIT":"EXIT",
                     "%location":{"filename":"trap-await-parallel.hh.js","pos":259},
                     "%tag":"break"
                  }
               )

            )
         )
      ),
      hh.ATOM({"%location":{"filename":"trap-await-parallel.hh.js","pos":274},"%tag":"hop","apply":function (){console.log("end");}
      })
);

m=new hh.ReactiveMachine(prg,"atom");
m.react();
m.inputAndReact("B");*/


var __hh_module;const hh=require("hiphop");let prg;let m;__hh_module=require("hiphop");

prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"trap-await-parallelNode.js","pos":69},"%tag":"module"},
   __hh_module.SIGNAL({"%location":{"filename":"trap-await-parallelNode.js","pos":81},"direction":"INOUT","name":"A"}),
   __hh_module.SIGNAL({"%location":{"filename":"trap-await-parallelNode.js","pos":84},"direction":"INOUT","name":"B"}),
   __hh_module.LOCAL({"%location":{"filename":"trap-await-parallelNode.js","pos":93},"%tag":"signal"},
      __hh_module.SIGNAL({"name":"toto"}),

      __hh_module.AWAIT(
         {
            "%location":{"filename":"trap-await-parallelNode.js","pos":110},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
               return ((() => {
                  const A=this["A"];
                  const B=this["B"];
                  return A.now || B.now;
               })());
            },
            "countapply":function (){return 3;}
}

,__hh_module.SIGACCESS({"signame":"A","pre":false,"val":false,"cnt":false}),__hh_module.SIGACCESS({"signame":"B","pre":false,"val":false,"cnt":false})),__hh_module.ATOM({"%location":{"filename":"trap-await-parallelNode.js","pos":337},"%tag":"hop","apply":function (){console.log("end");}
})));m=new hh.ReactiveMachine(prg);m.react();m.inputAndReact("B");