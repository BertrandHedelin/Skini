/*"use hiphop";
"use hopscript";

var hh = require( "hiphop" );

hiphop module sub( S, U, A, B ) {
   fork {
      if( S.now ) emit A();
   } par {
      if( U.now ) emit B();
   }
}

hiphop module main( in S, in U, A, B ) {
   run sub( ... );
} 

exports.prg = new hh.ReactiveMachine( main, "run2" );
*/


"use strict";
var hh;
var __hh_module;
let sub;
let main;
hh=require("hiphop");
__hh_module=require("hiphop");

sub=__hh_module.MODULE({"id":"sub","%location":{"filename":"run.3points.hh.js","pos":70},"%tag":"module"},
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":82},"direction":"INOUT","name":"S"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":85},"direction":"INOUT","name":"U"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":88},"direction":"INOUT","name":"A"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":91},"direction":"INOUT","name":"B"}),
	__hh_module.FORK({"%location":{"filename":"run.3points.hh.js","pos":100},"%tag":"fork"},
		__hh_module.SEQUENCE({"%location":{"filename":"run.3points.hh.js","pos":100},"%tag":"fork"},
			__hh_module.IF({"%location":{"filename":"run.3points.hh.js","pos":113},"%tag":"if",
				"apply":function (){return ((() => {const S=this["S"];return S.now;})());}
},
__hh_module.SIGACCESS({"signame":"S","pre":false,"val":false,"cnt":false}),
__hh_module.EMIT({"%location":{"filename":"run.3points.hh.js","pos":130},"%tag":"emit","A":"A"}))),__hh_module.SEQUENCE({"%location":{"filename":"run.3points.hh.js","pos":140},"%tag":"par"},__hh_module.IF({"%location":{"filename":"run.3points.hh.js","pos":152},"%tag":"if","apply":function (){return ((() => {const U=this["U"];return U.now;})());}
},
__hh_module.SIGACCESS({"signame":"U","pre":false,"val":false,"cnt":false}),
__hh_module.EMIT({"%location":{"filename":"run.3points.hh.js","pos":169},"%tag":"emit","B":"B"})))));

__hh_module=require("hiphop");

main=__hh_module.MODULE({"id":"main","%location":{"filename":"run.3points.hh.js","pos":189},"%tag":"module"},
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":202},"direction":"IN","name":"S"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":208},"direction":"IN","name":"U"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":214},"direction":"INOUT","name":"A"}),
	__hh_module.SIGNAL({"%location":{"filename":"run.3points.hh.js","pos":217},"direction":"INOUT","name":"B"}),
	
	__hh_module.RUN({"%location":{"filename":"run.3points.hh.js","pos":226},"%tag":"run","module":
		__hh_module.getModule("sub",{"filename":"run.3points.hh.js","pos":230}),"autocomplete":true}
	)
);

exports.prg=new hh.ReactiveMachine(main,"run2");