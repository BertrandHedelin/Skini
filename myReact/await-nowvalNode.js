/*"use hiphop"
"use hopscript"

var hh = require( "hiphop" );

hiphop module prg( in I, out O ) {
   loop {
      await ( I.now && I.nowval == 3 );
      emit O();
   }
}

exports.prg = new hh.ReactiveMachine( prg, "await3" );
*/

"use strict";
var hh;

var __hh_module;
let prg;
hh=require("hiphop");

__hh_module=require("hiphop");
prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"await-nowval.hh.js","pos":68},"%tag":"module"},
	__hh_module.SIGNAL({"%location":{"filename":"await-nowval.hh.js","pos":80},"direction":"IN","name":"I"}),
	__hh_module.SIGNAL({"%location":{"filename":"await-nowval.hh.js","pos":86},"direction":"OUT","name":"O"}),
	__hh_module.LOOP({"%location":{"filename":"await-nowval.hh.js","pos":99}},
		__hh_module.AWAIT(
			{"%location":{"filename":"await-nowval.hh.js","pos":112},
			"%tag":"await","immediate":false,
			"apply":function (){
					return ((() => {
						const I=this["I"];
						return I.now && I.nowval == 3;
					})());
				}
			},
		__hh_module.SIGACCESS({"signame":"I","pre":false,"val":false,"cnt":false})
		),


		__hh_module.EMIT({"%location":{"filename":"await-nowval.hh.js","pos":157},"%tag":"emit","O":"O"})));

exports.prg=new hh.ReactiveMachine(prg,"await3");