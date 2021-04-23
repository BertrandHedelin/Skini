/********************************

	VERSION NODE JS : Fev 2018

  © Copyright 2017-2021, B. Petit-Hédelin

*********************************/
'use strict'

var par = require('./skiniParametres');
var fs = require("fs");
var oscMidiLocal = require('./OSCandMidi');
var DAW = require('./controleDAW');
var ipConfig = require('./ipConfig');
var groupesClientSon = require('./autocontroleur/groupeClientsSons');

var generatedDir = "./myReact/"

var groupeEncours = 0;


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

// Automate des possibles
var DAWStatus = 0;
var setTimer;
var timer = 1000;
var timerDivision = 4;
var offsetDivision = 0;
var compteurDivisionMesure = 0;
var nbeDeGroupesSons = 0;
var socketControleur;
var ongoingGroupe;
var groupeName = "";
var automatePossibleMachine;
var chargementAuLancementSkini = true;

// Scoring pour les jeux
var computeScorePolicy = 0;
var computeScoreClass = 0;

// CONTROLEUR
var DAWTableReady = false;

/*************************************************
 
	WEBSOCKET EN NODE JS

**************************************************/
var premiereConnexion = true;

const WebSocketServer = require('ws');
const serv = new WebSocketServer.Server({port: ipConfig.websocketServeurPort});

// Broadcast to all.
serv.broadcast = function broadcast(data) {
  //if(debug) console.log("Web Socket Server: broadcast: ", data);
  serv.clients.forEach(function each(client) {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(data);
    }
  });
};

// Pour les broadcasts depuis controle DAW, c'est la structure dans HOP que je garde.
DAW.initBroadCastServer(serv);
groupesClientSon.initBroadCastServer(serv);

/*************************************************************************************

RECEPTION DES TICK MIDI OU BITWIG

**************************************************************************************/
var previousTimeClockMidi =0;
var currentTimeClockMidi = 0;
var tempoTime = 0;

// Vient de midiMix.js et diretement de Bitwig ou de processing
function sendOSCTick(){
	if(debug) console.log("websocketserver: sendOSCTick");
	receivedTickFromDaw();
}
exports.sendOSCTick = sendOSCTick;

function receivedTickFromDaw(){
	if(debug) console.log("websocketserver : receivedTickFromDaw: tick received");
	currentTimeClockMidi = Date.now();
	tempoTime = currentTimeClockMidi - previousTimeClockMidi; // Real duration of a quater note
	if (debug) console.log("websocketserver:dureeDuTickHorlogeMidi:tempoTime=", tempoTime, compteurDivisionMesure,
		groupesClientSon.getTimerDivision());
	previousTimeClockMidi = currentTimeClockMidi;

/*	if(par.pulsationON ){
		reactAutomatePossible( { pulsation:  undefined } );
	}

	// La remise à jour de la durée des patterns est possible depuis les automates.
	// Si les automates ne mettent pas timetDivision à jour, on garde la valuer par défaut
	// donnée dans le fichier de config de la pièce. (compatibilté ascendante)
	if ( groupesClientSon.getTimerDivision() !== undefined){
		timerDivision = groupesClientSon.getTimerDivision();
	}

    //offsetDivision = timerDivision/2;
	if (par.synchoOnMidiClock) {
		if ( compteurDivisionMesure ===  0 ) {  // offsetDivision
			actionOnTick(timerDivision);
		}
	}
	// Ceci est la définition du tick. 
	compteurDivisionMesure = (compteurDivisionMesure + 1) % timerDivision;*/
}

/*************************************************************************************

MATRICE DES POSSIBLES, AUTOMATE

**************************************************************************************/

function initMatriceDesPossibles(DAWState) {

	if ( DAWState == 0 ) {
		if (debug) console.log("WARNING: websocketserver:initMatriceDesPossibles:DAWState à 0" );
		return;
	}
	nbeDeGroupesSons = DAW.getNbeDeGroupesSons();
	groupesClientSon.setNbeDeGroupesSons(nbeDeGroupesSons);
	if ( groupesClientSon.setGroupesSon(DAWState) == -1) {
		console.log("WARNING: websocketserveur:initMatriceDesPossibles: setGroupesSon: vide");
	}
	groupesClientSon.createMatriceDesPossibles();

	var mesReponse = {
		type: "setControlerPadSize",
		nbeDeGroupesClients : par.nbeDeGroupesClients,
		nbeDeGroupesSons: nbeDeGroupesSons
	}

	if (socketControleur.readyState == 1 ) {
		socketControleur.send(JSON.stringify(mesReponse));
	} else {
		console.log("ERR: websocketserveur:initMatriceDesPossibles:", socketControleur.readyState);
	}
}

function actionOnTick(timerDivision) {
	if (debug) {
		currentTimePrevMidi = currentTimeMidi;
		currentTimeMidi = Date.now();
		console.log("webSocketServeur:actionOnTick:diff de temps:", currentTimeMidi - currentTimePrevMidi, ":", timerDivision );
	}

/*	if(!reactAutomatePossible( { tick:  undefined } )) {
		console.log("WARN: websocketserver: actionOnTick: automate not ready");
		return false;
	}*/
	DAW.playAndShiftEventDAW(timerDivision);
	DAW.displayQueues();
	return true;
}

// Pour mettre à jour la vriable sur les longeurs de liste de memorySortable
// Les clients ont besoin de cette variable lors de la connexion. ELle peut évoluer au cours d'une pièce.
function setPatternListLength(value){
	if(debug1) console.log("websocketserver.js : setPatternListLength : value :", value);
}
exports.setPatternListLength = setPatternListLength;

/*************************************************************************************

WEB SOCKET

**************************************************************************************/
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

    // Pour dire à l'ouverture au client si on est ou pas dans une scène où DAW est actif.
    if (debug) console.log("Web Socket Server: DAWON:", par.DAWON);
    msg.type = "DAWON";
    msg.value = par.DAWON; // variable true, false, ou un chiffre
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

	function pushClipDAW(clip) {
		var DAWNote = clip[0];
		var DAWChannel = Math.floor(DAWNote / 127) + 1;
		DAWNote = DAWNote % 127;
		if (DAWChannel > 15) {
			if (debug) console.log("Web Socket Server.js : pushNoteOnDAW: Nombre de canaux midi dépassé.");
			return;
		}
		var nom = clip[3];
		var DAWInstrument = clip[5];
		var dureeClip = clip[10];
		var dureeAttente = DAW.pushEventDAW(par.busMidiDAW, DAWChannel, DAWInstrument, DAWNote, 125, ws.id, pseudo, dureeClip, nom);
		console.log("Web Socket Server.js : pushNoteOnDAW: DAWInstrument", DAWInstrument, " durée: ", dureeAttente);

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

		case "clientScenes": // Pas trés utile, c'est dans scenes.js
			ws.id = msgRecu.value;
			break;

	    case "closeSpectateur":
			if (debug) console.log( "Web Socket Server: received message system : [%s]",
		    msgRecu.text, " from Client ID:", ws.id);
			//DAW.libereDansTableDesCommandes(ws.id);

			messageLog.id = ws.id;
			messageLog.pseudo = msgRecu.pseudo;
			delete messageLog.text;
			delete messageLog.note;		
			logInfoSocket(messageLog);

			ws.close();
			break;

		case "combienDeSpectateurs":
			var value = DAW.nbeDeSpectateursConnectes();
		     var msg = {
            	type: "nbeDeSpectateurs",
            	value: value
            }
			ws.send(JSON.stringify(msg));
			break;

	    case "configuration": // Message converti en signal pour l'automate central
			if (debug) console.log( "Web Socket Server: received message configuration : [%s]",
			msgRecu.text, " from Client ID:", ws.id);
			//machineServeur.inputAndReact( msgRecu.text, msgRecu.extra ); // ENVOI DU SIGNAL VERS HIPHOP
			break;

		case "DAWPseudo":
			break;

		case "DAWReloadConfAgit":
			DAW.initDAWTable("controleDAWAgitV2.csv");
			break;

		case "DAWReloadConfMortDuGolem":
			DAW.initDAWTable("controleDAWMortDuGolemV2.csv");
			break;

	    case "DAWSelectListClips":
            var listClips = new Array(); // Devient alors utilisable pour les controles dans DAW
            listClips = DAW.getListClips(msgRecu.niveaux);
            //if (debug) console.log("Web Socket Serveur: niveaux pour recherche ", msgRecu.niveaux, listClips);   
            var msg = {
            	type: "listClips",
            	listClips: listClips
            }
            ws.send(JSON.stringify(msg));
			break;

	    case "DAWStartClip":
	    	pseudo = msgRecu.pseudo;
	    	if (msgRecu.clipChoisi === undefined ) break; // Protection si pas de selection sur le client
            if (debug) console.log("Web Socket Serveur: DAWStartClip: clipChoisi", msgRecu.clipChoisi, " pour ID: ", msgRecu.id);
			if (debug) console.log('Websocket serveur : DAWStartClip: demandeDeSonParPseudo : ', msgRecu.pseudo, msgRecu.clipChoisi[4]);

			var dureeAttente = pushClipDAW(msgRecu.clipChoisi);
			if ( dureeAttente === -1) {
				break; // On est dans un cas de note répétée
			}

            var msg = {
            	type: "dureeAttente",
            	text: dureeAttente,
            	son: msgRecu.clipChoisi[3]
            }
			// On communique au client le temps d'attente avant d'entendre.
		    ws.send(JSON.stringify(msg));

			oscMidiLocal.sendProcessing( "/DAWPseudo", msgRecu.pseudo );

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

		case "dureeDuTickHorlogeMidi": // Reçu de Processing chaque 24 pulses de l'horloge Midi (une noire)
			receivedTickFromDaw();
			break;

		case "loadDAWTable" : // Piloté par le controleur, charge une config et les automates
			// Controle de l'existence de la table (déclaration du fichier csv) avant de la charger
			DAWTableReady = false;
			if ( par.configClips[msgRecu.value] != "" && par.configClips[msgRecu.value] != undefined ) {
				try{
					DAW.loadDAWTable(par.configClips).then(function() {
						DAWStatus = msgRecu.value + 1; // !! La valeur reçue est un index et non la valeur d'DAWON
						if(debug1) console.log("INFO: websocketServer: loadDAWTable OK: DAWStatus:", DAWStatus );

/*						try{
							automatePossibleMachine = groupesClientSon.makeOneAutomatePossibleMachine(DAWStatus);
						}catch(err){
							console.log("ERR: websocketserver.js: pb makeOneAutomatePossibleMachine", err);
							throw err;
							return;
						}
						// Pour l'emission des commandes OSC depuis l'orchestration vers un jeu
						if(par.gameOSCIn !== undefined){
							gameOSC.setOrchestration(automatePossibleMachine);
							gameOSC.init();
						}
						DAW.setAutomatePossible(automatePossibleMachine);
						console.log("INFO: websocketServer: loadDAWTable: HipHop compiled\n");
						hop.broadcast('consoleBlocklySkini', "HipHop compiled");

						try{
							reactAutomatePossible( {DAWON :  DAWStatus} );
						}catch(e){
							console.log("websocketServerSkini:loadDAWTable:catch react:", e);
					   	}
					   	DAWTableReady = true;*/
					   	
					}).catch( function(err) {
						console.log("ERR: websocketServer: loadDAWTable :", par.configClips[msgRecu.value], err.toString());
					   	hop.broadcast('consoleBlocklySkini', err.toString());
					   	throw err;
					});
				}catch (err){
					break;
				}
			}else{
				console.log("WARNING: websocketServer: loadDAWTable: table inexistante dans cette configuration.");
				hop.broadcast('consoleBlocklySkini', "No orchestration at this position"); // Pour Blockly
				var mesReponse = {
					type: "noAutomaton"
				}
				ws.send(JSON.stringify(mesReponse));
			}
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

		case "startSpectateur": // On récupère l'ID du client
			ws.id = msgRecu.id;
			
			//timeToPlay = msgRecu.date; // On initialise l'heure venu du client.
			//testLatence(ws);

			if(debug1) console.log("websocketserbeur: startSpectateur: ", msgRecu);

			// On ne permet donc qu'un seul controleur.
			// Attention: La connexion d'un deuxième contrôleur, fait perdre la première et réinitialise la matrice des possible.
			if ( msgRecu.text === "controleur") {
				if (debug) console.log("webSocketServeur: startSpectateur: un controleur connecté");
				socketControleur = ws;
				groupesClientSon.setSocketControleur(ws);
				initMatriceDesPossibles(DAWStatus);
				break;
			}

			/*
			if ( msgRecu.text === "simulateur") {
				if(par.simulatorInAseperateGroup){
					// Assignation d'un groupe au client
					var mesReponse = {
						type: "groupe",
						noDeGroupe : par.nbeDeGroupesClients-1
					}
					ws.send(JSON.stringify(mesReponse));
				
					groupesClientSon.putIdInGroupClient(ws.id, par.nbeDeGroupesClients-1);

					// Pour dire à l'ouverture au simulateur si on est ou pas dans une scène où DAW est actif.
				    if (debug) console.log("Web Socket Server: DAWON:", par.DAWON);
				    msg.type = "DAWON";
					msg.value = DAWStatus;
					ws.send(JSON.stringify(msg));
					break;
				}
			}

			if (debug) console.log("websocket serveur: startSpectateur: ",ws.id, "dans groupe:", groupeEncours, msgRecu, clientsEnCours);

			// Assignation d'un groupe au client
			var mesReponse = {
				type: "groupe",
				noDeGroupe : groupeEncours
			}
			ws.send(JSON.stringify(mesReponse));
*/
			groupesClientSon.putIdInGroupClient(ws.id, groupeEncours);
/*
			if (debug) console.log("websocket serveur: startSpectateur: groupesClientSon:", groupesClientSon.getGroupesClient() );

			// Pour une distribution équilibrée entre les groupes
			// Si on souhaite avoir le simulateur sur un groupe non distribué à l'audience,
			// dans le fichier de configuration on met simulatorInAseperateGroup = true;
			// Ceci réserve le dernier groupe Client pour le simulateur puisque groupeEnCours n'aura jamais
			// la valeur maximale nbeDeGroupesClients
			if( par.nbeDeGroupesClients === 1 && par.simulatorInAseperateGroup){
				console.log("WARN: ATENTION PAS DE GROUPE ASSIGNE A L'AUDIENCE !");
			}
			groupeEncours++;
			if(par.simulatorInAseperateGroup){
				groupeEncours %= par.nbeDeGroupesClients - 1;
			}
			else{
				groupeEncours %= par.nbeDeGroupesClients;
			}
			// Essai sur les latences
			//timeToPlay = msgRecu.date; // On initialise l'heure venue du client.
			//testLatence(ws);

			// Pour dire à l'ouverture au client si on est ou pas dans une scène où DAW est actif.
		    if (debug) console.log("Web Socket Server: DAWON:", par.DAWON);
		    msg.type = "DAWON";
		    //msg.value = par.DAWON; // variable true, false, ou un chiffre
			msg.value = DAWStatus;
			ws.send(JSON.stringify(msg));

			*/
			break;

		case "setDAWON":
			// msgRecu.value > 0 => DAW Active
			DAWStatus = msgRecu.value;
			if (DAWTableReady) {
			    if(debug1) console.log("websocketServer:setDAWON:",DAWStatus);
				DAW.cleanQueues();

				var msg = {
					type: "DAWStatus",
					matrice : msgRecu.value
				}
				serv.broadcast(JSON.stringify(msg));

				initMatriceDesPossibles(DAWStatus);
				// Pour être en phase avec la création du pad controleur
				groupesClientSon.resetMatriceDesPossibles();
			} else {
				console.log("WARNING: Table des commandes DAW pas encore chargée: ", DAWStatus);
				var msg = {
					type: "DAWTableNotReady",
					text : "Table des commandes DAW pas encore chargée"
				}
            	ws.send(JSON.stringify(msg));
			}
			break;

	    case "system": // Message converti en signal pour l'automate central
			if (debug) console.log( "Web Socket Server: received message : [%s]",
			msgRecu.text, " from Client ID:", ws.id);
			machineServeur.inputAndReact( msgRecu.text, ws.id ); // ENVOI DU SIGNAL VERS HIPHOP
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








