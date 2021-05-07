/*"use hiphop";
"use hopscript";

var hh = require( "hiphop" );

hiphop module sub( S, U, W, Z ) {
   fork {
      if( S.now ) emit W();
   } par {
      if( U.now ) emit Z();
   }
}

hiphop module main( in S, in U, A, B ) {
   run sub( S, U, W as A, Z as B );
} 

exports.prg = new hh.ReactiveMachine( main, "run2" );*/


"use strict";

var hh = require("../hiphop/hiphop.js");

var sub = hh.MODULE(
	{
		"id":"sub",
		"%location":{},
		"%tag":"module"
	},
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":82},"direction":"INOUT","name":"S"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":85},"direction":"INOUT","name":"U"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":88},"direction":"INOUT","name":"W"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":91},"direction":"INOUT","name":"Z"}),

	hh.FORK(
		{"%location":{"filename":"run.hh.js","pos":100},"%tag":"fork"},
		hh.SEQUENCE(
			{"%location":{"filename":"run.hh.js","pos":100},"%tag":"fork"},
			hh.ATOM(
	          {
	            "%location":{},
	            "%tag":"node",
	            "apply":function () {console.log('message serveur');}
	          }),
			hh.IF(
				{"%location":{"filename":"run.hh.js","pos":113},"%tag":"if","apply":function (){return ((() => {const S=this["S"];return S.now;})());}
			},
			hh.SIGACCESS({"signame":"S","pre":false,"val":false,"cnt":false}),

			hh.EMIT({"%location":{"filename":"run.hh.js","pos":130},"%tag":"emit","W":"W"}))
		),
		hh.SEQUENCE(
			{"%location":{"filename":"run.hh.js","pos":140},"%tag":"par"},
				hh.IF({"%location":{"filename":"run.hh.js","pos":152},"%tag":"if","apply":function (){return ((() => {const U=this["U"];return U.now;})());}
			},
			hh.SIGACCESS({"signame":"U","pre":false,"val":false,"cnt":false}),
	
			hh.EMIT({"%location":{"filename":"run.hh.js","pos":169},"%tag":"emit","Z":"Z"}))
		)
	)
);
exports.sub = sub;