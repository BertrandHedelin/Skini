/********************************

	VERSION NODE JS : Fev 2018

*********************************/


var par = require('./logosParametres');
var fs = require("fs");
var oscMidiLocal = require('./logosOSCandMidiLocal');
var ableton = require('./controleAbleton');
var generatedDir = "./myReact/"

const tripleCrocheTR = 2;
const tripleCrocheR = 3;
const doubleCrocheTR = 4;
const doubleCrocheR = 6;
const crocheTR = 8;
const crocheR = 12;
const noireTR = 16;
const noireR = 24;
const blancheTR = 32;
const blancheR = 48;
const rondeTR = 64;
const rondeR = 96;

// INITIALISATION DES DONNEES D'INTERACTION DU SEQUENCEUR
var tempsMesure = 4;    		// Partie haute de la mesure, nombre de temps dans la mesure
var divisionMesure = noireR; 	// Partie basse de la mesure
var nbeDeMesures = 1;
var tempo = 60; 				// à la minute
var canalMidi = 1;
var dureeDuTick = ( (60 / tempo ) / divisionMesure ) * 1000 ; // Exprimé ici en millisecondes

var debug = false;
var debug1 = true;
var previousTime =0;
var currentTime = 0;
var timeToPlay = 0;
var previousTimeToPlay = 0;
var defautDeLatence;

/*************************************************
 
	WEBSOCKET EN NODE JS

**************************************************/
var premiereConnexion = true;

const WebSocketServer = require('ws');
const serv = new WebSocketServer.Server({port: 8383});

// Pour les broadcasts depuis controle ableton, c'est la structure dans HOP que je garde.
ableton.initBroadCastServer(serv);

// Broadcast to all.
serv.broadcast = function broadcast(data) {
  //if(debug) console.log("Web Socket Server: broadcast: ", data);
  serv.clients.forEach(function each(client) {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(data);
    }
  });
};

serv.on('connection', function (ws) {

  	// Pas trés jolie... mais ça lance le mécanisme de lecture du buffer de commande midi.
  	if (premiereConnexion) {
	  	playerBuffer = setInterval( function() { 
			nextEventInBuffer();
	  	}, resolutionDuBuffer );
	  	premiereConnexion = false;
	}

  	// Variables locales à la session websocket
	//var ws = event.value;
	var index = -1;

	var msg = {
	    type: "message",
	    text: "Server: Connection Websocket OK" ,
	    value:   2,
	};

	var messageLog = {
		date: "",		
		source: "websocketServerSkini.js",
		type: "log",
		note: "",
		pseudo: "",
		id: ""
	}

	var pseudo;
	var listClips;

	// Pour informer que l'on est bien connecté
	if (debug1) console.log( "Web Socket Server: connection established:");
    msg.type = "message";
    msg.text = "Bienvenue chez GOLEM !"
	ws.send(JSON.stringify(msg));

    // Pour dire à l'ouverture au client si on est ou pas dans une scène où Ableton est actif.
    if (debug) console.log("Web Socket Server: abletonON:", par.abletonON);
    msg.type = "abletonON";
    msg.value = par.abletonON; // variable true, false, ou un chiffre
	ws.send(JSON.stringify(msg));

	// DONNEES DE TEMPO pour les séquenceurs.
	var msgTempo = {
		type : "setConfigSequenceur",
		tempsMesure: tempsMesure,
		divisionMesure: divisionMesure,
		nbeDeMesures : nbeDeMesures,
		tempo : tempo,
		canalMidi : canalMidi,
		dureeDuTick : dureeDuTick
	}
	ws.send(JSON.stringify(msgTempo));

	function pushClipAbleton(clip) {
		var abletonNote = clip[0];
		var abletonChannel = Math.floor(abletonNote / 127) + 1;
		abletonNote = abletonNote % 127;
		if (abletonChannel > 15) {
			if (debug) console.log("Web Socket Server.js : pushNoteOnAbleton: Nombre de canaux midi dépassé.");
			return;
		}
		var nom = clip[3];
		var abletonInstrument = clip[5];
		var dureeClip = clip[10];
		var dureeAttente = ableton.pushEventAbleton(par.busMidiAbleton, abletonChannel, abletonInstrument, abletonNote, 125, ws.id, pseudo, dureeClip, nom);
		console.log("Web Socket Server.js : pushNoteOnAbleton: abletonInstrument", abletonInstrument, " durée: ", dureeAttente);

		return dureeAttente;
	}

	ws.on('close', function() {
		if (debug) console.log( "Web Socket Server: Socket closed by client." );
	});

	ws.on('error', function( event ){
	  	console.log( "Web Socket Server: Erreur sur socket:", ws.socket, " ", event );
	});

  	ws.on('message', function (message) {
	    if(debug) console.log('received: %s', message);

	    var msgRecu = JSON.parse(message);
		var mixReaper;

	   // Pour le Log des messages reçus
	   messageLog.date = getDateTime();
	   messageLog.type = msgRecu.type;

	  switch(msgRecu.type) {
	  	case "pong":
	  	  	var date = new Date();
			datePong = date.getTime(); // en ms
			latencePing = (datePong - datePing)/2; // Aller-retour
			setClientLatency( ws.id, latencePing );
			console.log("Latence sur Ping", latencePing, listeDesLatences );
			break;

		case "ping":
			var mesReponse = {
				type: "pong"
			}		
			ws.send(JSON.stringify(mesReponse));
			break;

	  	case "midiNoteOn":
	  		// Pour valider la latence
  			var date = new Date();

	  		if ( msgRecu.velocite != 0 ) { //Pour se limiter au NoteON
		  		// Pour prendre en compte le moment où le client a lancé sa commande Midi
		  		previousTimeToPlay = timeToPlay; // sec
		  		timeToPlay = msgRecu.date; // sec

		  		previousTime = currentTime; // ms
	  			currentTime = date.getTime(); // ms

		  		// On en peut pas comparer les dates sur le client et le serveur, mais on peut voir les différence de délai entre notes.
		  		defautDeLatence = (timeToPlay - previousTimeToPlay)*1000 - (currentTime - previousTime); // (Delta entre 2 notes sur le client) - (même delta sur le serveur)
		  		// Si defautDeLatence > O, l'écart sur le client est > à celui sur le serveur
		  		// on avait du retard sur l'evenement d'avant, si defautDeLatence > 0 on a du retard sur l'evenement actuel
		  		// si defautDeLatence == 0 on est en phase.
		  		// Mais est-ce bien pertinent de comparer l'horloge webaudio du client avec l'horloge JS du serveur ?
		  		// Ceci peut aussi demeontrer l'irregularité de JS

				//console.log( "DEFAUT DE LATENCE:", defautDeLatence );

				// Profitons de l'occasion pour vérifier la latence avec un ping/pong
	  			testLatence(ws);
			}

	  		//oscMidiLocal.sendNoteOn( msgRecu.bus, msgRecu.canal, msgRecu.codeMidi, msgRecu.velocite );
			putEventInPlayBuffer(listeDesLatences[ws.id], msgRecu);

	  		break;

		case "clientScenes": // Pas trés utile, c'est dans scenes.js
			ws.id = msgRecu.value;
			break;

		case "abletonPseudo":
			break;

		case "startSpectateur": // On récupère l'ID du client
			ws.id = msgRecu.id;
			timeToPlay = msgRecu.date; // On initialise l'heure venu du client.
			testLatence(ws);
			break;

	    case "system": // Message converti en signal pour l'automate central
			if (debug) console.log( "Web Socket Server: received message : [%s]",
			msgRecu.text, " from Client ID:", ws.id);
			machineServeur.inputAndReact( msgRecu.text, ws.id ); // ENVOI DU SIGNAL VERS HIPHOP
			break;

	    case "configuration": // Message converti en signal pour l'automate central
			if (debug) console.log( "Web Socket Server: received message configuration : [%s]",
			msgRecu.text, " from Client ID:", ws.id);
			machineServeur.inputAndReact( msgRecu.text, msgRecu.extra ); // ENVOI DU SIGNAL VERS HIPHOP
			break;

	    case "closeSpectateur":
			if (debug) console.log( "Web Socket Server: received message system : [%s]",
		    msgRecu.text, " from Client ID:", ws.id);
			//ableton.libereDansTableDesCommandes(ws.id);

			messageLog.id = ws.id;
			messageLog.pseudo = msgRecu.pseudo;
			delete messageLog.text;
			delete messageLog.note;		
			logInfoSocket(messageLog);

			ws.close();
			break;

	    case "abletonStartClip":
	    	pseudo = msgRecu.pseudo;
	    	if (msgRecu.clipChoisi === undefined ) break; // Protection si pas de selection sur le client
            if (debug) console.log("Web Socket Serveur: abletonStartClip: clipChoisi", msgRecu.clipChoisi, " pour ID: ", msgRecu.id);
			if (debug) console.log('Websocket serveur : abletonStartClip: demandeDeSonParPseudo : ', msgRecu.pseudo, msgRecu.clipChoisi[4]);

			var dureeAttente = pushClipAbleton(msgRecu.clipChoisi);
			if ( dureeAttente === -1) {
				break; // On est dans un cas de note répétée
			}

			// On communique au client le temps d'attente avant d'entendre.
			msg.type = "dureeAttente";
			msg.text = dureeAttente;
			msg.son = msgRecu.clipChoisi[3];
		    ws.send(JSON.stringify(msg));

			oscMidiLocal.sendProcessing( "/abletonPseudo", msgRecu.pseudo );

		    // Informe tout le monde
			var messageBroadcast = msgRecu.pseudo + " a choisi " + msgRecu.clipChoisi[3];
			msg.type = "demandeDeSonParPseudo";
			msg.text = messageBroadcast;
			delete msg.listClips;
			serv.broadcast(JSON.stringify(msg));

			// Log la manip
			messageLog.note = msgRecu.clipChoisi[3];
			messageLog.id = ws.id;
			messageLog.pseudo = msgRecu.pseudo;
			messageLog.text = msg.text;
			logInfoSocket(messageLog);
			break;

	    case "abletonSelectListClips":
            listClips = new Array(); // Devient alors utilisable pour les controles dans Ableton
            listClips = ableton.getListClips(msgRecu.niveaux);
            //if (debug) console.log("Web Socket Serveur: niveaux pour recherche ", msgRecu.niveaux, listClips);   
            msg.type = "listClips";
            msg.listClips = listClips;
            ws.send(JSON.stringify(msg));
			break;

		case "abletonReloadConfAgit":
			ableton.initAbletonTable("controleAbletonAgitV2.csv");
			break;

		case "abletonReloadConfMortDuGolem":
			ableton.initAbletonTable("controleAbletonMortDuGolemV2.csv");
			break;

		case "combienDeSpectateurs":
			msg.type ="nbeDeSpectateurs";
			msg.value = ableton.nbeDeSpectateursConnectes();
			ws.send(JSON.stringify(msg));
			break;

		case "getReaperMix":
			if (debug) console.log("Web Socket Serveur: GET REAPER MIX: "+ msgRecu.scene + ":" + msgRecu.conf);
			mixReaper = oscMidi.getReaperMix(msgRecu.scene, msgRecu.conf);
			if (debug) console.log("websocket server: Voici le mix reaper extrait: " + mixReaper);
			msg.type = "reaperMix";	
			msg.text = "Param du reaperMix";
			msg.mix = mixReaper;
			ws.send(JSON.stringify(msg));
		    break;

		case "changeReaperMix":
			if (debug) console.log("WebSocket Serveur: CHANGE REAPER MIX: "+ msgRecu.scene + ": " + msgRecu.conf + ": " + msgRecu.channel + ": " + msgRecu.value);
			oscMidi.changeReaperMix(msgRecu.scene, msgRecu.conf, msgRecu.channel, msgRecu.value);
			break;

		case "saveBlocklyGeneratedFile":
			if(debug1) console.log("saveBlocklyGeneratedFile: fileName", msgRecu.fileName , "\n--------------------");
			if(debug1) console.log(msgRecu.text);
			fs.writeFile(generatedDir + msgRecu.fileName + ".js", msgRecu.text, function (err) {
			  if (err) return console.log(err);
			  console.log(msgRecu.fileName + ".js", " written");
			});

			fs.writeFile(generatedDir + msgRecu.fileName + ".xml", msgRecu.xmlBlockly, function (err) {
			  if (err) return console.log(err);
			  console.log(msgRecu.fileName + ".xml", " written");
			});
			break;

		case "loadBlocks":
			fs.readFile(generatedDir + msgRecu.fileName, 'utf8' , (err, data) => {
				if (err) {
				  console.error(err);
				  return;
				}
				console.log(data);
				var msg = {
			  		type: "blocksLoaded",
			  		data: data,
			  	}	
				ws.send(JSON.stringify(msg));
			});
			break;

	    default:  console.log( "Web Socket Serveur: Type de message inconnu : " , msgRecu);
	}
  });
});

/****** FIN WEBSOCKET ************/

var latenceMax = 200; // en ms
var indexCourantBuffer = 0;
var playerBuffer;
var resolutionDuBuffer = dureeDuTick / 10 ; // A voir : l'impact réel de la résolution / à la durée du tick

// Pour mémoire de la structure
var midiEvent = {
	bus: 0,
	canal: 1,
	codeMidi: 64,
	velocite: 125,
}

var datePing;
var datePong;
var latencePing;

// Buffer à deux dimensions des evements Midi [ [bus, canal, codeMidi, velocite ], ...... ]
var playBuffer = new Array( Math.floor(latenceMax / resolutionDuBuffer) + 1 );
// On a besoin d'initialiser le buffer à cause des lectures systématiques dès le départ
for ( var i=0; i < playBuffer.length; i++) playBuffer[i] = new Array(); 
var finplayBuffer = playBuffer.length;

// Associative array
var listeDesLatences = {};

function setClientLatency(id, latence) {
	listeDesLatences[id] = latence;
}

function removeClientLatency(id) {
	delete listeDesLatences[id];
}

function putEventInPlayBuffer(latence, midiEvent) {
	// C'est là que se joue la précision du séquenceur
	// Le ratio latence / resolutionDuBuffer est important
	// S'il n'y a pas de latence on pose l'evt en queue du buffer

	if ( latence > latenceMax )  latence = latenceMax; // Limitation de la latence, sécurité au départ
 
 	// C'est là que l'on tient compte de la latence pour positionner le midiEvent dans le buffer.
 	// Si la latence est faible, l'evement sera en queue du buffer pour être jouer plus tard
 	// Si la latence est longue il sera en tête pour être joué plus rapidement.
	// Ceci est censé améliorer les décalages dus à la latence, mais c'est plutôt JS qui crée des décalages.

	index = (playBuffer.length - Math.floor(latence / resolutionDuBuffer)) - 1;
	//console.log("putEventInPlayBuffer, index : ", index ," buffer length: " , playBuffer.length," latence : ", latence, " playBuffer[index] : ", playBuffer[index]);

	playBuffer[index].push(midiEvent);
}

// Cettes fonction est appelée par un setInterval qui démarre au moment de la connexion.
// La fréquence est définie par resolutionDuBuffer.

function playEventInPlayBuffer(index) {

	if ( playBuffer[index] != undefined ) {
		// Il faudra peut-etre tenir compte d'un séquencement quelconque, si un noteoff arrive avant in noteon.
		// Ce serait possible en cas de forte instabilité de la latence.
		//console.log("playEventInPlayBuffer", playBuffer[index] );
		// On joue les notes en index
		for (var i=0; i < playBuffer[index].length ; i++) {
			if ( playBuffer[index] != undefined ) {
				console.log("playEventInPlayBuffer", playBuffer[index][i].bus, playBuffer[index][i].canal, playBuffer[index][i].codeMidi, playBuffer[index][i].velocite );
				oscMidiLocal.sendNoteOn( playBuffer[index][i].bus, playBuffer[index][i].canal, playBuffer[index][i].codeMidi, playBuffer[index][i].velocite );

				// On vide l'index
				playBuffer[index].splice(i,1);
			}
		}
	}
}

function nextEventInBuffer() {
 	playEventInPlayBuffer(indexCourantBuffer);
 	indexCourantBuffer++;
 	indexCourantBuffer %= finplayBuffer;
}

function testLatence(ws) {
	var date = new Date();
	datePing = date.getTime(); // ms
	var msgPing = {
		type: "ping",
		value : "azertytrytrytrytrytrytrytrytrytrytrytr"
	};
	ws.send(JSON.stringify(msgPing));
}


function logInfoSocket(message){
	fs.appendFile('skinilog.json', JSON.stringify(message) + "\n", "UTF-8", function (err) { 
		if (err) { 
	   		console.error(err);
	   		throw err;
		}
    });
}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + ":" + month + ":" + year + ":" + hour + ":" + min + ":" + sec;
}










