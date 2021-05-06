/*"use hiphop"
"use hopscript"

var hh = require( "hiphop" );

hiphop module prg( A, B, C ) {
   fork {
      loop {
	 if( B.nowval > 3 ) emit A();
	 yield;
      }
   } par {
      loop {
	 if( C.now ) {
	    emit B( 4 );
	 } else {
	    emit B( 3 );
	 }
	 yield;
      }
   }
}

var m = new hh.ReactiveMachine( prg, "awaitvalued" );

m.debug_emitted_func = console.log

m.react()
m.react()
m.inputAndReact( "C" )
m.react()
m.inputAndReact( "C" )
m.inputAndReact( "C" )
*/

"use strict";
var hh;var __hh_module;
var m;
let prg;


__hh_module= require("../hiphop/hiphop.js");

prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"emit-if2.hh.js","pos":68},"%tag":"module"},__hh_module.SIGNAL({"%location":{"filename":"emit-if2.hh.js","pos":80},"direction":"INOUT","name":"A"}),
	__hh_module.SIGNAL({"%location":{"filename":"emit-if2.hh.js","pos":83},"direction":"INOUT","name":"B"}),__hh_module.SIGNAL({"%location":{"filename":"emit-if2.hh.js","pos":86},"direction":"INOUT","name":"C"}),
	__hh_module.FORK(
		{"%location":{"filename":"emit-if2.hh.js","pos":95},"%tag":"fork"},
		__hh_module.SEQUENCE(
			{"%location":{"filename":"emit-if2.hh.js","pos":95},"%tag":"fork"},
				__hh_module.LOOP(
					{"%location":{"filename":"emit-if2.hh.js","pos":108}},
					__hh_module.IF(
						{
							"%location":{"filename":"emit-if2.hh.js","pos":117},
							"%tag":"if",
							"apply":function (){return ((() => {const B=this["B"];return B.nowval > 3;})());}
						},
						__hh_module.SIGACCESS(
								{"signame":"B","pre":false,"val":true,"cnt":false}
						),
/*					__hh_module.EMIT(
					{"%location":{"filename":"emit-if2.hh.js","pos":141},"%tag":"emit","A":"A"}
					)),*/
						__hh_module.PAUSE(
							{
								"%location":{"filename":"emit-if2.hh.js","pos":148},
								"%tag":"yield"
							}
						)
					)
				),
				__hh_module.SEQUENCE(
					{"%location":{"filename":"emit-if2.hh.js","pos":168},"%tag":"par"},
						__hh_module.LOOP(
							{"%location":{"filename":"emit-if2.hh.js","pos":180}},
							__hh_module.IF(
								{
									"%location":{"filename":"emit-if2.hh.js","pos":189},
									"%tag":"if",
									"apply":function (){return ((() => {const C=this["C"];return C.now;})());}
								},

							__hh_module.SIGACCESS(
								{"signame":"C","pre":false,"val":false,"cnt":false}
							),
							__hh_module.SEQUENCE(
								{"%location":{"filename":"emit-if2.hh.js","pos":201},"%tag":"sequence"},
								__hh_module.EMIT(
									{"%location":{"filename":"emit-if2.hh.js","pos":213},"%tag":"emit","B":"B","apply":function (){return 4;}
								})
							),
							__hh_module.SEQUENCE(
								{"%location":{"filename":"emit-if2.hh.js","pos":230},"%tag":"sequence"},
								__hh_module.EMIT({"%location":{"filename":"emit-if2.hh.js","pos":242},"%tag":"emit","B":"B","apply":function (){return 3;}
								})
							)
						),
					__hh_module.PAUSE({"%location":{"filename":"emit-if2.hh.js","pos":256},"%tag":"yield"}))
				)

		)
	);

m = new hh.ReactiveMachine(prg,"awaitvalued");

m.debug_emitted_func=console.log;

m.react();
m.react();
m.inputAndReact("C");
m.react();
m.inputAndReact("C");
m.inputAndReact("C");
