"use strict";

var hh = require("../hiphop/hiphop.js");
const decache = require('decache');

var main;
var sub;
var prg;

sub = require("./runNode2.js");

var sigS = hh.SIGNAL({"%location":{},"direction":"IN","name":"S"});
var sigU = hh.SIGNAL({"%location":{},"direction":"IN","name":"U"});
var sigA = hh.SIGNAL({"%location":{},"direction":"INOUT","name":"A"});
var sigB = hh.SIGNAL({"%location":{},"direction":"INOUT","name":"B"});

var signals = [
	sigS, sigU, sigA, sigB
];

main = hh.MODULE(
	{"id":"main","%location":{},"%tag":"module"},
	signals,
	
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Main1');}
      }
    ),

	hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "A":"A",
          "apply":function (){
            return ((() => {
              const A=this["A"];
              return 25;
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"A",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ),


	hh.RUN({
		"%location":{},
		"%tag":"run",
		"module": hh.getModule("sub", {}),
		"S":"",
		"U":"",
		"W":"A",
		"Z":"B"
	})
);

prg = new hh.ReactiveMachine(main,"run2");

prg.addEventListener("A", ()=> console.log("A") );
prg.addEventListener("B", ()=> console.log("B") );

prg.react("S");
prg.react("S");
prg.react("U");
prg.react();

console.log("--------------");

//delete require.cache[require.resolve("./runNode2.js")];
decache("./runNode2.js");

try{
	sub = require("./runNode2.js");
}catch(err){
	console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
	throw err;
}

prg = new hh.ReactiveMachine(main,"run2");

prg.addEventListener("A", ()=> console.log("A") );
prg.addEventListener("B", ()=> console.log("B") );

prg.react("S");
prg.react("S");
prg.react("U");
prg.react();

