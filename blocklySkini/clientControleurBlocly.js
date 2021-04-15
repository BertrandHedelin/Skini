
/**************************************************

Pour compiler et lancer l'orchestration depuis
le client Blockly.
Permet de se passer du contrôleur pendant le
développement.

© Copyright 2017-2021, Bertrand Petit-Hédelin

****************************************************/
"use strict"
"use hopscript"

var port;
var par;
var ws;
var id = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client;

var debug = false;
var debug1 = true;

var abletonTableEnCours = 0;
var automateEncours = false;

// Autres déclarations

var msg = { // On met des valeurs pas defaut, mais ce n'est pas nécessaire.
			type: "configuration",
};

service controleur();
service controleurPing();

function cleanQueues() {
	var msg = { 
		type: "cleanQueues",
	};
	ws.send(JSON.stringify(msg));
}
exports.cleanQueues = cleanQueues;

//****** Lancement des opérations et fermeture *********

function init(port, p) {
	par = p;
	initWSSocket( port );
}
exports.init = init;

// Gestion de la fermeture du browser
window.onbeforeunload = function () {
	msg.type = "closeSpectateur";
	msg.text = "DISCONNECT_SPECTATEUR";
	ws.send(JSON.stringify(msg));
	ws.close();
}

function loadAbleton(val) {
	if ( !automateEncours) {
		console.log("clientControleur:loadAbleton:", val); 
		msg.type = "loadAbletonTable";
		msg.value = val -1; // Pour envoyer un index
		abletonTableEnCours = val;
		ws.send(JSON.stringify(msg));
	} else {
		alert("WARNING: Orchestration running, stop before selecting another one.")
	}
}
exports.loadAbleton = loadAbleton;

function startAutomate() {
	msg.type = "setAbletonON";
	if (abletonTableEnCours !== 0 && !automateEncours) {
		msg.value = abletonTableEnCours;
		ws.send(JSON.stringify(msg));
		document.getElementById( "buttonStartAutomate").style.display = "none";
		document.getElementById( "buttonStopAutomate").style.display = "inline";
		msg.type = "startAutomate";
		ws.send(JSON.stringify(msg));
		automateEncours = true;
	}  else  {
		alert("WARNING: No orchestration selected or one is running ");
	} 
}
exports.startAutomate = startAutomate;

function stopAutomate() {
	document.getElementById( "buttonStartAutomate").style.display = "inline";
	document.getElementById( "buttonStopAutomate").style.display = "none";
	msg.type = "stopAutomate";
	ws.send(JSON.stringify(msg));
	automateEncours = false;
	cleanQueues();
}
exports.stopAutomate = stopAutomate;

//************ WEBSOCKET HOP et listener BROADCAST ******************************
function initWSSocket(port) {

	ws = new WebSocket( "ws://" + par.serverIPAddress + ":" + port + "/hop/serv", [ "bar", "foo" ] );

	if (debug) console.log("clientcontroleur.js WS: ", "ws://" + par.serverIPAddress + ":" + port + "/hop/serv" );
	ws.onopen = function( event ) {
		msg.type = "startSpectateur";
		msg.text = "controleur";
		msg.id = id;
		console.log("ID sent to server:", msg.id);
		ws.send(JSON.stringify(msg));
	};

	//Traitement de la Réception sur le client
	ws.onmessage = function( event ) {
		//console.log( "Client: received [%s]", event.data );

		var msgRecu = JSON.parse(event.data);

		switch(msgRecu.type) {
			case "abletonTableNotReady": // Si la table n'est pas chargée on garde le bouton start
				alert("Orchestration not ready");
				document.getElementById( "buttonStartAutomate").style.display = "inline";
				document.getElementById( "buttonStopAutomate").style.display = "none";
				automateEncours = false;
				break;

			case "groupesClientLength":
				break;

			case "noAutomaton":
				//document.getElementById("consoleArea").innerHTML = "No automaton at this position";
				console.log("No automaton at this position");
				automateEncours = false;
				break;

			case "sessionLoaded":
				document.getElementById("consoleArea").innerHTML = "Orchestration loaded :" + msgRecu.fileName;
				break;

			case "message":  
				if (debug) console.log(msgRecu.text);
				break;

			default: if (debug) console.log("Le Client reçoit un message inconnu", msgRecu );
		}
	};

	ws.onerror = function (event) {
		if (debug) console.log( "clientcontroleur.js : received error on WS", ws.socket, " ", event );
	}

	// Mécanisme de reconnexion automatique si le serveur est tombé.
	// Le service Ping permet de vérifier le présence du serveur
 	ws.onclose = function( event ) {
		if (debug1) console.log( "clientcontroleur.js : ON CLOSE");

/*	  	(function loop() {
		   	if (!debug) {
	      	    controleurPing()
		    	.post()
		    	.then(function(){ // Si serveur présent
		    	   	document.location=controleur(); 
			 	},
			 	function(){ // Si serveur absent
				    if (debug) console.log( "reconnecting..." );
				    setTimeout( loop, 2000 );
				} );
		   	}
		})();*/
   	}
}
