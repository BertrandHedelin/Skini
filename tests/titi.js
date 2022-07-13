// 8787

var toto = require("./toto.js");

function setTruc(texte){
	toto.setTruc(texte);
}
exports.setTruc = setTruc;

function getTruc(){
	return toto.getTruc();
}
exports.getTruc = getTruc;
