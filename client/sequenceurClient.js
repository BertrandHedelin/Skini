function info() {
	console.log("INFO TROIS");
}


//******************
var $=require('jquery');
$('#test').text('browserify working');

var port;
var ws;
var wsProcessing;

var par = require('../serveur/logosParametres');
//var oscMidi = require('../serveur/logosOSCandMidiLocal');

var id = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client
var src = -1;
var pseudo;
var debug = true;

// Résolutions en tick: le tick est la durée en ms séparant deux événements du séquenceur. Elle sera définie par le tempo.
// Le tick minimum est défini par le PPCM entre une triple croche en mode binaire et ternaire (on ne va pas plus loin que la 
// triple croche comme définition sur le Pad).
// La passage d'un décompte entre ternaire et binaire et nécessaire pour les triolets et les rythmes ternaires (6/8, 9/8 etc.)
// Deux croches = un triolet de 3 croches
//
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

// Pour initialisation mais en fait fournis par le serveur **************

// DONNEES D'INTERACTION DU SEQUENCEUR A MODIFIER POUR TESTER
var tempsMesure = 4;    		// Partie haute de la mesure, nombre de temps dans la mesure
var divisionMesure = noireR; 	// Partie basse de la mesure
var nbeDeMesures = 1;
var tempo = 60; 				// à la minute
var canalMidi = 1;

// Durée du tick selon le tempo et la mesure, avec le tempo définie selon une division de la mesure à la minute.
// C'est la façon classique de faire.
// ex: 24 ticks = 1 x noire, si noire = 90 => 90 noires / min => une noire toutes les 60/90 sec
// soit un tick toutes les (60/90) / 24 sec => (60/90)/24 * 1000 ms => tick = 27,7 ms

var dureeDuTick = ( (60 / tempo ) / divisionMesure ) * 1000 ; // Exprimé ici en millisecondes

// FIN de ce qui est fourni par le serveur **************

// Tableau pour le sequenceur, voir si c'est le serveur ou le client qui va définir ce paramètre.
// ça peut dépendre du niveau d'expertise du client.
var sequence = new Array( nbeDeMesures * tempsMesure * divisionMesure );

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

// Mécanisme de syncho
var datePing = 0;
var datePong = 0;
var latencePing = 0;

var datePingProcessing = 0;
var datePongProcessing = 0;
var latencePingProcessing;


var matricePad;
// La résolution du Pad correspond à la durée en ticks qui sépare deux boutons.
// ELle permet entre autre de gérer le passage binaire <-> ternaire.
// Elle est nécessaire pour ajouter des notes dans la séquence.

// DONNEES D'INTERACTION DU PAD A MODIFIER POUR TESTER
var resolutionPad = doubleCrocheR;
var nbeLignesPad = 88;

var nbeColonesPad = nbeDeMesures * tempsMesure * divisionMesure / resolutionPad;

// Player
var player;
var compteurPlayer = 0;
var finPlayer = nbeDeMesures * tempsMesure * divisionMesure; //sequence.length;
var compteurColone = 0;
var coloneVerteEnCours = 0;
//var listenMachine;

console.log("Taille Séquenceur:", finPlayer , "Durée du Tick: ", dureeDuTick);


var bleu 	= "#008CBA";
var rouge 	= '#CF1919';
var vert 	= "#4CAF50";
var marron 	= '#666633';
var violet 	= '#797bbf';
var orange 	= '#b3712d';

// Autres déclarations

var msg = { // On met des valeurs pas defaut, mais ce n'est pas nécessaire.
			type: "configuration",
			text: "ECRAN_NOIR" ,
			pseudo: "Anonyme",
			value: 0,
};

Number.prototype.mod = function(n) {
	var m = (( this % n) + n) % n;
	return m < 0 ? m + Math.abs(n) : m;
};

function Note(code, vel, duree, index, id) {
	this.codeMidi = code;
	this.velocite = vel;
	this.duree = duree;
	this.index = index;
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

//service sequenceur();
//service sequenceurPing();

//********** Gestion des sequences **********************

function creationSequences(nbeDeMesures, tempsMesure, divisionMesure) {
	sequence = new Array(nbeDeMesures * tempsMesure * divisionMesure );
}

function putNoteInSequence(index, note) {

	// Si pas encore de note on met le Note On en donnant la vélocité
	if ( sequence[index] == undefined ) {
		sequence[index] = new Array();
	}
	sequence[index].push(note);

	// On place le Note OFF en mettant une vélocité à 0
	var noteOFF = new Note(note.codeMidi, 0, 0);
	index += (note.duree -1) % finPlayer; // Attention sur la duree qui n'est pas un index
	if ( sequence[index] == undefined ) {
		sequence[index] = new Array();
	}
	sequence[index].push(noteOFF);
}

function getNoteInSequence(index, noteMidi) {

	if ( sequence[index] == undefined ) { // Pb
			return -1;
	}
	for ( var i=0; i < sequence[index].length; i++) {
			if ( sequence[index][i].codeMidi == noteMidi) {
				return sequence[index][i];
		}
	}
}

function removeNoteInSequence(index, note) {

	if ( note == undefined ) {
		if (debug) console.log("removeNoteInSequence:note:undefined");
		return -1;
	}

	if ( sequence[index] == undefined ) {
		return -1;
	}
	else {
		// Avec Websocket
		msg.type = "midiNoteOn";
		msg.bus = par.busMidiFM8;
		msg.canal =  canalMidi;
		msg.codeMidi = note.codeMidi;
		msg.velocite = 0;
		datePing = msg.date = audioCtx.currentTime;
		ws.send(JSON.stringify(msg));

		//oscMidi.sendNoteOn( par.busMidiFM8, canalMidi, note.codeMidi, 0 ).post();

		var seqLocal = sequence[index + note.duree -1 ]; // Pointe sur le Note Off
		removeNoteInArray(seqLocal, note);
		var seqLocal = sequence[index]; // Pointe sur la note
		removeNoteInArray(seqLocal, note);
	}
}

function removeNoteInArray(groupeNote, note) {
	if ( groupeNote == undefined ) {
		if (debug) console.log("removeNoteInArray:groupeNote:undefined");
		return -1;
	}

	for ( var i=0; i < groupeNote.length; i++) {
			if ( groupeNote[i].codeMidi == note.codeMidi) {
				groupeNote.splice(i,1); // On enlève la note
		}
	}
	return 0;
}


//******** Gestion des start et stop
var playing = false;
var playingStatus = false;

function startPlayerMidi(){
	noteTime = audioCtx.currentTime; // Il faut remettre ce compteur à jour pour démarrer le calage 
	// On divise la durée du tick pour s'approcher de l'horloge Webaudio.
	tickTime = audioCtx.currentTime; // On initialise tickTime 
	player = setInterval(function() { playerMidi(); }, dureeDuTick / 10); // 10
}

function stopPlayerMidi() {
	console.log("stopPlayerMidi");
	clearInterval(player);
}

function startSequenceur() {
	document.getElementById( "buttonStart").style.display = "none";
	document.getElementById( "buttonStop").style.display = "inline";
	playing = true;
}
window.startSequenceur = startSequenceur;

function stopSequenceur() {
	document.getElementById( "buttonStart").style.display = "inline";
	document.getElementById( "buttonStop").style.display = "none";
	playing = false;
}
window.stopSequenceur = stopSequenceur;

function synchroSequenceur() {
	if ( playing != playingStatus) {
		if (playing) {
			startPlayerMidi();
			console.log("START", playing, playingStatus);
		}
		else {
			stopPlayerMidi();
			console.log("STOP", playing, playingStatus);
		}
		playingStatus = playing;
	}
}
exports.synchroSequenceur = synchroSequenceur;

/*//For Safari audioContext is disabled until there's a user click
if(audioContext.state === 'suspended'){
  audioContext.resume();
};*/

// playerMidi Joue la séquence Midi et allume le Pad en conséquence. Appelé à chaque tick.

var nbeColonesPadPrecedent = nbeColonesPad; // Etat initial
var coloneVerteEnCoursPrecedent = 0;
var tickTime;

function playerMidi() {
	// L'idée est d'appeler playerMidi avec setInterval à une fréquence 
	// supérieure à celle mesurée avec audioCtx.currentTime de Webaudio
	// on peut ainsi avoir une meilleurs précision sur la mesure tu temps
    if ( audioCtx.currentTime < tickTime ) { // C'est trop tôt on ne fait rien
    	    return;
    }	    
    tickTime += dureeDuTick / 1000; // Exprimée en seconde pour l'horloge Webaudio et pas ms comme setInterval
    //console.log("TICK:", tickTime);

	// Pour le midi
	if ( sequence[compteurPlayer] != undefined ) {
		if ( sequence[compteurPlayer].length != 0 ) {
			if (debug) console.log(sequence[compteurPlayer], compteurPlayer);
			for (var i=0; i < sequence[compteurPlayer].length; i++) {
				var noteEnCours = sequence[compteurPlayer][i];
				// Pour test avec FM8

				// Avec Websocket
				msg.type = "midiNoteOn";
				msg.idClient = id;				
				msg.bus = par.busMidiFM8;
				msg.canal =  canalMidi;
				msg.codeMidi = noteEnCours.codeMidi;
				msg.velocite = noteEnCours.velocite;
				msg.duree = noteEnCours.duree;
				msg.index = compteurPlayer;
				//ws.send(JSON.stringify(msg)); // Envoi vers serveur HOP
				
				// On en profile pour faire un ping
				datePing = msg.date = audioCtx.currentTime;

				// Envoi sur serveur Processing
				wsProcessing.send(JSON.stringify(msg));

				//if ( noteEnCours.velocite != 0 ) audioInit.play(); // Test client
				//Test Manuel
				//wsDeTest.send(audioCtx.currentTime * 1000);
				// Avec service Hop
				//oscMidi.sendNoteOn( par.busMidiFM8, canalMidi, noteEnCours.codeMidi, noteEnCours.velocite ).post();
			}
		}
	}

	compteurPlayer++;
	compteurPlayer %= finPlayer;

    // Affichage des colonnes
	coloneVerteEnCours = Math.floor(compteurPlayer / resolutionPad);
	if ( coloneVerteEnCours != coloneVerteEnCoursPrecedent ) {
		coloneVerteEnCoursPrecedent = coloneVerteEnCours;
		if ( coloneVerteEnCours == 0 ) { 	// On est au début du Pad
			setTimeout( function() {
					coloneVerte(0);					// On met la premiere colone en vert
					coloneGrise(nbeColonesPad -1); 	// La précédente colone était la dernière du Pad
				}, latencePing / 2 ); 
		} else {							
		setTimeout( function() {
				coloneGrise(coloneVerteEnCours -1);
				coloneVerte(coloneVerteEnCours);
			}, latencePing / 2 ); 
		}
	}
}

// ********** Gestion du PAD **********************************

function pushNoteInMatricePad(ligne, colone, note) {
	if ( matricePad[ligne][colone] == undefined ) {
		matricePad[ligne][colone] = new Array();
	}
	matricePad[ligne][colone].push(note);

 	var bouton = getButonByAttributes(ligne, colone);
 	if ( bouton == undefined ) {
 		console.log("pushNoteInMatricePad:undefined", ligne, colone);
 		return;
 	}
 	bouton.setAttribute("class", "padBoutonBleu");
}

function removeNotesInMatricePad(ligne, colone, index) {

	// Protection
	if ( matricePad[ligne][colone] == undefined ) {
		console.log("removeNotesInMatricePad:undefined", ligne, colone);
		return -1;
	}
	// Supression dans le séquenceur des notes référencées dans (ligne, colone)
	// de la matricePad.
	var notesASupprimer = matricePad[ligne][colone];
	for ( var i=0; i < notesASupprimer.length; i++ ) {
		 removeNoteInSequence(notesASupprimer[i].index, notesASupprimer[i]);	
	}

	// Supression de l'élément de la matrice
	if ( matricePad[ligne][colone] == undefined ) {
			return -1;
	}
	matricePad[ligne][colone].splice(0);

	// Changement d'affichage sur le Pad
	var bouton = getButonByAttributes(ligne, colone);
 	if ( bouton == undefined ) {
 		console.log("removeNotesInMatricePad:undefined", ligne, colone);
 		return;
 	}
 	bouton.setAttribute("class", "padBouton");
}

function getButonByAttributes(ligne, colone) {
	// Syntaxe trés difficile à trouver
	var critere = "[data-ligne ='" + ligne + "']" + "[data-colone ='" + colone + "']";
	// Retourne une liste
	var boutons = document.querySelectorAll(critere);
	//console.log("getButonByAttributes",boutons);

	// Il n'y a qu'un bouton on prend donc le premier element de la liste.
	return boutons[0];
}

noteString = ["C-", "Db", "D-", "Eb", "E-", "F-", "Gb", "G-", "Ab", "A-", "Bb", "B-" ];

function midiToNote (noteNum) {
    var octv;
    var nt;
    octv = (noteNum / 12)-2;
    nt = noteString[noteNum % 12];
    return nt + Math.floor(octv) + " ";
}

function creationPad(ligneFin, colones){

	var place = document.getElementById("listBoutonsSons");
	var compteurBouton = 0;

	// On vide le PAD
	while (place.firstChild) {
		place.removeChild(place.firstChild);
	}

	for(var i = ligneFin -1 ; i >= 0  ;i--) {
		var em = document.createElement("a");
		em.setAttribute("class", "texteNote");
		place.appendChild(em);
		em.innerHTML = midiToNote(i);

		for(var j=0;j< colones ;j++){	
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

	// Modifier l'affichage des boutons en fonction du séquenceur
	updateMatricePad(ligneFin, colones, resolutionPad);
}

function initMatricePad(ligneFin, colones) {
	// Créer la matrice vide 
	matricePad = new Array();
	for (var i = 0; i < ligneFin; i++) {
		matricePad[i] = [];
		for ( var j=0; j < colones; j++ ) {
			matricePad[i][j] = [];
		}
	}
}

function updateMatricePad(ligneFin, colones, resolution) {
	var lignePad = 0;
	var colonePad = 0;

	// Remise a 0 de la matrice;
	initMatricePad(ligneFin, colones);

	// Remplie la matrice avec la sequence
	// C'est utilisé quand on change de résolution pour la saisie des notes.
	for ( var i=0; i < sequence.length; i ++ ) {

		colonePad =  Math.floor(i / resolution); // Assignation de la note à la colone juste avant.

		if( sequence[i] != undefined ) {
			for (var j=0; j < sequence[i].length; j++) {

				var noteEnCours = sequence[i][j];
				lignePad = noteEnCours.codeMidi;

				//console.log("updateMatricePad:sequence[]", sequence[i][j], lignePad, colonePad );
				if ( noteEnCours.duree != 0 )	// Quand on n'est pas sur le NotOFF			
					pushNoteInMatricePad(lignePad, colonePad, noteEnCours);
			}
		}
	}
	//console.log("updateMatricePad:MATRICE PAD", matricePad);
}
exports.updateMatricePad = updateMatricePad;

function changeResolutionPad(resolution, monId) {
    var nbeColones = nbeDeMesures * tempsMesure * divisionMesure / resolution;
	nbeColonesPad = nbeColones;
	resolutionPad = resolution; // A mettre ailleurs peut-etre.
    creationPad(nbeLignesPad, nbeColones);
    console.log("changeResolutionPad:", nbeLignesPad, nbeColones, resolution);
	updateMatricePad(nbeLignesPad, nbeColones, resolution);

	// Un peu bourin, je sais
	var elements = document.getElementsByClassName("buttonResolution");
	for ( var i=0; i< elements.length; i++) {
			elements[i].style.backgroundColor = "#666633"; 
	}
	if (monId != undefined) monId.style.backgroundColor =  "#CF1919"; // Rouge
}
window.changeResolutionPad = changeResolutionPad;

function coloneVerte(colone) {
	var id = parseInt(colone);
	for(var i=0; i < nbeLignesPad; i++){
		//console.log("ID", "padBouton" + id.toString());
		var bouton = document.getElementById("padBouton" + id.toString());
		if ( bouton == undefined ) {
	 		console.log("coloneVerte:undefined", colone);
	 		return;
	 	}

		if ( bouton.getAttribute("class") != "padBoutonBleu") {
			bouton.setAttribute("class", "padBoutonVert");
		}
		id +=nbeColonesPad;
	}
}

function coloneGrise(colone) {
	var id = parseInt(colone);
	for(var i=0; i < nbeLignesPad; i++){
		//console.log("ID", "padBouton" + id.toString());
		var bouton = document.getElementById("padBouton" + id.toString());
		if ( bouton == undefined ) {
	 		console.log("coloneGrise:undefined", colone);
	 		return;
	 	}

		if ( bouton.getAttribute("class") != "padBoutonBleu") {
			bouton.setAttribute("class", "padBouton");
		}
		id +=nbeColonesPad;
	}
}

// A faire: 
// Quand on clique un bouton (X,Y), si pas d'objet dans la matrice, on crée la note dans la séquence,
// on la déclare dans la matrice, et on change l'affichage.
// S'il y a un objet dans la matrice en (X,Y) on détruit la note dans la séquence, on supprime la note de 
// la matrice, on change l'affichage.

function clickPadBouton(padBouton) {
	var bouton = document.getElementById( padBouton );
	if (debug) console.log("LIGNE COLONE", bouton.dataset.ligne, bouton.dataset.colone);
	var index = resolutionPad * parseInt(bouton.dataset.colone);
	var noteMidi = parseInt(bouton.dataset.ligne);
	
	// A FAIRE: Ajouter ici la gestion des vélocités avec plusieurs clicks en intensifiant 
	// la couleur.

	if ( bouton.getAttribute("class") == "padBoutonBleu") { // Désactivation de la note
		bouton.setAttribute("class", "padBouton");
		
		//var noteASupprimer = getNoteInSequence(index, noteMidi);
		//removeNoteInSequence(index, noteASupprimer);

		// Supprime aussi les notes dans séquence
		removeNotesInMatricePad(bouton.dataset.ligne, bouton.dataset.colone);

	} else { // Activation de la note
		bouton.setAttribute("class", "padBoutonBleu");
		var duree = resolutionPad;
		var note = new Note(noteMidi, 124, resolutionPad, index);
		putNoteInSequence(index, note);
		pushNoteInMatricePad(bouton.dataset.ligne, bouton.dataset.colone, note);
	}
	//console.log("clickPadBouton:MATRICE PAD", matricePad);

}
exports.clickPadBouton = clickPadBouton;

//****** Autres interfaces **********************

function vibration(duree) {
	if (navigator.vibrate == undefined ) return;
	if ('vibrate' in navigator) {
		navigator.vibrate(duree);
	}
}

var audioInit = new Audio();

//var srcInit = getSoundFile.resource("../sounds/tick.mp3");

// Pour flasher le smartphone
function bg() {
   document.body.className = "inplay";
   setTimeout( function() { document.body.className = "black-again" }, 10 );
}
exports.bg = bg

//****** Lancement des opérations et fermeture *********

function initialisation() {
	//audioInit.src = srcInit;
	//audioInit.play();
	//audioInit.pause(); 

	// Pour la gestion de la reconnexion si le serveur est tombé et relancé.
	// Si on n'a pas de pseudo en local on suit la procédure de demande d'un pseudo
	// Si on a déjà un pseudo on ne demande rien .
	// La gestion du status du client est dangereuse car c'est document.getElementById("monPseudo").value;
	// qui donne l'état. Ce sera à revoir.

	if (debug) console.log("PSEUDO clientsequenceur.js:", pseudo);
	if (pseudo === undefined) { // Cas de la première fois que l'on appelle le service sequenceur(pseudo)
		var x = document.getElementById("monPseudo").value;
		if ( x === "" || x === "Votre pseudo" ) { // Cas du OK sans saisie
			document.getElementById("MessageDuServeur").textContent = "Entrez un pseudo";
			return;
		} else {
			pseudo = x;
		}
	}
    msg.pseudo = pseudo;

	initWSSocket( port );

	// Attention: si on envoie un message ici sur la websocket immédiatament après la reconnexion.
	// Il se peut que la socket ne soit pas encore prête. Il y a des choses à faire avec readyState.

    document.getElementById( "monPseudo" ).style.display = "none";
    document.getElementById( "leBoutonPseudo" ).style.display = "none";
	document.getElementById("MessageDuServeur").style.display = "inline";

	// Attention block et pas inline pour les div
	el = document.getElementById( "listBoutonsSons" );
	el.style.display = "block";

	// Création du pad et des sequences
	creationPad( nbeLignesPad, nbeColonesPad);
	creationSequences(nbeDeMesures, tempsMesure, divisionMesure);

	el = document.getElementById( "buttonStart" );
	el.style.display = "inline";

	var elements = document.getElementsByClassName("buttonResolution");
	for ( var i=0; i< elements.length; i++) {
			elements[i].style.display = "inline"; 
	}

	/*console.log("BINAIRE", sequenceBinaire);
	console.log("TERNAIRE", sequenceTernaire);*/
	//initServerListener();
}
window.initialisation = initialisation;

// Pas encore utilisé tel que en Node
function init(port, p, unPseudo) {
	//hh = require("hiphop");
	par = p;
	pseudo = unPseudo;
	//listenMachine = makeListenMachine();
	initWSSocket( port );
	initialisation();
}
exports.init = init;

// Gestion de la fermeture du browser
window.onbeforeunload = function () {
	msg.type = "closeSpectateur";
	msg.text = "DISCONNECT_SPECTATEUR";
	msg.pseudo = pseudo;
	ws.send(JSON.stringify(msg));
	ws.close();
}
//************ WEBSOCKET et listener BROADCAST ******************************



function initWSSocket(port) { // Attention port pas utilisé ici pour le moment

// POUR COMMUNICATION DIRECTE AVEC PROCESSING **************
   var timeProcessing;

	//wsProcessing = new WebSocket( "ws://" + par.serverIPAddress + ":" + "8025" + "/processing" );
	wsProcessing = new WebSocket("ws://192.168.1.7:8035/processing");

	wsProcessing.onmessage = function( event ) {
		var msgRecu = JSON.parse(event.data);
		//console.log( "Client: received [%s]", event.data );
		switch(msgRecu.type) {
			case "message":  
				if (debug) console.log(msgRecu.text);
				/*var element = document.getElementById("MessageDuServeur");
				element.innerHTML = msgRecu.text;*/
				break;

			case "ping":
				if (debug) console.log("Reçu ping de PROCESSING" );
				var msgPong = {
					idClient: id,
					type: "pong",
					value: audioCtx.currentTime
				};
				wsProcessing.send(JSON.stringify(msgPong));
				break;

			case "pong":
				datePongProcessing = audioCtx.currentTime;
				console.log("Time reçu de Processing: ", msgRecu.time, "temps local: ", datePongProcessing );
				timeProcessing = msgRecu.time;

				latencePingProcessing = datePongProcessing - datePingProcessing;
				if (debug) console.log("Reçu pong de Processing, latence: ", latencePingProcessing);
				break;

			case "synchroProcessing":
				console.log("Reçu synchro de Processing");
				synchroSequenceur();
				//listenMachine.inputAndReact("synchro");
				break;

			default: if (debug) console.log("Le Client reçoit un message inconnu de Processing", msgRecu.time );
		}
	};	

	wsProcessing.onopen = function( event ) {
		if (debug) console.log("wsProcessing.onopen." );
		msg.type = "startSpectateur";
		msg.idClient = id;
		wsProcessing.send(JSON.stringify(msg)); // Sur le serveur Processing
	};

	wsProcessing.onerror = function (event) {
		if (debug) console.log( "clientsequenceur.js : received error on WS Processing", event );
	}

// POUR COMMUNICATION AVEC NODE **************************
	//ws = new WebSocket( "ws://" + par.serverIPAddress + ":" + port + "/hop/serv", [ "bar", "foo" ] );
	ws = new WebSocket('ws://localhost:8383'); // NODE JS

	//if (debug) console.log("clientsequenceur.js WS: ", "ws://" + par.serverIPAddress + ":" + port + "/hop/serv" );
	ws.onopen = function( event ) {
		msg.type = "startSpectateur";
		msg.text = "client";
		msg.idClient = id;
		msg.date = audioCtx.currentTime;
		ws.send(JSON.stringify(msg));
	};

	//Traitement de la Réception sur le client
	ws.onmessage = function( event ) {
		var msgRecu = JSON.parse(event.data);
		//console.log( "Client: received [%s]", event.data );
		switch(msgRecu.type) {
			case "message":  
				if (debug) console.log(msgRecu.text);
				/*var element = document.getElementById("MessageDuServeur");
				element.innerHTML = msgRecu.text;*/
				break;

			case "pong":
				datePong = audioCtx.currentTime;
				latencePing = datePong - datePing;
				console.log("Latence sur Ping", latencePing );
				break;

			case "ping":
				var msgPong = {
					type: "pong",
					value: audioCtx.currentTime
				};
				console.log("recu Ping");
				ws.send(JSON.stringify(msgPong));
				break;

			case "setConfigSequenceur": // On doit tout réinitialiser ici
			    console.log("setConfigSequenceur", msgRecu );
				tempsMesure = msgRecu.tempsMesure;
				divisionMesure = msgRecu.divisionMesure;	
				nbeDeMesures = msgRecu.nbeDeMesures;
				tempo = msgRecu.tempo;	
				canalMidi = msgRecu.canalMidi;
				dureeDuTick = msgRecu.dureeDuTick;

				sequence = new Array( nbeDeMesures * tempsMesure * divisionMesure );
				finPlayer = sequence.length;

				nbeColonesPad = nbeDeMesures * tempsMesure * divisionMesure / resolutionPad;
				changeResolutionPad(resolutionPad);

				document.getElementById("MessageDuServeur").textContent =  " Nbe mesure: " + nbeDeMesures + " - tempo: " + tempo + " - " + tempsMesure + "/" + ( 96 / divisionMesure) ;

				break;
			default: if (debug) console.log("Le Client reçoit un message inconnu", msgRecu );
		}
	};

	ws.onerror = function (event) {
		if (debug) console.log( "clientsequenceur.js : received error on WS", ws.socket, " ", event );
	}

	// Mécanisme de reconnexion automatique si le serveur est tombé.
	// Le service sequenceurPing permet de vérifier le présence du serveur
 	ws.onclose = function( event ) {

 	/*	
	   (function loop() {
      	      sequenceurPing()
	    	 .post()
	    	 .then(function(){ // Si serveur présent
	    	    	document.location=sequenceur(pseudo); 
		 		}, 
		 		function(){ // Si serveur absent
				    if (debug) console.log( "reconnecting..." );
				    setTimeout( loop, 2000 );
				} );
	   })();
	 */  
   }
}

/**** C'est du hop, revoir le broadcast en node.js
function initServerListener() {
	server.addEventListener('synchroTempo', function( event ) {
		if (debug) console.log("Reçu Broadcast: tempo", event.value );
		tempo = event.value; // Variable globale
		setTimeout( function () { 
			synchroSequenceur(); // Enclenche un réaction de l'atomate start/stop en fonction de la latence
		}, latencePing / 2 );
	}); 
}

*/



