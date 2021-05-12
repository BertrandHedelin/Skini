/* "use hiphop"
"use hopscript"

const hh = require( "hiphop" );
hiphop module prg( A, B ) {
   EXIT: fork {
      await( A.now );
      hop { console.log( "A" ) }
      break EXIT;
   } par {
      await( B.now );
      hop { console.log( "B" ) }
      break EXIT;
   }

   hop { console.log( "end" ) } ;
}
const m = new hh.ReactiveMachine( prg );

m.react();
m.inputAndReact( "B" );
*/

"use strict";
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
m.inputAndReact("B");