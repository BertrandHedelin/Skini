var toto = require("./toto.js");
var titi = require("./titi.js");

toto.setTruc("truc1");

console.log(titi.getTruc());

var titi = require("./titi.js");
console.log(titi.getTruc());

toto.setTruc("truc2");
console.log(titi.getTruc());