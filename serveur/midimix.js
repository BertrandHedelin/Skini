"use hiphop"
"use hopscript"

/*************************************************************************** 
  SKINI
  midimix.js on Node.js
  
  © Copyright 2017-2020, B. Petit-Heidelein

   CONTROLE DEPUIS LES COMMANDES MIDI VIA OSC

   Ce programme est utilisé:
   1) Dans le cas d'ABleton, pour recevoir et traiter les commandes OSC venant de Processing qui sert de pont MIDI.
   Processing reçoit le MIDI qui envoie
   ces données MIDI de façon assez brute: NoteOn, NoteOff et ControlChange.

   2) Dans le cas de Bitwig, pour traité les message OSC envoyé directement pas Bitwig.

   On peut emettre des signaux HipHop d'ici.

   Le port de réception des commandes OSC est portWebSocket du fichier de config (.js)
   Remarque: la chaine est complexe pour MIDIMIX:
   MIDIMIX =(midi)=> Processing =(OSC)=> Serveur =(OSC)=> Processing (VISU)

**************************************************************************/

exports.midimix =  function(machineServeur, websocketServer) {

   var par = require('./ipConfig');
   var osc = require('osc-min');
   var dgram = require("dgram");
   var sock = dgram.createSocket('udp4');
   var debug = false;
   var debug1 = true;

   var previousNote = 0;
   var previousNotes = [0, 0, 0];
   var previousChannel = 0;
   var previousTimeStamp = 0;

	var note;
	var canal;
	var timeStamp;
	var noteSkini;

	function insertInPreviousNotes(laNote){
		for (var i=1; i < previousNotes.length ; i++){
			previousNotes[i-1] = previousNotes[i];
		}
		previousNotes[previousNotes.length-1] = laNote;
		if(debug) console.log("midimix: insInPreviousNote: ", previousNotes);
	};

	function isInPreviousNotes(laNote){
		for (var i=0; i < previousNotes.length ; i++){
			if (previousNotes[i] === laNote) return true;
		}
		return false;
	};

   sock = dgram.createSocket("udp4", function(msg, rinfo) {
    var error, message;
    try {
	 message = osc.fromBuffer(msg); // Message OSC recu
	 //msgloc.type  = message.address;
	 //msgloc.value1 =  message.args[0].value; // C'est compliqué le parsing OSC
	 //ws.send(JSON.stringify(msgloc));        // Pas utile pour le moment
	 if (debug) {
	 	console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
	 }
	switch(message.address) {

		case "/AkaiControlerChange":  // Emission des signaux en fonction des CC reçus
		    switch(message.args[0].value) {
			    case 62 :  // Ce CC de MIDIMIX est suivi de la configuration complète de la table...
			       machineServeur.inputAndReact("scene", 4); // Pour démo, pas utilisable en l'état
			       break;
			    default:   return;
		    }
		    break;

	   	case "/AkaiNoteOff": 
	   		if(debug) console.log("midimix.js: Commande NoteOFF OSC:", message.args[0].value);
	   	    break;

		case "/nanoKEY2NoteOff":
			if(debug) console.log("midimix.js: Commande NoteOFF OSC:", message.args[0].value);
			break ;

		case "/AbletonNoteOn":
		case "/BitwigNoteOn":
		case "/AkaiNoteOn":  // Emission des signaux en fonction des notes Midi reçues
		case "/nanoKEY2NoteOn": 
		    if(debug) console.log("midimix.js: Commande NoteON OSC:", message.args[0].value);
		    switch(message.args[0].value) {

			    case 25 :
			    	websocketServer.sendSignalStartFromMIDI();
			       	break;

			    case 26 :
			    	websocketServer.sendSignalStopFromMIDI();
			       	break;

			    default:   
			    	websocketServer.sendSignalFromMIDI(message.args[0].value);
			    	break;
		    }
	        break;

		case "/MPK25NoteOn":
		case "/Session1NoteOn":
		    break;

	    // Traitement des commandes MIDI reçues d'Ableton lorsqu'un clip est lancé.
	    // C'est un mécanisme utilisé pour traiter des "patterns pivots", cad qui peuvent être utilisés
	    // dans l'orchestration comme événements.
	    // Il y a ici un filtrage un peu particulier lié à la façon dont Ableton envoie les commandes MIDI
	    // à l'activation d'un clip.
		case "/StartClipNoteOn" :
			note = parseInt(message.args[0].value);
			canal = parseInt(message.args[1].value);
			timeStamp = parseFloat(message.args[2].value); // String car pb avec les Floats
			// Ableton envoie les commandes MIDI en comptant depuis le canal 1 (et pas 0 comme d'autres contrôleurs)
			// Il faut donc faire attention à la gestion des canaux MIDI en fonction du contrôleur.
			noteSkini = note + (canal -1) * 127;

			// Ableton répéte 1 fois le message NoteON une première fois (deux envois) avec un léger décalage temporel.
			// Si le pattern tourne, et qu'il est activé, Ableton envoie 4 commandes MIDI noteON avec le même timestamp.
			// En divisant le timestamp par 1 000 000, on est proche de la seconde. Le timestamp est proche de la micro-seconde.
			if (isInPreviousNotes(noteSkini) && previousTimeStamp === Math.round(timeStamp/1000000)){ // à peu près une seconde
					if (debug) console.log("midimix.js: REPETITION : ", noteSkini, timeStamp, previousTimeStamp);
					break;
			}

			previousTimeStamp = Math.round(timeStamp/1000000); 

			if (debug){
				console.log("midimix.js: socket reçoit OSC: [", message.address + " : "
				+ message.args[0].value,
				+ message.args[1].value,
				+ message.args[2].value,
				"]");
			}

			if(debug) console.log("midimix.js: noteSkini: ", noteSkini, note, canal);
			if(debug) console.log("isInPreviousNotes:", isInPreviousNotes(noteSkini));
			
			// Avec PUSH branché, Ableton Live envoie des notes négatives...
			// dont je ne connais pas la signification
			if(noteSkini > 0 ) {
				insertInPreviousNotes(noteSkini);
				websocketServer.sendSignalFromAbleton(noteSkini);
			}

			break;

		case "/StopClipNoteOff" :
			break;

		case "/ClipControlerChange" :
	 	    if (debug) console.log("Valeur du CC=" , message.args[1].value);
	 	    break;

	 	case "/videoNoteOn":
	 		websocketServer.sendSignalFromMidiMix(message.args[0].value);
	 		break;

	 	case "/AbletonTick":
	 	case "/BitwigTick":
	 		//console.log("midimix.js: tick: ", message.args[0].value);
	 		websocketServer.sendOSCTick();
	 		break;

	 	default:
	 		console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + (message.args[0].value) , "]");
	 		break;
	 }
	 return; // console.log(osc.fromBuffer(msg));
    }catch(error){
    	console.log("midimix.js: ERR dans réception OSC :", message.args, error);
		return;
    }
   });

   sock.on('listening', function () {
      var address = sock.address();
      if(debug1) console.log('midimix.js: UDP Server listening on ' + address.address + ":" + address.port);
   });

   sock.bind(par.InPortOSCMIDIfromDAW, par.serverIPAddress);
}
