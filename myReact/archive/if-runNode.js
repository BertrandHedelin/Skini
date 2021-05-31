"use hopscript"
"use hiphop"

const hh = require( "hiphop" );

const pauseModule = hiphop module() {
   yield;
}

const m = new hh.ReactiveMachine(
   hiphop module() {
	   loop {
			hop { console.log( ">>> start" ) };
			if( 1 ) {
			 run ${pauseModule}();
			} else {
			 yield;
			}
			hop { console.log( ">>> end" ) }
		}
	 }
);

m.react();
setTimeout( () => m.react(), 200 );


"use strict";
const hh=require("hiphop");
const pauseModule=(function (__hh_module){return 
	__hh_module.MODULE({"%location":{"filename":"if-run.hh.js","pos":90},"%tag":"module"},
		__hh_module.PAUSE({"%location":{"filename":"if-run.hh.js","pos":104},"%tag":"yield"}));}
)(require("hiphop"));

const m=new hh.ReactiveMachine((function (__hh_module){
	return __hh_module.MODULE({"%location":{"filename":"if-run.hh.js","pos":158},"%tag":"module"},
		__hh_module.LOOP({"%location":{"filename":"if-run.hh.js","pos":175}},
			__hh_module.ATOM({"%location":{"filename":"if-run.hh.js","pos":184},"%tag":"hop",
				"apply":function (){console.log(">>> start");
				}
			}),
			
			__hh_module.IF(
				{
					"%location":{"filename":"if-run.hh.js","pos":222},
					"%tag":"if",
					"apply":function (){
						return 1;
					},
				},
					__hh_module.SEQUENCE({"%location":{"filename":"if-run.hh.js","pos":230},"%tag":"sequence"},
						__hh_module.RUN({"%location":{"filename":"if-run.hh.js","pos":237},"%tag":"run","module":pauseModule})
					),
					__hh_module.SEQUENCE({"%location":{"filename":"if-run.hh.js","pos":268},"%tag":"sequence"},
						__hh_module.PAUSE({"%location":{"filename":"if-run.hh.js","pos":275},"%tag":"yield"})
					)
			),

			__hh_module.ATOM(
				{
					"%location":{"filename":"if-run.hh.js","pos":288},
					"%tag":"hop",
					"apply":function (){
						console.log(">>> end");
					}
				}
			)
		)
	);
}
)(require("hiphop")));

m.react();
setTimeout((() => {return m.react();}),200);