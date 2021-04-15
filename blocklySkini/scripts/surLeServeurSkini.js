/**************************************************

Editeur Skini sur Node.js avec Blockly

© Copyright 2017-2021, Bertrand Petit-Hédelin

****************************************************/

"use hiphop"
"use hopscript"

const hh = require("hiphop");
const fs = require( "fs" );
require.lang = "hopscript";

var HipHopMachine;
var codeHH;
var HHcompiled;
var debug = false;

// Pour test
var tempFile = "./serveur/autocontroleur/autoTestBlockly.js";

const HHfilePath = "./serveur/autocontroleur/";
var pathHere = "./blockly-hop/orchestrations/";

// Avec Skini
//var tempFile = ""; //./serveur/autocontroleur/autoTestBlockly.js";
//var pathHere ="./blockly-hop/"; 

service getFileBlockly(file) {
	var path = pathHere + file;
    if(debug) console.log("surLeServeurSKini.js: getFileBlockly:", path);
    //if(debug) console.log("getFileBlockly:", require.resolve("../" + path));
      return hop.HTTPResponseFile( path, { contentType: "text/plain", charset: hop.locale } );
}

service saveBlocksServer(file, d1){
	var path = pathHere + file + ".xml";
	if(debug) console.log("surLeServeurSKini.js: saveBlocksServer: recoit:", path);
	if(fs.existsSync(path)){
        fs.unlinkSync(path);
        if(debug) console.error("surLeServeurSKini.js: saveBlocksServer: unlinked :", path);
	}
	try {
		fs.writeFileSync(path, d1);
		if(debug) console.error("surLeServeurSKini.js: saveBlocksServer: writeFileSync :", path);
		console.log("Fichier Skini enregistré :", path);
	} catch (err) {
	  console.error("surLeServeurSKini.js: saveBlocksServer: writeFileSync:", err)
	}
	return true;
}

service printServeurFromBlockly(data) {
	console.log(data);
}

// Pour test, pas utile en production
service generateHHcode(data){
	//if (debug) console.log("----- generateHHcode -----\n", data, "\n ----- End of generated Code -----");
	if (debug) {
		console.log("generateHHcode: Exist Sync:", fs.existsSync(tempFile));
		//console.log("generateHHcode:", require.resolve("../" + tempFile));
	}

	if(fs.existsSync(tempFile)){
        fs.unlinkSync(tempFile);
	}

	try {
		fs.writeFileSync(tempFile, data);
	} catch (err) {
	  console.error("generateHHcode: writeFileSync:", err)
	}
	console.log("generateHHcode: Orchestration written:", tempFile);
}

service generateHHfile(file, data){
	//if (debug) console.log("----- generateHHcode -----\n", data, "\n ----- End of generated Code -----");
	var HHfile = HHfilePath + "auto" + file + ".js";
	if(debug) console.log("surLeServeurSKini.js: HHfile:", HHfile);
	if (debug) {
		console.log("surLeServeurSKini.js: generateHHfile: Exist Sync:", fs.existsSync(HHfile));
	}

	if(fs.existsSync(HHfile)){
        fs.unlinkSync(HHfile);
	}

	try {
		fs.writeFileSync(HHfile, data);
	} catch (err) {
	  console.error("ERR : surLeServeurSKini.js: generateHHfile: writeFileSync:", err)
	}
	if(debug) console.log("surLeServeurSKini.js: generateHHfile: Orchestration written:", HHfile);
}