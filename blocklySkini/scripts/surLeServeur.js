/**************************************************

Editeur Skini en ligne avec Blockly

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
var debug = true;

var tempFile = "temp.js";
//var tempFile = tempName + "0";

// Listeners pour test
function createListeners(machine){
	machine.addEventListener("toto", function(evt) {
	  console.log("toto from HipHop:", evt.signalValue);
	});

	machine.addEventListener("display", function(evt) {
	  console.log("display from HipHop:", evt.signalValue);
	});
}

service getFileBlockly(path) {
    if (debug) console.log("getFileBlockly:", path);
      return hop.HTTPResponseFile( path, { contentType: "text/plain", charset: hop.locale } );
}

service saveBlocksOnServer(file, data){
	if (debug) console.log("saveBlocks recoit:", file);
	fs.writeFileSync(file, data);
}

var lesSignaux;
var signalsGlobal;
var listSignals = [];

service executeHHServeur(signals) {
	listSignals = [];
	console.log("surLeServeur: executeHHServeur: Signals recieved:\n", listSignals, "\n");

	if (signals !== undefined && signals !== ""){
		var listSignalsMacro = signals.toString().replace(/ /g, "").split(',');
		for (var i=0; i < listSignalsMacro.length; i++){
			var unSignal = listSignalsMacro[i].split(':');
			if (unSignal[1] === undefined){
				listSignals.push([unSignal[0], undefined]);
			}else{
				listSignals.push([unSignal[0], unSignal[1]]);
			}
		}
		// Fabrication de la chaine pour la création du paramètre du react()
		var signalsString = "lesSignaux = {";
		for (var i=0; i < listSignalsMacro.length; i++){
			signalsString += "\'" + listSignals[i][0] + "\' : ";
			signalsString += listSignals[i][1] + ",";
		}
		signalsString += " };";
		console.log("signalsString:", signalsString);
		eval(signalsString);
		HipHopMachine.react(lesSignaux);
	}else{
		HipHopMachine.react();
	}
}

service printServeur(data) {
	console.log(data);
}

service generateHHcode(data){

	console.log("generateHHcode:\n", data);
	//const prgm = hh.eval(data);
	//HipHopMachine = new hh.ReactiveMachine(prgm, "automate");
	
/*	fs.unlink(tempFile, (err) => {
        if (err) {
            if (debug) console.log("failed to delete local tempFile:"+err);
        } else {
            console.log('successfully deleted:', tempFile);                        
        }
	});*/

	if(fs.existsSync(tempFile)){
		try{
        	fs.unlinkSync(tempFile);
        	console.log("unlink:", tempFile);
    	}catch(err){
    		console.log("ERR:", err);
    	}
	}

	fs.writeFileSync(tempFile, data);

	// Le require lance la compilation du programme HH
	delete require.cache[require.resolve("../" + tempFile)];
	HHcompiled = require("../" + tempFile, "hiphop").hh;

	// Il faut recréer l'automate
	HipHopMachine = new hh.ReactiveMachine(HHcompiled, "automate");
}

