"use strict";
var __hh_module;
let prg;

function foo(evt){{console.log("foo called by",evt.type,"with value",evt.nowval);}}

__hh_module = require("./hiphop");

prg = __hh_module.MACHINE(
		{"id":"prg","%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":37},"%tag":"machine"},

	__hh_module.SIGNAL({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":50},"direction":"IN","name":"A"}),
	__hh_module.SIGNAL({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":56},"direction":"IN","name":"B"}),
	__hh_module.SIGNAL({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":62},"direction":"IN","name":"R"}),
	__hh_module.SIGNAL({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":68},
		"direction":"OUT","name":"O","init_func":function (){
			console.log("init O");
			return 0;
		} }),

	__hh_module.LOOPEACH(
		{
			"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":85},
			"%tag":"do/every",
			"immediate":false,
			"apply":function (){return ((() => {
				const R=this["R"];
				console.log("apply R");
				return R.now;
			})());}
		},
		__hh_module.SIGACCESS({
			"signame":"R",
			"pre":false,
			"val":false,
			"cnt":false
		}),


	__hh_module.FORK(
		{"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":96},"%tag":"fork"},
	__hh_module.SEQUENCE({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":96},"%tag":"fork"},
		__hh_module.AWAIT({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":112},"%tag":"await",
			"immediate":true,"apply":function (){return ((() => {
				const A=this["A"];
				console.log("AWAIT A");
				return A.now;
			})());}
		},
		__hh_module.SIGACCESS({"signame":"A","pre":false,"val":false,"cnt":false}))),
		__hh_module.SEQUENCE(
			{"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":136},"%tag":"par"},
			__hh_module.AWAIT(
				{"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":151},"%tag":"await",
				"immediate":true,"apply":function ()
					{
						return ((() => {
							const B=this["B"];
							console.log("AWAIT B");
							return B.now;
						})());
					}
				},
				__hh_module.SIGACCESS({"signame":"B","pre":false,"val":false,"cnt":false})
			)
		)
	),
	__hh_module.EMIT({"%location":{"filename":"/home/serrano/trashcan/abro.hh.js","pos":186},
		"%tag":"emit","O":"O","apply":function (){
			return ((() => {
				const O=this["O"];
				console.log("EMIT O");
				return O.preval + 1;
			})());}
		},
		__hh_module.SIGACCESS({"signame":"O","pre":true,"val":true,"cnt":false}))
	)
);

module.exports=prg;

prg.addEventListener("O",foo);

prg.input({"A":1});
prg.input({"B":1});

prg.react({"R":1});

prg.react();

