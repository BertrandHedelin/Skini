/********************************************

CODE CLIENT POUR JEU DE TYPE MEMORY MUSICAL
Sur NODE JS
© Copyright 2017-2021, B. Petit-Hedelin

Utilise:
https://github.com/SortableJS/Sortable

********************************************/
'use strict'

var par = require('../../serveur/skiniParametres');
var ipConfig = require('../../serveur/ipConfig');
var mr = require('../../myReact/myReact');

var $=require('jquery');
$('#test').text('browserify working');

var port;
var par;
var ws;
var currentButtons;
var positionBouton = [];
var arbre;

var idClient = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client
var monGroupe = -1; // Fourni par le serveur

var progCommunication;

var buttonMachine;
var src = -1; // Pour les fichiers son associés aux patternx
var DAWON = 0;
var demandeDeSons = ' '; 
var pseudo;
var debug = false;
var debug1 = true;
var listClips = []; // Devient une array avec toutes les infos sur les clips selectionnes
var indexChoisi =-1;
var nombreSonsPossibleInit = 3;
var nombreSonsPossible = nombreSonsPossibleInit;
var IdidAChoice = false;
var groupesDesSons =[];
var patternsChoisis = []; // Liste des patterns notes Skini de patterns choisis
var patternsListSent = []; // Liste des patterns qui ont été demandé et dont on attend le jeu
var actionSurGroupeClientPossible = true;

var sequenceLocale = [];

var bleu 	= "#008CBA";
var rouge 	= '#CF1919';
var vert 	= "#4CAF50";
var marron 	= '#666633';
var violet 	= '#797bbf';
var orange 	= '#b3712d';

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

var english = false;
		
var msg = {
	type : "startSpectateur",
	text: "client",
	id: idClient
}

/*********************************************

SECTION NODE
WEBSOCKET

**********************************************/

var audioLocal = new Audio();
var srcInit = "../../sounds/FM8-6.mp3";
var playPromiseInit;

function initWSocket(host) {
	//initServerListener();

	if( host !== undefined){
		ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort); // NODE JS
		console.log("clientListe.js WS://" + host + ":" + ipConfig.websocketServeurPort);
	}else{
		console.log("clientListe.js: initWSSocket host undefined");

	}
	
	ws.onopen = function( event ) {

		var msg = {
			type : "startSpectateur",
			text: "client",
			id: idClient
		}
		ws.send(JSON.stringify(msg));

		var msg = {
			type : "getPatternGroups",
		}
		try{
			ws.send(JSON.stringify(msg));
		}catch(err){
			console.log("ERR: onopen getPatternGroups:", err);
		}

		// Pour la définition de la longueur de la lsite de choix
		var msg = {
			type : "getNombreDePatternsPossibleEnListe",
		}
		try{
			ws.send(JSON.stringify(msg));
		}catch(err){
			console.log("ERR: onopen getNombreDePatternsPossibleEnListe:", err);
		}
	};

	// ON pourrait peut être mettre ça ailleurs
	setInterval(function() { decrementeAttentes(); }, 1000 );

	//Traitement de la Réception sur le client
	ws.onmessage = function( event ) {
		var msgRecu = JSON.parse(event.data);
		//console.log( "Client: received [%s]", event.data );
		//console.log( "Client: received:", msgRecu.type );

		switch(msgRecu.type) {

			case "DAWON": 
				//Permet de savoir si DAW est actif quand on recharge un client, le serveur envoie l'info à la connexion 
				// C'est le même scénario que quand on reçoit un broadcast de "DAWStatus".
				// Version Node JS: est bien utile ?
				DAWON = msgRecu.value;
				if (debug1) console.log("***** reçu message DAWON: ", DAWON);
				actionSurDAWON();
				break;

			case "DAWStatus":
				if (debug) console.log("Reçu DAWStatus:", msgRecu.value ); 
				DAWON = msgRecu.value ;
				selectAllClips();
				
				// On peut recevoir DAWStatus avant d'avoir créer les Listes
				// auquel cas cleanChoiceList n'est pas encore une fonction.
				if( typeof cleanChoiceList == "function"){
					cleanChoiceList();
					initDisplay();
				}
				break;

			case "delaiInstrument":
				if (debug) console.log("delayInstrument:delai:", msgRecu.text, "pour son:", msgRecu.son);
				//if ( msgRecu.text != -1) {
				//	document.getElementById("sonChoisi").innerHTML = msgRecu.son + " dans " + msgRecu.text + "s";
				//}
				break;

			case "dureeAttente": // Message en retour d'une demande de jouer un pattern
				afficheAttente(msgRecu.text, msgRecu.son);
				break;

			case "etatDeLaFileAttente":
				break;

			case "groupe":
				monGroupe = msgRecu.noDeGroupe;
				if (debug1) console.log("Je suis dans le groupe:", monGroupe);
				if(english) {
					document.getElementById("monGroupe").innerHTML = "In group: " + monGroupe;
				}else{
					document.getElementById("monGroupe").innerHTML = "Mon groupe: " + monGroupe;
				}
				break;

			case "groupeClientStatus":
				if (debug1) console.log("Reçu Broadcast: groupeClientStatus:", msgRecu, msgRecu.groupeClient );
				if (msgRecu.groupeClient == monGroupe || msgRecu.groupeClient == 255) {
					//if(actionSurGroupeClientPossible) actionSurGroupeClientStatus(retour.groupeName, retour.status);
					actionSurGroupeClientStatus(msgRecu.groupeName, msgRecu.status);
				}
				break;

			case "infoPlayDAW":
				if (debug1) console.log("Reçu Texte Broadcast infoPlayDAW:", msgRecu );

				if ( msgRecu.value[4] === idClient ){ // C'est la position de l'idClient (wsid) dans la file d'attente ([bus, channel, note, velocity, wsid, pseudo, dureeClip, nom]);
					//document.getElementById("MessageDuServeur").textContent = " "; // Nettoyage
					vibration(2000);
				   	document.body.className = "inplay";
			   		setTimeout( function() { document.body.className = "black-again" }, 1000 );

					// Retirer le pattern de la liste si c'est un des miens envoyer dans la séquence
					if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW", event.value[7]);
					for(var i=0; i < patternsListSent.length; i++){
						if(patternsListSent[i].patternName === msgRecu.value[7]){

							mr.activateSignal("infoPlayDAW", 1);
							mr.runProg(progCommunication);
							//communicationMachine.inputAndReact("infoPlayDAW", event.value);
							
							patternsListSent.splice(i, 1); // Enlève la position
							if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: nouvelle liste: ", patternsListSent);
						}
					}
					if(patternsListSent.length === 0){ // On a joué tous les patterns
						if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: tous les patterns joues");
						mr.activateSignal("receivedAllPatternPlayed", 1);
						mr.runProg(progCommunication);
						//communicationMachine.inputAndReact("receivedAllPatternPlayed");
						if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: nombreSonsPossible:", nombreSonsPossible);
					}
				}
				break;

			case "listClips":
				// Réinitialiser l'indicateur de choix réalisé, mécanisme pour potéger des choix répétés
				IdidAChoice = false;
				if ( msgRecu.listClips === -1 ) {
					// if (debug) console.log("WS Recu : listClips: vide", listClips);
					break;
				}

				// S'il y a des choix et pas que des patterns dans la liste, on n'affiche que les choix
				var listChoice = [];
				for(var i=0;i< msgRecu.listClips.length ;i++) {
					// C'est le code MIDI négatif qui définit un message
					if (msgRecu.listClips[i][0] < 0){
						msgRecu.listClips[i][11] = 0;
						listChoice.push(msgRecu.listClips[i]);
					}
				}
				if(listChoice.length !== 0){
					listClips = listChoice; // Pour startClip
					setBoutonSons(listChoice);

					//listenMachine.inputAndReact("isChoices");

					if (debug) console.log("WS Recu : listClips:", msgRecu.listClips);
					break;
				}

				// A partir d'ici ce sont des patterns
				// Pour conserver les durées d'attente quand la liste est modifiée
				var listClipsNew = [];
				for(var i=0;i< msgRecu.listClips.length ;i++) {
					// Créer une liste intermédiaire à partir de celle reçue
					// avec des durées à 0
					listClipsNew[i] = msgRecu.listClips[i];
					listClipsNew[i][11] = 0;

					// On balaye la liste en cours en reprenant les durées
					for(var j=0; j< listClips.length; j++) {
						if ( listClips[j][0] == msgRecu.listClips[i][0] ) {
							if ( listClips[j][11] == undefined ) { // Cas initial
								listClips[j][11] = 0;
							}
							listClipsNew[i][11] = listClips[j][11];
						}
					}
				}

				// On met à jour la liste en cours
				listClips = listClipsNew;
				setBoutonSons(listClips);
				//listenMachine.inputAndReact("isPatterns")
				break;

			case "lesFilesDattente":
				break;

			case "nombreDePatternsPossible":
				if (debug) console.log("Reçu Broadcast: nombreDePatternsPossible:", event.value );
				var nombreDePatternsPossibleEnListe = event.value;

				// Mise à jour du suivi des longueurs de listes d'abord / au groupe
				for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
					if(	nombreDePatternsPossibleEnListe[i][1] === monGroupe ){
						nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
						if (debug1) console.log("Reçu Broadcast: nombreDePatternsPossible:nombreSonsPossibleInit ", nombreSonsPossibleInit );
						return;
					}
				} // Sinon en fonction du broadcast 255
				for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
					if( nombreDePatternsPossibleEnListe[i][1] === 255 ){
						nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
						if (debug1) console.log("Reçu Broadcast: nombreDePatternsPossible:nombreSonsPossibleInit ", nombreSonsPossibleInit );
						return;
					}
				}
				if(debug1) console.log("nombreDePatternsPossible : ne suis pas concerné : ", event);
				break;

			case "message":  
				if (debug) console.log(msgRecu.text);
				var element = document.getElementById("MessageDuServeur");
				if(msgRecu.text !== undefined){
					element.innerHTML = msgRecu.text;
				}
				break;

			// Donne une liste qui contient la longueur des listes en fonction du groupe
			// dans lequel se trouve le client.
			case "nombreDePatternsPossibleEnListe":
				if (debug1) console.log("socket : nombreDePatternsPossibleEnListe: msgRecu: ", msgRecu.nombreDePatternsPossible);
				var nombreDePatternsPossibleEnListe = msgRecu.nombreDePatternsPossible;
				var flagFin = false;

				// Mise à jour du suivi des longueurs de listes d'abord / au groupe
				for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
					if(	nombreDePatternsPossibleEnListe[i][1] === monGroupe ){
						nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
						nombreSonsPossible = nombreSonsPossibleInit;
						flagFin = true;
						break;
					}
				}
				if (!flagFin){
					// Sinon en fonction du broadcast 255
					for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
						if(	nombreDePatternsPossibleEnListe[i][1] === 255 ){
							nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
							nombreSonsPossible = nombreSonsPossibleInit;				
							break;
						}
					}
				}
				if (debug1) console.log("Reçu socket : nombreDePatternsPossible:nombreSonsPossibleInit ", nombreSonsPossibleInit );
				break;

			case "patternSequenceAck":
				mr.activateSignal("patternSequenceAck", msgRecu); // Quid du message reçu ?
				mr.runProg(progCommunication);
				//communicationMachine.inputAndReact("patternSequenceAck", msgRecu);

				if(english){
					$('#demandeDeSons').text("My score: " + msgRecu.score);
				}else{
					$('#demandeDeSons').text("Mon score: " + msgRecu.score);
				}
				break;

			case "setPatternGroups":
				groupesDesSons = msgRecu.value;
				break;

			case "texteServeur":
				if (debug) console.log("Reçu Broadcast:", event.value );
				var element = document.getElementById("Broadcast");
				element.innerHTML = event.value;
				break;

			default: console.log("Le Client reçoit un message inconnu", msgRecu );
		}
	};

	ws.onerror = function (event) {
		console.log( "clientmemory.js : received error on WS", ws.socket, " ", event );
	}

	// Mécanisme de reconnexion automatique si le serveur est tombé.
	// Le service memoryPing permet de vérifier le présence du serveur
 	ws.onclose = function( event ) {
 		DAWON = 0; // Les états sur AbeltonON sont compliqué, cette info est donnée à la connexion.

   }
}
window.initWSocket = initWSocket;

function sendPseudo( texte, groupe ) {
	msg.type = "clientPseudo";
	msg.pseudo = texte;
	msg.groupe = groupe;
	try{
		ws.send(JSON.stringify(msg));
	}catch(err){
		console.log("Pb sendPseudo:", err, "\nPseudo: ", texte);
	}
}

/**********************************

	Automate de communication

***********************************/

function makeCommunicationMachine() {

mr.createSignal("startTempo", 0);
mr.createSignal("resetPatternSequenceSent", 0);
mr.createSignal("alertSequenceOnGoing", 0);
mr.createSignal("stopListOfPatterns", 0);
mr.createSignal("resumeListOfPatterns", 0);
mr.createSignal("sendPatternSequence", 0);

// On peut faire des branches de branches
	var instructions = [
		mr._atom(() => {console.log("** Communication automate started");}),

/*		mr._every("initialisation",1,
            [
            	mr._atom(() => {console.log("** automate: initialisation");}),
                mr._emit("resetPatternSequenceSent", 0),
                mr._await("cleanAllQueues", 1),
                mr._atom( () => {
                	console.log("-- cleanQueues");
					cleanChoiceList();
				}),
                mr._emit("resumeListOfPatterns", 0),
        	]
        ),*/
        mr._par(
        	[
            	mr._loop(
              		[
              			mr._await("clickPatternSequence", 1),
              			mr._atom(() => {console.log("** automate: clickPatternSequence");}),
						mr._emit("startTempo", 1),
						mr._emit("sendPatternSequence", 1),
              		],
              	),

            	mr._every("infoPlayDAW",1,
            		[
                		mr._atom( ()=> {console.log('** mr: infoPlayDAW');} ),
            		]
            	),

            	mr._every("patternSequenceAck",1,
            		[
                		mr._atom( ()=> {console.log('** mr: patternSequenceAck');} ),
            		]
            	),
        	]
        ),
		mr._atom(() => {console.log("** Communication automate finished");}),
	];

	progCommunication = mr.createModule(instructions);

	mr.runProg(progCommunication);
	var timeOut;

	mr.addEventListener("startTempo", function(evt) {
		if(timeOut !== undefined) clearTimeout(timeOut);
		console.log("-- startTempo");
		// Ne devrait pas être nécessaire, on garde en réserve...
		timeOut = setTimeout(function(){
			console.log("-- endTempo");
			//communicationMachine.inputAndReact("endTempo");
		}, 15000); // tempo si on ne reçoit pas d'info sur les patterns à jouer
	});

	mr.addEventListener("resetPatternSequenceSent", function(evt) {
		if(debug1) console.log("-- resetPatternSequenceSent");
		patternsListSent = [];
	});

	mr.addEventListener("alertSequenceOnGoing", function(evt) {
		if(debug1) console.log("-- alertSequenceOnGoing");
		alert("Séquence en cours");
	});

	mr.addEventListener("stopListOfPatterns", function(evt) {
		if(debug1) console.log("-- clickOnListOfPatterns");
		actionSurGroupeClientPossible = false;
	});

	mr.addEventListener("resumeListOfPatterns", function(evt) {
		if(debug1) console.log("-- resumeListOfPatterns");
		actionSurGroupeClientPossible = true;
	});

	mr.addEventListener("sendPatternSequence", function(evt) {
		if(debug1) console.log("-- sendPatternSequence");
		sequenceLocale = [];

		if(debug) console.log("sendPatternSequence: patternsChoisis: ", patternsChoisis);

		if(patternsChoisis.length === 0){
			console.log("WARN: sendPatternSequence: sequence vide");
			return;
		}
		for(var i=0; i < patternsChoisis.length; i++){
			sequenceLocale[i] = patternsChoisis[i].note;
		}
		if(debug1) console.log("-- sendPatternSequence", sequenceLocale);
		msg.type = "sendPatternSequence";
		msg.patternSequence = sequenceLocale;
		msg.pseudo = pseudo;
		msg.groupe = monGroupe;
		msg.idClient = idClient;
		ws.send(JSON.stringify(msg));

		// Met en place les données pour le mécanisme d'attente
		// du jeu complet de la liste
		patternsListSent = patternsChoisis.slice();
	});

/*
	var automateCom = hiphop module(
		out sendPatternSequence,
		out alertSequenceOnGoing,
		out startTempo,
		out stopListOfPatterns,
		out resumeListOfPatterns,
		out resetPatternSequenceSent,
		in receivedAllPatternPlayed,
		in clickPatternSequence,
		in patternSequenceAck,
		in infoPlayDAW,
		in initialisation,
		in endTempo,
		in cleanAllQueues,
		in clickOnListOfPatterns,
		in onAddPattern) {
		hop{console.log("Communication automate started");}

		every immediate (initialisation.now || cleanAllQueues.now){
			emit resetPatternSequenceSent();
			if (cleanAllQueues.now){
				hop{
					console.log("-- cleanQueues");
					cleanChoiceList();
				}
			}
			emit resumeListOfPatterns();

			fork{
				loop{
					await immediate (clickPatternSequence.now);
					hop{console.log("-- clickPatternSequence")}
					emit startTempo();
					emit sendPatternSequence();
					abort (receivedAllPatternPlayed.now || endTempo.now){
						every (clickPatternSequence.now){
							emit alertSequenceOnGoing();
						}
					}
					hop{console.log("-- Tout les patterns joués ou fin tempo");}
				}
			}par{
				every (infoPlayDAW.now){
					hop{console.log("-- infoPlayDAW", infoPlayDAW.nowval[7])}
				}
			}par{
				every (patternSequenceAck.now){
					hop{console.log("-- patternSequenceAck: ", patternSequenceAck.nowval);}
				}
			}par{

			}
		}
	}

	communicationMachine = new hh.ReactiveMachine(automateCom, "automateCom");

	var timeOut;
	communicationMachine.addEventListener("startTempo", function(evt) {
		if(timeOut !== undefined) clearTimeout(timeOut);
		console.log("-- startTempo");
		// Ne devrait pas être nécessaire, on garde en réserve...
		timeOut = setTimeout(function(){
			console.log("-- endTempo");
			//communicationMachine.inputAndReact("endTempo");
		}, 15000); // tempo si on ne reçoit pas d'info sur les patterns à jouer
	});

	communicationMachine.addEventListener("resetPatternSequenceSent", function(evt) {
		if(debug) console.log("-- resetPatternSequenceSent");
		patternsListSent = [];
	});

	communicationMachine.addEventListener("alertSequenceOnGoing", function(evt) {
		if(debug) console.log("-- alertSequenceOnGoing");
		alert("Séquence en cours");
	});

	communicationMachine.addEventListener("stopListOfPatterns", function(evt) {
		if(debug) console.log("-- clickOnListOfPatterns");
		actionSurGroupeClientPossible = false;
	});

	communicationMachine.addEventListener("resumeListOfPatterns", function(evt) {
		if(debug) console.log("-- resumeListOfPatterns");
		actionSurGroupeClientPossible = true;
	});

	communicationMachine.addEventListener("sendPatternSequence", function(evt) {
		if(debug) console.log("-- sendPatternSequence");
		sequenceLocale = [];

		if(debug) console.log("sendPatternSequence: patternsChoisis: ", patternsChoisis);

		if(patternsChoisis.length === 0){
			console.log("WARN: sendPatternSequence: sequence vide");
			return;
		}
		for(var i=0; i < patternsChoisis.length; i++){
			sequenceLocale[i] = patternsChoisis[i].note;
		}
		if(debug1) console.log("-- sendPatternSequence", sequenceLocale);
		msg.type = "sendPatternSequence";
		msg.patternSequence = sequenceLocale;
		msg.pseudo = pseudo;
		msg.groupe = monGroupe;
		msg.idClient = idClient;
		ws.send(JSON.stringify(msg));

		// Met en place les données pour le mécanisme d'attente
		// du jeu complet de la liste
		patternsListSent = patternsChoisis.slice();
	});
	return communicationMachine;
*/
}

/**********************************

	Ecoute des broadcasts HOP

***********************************/
function initServerListener() {

	// Mise à jour de la durée d'attente sur un instrument
	// Les valeurs des attentes sont conservés quand on reçoit une modifictaion de la liste des clips
/*	server.addEventListener('attenteInstrument', function( event ) {
		var retour = JSON.parse(event.value); 
		if (debug) console.log("Reçu Broadcast: attenteInstrument:", retour, retour.instrument, retour.attente );

		for(var i=0;i< listClips.length ;i++){
			if ( listClips[i][5] === retour.instrument ) {
				listClips[i][11] = retour.attente; // Extension ou mise à jour de la liste des clips avec la duréé d'attente
				var bouton = document.getElementById(i);
				// On vérifie que le bouton existe toujours
				if(bouton !== null){
					bouton.innerHTML = listClips[i][3].toString() + " " + retour.attente.toString() +"s";
					//console.log("----------------attenteInstrument:", listClips[i][3].toString() + " " + retour.attente.toString() +"s" );
				}
			}
		}
	});
*/

/*

	server.addEventListener('alertInfoScoreON', function( event ) {
		if (debug1) console.log("Reçu alertInfoScoreON:", event.value ); 
		$('#MessageDuServeur').text(event.value);
	});

	server.addEventListener('alertInfoScoreOFF', function( event ) {
		if (debug1) console.log("Reçu alertInfoScoreOFF:", event.value ); 
		$('#MessageDuServeur').text(" ");
	});

	server.addEventListener('DAWStatus', function( event ) {
		if (debug) console.log("Reçu DAWStatus:", event.value ); 
		DAWON = event.value ;
		if (debug) console.log("reçu broadcast DAWON: ", DAWON);
		
		selectAllClips();
		cleanChoiceList();
		initDisplay();

		//actionSurDAWON();
	});

	server.addEventListener('cleanQueues', function( event ) {
		if (debug1) console.log("Reçu Broadcast:cleanQueues", event.value );
		// On pourrait traiter l'instrument concerné donné dans event.value
		// Mais est-ce bien utile ? C'est compliqué mais faisable, event.value donne un instrument et non un
		// groupe de clients.
		communicationMachine.inputAndReact("cleanAllQueues");
	});

	server.addEventListener('cleanChoiceList', function( event ) {
		var retour = event.value;
		if (debug1) console.log("Reçu Broadcast: cleanChoiceList:", retour);
		if (retour === monGroupe || retour === 255) {
			if(cleanChoiceList !== null) cleanChoiceList();
		}
	});

/*	server.addEventListener('demandeDeSonParPseudo', function( event ) {
		if (debug) console.log("Reçu Texte Broadcast demande de son par pseudo:", event.value );
		if ( event.value === ' ') {
			document.getElementById("demandeDeSons").innerHTML =  " ";
			demandeDeSons = " ";
		} else {
			var msgBroadcast = JSON.parse(event.value); 
			demandeDeSons = msgBroadcast.soundName + "("+ msgBroadcast.pseudo + ")" + " <br> " + demandeDeSons;
			//demandeDeSons = event.value + " <br> " + demandeDeSons;

			// On tronque aussi la chaine de caractère        
			document.getElementById("demandeDeSons").innerHTML = demandeDeSons.slice(0, 50);
		}
	}); */

/*
	server.addEventListener('groupeClientStatus', function( event ) {
		var retour = JSON.parse(event.value); 
		if (debug) console.log("Reçu Broadcast: groupeClientStatus:", retour, retour.groupeClient );
		if (retour.groupeClient == monGroupe || retour.groupeClient == 255) {
			//if(actionSurGroupeClientPossible) actionSurGroupeClientStatus(retour.groupeName, retour.status);
			actionSurGroupeClientStatus(retour.groupeName, retour.status);
		}
	});

	server.addEventListener('infoPlayDAW', function( event ) {
		if (debug) console.log("Reçu Texte Broadcast infoPlayDAW:", event.value );

		if ( event.value[4] === idClient ){ // C'est la position de l'idClient (wsid) dans la file d'attente ([bus, channel, note, velocity, wsid, pseudo, dureeClip, nom]);
			//document.getElementById("MessageDuServeur").textContent = " "; // Nettoyage
			vibration(2000);
		   	document.body.className = "inplay";
	   		setTimeout( function() { document.body.className = "black-again" }, 1000 );

			// Retirer le pattern de la liste si c'est un des miens envoyer dans la séquence
			if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW", event.value[7]);
			for(var i=0; i < patternsListSent.length; i++){
				if(patternsListSent[i].patternName === event.value[7]){
					communicationMachine.inputAndReact("infoPlayDAW", event.value);
					patternsListSent.splice(i, 1); // Enlève la position
					if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: nouvelle liste: ", patternsListSent);
				}
			}
			if(patternsListSent.length === 0){ // On a joué tous les patterns
				if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: tous les patterns joues");
				communicationMachine.inputAndReact("receivedAllPatternPlayed");
				if(debug) console.log("Reçu Texte Broadcast demande de son par pseudo: infoPlayDAW: nombreSonsPossible:", nombreSonsPossible);
			}
		}
	});

	server.addEventListener('nombreDePatternsPossible', function( event ) {
		if (debug) console.log("Reçu Broadcast: nombreDePatternsPossible:", event.value );
		var nombreDePatternsPossibleEnListe = event.value;

		// Mise à jour du suivi des longueurs de listes d'abord / au groupe
		for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
			if(	nombreDePatternsPossibleEnListe[i][1] === monGroupe ){
				nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
				if (debug1) console.log("Reçu Broadcast: nombreDePatternsPossible:nombreSonsPossibleInit ", nombreSonsPossibleInit );
				return;
			}
		} // Sinon en fonction du broadcast 255
		for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
			if( nombreDePatternsPossibleEnListe[i][1] === 255 ){
				nombreSonsPossibleInit = nombreDePatternsPossibleEnListe[i][0];
				if (debug1) console.log("Reçu Broadcast: nombreDePatternsPossible:nombreSonsPossibleInit ", nombreSonsPossibleInit );
				return;
			}
		}
		if(debug1) console.log("nombreDePatternsPossible : ne suis pas concerné : ", event);
	});

	server.addEventListener('setPatternGroups', function( event ) {
		if (debug) console.log("Reçu setPatternGroups:", event.value ); 
		groupesDesSons = event.value ;
	});

	server.addEventListener('texteServeur', function( event ) {
		if (debug) console.log("Reçu Broadcast:", event.value );
		var element = document.getElementById("Broadcast");
		element.innerHTML = event.value;
	});

	*/    
}

/**************************************************

 Automate des boutons de sélection et d'écoute

 ***************************************************/
// Ecoute en local
function startListenClip() {
	document.getElementById( "buttonEcouter").style.display = "none";
	document.getElementById( "buttonStop").style.display = "inline";
	startSound();
}
window.startListenClip = startListenClip;

// Arret de l'écoute en local
function stopListenClip() {
	document.getElementById( "buttonEcouter").style.display = "inline";
	document.getElementById( "buttonStop").style.display = "none";
	src.pause();
}
window.stopListenClip = stopListenClip;


var endedListener = null;
var nextListener = null;
var audio = new Audio();

// startSound remet toute la liste de lecture en place
// à chaque appel. 
function startSound() {

	// Protection au départ
	if(patternsChoisis.length === 0){
		return;
	}
	
	var index = 0;
	audio.removeEventListener("error", endedListener);
	audio.removeEventListener("ended", endedListener);
	audio.removeEventListener("ended", nextListener);

	// Bloque drag and dop
	disablePatternChoice();

	endedListener = function() {
		if(debug) console.log("play fini");
		index = 0;
		audio.pause();

		// Remet drag and dop
		enablePatternChoice();
		//thisIsdone();
	}

	nextListener = function() {
		// Le dernier pattern
		if(index == patternsChoisis.length-1){
			if(debug) console.log("nextListener:FIN:", index);
			audio.addEventListener("error", endedListener);
			audio.addEventListener("ended", endedListener);
			audio.src = patternsChoisis[index].sound;
			var playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.then(function() {
			  		if (debug) console.log("startSound: nextListener1: Son en cours");
				}).catch(function(error) {
			 		console.log("WARN: startSound:nextListener1: Erreur Son en cours:", error);
				});
			}
			return;
		}else{ // Les autres patterns
			if(debug) console.log("nextListener:index et note:", index, patternsChoisis[index].note);
			audio.addEventListener("error", endedListener);
			audio.addEventListener("ended", nextListener);
			audio.src = patternsChoisis[index].sound;
			var playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.then(function() {
			  		if (debug) console.log("startSound: nextListener2: Son en cours");
				}).catch(function(error) {
			 		console.log("WARN: startSound:nextListener2: Erreur Son en cours:", error);
				});
			}
			index ++;
		}
	}
	nextListener();
}

/*
	var automate = hiphop module(in DAWON, in start, in stop, in isChoices, in isPatterns,
		out displayStop, out displayStart, out displayEcouter) {

		fork{
			every immediate (DAWON.now){
				if(DAWON.nowval && !isChoices.nowval){
					emit displayEcouter(true);
					emit displayStop(false);
					emit displayStart(true);
				}else{
					emit displayEcouter(false);
					emit displayStop(false);
					emit displayStart(false);
				}
			}
		}par{
			every immediate (start.now) {
				abort (stop.now) {
					emit displayStop(true);
					emit displayEcouter(false);

					// async bloque ESTEREL en attendant this.notifyAndReac ou kill (ou ONSUSP ou ONRES)
	                // Si this.notifyAndReac est activé quelque part on débloque en passant à la suite, cas de la fin de la lecture audio
	                // Si c'est l'ABORT qui se produit, on est dans la cas d'un kill et on exécute audio.pause()
	                // On prend donc assez simplement en compte deux cas, la fin naturelle et l'abort.
	                async {
	                	startSound( () => {this.notify(); this.react()} );
	                } kill {
						audio.pause();
						enablePatternChoice();
	                }
				}
				emit displayStop(false);
				emit displayEcouter(true);
			}
		}
	}

    listenMachine = new hh.ReactiveMachine(automate, "automate");

	listenMachine.addEventListener("displayStop", function(evt) {
		if (evt.signalValue) {
			document.getElementById( "buttonStop").style.display = "inline";
		} else {
			document.getElementById( "buttonStop").style.display = "none";
		}
	});

	listenMachine.addEventListener("displayStart", function(evt) {
		if (evt.signalValue) {
			document.getElementById( "buttonStart").style.display = "inline";
		} else {
			document.getElementById( "buttonStart").style.display = "none";
		}
	});

	listenMachine.addEventListener("displayEcouter", function(evt) {
		if (evt.signalValue) {
			document.getElementById( "buttonEcouter").style.display = "inline";
		} else {
			document.getElementById( "buttonEcouter").style.display = "none";
		}
	});
	return listenMachine;
*/


/****************************************

SECTION JS COMPATIBLE NODE.JS

*****************************************/
function vibration(duree) {
	if (navigator.vibrate == undefined ) return;
	if ('vibrate' in navigator) {
		navigator.vibrate(duree);
	}
}

//- Attention d'avoir initialisation avant de faire server.addEventListener('DAWStatus', function( event )---
// Cette fonction de remise à jour de l'affichage est appelée sur plusieurs évènements :
// onload, Modif DAW, Modif sur groupe de sons, reconnexion, rechargement de la page.

$('#monPseudo').keypress(function(e) {
	if (e.which == 13){
    	initialisation();   
  	}
});

function initDisplay(){
    $('#monPseudo').hide();
    $('#leBoutonPseudo').hide();
    $('#labelSons').text(" ");
    $('#lesProgressBars').show();
	$('#progressbar1').hide();
	$('#progressbar2').hide();
	$('#progressbar3').hide();
	$('#progressbar4').hide();
	$('#progressbar5').hide();
	$('#labelPoubelle').hide();

	if (DAWON) {
		$('#labelSons').show(); 
		$('#sonChoisi').show();
		$('#MessageDuServeur').text("");
		$('[class="text-spectacle"]').show();
		$('#listButton').show();
		$('#listButtonChoice').show();
		$('[class="breakAccueil"]').hide();
		$('#labelPoubelle').show();

		$('#buttonStart').show();
		$('#buttonEcouter').show();
		//listenMachine.inputAndReact("DAWON", true);
	}else{ 
		$('#labelSons').hide();
		$('#sonChoisi').hide();
		$('#MessageDuServeur').text(pseudo);
		$('[class="text-spectacle"]').hide();
		$('#listButton').hide();
		$('#listButtonChoice').hide();
		$('[class="breakAccueil"]').show();
		$('#labelPoubelle').hide();

		$('#buttonStart').hide();
		$('#buttonEcouter').hide();
		//listenMachine.inputAndReact("DAWON", false);
	} 
}

function initialisation() {

	makeCommunicationMachine();

	if (debug) console.log("initialisation:pseudo;", pseudo);
	audioLocal.src = srcInit; // Attention à la création dans la section HOP
	playPromiseInit = audioLocal.play();

	if (playPromiseInit !== undefined) {
		playPromiseInit.then(function() {
	  		//if (debug) console.log("Son en cours");
		}).catch(function(error) {
	 		if (debug) console.log("Erreur Son en cours:", error);
		});
	}
	
	// Pour la gestion de la reconnexion si le serveur est tombé et relancé.
	// Si on n'a pas de pseudo en local on suit la procédure de demande d'un pseudo
	// Si on a déjà un pseudo on ne demande rien .
	// La gestion du status du client est dangereuse car c'est document.getElementById("monPseudo").value;
	// qui donne l'état. Ce sera à revoir.
	if (pseudo === undefined) { // Cas de la première fois que l'on appelle le service memory(pseudo)
		var x = $('#monPseudo').val(); // document.getElementById("monPseudo").value;

		// Protection sur la saisie de messages bizarre et de code
		var regexp = new RegExp('\\W', 'g'); //  /\W/g;
		x = x.slice(0,10).replace( regexp , "");

		if ( x === "" || x === "Votre pseudo" ) { // Cas du OK sans saisie ou mauvaise saisie
			if(english){
				$('#MessageDuServeur').text("A pseudo with letters");
			}else{
				$('#MessageDuServeur').text("Un pseudo avec des lettres");
			}
			$('#monPseudo').text("");
			return;
		} else {
			pseudo = x;
		}
	}
    msg.pseudo = pseudo;

	sendPseudo(pseudo, monGroupe);

	if (debug1) console.log("clientmemory.js:initialisation: PSEUDO ", pseudo);

	// Attention: si on envoie un message ici sur la websocket immédiatament après la reconnexion.
	// Il se peut que la socket ne soit pas encore prête. Il y a des choses à faire avec readyState.

    // On a passé l'étape du pseudo, on peut afficher la page d'interaction
    initDisplay();
	
	// Le drag and drop
	initSortable();

	// Démarre ou redémarre l'automate de communication
	mr.activateSignal("initialisation", 1);
	mr.runProg(progCommunication);
	//mr.inputAndReact("initialisation");

	return pseudo;
}
window.initialisation = initialisation;

// Mettre de l'ordre entre init, initialisation, initWSocket !!
function init(port, p, unPseudo) {
	if (debug) console.log("init:pseudo=", unPseudo);
	pseudo = unPseudo;
	par = p;

	if (par.english !== undefined){
		if(par.english) english = true;
	}

	//listenMachine = makeListenMachine();
	//communicationMachine = makeCommunicationMachine();
	makeCommunicationMachine();
	initWSSocket( port );
}
window.init = init;

function decrementeAttentes() {
	for(var i=0; i< listClips.length; i++){
		if ( listClips[i][11] != 0 ) {
			listClips[i][11]--;
			var bouton = document.getElementById(i);
			if(bouton !== null){
				// Affichage de l'attente
				bouton.innerHTML = listClips[i][3].toString() + " " + listClips[i][11].toString() +"s";
				//console.log("----------------attenteInstrument:", listClips[i][3].toString() + " " + listClips[i][11].toString() +"s" );
			}
		}
	}	
}

function decreaseProgessBar(progressBar, duree, nomDuSon){
	// Attention de n'avoir aucun caractère ou CR entre les div des progress bars
	// dans la page HTML. C'est le champ qui est utilisé pour définir si la barre est
	// active.
	if (progressBar.text() === '' ){
		$(progressBar).attr("aria-valuenow", duree);
		$(progressBar).text(nomDuSon);
		decreaseProgressBarJQ($(progressBar),nomDuSon);
		return true;
	}else return false;
}

function afficheAttente (duree, nomDuSon) {
	if(duree === 0){
		if(debug) console.log("afficheAttente: duree 0");
		return;
	}
	if(debug) console.log("---- afficheAttente:text:", $('#progressbar1').text(), ":");

	if(decreaseProgessBar($('#progressbar1'), duree, nomDuSon)) return;
	if(decreaseProgessBar($('#progressbar2'), duree, nomDuSon)) return;
	if(decreaseProgessBar($('#progressbar3'), duree, nomDuSon)) return;
	if(decreaseProgessBar($('#progressbar4'), duree, nomDuSon)) return;
	if(decreaseProgessBar($('#progressbar5'), duree, nomDuSon)) return;
	console.log("WARN: clientmemory.js: afficheAttente: MESSAGE POUR SON INATTENDU");
}

function decreaseProgressBarJQ(progressBar, nomDuSon) {
	var compte = progressBar.attr("aria-valuenow");
	if(debug) console.log("decreaseProgressBarJQ:compte:", compte);
	progressBar.show();

	progressBar.text(nomDuSon);
	do {
		setTimeout( function() {
			var attrib = progressBar.attr("aria-valuenow")-1;
			progressBar.attr("aria-valuenow", attrib);
			progressBar.css("width", attrib.toString() + '%');

			if(debug) console.log(
			"decreaseProgressBarJQ:", progressBar.text(),
			"setWidth:", attrib.toString() + '%',
			"aria:", progressBar.attr("aria-valuenow"),
			"nombreSonsPossible:", nombreSonsPossible,
			"width:", progressBar.width());

			if(debug) console.log("Progress value compte JQ:", compte);
			//Il s'agit de prendre en compte la fin d'une demande de pattern
			// en fonction des progress bars et pas du message de broadcast
			// 'infoPlayDAW'. 
			// En effet, si on ne reçoit pas le broadcast on reste bloqué.
			if (attrib == 0) {
				progressBar.text('');
				progressBar.hide();
				return;
			}
		}, compte * 1000);
		compte--;
	} while ( compte > 0 );
}

// Utilisé à partir du broadcast mais aussi du message WS.
// WS est utilisé en cas de reconnexion.
function actionSurDAWON() {
	if ( DAWON === false ) {
		if (debug) console.log("clientmemory.js:actionSurDAWON:false");
		initialisation();
		return;
	}else{
		if (debug) console.log("clientmemory.js:actionSurDAWON:true:", DAWON);
		initialisation(); //Pour le cas où le client recharge sa page en cours d'interaction
		selectAllClips();
	}
}

function actionSurGroupeClientStatus(sons, status) {
	if ( DAWON == false ) {
		if (debug) console.log("clientmemory.js:actionSurGroupeClientStatus:DAWON:false");
		console.log("initialisation: actionSurGroupeClientStatus");
		initialisation(pseudo);
		return;
	}

	if (debug) console.log("WS actionSurGroupeClientStatus:", monGroupe);
	selectAllClips();
}

// Gestion de la fermeture du browser
window.onbeforeunload = function () {
	DAWON = 0; // Réinitialisation
	msg.type = "closeSpectateur";
	msg.text = "DISCONNECT_SPECTATEUR";
	msg.pseudo = pseudo;
	ws.send(JSON.stringify(msg));
	ws.close();
}

/*************************************************

	Controle des patterns

*************************************************/
function selectAllClips() {
	if(debug1) console.log("selectListClips: monGroupe", monGroupe);
	msg.type = "selectAllClips";
	msg.groupe = monGroupe;
	ws.send(JSON.stringify(msg));
}

// Demande au serveur de lancer le clip
function startClip() {

	if (indexChoisi == -1) return -1; // Protection sur un choix sans selection au départ

	if (nombreSonsPossible < 1 ) {
		if (english) {document.getElementById("MessageDuServeur").textContent = "You already ask for " + nombreSonsPossibleInit + " pattern.";}
		else {document.getElementById("MessageDuServeur").textContent = "Vous avez dejà demandé " + nombreSonsPossibleInit + " pattern.";}
		return -1;
	}

	if(debug) console.log("Clip choisi:", listClips[indexChoisi]);

	// On ne compte pas les messages sans pattern, avec une "note MIDI" négative ce sont des choix
	if (listClips[indexChoisi][0] >= 0) nombreSonsPossible--;

	if(debug1) {
		if(nombreSonsPossible < 0) console.log("--- !! startclip: nombreSonsPossible = ", nombreSonsPossible);
	}

	msg.type = "DAWStartClip";
	msg.clipChoisi = listClips[indexChoisi];
	msg.pseudo = pseudo;
	msg.groupe = monGroupe;
	ws.send(JSON.stringify(msg));

	//document.getElementById("buttonStart").style.backgroundColor = violet;  // '#797bbf'
	vibration(200);	

	// On remet le choix en position vide
	// ça évite des bugs sur des choix qui restent en cours
	// ça évite la répétition bête
	indexChoisi = -1;
 	document.getElementById("sonChoisi").innerHTML = "";
}

function sendPatternSequence(){
	if(debug1) console.log("sendPatternSequence :", patternsChoisis)
	if(patternsChoisis.length > 0){
		mr.activateSignal("clickPatternSequence", 1);
		mr.runProg(progCommunication);
		//communicationMachine.inputAndReact("clickPatternSequence");
	}
}
window.sendPatternSequence = sendPatternSequence;

function getDelayClip() {
	if (indexChoisi == -1) return -1; // Protection sur un choix sans selection au départ
	msg.type = "getDelayInstrument";
	msg.clipChoisi = listClips[indexChoisi];
	msg.pseudo = pseudo;
	msg.groupe = monGroupe;
	ws.send(JSON.stringify(msg));
}

// Ecoute en local
function startListenClip() {
	//listenMachine.inputAndReact("start", src);
}
window.startListenClip = startListenClip;

// Arret de l'écoute en local
function stopListenClip() {
	//listenMachine.inputAndReact("stop");
}
window.stopListenClip = stopListenClip;

// Pour flasher le smartphone ====================================
function bg() {
   document.body.className = "inplay";
   setTimeout( function() { document.body.className = "black-again" }, 10 );
}
exports.bg = bg

//========= Automate Buttons de sélection des sons ===============

function getSoundFile(nomDuFichierSon){

    // Par défaut on a des fichiers sont au format mp3, il faut mettre une extension pour avoir des fichiers wave
    if ( DAWON == 1 && par.soundFilesPath1 != undefined && par.soundFilesPath1 != "" ) {
    	if (nomDuFichierSon.includes(".wav")){
    		var nomComplet = "../../sounds/" + par.soundFilesPath1 + "/" + nomDuFichierSon;
   		} else {
   			var nomComplet = "../../sounds/" + par.soundFilesPath1 + "/" + nomDuFichierSon + ".mp3";
   		}
    } else if ( DAWON == 2 && par.soundFilesPath2 != undefined && par.soundFilesPath2 != "" ) {
    	if (nomDuFichierSon.includes(".wav")){
    		var nomComplet = "../../sounds/" + par.soundFilesPath2 + "/" + nomDuFichierSon;
   		} else {
   			var nomComplet = "../../sounds/" + par.soundFilesPath2 + "/" + nomDuFichierSon + ".mp3";
   		}
    } else if ( DAWON == 3 && par.soundFilesPath3 != undefined && par.soundFilesPath3 != "" ) {
    	if (nomDuFichierSon.includes(".wav")){
    		var nomComplet = "../../sounds/" + par.soundFilesPath3 + "/" + nomDuFichierSon;
   		} else {
   			var nomComplet = "../../sounds/" + par.soundFilesPath3 + "/" + nomDuFichierSon + ".mp3";
   		}
    } else {
    	var nomComplet = "../../sounds/" + nomDuFichierSon + ".mp3";
    }
	if(debug1) console.log("getSoundFile: Soundfile recu :", nomComplet);

	return nomComplet;
}

function getSoundFileNameFromNote(patternsList, noteSKini){
	for(var i=0; i< patternsList.length ; i++) {
		if(patternsList[i][0] == noteSKini ){ // == et pas ===, sinon ça ne marche pas, JS pas typé ?
			return patternsList[i][4]; // Nom du fichier son
		}
	}
	console.log("WARN: getSoundFileNameFromNote: pas de fichier son associé à la note");
	return -1;
}

function getPatternNameFromNote(patternsList, noteSKini){
	for(var i=0; i< patternsList.length ; i++) {
		if(patternsList[i][0] == noteSKini ){ // == et pas ===, sinon ça ne marche pas, JS pas typé ?
			return patternsList[i][3]; // Nom du pattern
		}
	}
	console.log("WARN: getPatternNameFromNote: pas de nom de pattern associé à la note");
	return -1;
}

// Les clips sont des lignes de la table des commandes [4] -> nom du fichier, [3] -> nom du son
function selectClipBouton(id, listClips) {

	// Pas utile d'afficher le son choisi dans ce client
    //document.getElementById("sonChoisi").innerHTML = listClips[id][3];

    indexChoisi = id;
    var nomDuFichierSon = listClips[id][4];

    // S'il s'agit d'un choix (note MIDI négative), pas besoin de chercher un fichier son et d'envoyer avec le bouton SEND
    // On envoie tout de suite.
    if(listClips[id][0] < 0){
    	if(IdidAChoice){
    		if (english) {alert("You already did a choice!");}
    		else {alert("Vous avez déjà fait votre choix!");}
    		return;
    	}

    	startClip();

    	if (english){alert("You choose "+listClips[id][3]);}
    	else {alert("Vous avez choisi "+listClips[id][3]);}
    	IdidAChoice = true;
    	return;
    }

    // Va chercher le fichier son sur le serveur
	src = getSoundFile(nomDuFichierSon);

	// Stop le pattern précédent
	audioLocal.pause();

	// Prépare celui choii
	audioLocal.src = src;

	// Joue le pattern
	var playPromise = audioLocal.play();

	if (playPromise !== undefined) {
		playPromise.then(function() {
	  		//if (debug) console.log("Son en cours");
		}).catch(function(error) {
	 		if (debug) console.log("Erreur Son en cours:", error);
		});
	}

	getDelayClip(); // Pas utile pour le moment
}

function findColorOfTheGroup(id, listOfgroups) {
	if(debug) console.log("findColorOfTheGroup:", id, listOfgroups);
	if(listOfgroups === undefined)  return undefined;
	
	for(var i=0; i < listOfgroups.length; i++){
		if(listOfgroups[i][1] === id){
			if(listOfgroups[i][6] !== undefined) return listOfgroups[i][6];
		}
	}
	return undefined;
}

function shuffle(originalArray) {
  var array = [].concat(originalArray);
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function setBoutonSons(listOfClipsInit) {
	var place = document.getElementById("listBoutonsSons");
	var styleBouton;
	var colorOfTheClip;

	while (place.firstChild) {
		place.removeChild(place.firstChild);
	}

	//tri(listClips, evaluation); // Ce n'est pas ici qu'il faut trier. Il faudrait le faire à chaque reception d'une info
	// sur une son joué, mais ça fait beaucoup de mouvement dans l'affichage.

	// Les clips sont des lignes de la table des commandes
	// Table de commandes:
	// 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Slot, 7=type, 8=pas utilisé, 9=groupe, 10=durée
	// 11= réservé client, 12= pseudo

	// Pour certains jeux il faut désorganiser la liste qui suit l'ordre des instruments.
	// Le classement founi est bien pour les scénarion DMFN, mais pas pour les jeux où il faut trouver les patterns selon 
	// des instruments, comme c'est naturellement dans l'ordre des instruments c'est trop facile.
	if(par.shufflePatterns !== undefined){
		if(par.shufflePatterns){
			var listOfClips = shuffle(listOfClipsInit);
		}else{
			var listOfClips = [].concat(listOfClipsInit);
		}
	}else{
		var listOfClips = [].concat(listOfClipsInit);
	}

	for(var i=0; i < listOfClips.length; i++){
	  var bouton = document.createElement("button");
	  bouton.id = i;

	  // Si c'est une liste de choix il n'y a pas d'attente à afficher
	  if(listOfClips[i][0] < 0){
	  	bouton.innerHTML = listOfClips[i][3];

	  // Les clips sont des lignes de la table des commandes [3] -> nom du son, [11] -> attente
	  }else{
	  	bouton.innerHTML = listOfClips[i][3];

	  	// Avec affichage des attentes, inverser le commentaire avec la ligne précédente
	  	// bouton.innerHTML = listOfClips[i][3] + " " + listOfClips[i][11] + "s";
	  }
	  // Pour mettre une couleur selon les instruments
	  // Si dans fichier de configuration [9] -> groupe
	  colorOfTheClip = findColorOfTheGroup(listOfClips[i][9], groupesDesSons);

	  if(colorOfTheClip !== undefined){
	  	bouton.style.backgroundColor = colorOfTheClip;
	  }else{
	  	console.log("setBoutonSons: couleur non assignée: groupesDesSons", groupesDesSons);
	  	var couleur = listOfClips[i][5] % 3; // Palliatif pour faire qqc selon l'instrument en [5]
	  }
	  if(couleur !== undefined){
		styleBouton = "boutonsSons " + "boutonsSons" + couleur;
	  }else{
	  	styleBouton = "boutonsSons ";
	  }
	  bouton.setAttribute("class", styleBouton);

	  bouton.addEventListener("click", function(event) {
	  	if(debug1) console.log("click button:id:", this.id);
		selectClipBouton(this.id, listOfClips);
	  });

	  // Il y a un espace dans la liste mais sans clip pour le moment, on ne les affiche pas
	  if(listOfClips[i][3] === '' || listOfClips[i][3] === undefined){
		bouton.style.display = "none";
	  }

	  // Création d'un champ noteSkini pour les éléments de la liste
	  bouton.dataset.noteSkini = listOfClips[i][0];

	  place.appendChild(bouton);
	}
}

var evaluation = function(a,b){ // Sur les durées
   return a[11] < b[11] ; 
} 

function tri(liste,evaluation){
    for(var i= 0 ; i< liste.length; i++){ 
    // le tableau est trié de 0 à i-1
    // La boucle interne recherche le min
    // de i+1 à la fin du tableau. 
        for(var j=i+1; j< liste.length; j++){
               if(evaluation( liste[j], liste[i]) ){
                   var temp = liste[j];
                   liste[j]=liste[i];
                   liste[i]=temp;
                }
        }
    }
    return liste ;
}

/*******************************************************

	GESTION DU DRAG AND DROP 

********************************************************/
var disablePatternChoice = null;
var enablePatternChoice = null;
var cleanChoiceList = null;

function initSortable() {
	var sortableChoice;
	var sortableList;

	disablePatternChoice = function(){
		sortableChoice.option("disabled", true);
		sortableList.option("disabled", true);
	}

	enablePatternChoice = function(){
		sortableChoice.option("disabled", false);
		sortableList.option("disabled", false);
	}

	cleanChoiceList = function(){
	// Vider les choix en cas de relance de l'automte ou de reconnexion...
	var place = document.getElementById("patternsChoice");
		while (place.firstChild) {
			place.removeChild(place.firstChild);
		}
		patternsChoisis = [];
		nombreSonsPossible = nombreSonsPossibleInit;
		sortableChoice.option("disabled", false);
		sortableList.option("disabled", false);

		if(debug1) console.log("cleanChoiceList:nombreSonsPossible:", nombreSonsPossible);
	}

	sortableList = new Sortable(listBoutonsSons, {
		group: {
			name: 'listBoutonsSons',
			pull: 'clone'
			//put: ['patternsChoice']
		},

		put: false, // Do not allow items to be put into this list, ne fonctionne pas 
		//group: 'shared',
	    animation: 150,
	    sort: false, // To disable sorting: set sort to false, ne fonctionne pas 
		delay : 100, // Pour permettre le click sur un bouton sur Android
		disabled: false, // nécessaire mais pas dans la doc. Ceci bloque bien la liste, à true.

		onStart: function(evt){
			if(debug) console.log("onstart:",evt.oldIndex);
			mr.activateSignal("receivedAllPatternPlayed", 1);
			mr.runProg(progCommunication);
			//communicationMachine.inputAndReact("clickOnListOfPatterns");
		},

		onChoose: function(evt){
			if(debug) console.log("onChoose:",evt.oldIndex);
			mr.activateSignal("clickOnListOfPatterns", 1);
			mr.runProg(progCommunication);
			//communicationMachine.inputAndReact("clickOnListOfPatterns");
		},

		onMove: function(evt){
			if(debug1) console.log("onMove");
			mr.activateSignal("clickOnListOfPatterns", 1);
			mr.runProg(progCommunication);
			//communicationMachine.inputAndReact("clickOnListOfPatterns");
		},

 		// Element dragging ended
		onEnd: function (evt) {
			if(debug1) console.log("sortableList: on End");
			//if(debug1) console.log("listBoutonsSons: onEnd: Old",evt.oldIndex, ": new: ", evt.newIndex);
			var itemEl = evt.item;  // dragged HTMLElement
			evt.to;    // target list
			evt.from;  // previous list
			evt.oldIndex;  // element's old index within old parent
			evt.newIndex;  // element's new index within new parent
			//evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
			//evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
			evt.clone; // the clone element
			//evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

			if(debug1) console.log("listBoutonsSons: onEnd: Old",evt.oldIndex, ": new: ", evt.newIndex, "\n", listBoutonsSons);

			// sort : false et put: false ne fonctionnent pas 
			// Je contourne le pb de put en ne faisant rien quand on bouge un patterns dans la liste de boutons sons
			if(debug1) console.log("listBoutonsSons: onEnd: evt.to;", evt.to.id);
			if(evt.to.id === "listBoutonsSons"){
				if(debug1) console.log("listBoutonsSons: onEnd: sort: ", sortableList);
				return;
			}

			if(nombreSonsPossible <= 0){
				if(debug1) console.log("sortable: sortableList: onEnd: plus de pattern possible:", nombreSonsPossible);

					$('#messageAlert').show();
					if(english){
						$('#messageAlert').text("Your reach the max of patterns");
					}else{
						$('#messageAlert').text("Max de patterns atteint");
					}

					setTimeout( () => {$('#messageAlert').hide();} , 3000 );
					//alert("Max de clip atteint");

					sortableList.option("disabled", true); // Ne fonctionne pas ici ?

					// On enlève le dernier élément déposé car il a déjà été pris en compte
					// par sortableChoice quand on arrive ici
					var itemEl = evt.item;  // dragged HTML Element
					itemEl.parentNode.removeChild(itemEl); // Suppression de l'élément
					patternsChoisis.splice(evt.newIndex, 1);
			}else{
				nombreSonsPossible--;
				if(debug1) console.log("sortableList: on End: nombreSonsPossible", nombreSonsPossible);
			}
		},

		// Element is dropped into the list from another list
		onAdd: function (evt) {
			if(debug) console.log("listBoutonsSons: onAdd: Old",evt.oldIndex, ": new: ", evt.newIndex);
			if(debug1) console.log("listBoutonsSons: onAdd: nombreSonsPossible", nombreSonsPossible);
			// same properties as onEnd
		},

		// Changed sorting within list
		onUpdate: function (evt) {
			if(debug1) console.log("listBoutonsSons: onUpdate: Old",evt.oldIndex, ": new: ", evt.newIndex);
			// same properties as onEnd
		},

		// Called when creating a clone of element
		// Ceci est nécessaire car on perd les events avec le clonage
	   	onClone: function (evt) {
	   		if (debug) console.log("On Clone liste de clip reçue");
	        evt.clone.addEventListener("click", function(event) {
	  			if(debug) console.log("click button:id:", this.id, listClips);
				selectClipBouton(this.id, listClips);
	  		});
	    }
	});

	sortableChoice = new Sortable(patternsChoice, {
	    group: {
	    	name: 'patternsChoice',
	    	put: ['listBoutonsSons']
	    },
	    animation: 150,
	    sort: false, // To disable sorting: set sort to false
		disabled: false, // nécessaire ? mais pas dans la doc. Inopérant sur cette liste.
		delay : 100, // Pour permettre le click sur un bouton sur Android

	    // Element dragging ended
		onEnd: function (evt) {
			var itemEl = evt.item;  // dragged HTMLElement
			evt.to;    // target list
			evt.from;  // previous list
			evt.oldIndex;  // element's old index within old parent
			evt.newIndex;  // element's new index within new parent
			evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
			evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
			evt.clone // the clone element
			evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable: patternsChoice: onEnd: noteSkini undefined");
			}else{
				if(debug) console.log("Sortable: patternsChoice: onEnd: noteSkini:", noteSkini, evt.newIndex, patternsChoisis);
			}

			// On ne prend pas en compte la réorganisation de la liste pour le décompte
			if(debug1) console.log("patternsChoice: onEnd: evt.to;", evt.to.id);
			if(evt.to.id === "patternsChoice"){
				return;
			}else if(evt.to.id === "poubelle"){
				nombreSonsPossible++;
			}
			if(debug1) console.log("Sortable: patternsChoice: onEnd: après nombreSonsPossible:", nombreSonsPossible);
		},

		// Element is dropped into the list from another list
		onAdd: function (evt) {
			//console.log("Right On Add", evt.from, ":", evt.to, ":",evt.oldIndex, ":", evt.newIndex);
			//console.log("Choice On Add: Old",evt.oldIndex, ": new: ", evt.newIndex, evt.clone);
			// same properties as onEnd
			
			mr.activateSignal("onAddPattern", evt.oldIndex);
			mr.runProg(progCommunication);
			//communicationMachine.inputAndReact("onAddPattern", evt.oldIndex);

			if(debug) console.log("sortable: patternsChoice: onAdd 2 :", nombreSonsPossible);

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable: patternsChoice: onAdd:noteSkini undefined");
			}else{
				var selectedPattern = new Object();
				selectedPattern.note = noteSkini;
				var fileName = getSoundFileNameFromNote(listClips, noteSkini);
				var patternName = getPatternNameFromNote(listClips, noteSkini);
				if(fileName !== -1 && patternName !== -1){
					selectedPattern.sound = getSoundFile(fileName);
					selectedPattern.patternName = patternName;
					patternsChoisis.splice(evt.newIndex, 0, selectedPattern); // Insére le pattern
					if(debug) console.log("Sortable: patternsChoice: onAdd: noteSkini:", noteSkini, nombreSonsPossible, patternsChoisis);
					// Il faut regénerer l'automate avec la nouvelle liste
					// makeListenMachine(); // !!!
				}else{
					console.log("WARN: sortableChoice: onAdd: note no more in the list of patterns");
				}
			}
		},

		// Changed sorting within list
		onUpdate: function (evt) {
			if(debug1) console.log("sortableChoice: On Update");
			//console.log("Right OnUpdate", evt.from, ":", evt.to, ":",evt.oldIndex, ":", evt.newIndex);
			if(debug) console.log("Choice onUpdate: Old",evt.oldIndex, ": new: ", evt.newIndex, evt.clone);
			// same properties as onEnd

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable: patternsChoice: onUpdate: noteSkini undefined");
			}else{
				if(patternsChoisis.length > 0 ){
					patternsChoisis.splice(evt.oldIndex, 1); // Enlève l'ancienne position

					var selectedPattern = new Object();
					selectedPattern.note = noteSkini;
					var fileName = getSoundFileNameFromNote(listClips, noteSkini);
					var patternName = getPatternNameFromNote(listClips, noteSkini);
					if(fileName !== -1 && patternName !== -1){
						selectedPattern.sound = getSoundFile(fileName);
						selectedPattern.patternName = patternName;
						patternsChoisis.splice(evt.newIndex, 0, selectedPattern); // Insére à la nouvelle position

						// Il faut regénerer l'automate avec la nouvelle liste
						//makeListenMachine();

					}else{
						console.log("WARN: sortableChoice: onUpdate: note no more in the list of patterns");
					}
				}
				if(debug) console.log("Sortable: patternsChoice: onUpdate: noteSkini:", noteSkini, evt.newIndex, patternsChoisis);
			}
		},

		// Event when you move an item in the list or between lists
	   	onMove: function (evt) {
	   		if(debug1) console.log("sortableChoice: On Move");
	    },

	    // Called when creating a clone of element
	   	onClone: function (evt) {
			if(debug1) console.log("sortableChoice: On onClone");
		}
	});

	new Sortable(poubelle, {
		group: {
			name: 'poubelle',
			//pull: false,
			put: ['patternsChoice']
		},
	    animation: 150,

	    // Element dragging ended
		onEnd: function (evt) {
			var itemEl = evt.item;  // dragged HTMLElement
			evt.to;    // target list
			evt.from;  // previous list
			evt.oldIndex;  // element's old index within old parent
			evt.newIndex;  // element's new index within new parent
			evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
			evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
			evt.clone // the clone element
			evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable:poubelle: onEnd:noteSkini undefined");
			}else{
				if(debug) console.log("Sortable: poubelle: onEnd:noteSkini:", noteSkini, evt.newIndex);
			}
		},

		// Element is dropped into the list from another list
		onAdd: function (evt) {
			//console.log("Right On Add", evt.from, ":", evt.to, ":",evt.oldIndex, ":", evt.newIndex);
			//console.log("poubelle On Add: Old",evt.oldIndex, ": new: ", evt.newIndex, evt.clone);
			//sortableChoice.option("disabled", false);

			if(debug1) console.log("poubelle On Add: nombreSonsPossible: ", nombreSonsPossible);
			sortableList.option("disabled", false);

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable:poubelle: onAdd: noteSkini undefined");
			}else{
				patternsChoisis.splice(evt.oldIndex, 1);
				if(debug) console.log("Sortable: poubelle: onAdd: noteSkini:", noteSkini, nombreSonsPossible, patternsChoisis);
				
				// Quand la liste des choix est vide on réinitialise le compteur
				if(patternsChoisis.length === 0 ){
					nombreSonsPossible = nombreSonsPossibleInit -1; // -1 car Pb d'index et de nombre...
				}

				// Il faut regénerer l'automate avec la nouvelle liste
				//makeListenMachine();
			}

			// same properties as onEnd
			var itemEl = evt.item;  // dragged HTML Element
			itemEl.parentNode.removeChild(itemEl); // Suppression de l'élément
		},

		// Changed sorting within list
		onUpdate: function (evt) {
			//console.log("Right OnUpdate", evt.from, ":", evt.to, ":",evt.oldIndex, ":", evt.newIndex);
			//console.log("poubelle onUpdate: old ",evt.oldIndex, ": new: ", evt.newIndex);

			var noteSkini = evt.clone.getAttribute("data-note-skini");
			if(noteSkini === undefined){
				console.log("ERR: Sortable:poubelle: onUpdate: noteSkini undefined");
			}else{
				if(debug) console.log("Sortable: poubelle: onUpdate: noteSkini:", noteSkini, evt.oldIndex);
			}
			// same properties as onEnd
		}
	});

	if(cleanChoiceList !== null) cleanChoiceList();
}