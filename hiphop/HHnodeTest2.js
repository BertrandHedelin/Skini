/*"use hiphop"
"use hopscript"

const hh = require( "hiphop" );

hiphop module prg( in A, in B, in R, out O ) {
   do {
      fork {
	 	await( A.now );
      } par {
	 	await( B.now );
      }
      emit O();
   } every( R.now )
}

exports.prg = new hh.ReactiveMachine( prg, "ABRO" );

prg.addEventListener( "O", () => {console.log("reçu O")} );

prg.input({"A":1});
console.log("A");
prg.input({"B":1});
console.log("B");


prg.inputAndReactls({"R":1});
*/

"use strict";
var hh;
let prg;

function foo(evt){ 
	console.log("foo called by",evt.type,"with value",evt.nowval);
}

hh = require("./hiphop");

prg = hh.MACHINE({"id":"prg","%location":{},"%tag":"machine"},

	hh.SIGNAL({
		"%location":{},
		"direction":"IN",
		"name":"A"
	}),
	hh.SIGNAL({
		"%location":{},
		"direction":"IN",
		"name":"B"
	}),
	hh.SIGNAL({
		"%location":{},
		"direction":"IN",
		"name":"R"
	}),
	hh.SIGNAL({
		"%location":{},
		"direction":"OUT",
		"name":"O",
		"init_func":function (){
				return 0;
			} 
		}
	),

	hh.LOOPEACH(
		{	
			"%location":{},
			"%tag":"do/every",
			"immediate":false,
			"apply":function (){
				return ( () => {
					const R=this["R"];
					return R.now;
				} )();
			}
		},
		hh.SIGACCESS({
			"signame":"R",
			"pre":false,
			"val":false,
			"cnt":false}),
		hh.FORK(
			{
				"%location":{},
				"%tag":"fork"
			},
			hh.SEQUENCE(
				{
					"%location":{},
					"%tag":"fork"
				},
				hh.AWAIT(
					{
						"%location":{},
						"%tag":"await",
						"immediate":true,
						"apply":function () {
							return ((() => {
								const A=this["A"];
								return A.now;
							})());
						}
					},
					hh.SIGACCESS(
					{
						"signame":"A",
						"pre":false,
						"val":false,
						"cnt":false
					})
				)
			),
			hh.SEQUENCE(
				{
					"%location":{},
					"%tag":"par"
				},
				hh.AWAIT(
					{
						"%location":{},
						"%tag":"await",
						"immediate":true,
						"apply":function () {
							return ((() => {
								const B=this["B"];
								return B.now;
							})());
						}
					},
					hh.SIGACCESS({
						"signame":"B",
						"pre":false,
						"val":false,
						"cnt":false
					})
				)
			)
		),
		hh.EMIT(
			{
				"%location":{},
				"%tag":"emit", 
				"O":"O",
				"apply":function (){
					return ((() => {
						const O=this["O"];
						return O.preval + 1;
					})());
				}
			},
			hh.SIGACCESS({
				"signame":"O",
				"pre":true,
				"val":true,
				"cnt":false
			})
		)
	)
);

module.exports=prg;

prg.addEventListener("O",foo);

prg.input({"A":1});
prg.input({"B":1});

prg.react({"R":1});
