"use strict";

var hh = require("../hiphop/hiphop.js");
const decache = require('decache');

var main;
var sub;
var prg;

sub = require("./runNode2.js");

main = hh.MODULE({"id":"main","%location":{"filename":"run.hh.js","pos":189},"%tag":"module"},
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":202},"direction":"IN","name":"S"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":208},"direction":"IN","name":"U"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":214},"direction":"INOUT","name":"A"}),
	hh.SIGNAL({"%location":{"filename":"run.hh.js","pos":217},"direction":"INOUT","name":"B"}),
	
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Main1');}
      }
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

