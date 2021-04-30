(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/************************

Controle de la matrice des possibles
entre groupe de sons et groupe de clients

Version Node.js

© Copyright 2017-2021, B. Petit-Heidelein

**************************/
"use strict"

var par = require('../../serveur/skiniParametres');
var ipConfig = require('../../serveur/ipConfig');

var port;
var ws;
var id = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client;

var matricePad;

var nbeLignesPad;
var nbeColonesPad;
var etatScrutateurs = [];

var bleu 	= "#008CBA";
var rouge 	= '#CF1919';
var vert 	= "#4CAF50";
var marron 	= '#666633';
var violet 	= '#797bbf';
var orange 	= '#b3712d';

var debug = false;
var debug1 = true;

var DAWTableEnCours = 0;
var automateEncours = false;
var serverHostname;
// Autres déclarations

var msg = { // On met des valeurs pas defaut, mais ce n'est pas nécessaire.
			type: "configuration",
};

// Cette fonction est activée à la demande de chaque client sequenceur
// Le client séquenceur peut envoyer cette ordre de deux façon:
// - clic sur erase par le client sequenceur
// - réception par le client séquenceur d'un broadcast  'resetSequenceur' émis par websocketServeur lorsqu'il reçoit une demande du controleur:
// controleur ---- ws "resetSequenceur" --->  websocketserveur  ----- broadcast "resetSequenceur" ---->   clientsequenceur ----------  ws vers Processing "erasePatern"  -----> Processing  vide
// C'est un montage compliqué mais Processing ne reçoit pas les broadcast de hop.
function resetSequenceur() {
	var msg = { 
		type: "resetSequenceur",
	};
	ws.send(JSON.stringify(msg));
}
window.resetSequenceur = resetSequenceur;

function creationPad() {

	var place = document.getElementById("listBoutonsLiens");
	var compteurBouton = 0;

	// On vide le PAD
	while (place.firstChild) {
		place.removeChild(place.firstChild);
	}

	// Première ligne
	var em = document.createElement("a");
	em.setAttribute("class", "texteSon");
	place.appendChild(em);
	em.innerHTML = "-";
	
	for(var j=0; j < nbeColonesPad ; j++){
		var em = document.createElement("button");
		em.dataset.colone = j;
		em.setAttribute("class", "numColone");
		em.addEventListener("click", function(event) { clickColoneBouton(this.dataset.colone); });
		place.appendChild(em);
		em.innerHTML = j;
	}

	var el = document.createElement("br");
	place.appendChild(el);

	// Le PAD
	for(var i=0; i < nbeLignesPad ; i++) {
		var em = document.createElement("a");
		em.setAttribute("class", "texteSon");
		place.appendChild(em);
		em.innerHTML = i;

		for(var j=0; j < nbeColonesPad ; j++){	
			  var bouton = document.createElement("button");
			  bouton.id = "padBouton" + compteurBouton;
			  compteurBouton++;
			  bouton.dataset.ligne = i;
			  bouton.dataset.colone = j;

			  bouton.setAttribute("class", "padBouton");
			  bouton.addEventListener("click", function(event) { clickPadBouton(this.id); });
			  place.appendChild(bouton);
		}
		var el = document.createElement("br");
		place.appendChild(el);
	}

	// Etat des scrutateurs
	for (var i=0; i < nbeColonesPad; i ++) {
		etatScrutateurs[i] = 0;
	}
	var em = document.createElement("a");
	em.setAttribute("class", "texteSon");
	place.appendChild(em);
	em.innerHTML = "-";
	
	for(var j=0; j < nbeColonesPad ; j++){
		var em = document.createElement("button");
		em.setAttribute("class", "etatScrut");
		em.setAttribute("id", "etatScrut" + j);
		place.appendChild(em);
		em.innerHTML = "-";
	}
	var el = document.createElement("br");
	place.appendChild(el);
}

function setPadButton(son, groupe, status) {
	// Traite une colone complète
	if(groupe == 255) {
		var id = son;
		for(var j=0; j < nbeLignesPad ; j++){
			var bouton = document.getElementById("padBouton" + id.toString());
			if ( bouton == undefined ) {
			 	console.log("ERR setAllPad: bouton undefined", id);
			 	return;
			}
			if (status) {
				bouton.setAttribute("class", "padBoutonBleu");
			} else {
				bouton.setAttribute("class", "padBouton");
			}
			id += nbeColonesPad;
		}
		return;
	}

	if (groupe >= par.nbeDeGroupesClients) {
		console.log("ERR: setPadButton:groupeClient size exceeded:", groupe);
		return;
	}
	if (son >= nbeColonesPad) {
		console.log("ERR: setPadButton:groupeSons size exceeded:", son);
		return;
	}

	var idBouton = "padBouton" + (son + groupe * nbeColonesPad);
	if (debug) console.log("clientcontroleur:setPadButton:idBouton", idBouton);
	var leBouton = document.getElementById(idBouton);
	if (status) {
		leBouton.setAttribute("class", "padBoutonBleu");
	} else {
		leBouton.setAttribute("class", "padBouton");
	}
}

function clickColoneBouton(colone) {
	var id = parseInt(colone);
	var status;

	if (debug) console.log("clickColoneBouton: bouton:", id, " nbeColonesPad:", nbeColonesPad);

	for(var j=0; j < nbeLignesPad ; j++){
		var bouton = document.getElementById("padBouton" + id.toString());

		if ( bouton == undefined ) {
		 	console.log("ERR setAlclickColoneBouton: bouton undefined", id);
		 	return;
		}

		if ( bouton.getAttribute("class") == "padBoutonBleu") { // Désactive le lien entre groupes
			bouton.setAttribute("class", "padBouton");
			status = false;
			
		} else { // Active le lien
			bouton.setAttribute("class", "padBoutonBleu");
			status = true;
		}

		var msg = { 
			type: "putInMatriceDesPossibles",
			clients: j,
			sons: colone,
			status: status
		};
		ws.send(JSON.stringify(msg));

		id += nbeColonesPad;
	}
}
window.clickColoneBouton = clickColoneBouton;

// Quand on clique un bouton (X,Y)
function clickPadBouton(padBouton) {
	var bouton = document.getElementById( padBouton );
	var status;

	if (debug) console.log("LIGNE, COLONE", bouton.dataset.ligne, bouton.dataset.colone);

	if ( bouton.getAttribute("class") == "padBoutonBleu") { // Désactive le lien entre groupes
		bouton.setAttribute("class", "padBouton");
		status = false;
		
	} else { // Active le lien
		bouton.setAttribute("class", "padBoutonBleu");
		status = true;
	}

	var msg = { 
		type: "putInMatriceDesPossibles",
		clients: bouton.dataset.ligne ,
		sons: bouton.dataset.colone,
		status: status
	};
	ws.send(JSON.stringify(msg));
}
exports.clickPadBouton = clickPadBouton;

function resetAllPad() {
	if (automateEncours) {
		var id = 0;
		for(var j=0; j < nbeLignesPad ; j++){
			for(var i=0; i < nbeColonesPad; i++){
				var bouton = document.getElementById("padBouton" + id.toString());
				if ( bouton == undefined ) {
			 		console.log("setAllPad:undefined", colone);
			 		return;
			 	}
				bouton.setAttribute("class", "padBouton");
				id++;
			}
		}

		var msg = { 
			type: "ResetMatriceDesPossibles",
		};
		ws.send(JSON.stringify(msg));
	} else {
		alert("WARNING: Nothing to reset")
	}
}
window.resetAllPad =resetAllPad;

function setAllPad() {
	if (automateEncours) {
		var id = 0;
		for(var j=0; j < nbeLignesPad ; j++){
			for(var i=0; i < nbeColonesPad; i++){
				var bouton = document.getElementById("padBouton" + id.toString());
				if ( bouton == undefined ) {
			 		console.log("setAllPad:undefined", colone);
			 		return;
			 	}
				bouton.setAttribute("class", "padBoutonBleu");
				id++;
			}
		}
		var msg = { 
			type: "setAllMatriceDesPossibles",
		};
		ws.send(JSON.stringify(msg));
	} else {
		alert("WARNING: Nothing to set ALL")
	}
}
window.setAllPad =setAllPad;

function cleanQueues() {
	var msg = { 
		type: "cleanQueues",
	};
	ws.send(JSON.stringify(msg));
}
window.cleanQueues = cleanQueues;

//****** Lancement des opérations et fermeture *********

function initialisation() {

	// Attention: si on envoie un message ici sur la websocket immédiatament après la reconnexion.
	// Il se peut que la socket ne soit pas encore prête. Il y a des choses à faire avec readyState.

	document.getElementById("MessageDuServeur").style.display = "inline";

	// Attention block et pas inline pour les div
	var el = document.getElementById( "listBoutonsLiens" );
	el.style.display = "block";

	initServerListener();

	setInterval(function() {
		getNbeDeSpectateurs();
	}, 1000 );
}
exports.initialisation = initialisation;

function getNbeDeSpectateurs() {
	var msg = { 
		type: "getGroupesClientLength",
	};
	ws.send(JSON.stringify(msg));
}

function initControleur(serverHostname) {
	initWSSocket(serverHostname);
	initialisation();
}
window.initControleur = initControleur;

// Gestion de la fermeture du browser
window.onbeforeunload = function () {
	msg.type = "closeSpectateur";
	msg.text = "DISCONNECT_SPECTATEUR";
	ws.send(JSON.stringify(msg));
	ws.close();
}

function loadDAW(val) {
	if ( !automateEncours) {
		console.log("clientControleur:loadDAW:", val);

/*		var bout; 
		msg.type = "loadDAWTable";
		msg.value = val -1; // Pour envoyer un index
		DAWTableEnCours = val;
		ws.send(JSON.stringify(msg));

		for (var i=1; i < 4; i++ ) {
			bout = "buttonLoadDAW" + i;
			document.getElementById( bout ).style.backgroundColor = "#4CAF50"; // Green
		}
		bout = "buttonLoadDAW" + val;*/
 
		msg.type = "loadDAWTable";
		msg.value = 0; // Pour envoyer un index
		DAWTableEnCours = val;
		ws.send(JSON.stringify(msg));

		var bout = "buttonLoadDAW";
		document.getElementById( bout ).style.backgroundColor = "#008CBA"; // bleu
	} else {
		alert("WARNING: Automaton running, stop before selecting another one.")
	}
}
window.loadDAW = loadDAW;

function stopDAW() {
	msg.type = "setDAWON";
	msg.value = 0;
	ws.send(JSON.stringify(msg));
	document.getElementById( "buttonStartDAW").style.display = "inline";
	document.getElementById( "buttonStopDAW").style.display = "none";

	cleanQueues();
	resetAllPad();
}
window.stopDAW = stopDAW;

function startAutomate() {
	msg.type = "setDAWON";
	if (DAWTableEnCours !== 0 ) {
		msg.value = DAWTableEnCours;
		ws.send(JSON.stringify(msg));
		document.getElementById( "buttonStartAutomate").style.display = "none";
		document.getElementById( "buttonStopAutomate").style.display = "inline";
		msg.type = "startAutomate";
		ws.send(JSON.stringify(msg));
		automateEncours = true;
	}  else  {
		alert("WARNING: No automaton selected")
	} 
}
window.startAutomate = startAutomate;

function stopAutomate() {
	document.getElementById( "buttonStartAutomate").style.display = "inline";
	document.getElementById( "buttonStopAutomate").style.display = "none";

	var bout = "buttonLoadDAW";
	document.getElementById( bout ).style.backgroundColor =  "#4CAF50"; // Green

	msg.type = "stopAutomate";
	ws.send(JSON.stringify(msg));
	resetAllPad();
	automateEncours = false;
	cleanQueues();
}
window.stopAutomate = stopAutomate;

function checkSession(){
	msg.type = "checkSession";
	ws.send(JSON.stringify(msg));
}
window.checkSession = checkSession;

//************ WEBSOCKET HOP et listener BROADCAST ******************************
function initWSSocket(host) {

	//ws = new WebSocket("ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort); // NODE JS
	ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort); // NODE JS

	if (debug1) console.log("clientcontroleur.js ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort );
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
		if(debug) console.log("message reçu: ", msgRecu.type);

		switch(msgRecu.type) {
			case "DAWTableNotReady": // Si la table n'est pas chargée on garde le bouton start
				alert(msgRecu.text);
				document.getElementById( "buttonStartAutomate").style.display = "inline";
				document.getElementById( "buttonStopAutomate").style.display = "none";
				break;

			case "etatDeLaFileAttente":
				if (debug1) console.log("etatDeLaFileAttente:", msgRecu);

			    var texteAffiche = ' ';

			    if(msgRecu.value === undefined){
			    	console.log("WARN: clientcontroleur: etatDeLaFileAttente undefined");
			    	break;
			    }
	    		for (var i = 0; i < msgRecu.value.length ; i++ ) {
	    			if(msgRecu.value[i].length !== 0 ){
		    			texteAffiche += "[" + i + ":" + msgRecu.value[i].length + "] " ; 
		    		}else{
		    			texteAffiche += " " ;
		    		}
	    		}

	    		if (debug1) console.log("etatDeLaFileAttente:", texteAffiche);
	    		document.getElementById("FileAttente").innerHTML = texteAffiche;
				break;

			case "groupesClientLength":
				if (debug1) console.log("groupesClientLength:", msgRecu.longueurs);

				var groupesDisplay = " ";
				for ( var i=0; i < msgRecu.longueurs.length; i++) {
					groupesDisplay += "[";
					groupesDisplay = groupesDisplay + msgRecu.longueurs[i] + "]";
				}
				document.getElementById("tailleDesGroupes").innerHTML = groupesDisplay;
				break;

			case "lesFilesDattente":
				break;

			case "noAutomaton":
				document.getElementById("MessageDuServeur").innerHTML = "No automaton at this position";
				automateEncours = false;
				break;

			case "sessionLoaded":
				document.getElementById("MessageDuServeur").innerHTML = "Session loaded :" + msgRecu.fileName;
				break;

			case "message":  
				if (debug) console.log(msgRecu.text);
				break;

			case "setInMatrix":
				setPadButton(msgRecu.son, msgRecu.groupe, msgRecu.status);
				break;

			case "setControlerPadSize":
				if (debug1) console.log("setControlerPadSize:", msgRecu.nbeDeGroupesClients, msgRecu.nbeDeGroupesSons);
				nbeLignesPad 	= msgRecu.nbeDeGroupesClients;
				nbeColonesPad 	= msgRecu.nbeDeGroupesSons + 1; // Conversion d'un index en nombre de colone
				// Création du pad
				creationPad();
				//resetAllPad();
				break;

			case "setTickAutomate":
				document.getElementById("MessageDuServeur").innerHTML = "Tick:" + msgRecu.tick;
				break;

			default: if (debug1) console.log("Le Client reçoit un message inconnu", msgRecu );
		}
	};

	ws.onerror = function (event) {
		if (debug) console.log( "clientcontroleur.js : received error on WS", ws.socket, " ", event );
	}

	// Mécanisme de reconnexion automatique si le serveur est tombé.
	// Le service Ping permet de vérifier le présence du serveur
 	ws.onclose = function( event ) {
		if (debug1) console.log( "clientcontroleur.js : ON CLOSE");
   	}
}


function initServerListener() {
/*    	server.addEventListener('etatDeLaFileAttente', function( event ) {
    		var texteAffiche = ' ';
    		//if (debug) console.log("Reçu Broadcast:", event.value );
    		for (var i = 0; i < event.value.length ; i++ ) {
    			texteAffiche += "[" + event.value[i][0] + ":" + event.value[i][1] + "] " ; 
    		}
    		document.getElementById("FileAttente").innerHTML =texteAffiche;
    	}); 

    	var texteScrutateur = '';
    	
	    server.addEventListener('propositionScrutateur', function( event ) {
	        if (debug) console.log("Reçu Broadcast scrutateur:", event.value );

	        texteScrutateur = "[" + event.value.pseudo + ":" + event.value.numero + ":" + event.value.value + "] " + texteScrutateur;
	        texteScrutateur = texteScrutateur.slice(0,50);
	        document.getElementById("propositionScrutateur").innerHTML = texteScrutateur;

	        // Affichage des compteurs de demandes
	        if ( event.value.value == '+') {
	        	etatScrutateurs[parseInt(event.value.numero)] += 1;
	        } else if ( event.value.value == '-') {
	        	etatScrutateurs[parseInt(event.value.numero)] -= 1;
	    	}
	    	document.getElementById("etatScrut" + event.value.numero).innerHTML = etatScrutateurs[event.value.numero];
	       	document.getElementById("propositionScrutateur").innerHTML = texteScrutateur;

	       	// Affichage de l'activation ou désactivation de la matrice des possibles 
	       	// On traite le colones et donc pas la groupes d'utilisateurs
			var groupeON = false;
			if ( event.value.value == '+')  groupeON = true;

			var id = parseInt( event.value.numero);

			for(var j=0; j < nbeLignesPad ; j++){
				var bouton = document.getElementById("padBouton" + id.toString());
				if ( bouton == undefined ) {
				 	console.log("ERR listener: propositionScrutateur: bouton undefined", id);
				 	return;
				}
				if ( !groupeON ) { // Désactive le lien entre groupes
					bouton.setAttribute("class", "padBouton");
				} else { // Active le lien
					bouton.setAttribute("class", "padBoutonBleu");
				}
				id += nbeColonesPad;
			}
	    }); */
}

},{"../../serveur/ipConfig":2,"../../serveur/skiniParametres":3}],2:[function(require,module,exports){
module.exports={
	"remoteIPAddressImage": "192.168.82.96",
	"remoteIPAddressSound": "192.168.25.96",
	"remoteIPAddressLumiere": "192.168.82.96",
	"remoteIPAddressGame": "192.168.82.96",
	"serverIPAddress": "192.168.25.96",
	"webserveurPort": 8080,
	"websocketServeurPort": 8383,
	"InPortOSCMIDIfromDAW": 13000,
	"OutPortOSCMIDItoDAW": 12000,
	"distribSequencerPort": 8888,
	"outportProcessing": 10000,
	"outportLumiere": 7700,
	"inportLumiere": 9000
}

},{}],3:[function(require,module,exports){
"use hopscript"

/* Configuration de l'architecture IP, OSC, Websocket ====================
24/1/2017 BH

© Copyright 2019-2021, B. Petit-Heidelein

                websocket en 8080
   SERVEUR <----------------------> CLIENT  OSC OUT: 10000 (vers Processing Visu)
      ^ OSC IN:13000                  ^  ^  OSC OUT: 12000 (vers Processing Midi)
      |                               |  |
      |         |---------------------|  |                   
      |         |         OSC            | OSC
      v         V                        |
    Processing MIDI                      v
     OSC IN:  12000                  Processing Visu (Uniquement en réception)
     OSC OUT: 13000                   OSC IN: 10000

===========================================================================*/

exports.DAWON = true;

exports.canWidth  = 10; // Pas utile si pas de tablette, 500
exports.canHeight = 10; // Pas utile si pas de tablette, 250

exports.tempo_ABL = 20; // CC udefined dans la norme MIDI

// Pour le client Golem
exports.nombreDeNiveaux = 2;

// Indexation des bus Midi dans OSCmidiHop de processing
exports.busMidiDAW = 6;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

exports.english = true;

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax =  3000; // En ms
exports.tempoMin = 1000; // En ms
exports.limiteDureeAttente = 33; // En pulsations

/********************************************************

AUTOMATE

*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoTrouveLaPercu-1';
exports.automate2 = '';
exports.automate3 = '';

// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;

exports.reactOnPlay = false;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = "pieces/trouveLaPercu.csv";

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "trouveLaPercu";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "trouveLaPercu";
exports.patternScorePath2 = "";
exports.patternScorePath3 = "";

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 3;
exports.simulatorInAseperateGroup = true; // Si true, le dernier groupe client est réservé au simulateur.

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// si pas de synchro MIDI
exports.timer1  = 0; 
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 450 * 4;

exports.timerDivision1  = 0; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 4; 

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

const bleu  = "#008CBA";
const rouge = '#CF1919';
const vert  = "#4CAF50";
const marron  = '#666633';
const violet  = '#797bbf';
const orange  = '#b3712d';
const rose = '#E0095F';
const gris = '#5F6262';
const ocre = '#BCA104';
const terre = '#A76611';
const grisvert = '#039879';
const grisbleu = '#315A93';

const groupesDesSons = [
  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  ["groupe1",   0, "group", 170, 100, 20, rouge, [], 1 ],  //0 index d'objet graphique
  ["groupe2",   1, "group", 20, 240, 20, bleu, [], 1 ],     //1
  ["groupe3",   2, "group", 170, 580, 20, vert, [], 1 ],  //2
  ["groupe4",   3, "group", 350, 100,  20, gris, [], 1 ],   //3
  ["groupe5",   4, "group", 20, 380, 20, violet, [], 1 ], //4
  ["groupe6",   5, "group", 350,580, 20, terre, [], 1 ],  //5
  ["groupe7",   6, "group", 540,100, 20, rose, [], 1 ],   //6
  ["derwish",   7, "group", 740,480, 20, rose, [], 1 ],
  ["gaszi",     8, "group", 540,580, 20, rose, [], 1 ],
  ["djembe",    9, "group", 740,200, 20, rose, [], 1 ],
  ["piano",    10,"group", 740,340, 20, rose, [], 1 ]
];
exports.groupesDesSons = groupesDesSons;


},{}]},{},[1]);
