"use hopscript"
require.lang = "hopscript";

var toto="un message";
console.log(toto);

function titi() {
	console.log("Un autre message");
}
exports.titi = titi;