/*"use hiphop";
"use hopscript";

const hh = require( "hiphop" );

hiphop module prg( in I, O ) {
   every( I.now ) {
      emit O();
   }
}

exports.prg = new hh.ReactiveMachine( prg, "every1" );
*/

var __hh_module;

const hh=require("hiphop");

let prg;__hh_module=require("hiphop");
prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"every1.hh.js","pos":72},"%tag":"module"},
	__hh_module.SIGNAL({"%location":{"filename":"every1.hh.js","pos":84},"direction":"IN","name":"I"}),
	__hh_module.SIGNAL({"%location":{"filename":"every1.hh.js","pos":90},"direction":"INOUT","name":"O"}),
	__hh_module.EVERY(
		{
			"%location":{"filename":"every1.hh.js","pos":99},
			"%tag":"every","immediate":false,
			"apply":function (){return ((() => {const I=this["I"];return I.now;})());
		}
	},
	__hh_module.SIGACCESS({"signame":"I","pre":false,"val":false,"cnt":false}),
	__hh_module.EMIT({"%location":{"filename":"every1.hh.js","pos":127},"%tag":"emit","O":"O"})
	)
);

exports.prg=new hh.ReactiveMachine(prg,"every1");