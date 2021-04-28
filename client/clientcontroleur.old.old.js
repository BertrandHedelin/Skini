
/************************

Controle de la matrice des possibles
entre groupe de sons et groupe de clients

Version Node.js

© Copyright 2017-2021, B. Petit-Heidelein

**************************/
"use strict"

var par = require('../serveur/skiniParametres');
var ipConfig = require('../serveur/ipConfig');

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
}
exports.initialisation = initialisation;

function getNbeDeSpectateurs() {
	var msg = { 
		type: "getGroupesClientLength",
	};
	ws.send(JSON.stringify(msg));
}

function initControleur() {
	initWSSocket();
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

		var bout; 
		msg.type = "loadDAWTable";
		msg.value = val -1; // Pour envoyer un index
		DAWTableEnCours = val;
		ws.send(JSON.stringify(msg));

		for (var i=1; i < 4; i++ ) {
			bout = "buttonLoadDAW" + i;
			document.getElementById( bout ).style.backgroundColor = "#4CAF50"; /* Green */
		}
		bout = "buttonLoadDAW" + val;
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
	msg.type = "stopAutomate";
	ws.send(JSON.stringify(msg));
	//resetAllPad();
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
function initWSSocket() {

	ws = new WebSocket("ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort); // NODE JS

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
			    var texteAffiche = ' ';
			    if(msg.value === undefined){
			    	console.log("WARN: clientcontroleur: etatDeLaFileAttente undefined");
			    	break;
			    }
	    		for (var i = 0; i < msg.value.length ; i++ ) {
	    			texteAffiche += "[" + msg.value[i][0] + ":" + msg.value[i][1] + "] " ; 
	    		}
	    		document.getElementById("FileAttente").innerHTML =texteAffiche;
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