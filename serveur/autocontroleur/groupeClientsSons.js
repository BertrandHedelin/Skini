
/*******************************

Gestion des groupes de clients et de sons
La Matrice des possibles

© Copyright 2019-2021, B. Petit-Hédelin

La matrice des possibles est un tableau à 2 dimensions qui donne pour chaque groupe de clients
l'état des  groupes de patterns,  actifs ou pas.
Chaque groupe de patterns, groupe d'éléments comporte plusieurs éléments
conformément à ce qui est décrit dans le fichier csv de description des patterns.

La mise à jour de la matrice des possibles est faite par l'automate hiphop, par le controleur,
ou par les scrutateurs. Elle est la concrétisation de l'orchestration.

Cette matrice est sollicitée en lecture par les clients quand ils emettent le message "selectAllClips" vers le serveur de webSocket.
Le clientSelecteurSimple emet ce message à l'initialisation (quand un message de modification du contexte DAW est reçu, DAWON) et à chaque fois
qu'il reçoit par broadcast un message 'groupeClientStatus' qui signifie une modification dans la matrice.
C'est donc bien à chaque fois qu'une modification est signalée que le client cherche à se mettre à jour.

Le message 'groupeClientStatus' de signalisation d'une modification de la matrice est émis par broadcast:
- soit par le serveur de WebSocket lorsqu'il reçoit une demande de modification de la matrice des possibles de la part du controleur via les messages:
 "putInMatriceDesPossibles", "ResetMatriceDesPossibles", "setAllMatriceDesPossibles". Pour plus de détail à ce niveau, voir les commentaires dans clientcontroleur.js.
- soit de la part du scrutateur (dans sa version active) via le message:  "propositionScrutateur".
- soit par l'automate via la fonction informSelecteurOnMenuChange() de groupeClientsSons.js. Dans l'automate c'est à la charge du compositeur
de signaler une mise à jour de la matrice. Ceci n'est pas automatique.

********************************/
'use strict'

var debug = false;
var debug1 = true;

var mr = require('../../myReact/myReact.min.js');
var par = require('../skiniParametres');
var DAW = require('../controleDAW');
var oscMidiLocal = require('../OSCandMidi'); // Pour OSC vers Game
var fs = require("fs");

var serv;

var automateUn, automateDeux, automateTrois;

if(debug) console.log("groupeClientsSons.js: require initial des automates: passé");

// Tableau des clients actifs par groupe,
// Devient un tableau de tableau. Le premier tableau a des index correspondant au groupe.
// Les tableaux en deuxième position contiennent les id des clients générés à la connexion.
var groupesClient = new Array(par.nbeDeGroupesClients);

var matriceDesPossibles = new Array(par.nbeDeGroupesClients);
exports.matriceDesPossibles = matriceDesPossibles;

var timerDivision; // doit rester undefined si pas mis à jour par les automates
var nbeDeGroupesSons = 0;

var nombreDePatternsPossibleEnListe = [[3, 255]]; // init pour client memorySortable

 // Pour les listes de clients memorySortable connectés et les infos sur les types de
 // patterns ainsi que les précédentes listes envoyées. Mis à jour dans websocketServeur.
var clientsEnCours = [];

// Devient le tableau des groupes de sons en cours
var groupesSon;

var groupeName = "";

var socketControleur;

var computeScorePolicy = 0;
var computeScoreClass = 0;


function initBroadCastServer(serveur) {
  if(debug1) console.log("groupecliensSons: initBroadCastServer ");
  serv = serveur;
}
exports.initBroadCastServer = initBroadCastServer;

/*===========================================================================
setClientsEncours et getClientsEncours

Ce sont  des fonctions qui font passerelle entre websocketServerSkini.js
et les orchestrations car il n'y a pas de lien direct de l'orchestration
vers websocketServerSkini. Il y en a dans l'autre sens via des react().

=============================================================================*/

function setClientsEncours(liste){
	clientsEnCours = liste;
}
exports.setClientsEncours = setClientsEncours;

function getClientsEncours(){
	if(debug) console.log("groupecliensSons: getClientsEncours:", clientsEnCours);
	return clientsEnCours;
}
exports.getClientsEncours = getClientsEncours;

/*===========================================================================
getWinnerPseudo, getWinnerScore, getTotalGameScore, rankWinners, getGroupScore

Le calcul du ranking des scores se fait ici car ils sont activés par l'orchestration
mais le calcul des scores se fait dans compScore.js qui est activé à partir
de webSocketServeurSkini.js chaque soumission de liste de patterns.

=============================================================================*/

function getWinnerPseudo(index){

	if(debug1) console.log("groupecliensSons: getWinner length:", clientsEnCours.length, index);
	console.log("groupecliensSons: getWinnerPseudo : index :", index);

	var winners = rankWinners(clientsEnCours);

	if(winners === -1 || index >= winners.length ){
		return '';
	}
	return winners[index].pseudo;
}
exports.getWinnerPseudo = getWinnerPseudo;

function getWinnerScore(index){
	if(debug) console.log("groupecliensSons: getWinner length:", clientsEnCours.length);
	var winners = rankWinners(clientsEnCours);
	if(winners === -1 || index >= winners.length){
		return 0;
	}
	return winners[index].score;
}
exports.getWinnerScore = getWinnerScore;

function getTotalGameScore(){
	if(debug) console.log("groupecliensSons: getTotalGameScore :", clientsEnCours);
	var totalScore = 0;

    for(var i = 0 ; i < clientsEnCours.length; i++){ 
    	totalScore += clientsEnCours[i].score;
    }
	return totalScore;
}
exports.getTotalGameScore = getTotalGameScore;

function rankWinners(uneListe){
	if(debug) console.log("groupecliensSons: rankWinners:", uneListe);

	if(uneListe === undefined){
		console.log("ERR : groupecliensSons: rankWinners: undefined");
		return -1;
	}

	if(uneListe.length === 0){
		return -1;
	}

	var evaluation = function(a,b){
	   return a.score > b.score ;
	}

	var liste = uneListe.slice();

    for(var i = 0 ; i < liste.length; i++){ 
    // le tableau est trié de 0 à i-1
    // La boucle interne recherche le min
    // de i+1 à la fin du tableau. 
        for(var j=i+1; j < liste.length; j++){
            if(evaluation( liste[j], liste[i]) ){
                var temp = liste[j];
                liste[j]=liste[i];
                liste[i]=temp;
            }
        }
    }
    return liste ;
}

function getGroupScore(rank){
	if(debug) console.log("groupecliensSons: getGroupScore:", clientsEnCours);
	var scores = new Array();
	var indexMaxDeGroupe = 0;

	// On calcule l'index max pour les groupes
    for(var i = 0 ; i < clientsEnCours.length; i++){
    	if (clientsEnCours[i].groupe > indexMaxDeGroupe) {
    		indexMaxDeGroupe = clientsEnCours[i].groupe;
    	}
    }

   // On crée le tableau d'objet scores pour pouvoir le trier après.
    for(var i = 0 ; i < indexMaxDeGroupe + 1; i++){
    	var el = {
    	 	groupe : i,
    		score : 0
    	}
    	scores.push(el);
     }
    // On remplit scores avec les totaux de chaque groupe
    // score est encore organisé avec comme index les groupes.
    for(var i = 0 ; i < clientsEnCours.length; i++){
    	if(clientsEnCours[i].groupe >= 0){ // On ne prend pas en compte les simulateurs hors audience dont le groupe est -1
    		scores[clientsEnCours[i].groupe].score += clientsEnCours[i].score;
    	}
    }
    // Classement des scores
   	var winners = rankWinners(scores);

    if(debug) console.log("groupecliensSons: getGroupScore:scores", scores, "winners", winners);
    return winners[rank].score;
}
exports.getGroupScore = getGroupScore;

/*===========================================================================
getTimerDivision, getComputeScorePolicy, getComputeScoreClass

Fonctions passerelle entre websocketServerSkini.js
et les orchestrations car il n'y a pas de lien direct de l'orchestration
vers websocketServerSkini. Il y en a dans l'autre sens via des react().

Les setTimerDivision, setComputeScorePolicy, setComputeScoreClass 
sont faits directement depuis l'orchestration avec des addEventListeners.

=============================================================================*/

function getTimerDivision() {
	return timerDivision;
}
exports.getTimerDivision = getTimerDivision;

function getComputeScorePolicy() {
	return computeScorePolicy;
}
exports.getComputeScorePolicy = getComputeScorePolicy;

function getComputeScoreClass() {
	return computeScoreClass;
}
exports.getComputeScoreClass = getComputeScoreClass;

function setSocketControleur(socket) {
	socketControleur = socket;
	if (automateUn !== undefined) automateUn.setSocketControleur(socket);
	if (automateDeux !== undefined) automateDeux.setSocketControleur(socket);
	if (automateTrois !== undefined) automateTrois.setSocketControleur(socket);
	//console.log("groupeClientsSons:socketControleur:", socketControleur);
}
exports.setSocketControleur = setSocketControleur;

/*********************************************************

Gestion des logs de l'automate

**********************************************************/

function logInfoAutomate(message){
	message.date = getDateTime();
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

var messageLog = {
	date: "",		
	source: "groupeClientSons.js",
	type: "log"
}

/******************

Gestion des info vers les clients

******************/
/*
function informSelecteurOnMenuChange(groupe, sons, status) {
	if (sons == undefined ) {
		groupeName = "";
	} else {
		groupeName = sons;
	}
	var message = {
		groupeClient: groupe,
		groupeName: groupeName,
		status : status
	};
	// Informe les selecteurs et simulateurs
	if(debug) console.log("groupecliensSons:informSelecteurOnMenuChange:", groupe, sons, status);
	hop.broadcast('groupeClientStatus',JSON.stringify(message));
}
exports.informSelecteurOnMenuChange = informSelecteurOnMenuChange;

function setTickOnControler(tick) {
	var message = {
		type: "setTickAutomate",
		tick: tick
	}
	//console.log("groupecliensSons:socketControleur automate:", socketControleur);
	if (socketControleur.readyState == 1 ) {
		socketControleur.send(JSON.stringify(message));
	} else {
		console.log("ERR: groupecliensSons: informControleur: socketControleur;", socketControleur.readyState);
	}
}
exports.setTickOnControler = setTickOnControler;

// Pour la gestion du client memorySortable et la diffusion de la taille des listes
function getNombreDePatternsPossibleEnListe(){
	if(debug) console.log("groupecliensSons: getNombreDePatternsPossibleEnListe:", nombreDePatternsPossibleEnListe);
	return nombreDePatternsPossibleEnListe;
}
exports.getNombreDePatternsPossibleEnListe = getNombreDePatternsPossibleEnListe;

*/

/******************

Gestion des Groupes de clients

*******************/
for ( var i=0; i < groupesClient.length; i++) {
	groupesClient[i] = new Array(); 
}

function putIdInGroupClient(id, groupe) {
	if(debug1) console.log("groupecliensSons:", id, groupe);
	groupesClient[groupe].push(id);

// Test de broadcast
/*	var msg = {
		type: "message",
		text : "Groupe Client Son"
	}
	serv.broadcast(JSON.stringify(msg));*/
}
exports.putIdInGroupClient = putIdInGroupClient;

function removeIdInGroupClient(id) {
	var position;
	
	for (var i=0; i < groupesClient.length; i++) {
		for (var j=0; j < groupesClient[i].length; j++) {
			if ( groupesClient[i][j] == id ) {
				position = groupesClient[i].splice(j, 1);
				return position; // Pour contrôle
			}
		}
	}
}
exports.removeIdInGroupClient = removeIdInGroupClient;

function getGroupClient(id) {
	for (var i=0; i < groupesClient.length; i++) {
		for (var j=0; j < groupesClient[i].length; j++) {
			if ( groupesClient[i][j] == id ) {
				return i;
			}
		}
	}
}
exports.getGroupClient = getGroupClient;

function getIdsClient(groupe) {
	return groupesClient[groupe];
}
exports.getIdsClient = getIdsClient;

function getGroupesClient() {
	return groupesClient;
}
exports.getGroupesClient = getGroupesClient;

function getGroupesClientLength(groupe) {
	var longueurs = new Array(par.nbeDeGroupesClients);
	for (var i=0; i < groupesClient.length; i++) {
		longueurs[i] = groupesClient[i].length;
	}
	return longueurs;
}
exports.getGroupesClientLength = getGroupesClientLength;

/************************************

Groupes de sons (patterns)

************************************/
function getOnGoingGroupeSons() {
	return groupesSon;
}
exports.getOnGoingGroupeSons = getOnGoingGroupeSons;

function getSignalFromGroup(groupe) {
	if(debug) console.log("groupecliensSons.js : getSignalFromGroup : ", groupe);

	var ongoingGroupe = getOnGoingGroupeSons();
	for (var i=0; i < ongoingGroupe.length; i++) {
		if( ongoingGroupe[i][1] == groupe) {
			return ongoingGroupe[i][0];
		}
	}
	console.log("ERR: groupecliensSons : getSignalFromGroup : groupe inconnu :", groupe);
	return -1;
}
exports.getSignalFromGroup = getSignalFromGroup;

function setNbeDeGroupesSons(groupesSons) {
	// Nbe de groupe de son est donné par controleDAW sur la base de ce qui est décrit dans les fichiers csv
	// il s'agit donc de la valeur max dans des groupes qui vont de 0 à X. Il y a donc X + 1 groupe de sons. 
	nbeDeGroupesSons = groupesSons + 1;
}
exports.setNbeDeGroupesSons = setNbeDeGroupesSons;

function getGroupeSons(signal) {

	var signalLocal = signal.slice(0, -3); // Pour enlever OUT

	if (debug) console.log("groupeClientSons.js: getGroupeSons: signal:", signal, "signalLocal:", signalLocal, "nbeDeGroupesSons:", nbeDeGroupesSons);

	for (var i = 0; i < nbeDeGroupesSons ; i++) {
		if  ( groupesSon[i][0] === undefined) {
			console.log("ERR: getGroupeSons: groupesSon[", i ,"i][0]: undefined, table groupesSon pas encore à jour");
			return -1;
		}
		if ( groupesSon[i][0] === signalLocal) {
			return groupesSon[i][1]; // et pas i !!
		}
	}
	console.log("ERR: groupeClientSons.js: getGroupeSons: signal inconnu", signalLocal);
	return -1;
}

function getNameGroupeSons(index) {
	for (var i = 0; i < groupesSon.length ; i++) {
		if ( groupesSon[i][1] == index) { // Attention pas de === ici, il y a changementde type
			return groupesSon[i][0];
		}
	}
	if(groupesSon[index] === undefined){
		console.log("ERR: groupeClientSons.js: getNameGroupeSons: index inconnu", index, groupesSon);
		return -1;
	}
}
exports.getNameGroupeSons = getNameGroupeSons;

function setGroupesSon(DAWState) {
	if (DAWState ==  0) {
		if (debug) console.log("groupeClientsSons: setGroupesSon:DAWStatus:", DAWState);
		return -1;
	}
	
	groupesSon = par.groupesDesSons[DAWState - 1]; // On compte les status DAW depuis 1 et non 0
	
	if (groupesSon == undefined ) {
		console.log("ERR: groupeClientSons.js: setGroupesSon: groupesSon:undefined:DAWStatus:", DAWState);
		return -1;
	}
	
	if (groupesSon.length == 0 ) {
		console.log("WARNING: groupeClientSons.js: setGroupesSon: groupesSon vide");
		return -1;
	}

	// !!!  hop.broadcast('setPatternGroups', par.groupesDesSons[DAWState-1] ); // Pour score et clients
	
	if (debug) console.log("groupeClientsSons: setGroupesSon:groupesSon ", groupesSon, "DAWStatus:", DAWState);
	return 0;
}
exports.setGroupesSon = setGroupesSon;

/*************************

Matrice des possibles, pour le contrôle
des liens entre groupes de clients et groupes de sons (patterns)

**************************/
function createMatriceDesPossibles() {
	for ( var i=0; i < matriceDesPossibles.length; i++) {
		matriceDesPossibles[i] = new Array(nbeDeGroupesSons); 
	}
	// Info pour les scrutateurs
	var msg = {
		type: "createMatriceDesPossibles",
		matrice : matriceDesPossibles
	}
	serv.broadcast(JSON.stringify(msg));
	// !!!  hop.broadcast("createMatriceDesPossibles", matriceDesPossibles);
}
exports.createMatriceDesPossibles = createMatriceDesPossibles;

function setInMatriceDesPossibles(groupeClient, groupeDeSons, status) {
	if (debug) console.log("groupeClientSons.js: setInMatriceDesPossibles ", groupeClient, groupeDeSons, status);

 	if (groupeClient === 255) { // On traite tous les groupes
		for (var i=0; i < par.nbeDeGroupesClients; i++) {
			matriceDesPossibles[i][groupeDeSons] = status;
		}
		return 0;
	}
	if (groupeClient >= par.nbeDeGroupesClients) {
		console.log("ERR: groupeClientSons.js:setInMatriceDesPossibles:groupeClient size exceeded:", groupeClient);
		return -1;
	}
	matriceDesPossibles[groupeClient][groupeDeSons] = status;

	// Info pour les scrutateurs
	var message = [groupeClient, groupeDeSons, status];
	var msg = {
		type: "setInMatriceDesPossibles",
		message : message
	}
	serv.broadcast(JSON.stringify(msg));
	// !!! hop.broadcast("setInMatriceDesPossibles", message);

	return 0;
}
exports.setInMatriceDesPossibles = setInMatriceDesPossibles;

function getStatusInMatriceDesPossibles(groupeClient, groupeSon) {
	if (matriceDesPossibles[groupeClient][groupeSon] != undefined ) {
		return matriceDesPossibles[groupeClient][groupeSon];
	}
}
exports.getStatusInMatriceDesPossibles = getStatusInMatriceDesPossibles;

function setMatriceDesPossibles() {
	for ( var i=0; i < matriceDesPossibles.length; i++) {
		for (var j=0; j < matriceDesPossibles[i].length; j++) {
			matriceDesPossibles[i][j] = true;
		}
	}
	// Info pour les scrutateurs
	var msg = {
		type: "setMatriceDesPossibles",
		message : "Set"
	}
	serv.broadcast(JSON.stringify(msg));
	// !!! hop.broadcast("setMatriceDesPossibles", "Set");
	if (debug) console.log("groupeClientSons:setMatriceDesPossibles:", matriceDesPossibles);
}
exports.setMatriceDesPossibles = setMatriceDesPossibles;

function resetMatriceDesPossibles() {
	for ( var i=0; i < matriceDesPossibles.length; i++) {
		for (var j=0; j < matriceDesPossibles[i].length; j++) {
			matriceDesPossibles[i][j] = false;
		}
	}
	//if (debug) console.log("groupeClientSons:resetMatriceDesPossibles:", matriceDesPossibles);
	// Info pour les scrutateurs
	var msg = {
		type: "resetMatriceDesPossibles",
		message : "Reset"
	}
	serv.broadcast(JSON.stringify(msg));
	// !!! hop.broadcast("resetMatriceDesPossibles", "Reset");
}
exports.resetMatriceDesPossibles = resetMatriceDesPossibles;

/*************************************************************

AUTOMATE DE GESTION DE LA MATRICE DES POSSIBLES

**************************************************************/

// Cette fonction devrait disparaitre au profit de la suivante makeOneAutomatePossibleMachine
// quand toutes les orchestrations seront créées sous forme d'expression de fonction.
function makeAutomatePossibleMachine () {

	/*
    if(debug) console.log("groupeClientsSons.js: makeAutomatePossibleMachine");

	// On recharge par = require('../logosParametres');
	// Il ne s'agit pas du fichier de configuration de la pièce
	// mais de sa copie dans logosParametres.js.
	// Réfléchir pour faire ça proprement...
	//delete require.cache[require.resolve('../logosParametres.js')];
	//par = require("../logosParametres.js");
	//if(debug1) console.log("groupesClientSons:makeAutomatePossibleMachine:Pour test:", par.groupesDesSons[0][0]);

	// Pour chargement et rechargerment de l'automate
	// On utilise des automates vides pour les orchestrations non déclarées
	// pour éviter de retoucher les mécanismes liés à DAWON
	if (par.automate1 !== undefined && par.automate1 !== ''){
		delete require.cache[require.resolve(par.automate1)];
		try{
			var automateUn = require(par.automate1, "hiphop");
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateUn =  require("./autoVide1.js", "hiphop");
	}
	if (par.automate2 !== undefined && par.automate2 !== ''){
		delete require.cache[require.resolve(par.automate2)];
		try{
			var automateDeux = require(par.automate2, "hiphop");
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateDeux =  require("./autoVide2.js", "hiphop");
	}
	if (par.automate3 !== undefined && par.automate3 !== ''){
		delete require.cache[require.resolve(par.automate3)];
		try{
			var automateTrois = require(par.automate3, "hiphop");
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateTrois =  require("./autoVide3.js", "hiphop");
	}

  	function creationModule( lesSons ) {
	// Pour debug création des signaux à partir de logosparameters
	//console.log( automateInt.creationInterfaces(par.groupesDesSons[0]));
		return hiphop module (in start, in stop, in tick, in DAWON,
		    out setTimerDivision, out resetMatriceDesPossibles,
		    out cleanQueues, out cleanOneQueue,
		    out pauseQueues, out resumeQueues, out pauseOneQueue, out resumeOneQueue,
		    out patternListLength,
		    out cleanChoiceList,
		    in patternSignal, in controlFromVideo, in pulsation, in midiSignal, in emptyQueueSignal,
		    out setComputeScoreClass, out setComputeScorePolicy)
			implements
				${automateInt.creationInterfaces(lesSons[0])},
				${automateInt.creationInterfaces(lesSons[1])},
				${automateInt.creationInterfaces(lesSons[2])},
			 	${automateInt.creationInterfacesGameIn(par.gameOSCIn)},
 				${automateInt.creationInterfacesGameOut(par.gameOSCOut)}  {

			fork {
				//run spy(...);
			} par {
				every immediate (DAWON.now) {
				 	if ( DAWON.nowval === 1 ) {
						run ${automateUn.trajetModule1}(...);
					} else if ( DAWON.nowval === 2 ){
						run ${automateDeux.trajetModule2}(...);
					} else if ( DAWON.nowval === 3 ){
						run ${automateTrois.trajetModule3}(...);
					}
				}
			}
		}
	}
	var machine = new hh.ReactiveMachine( creationModule( par.groupesDesSons) );

	// Création des listeners des signaux
	for (var j=0; j < par.groupesDesSons.length; j ++) {
		makeSignalsListeners(machine, j);
	}
	makeListener(machine);
	return machine;
*/
}
exports.makeAutomatePossibleMachine = makeAutomatePossibleMachine;

// Cette fonction est très proche de la précédente
// Elle permet de ne traiter qu'un automate lors que ceux-ci sont rechargeables
// On garde la précédente pour maintenir une compatibilité ascendante avec 
// les pièces musicales déjà produites qui sont non prévues pour des rechargements.

// On utilise des automates vides pour les orchestrations non déclarées
// pour éviter de retoucher les mécanismes assez compliqués liés à DAWON
function makeOneAutomatePossibleMachine (numAuto) {

	/*
    if(debug) console.log("groupeClientsSons.js: makeOneAutomatePossibleMachine");

	// Pour chargement et rechargerment de l'automate
	if (numAuto === 1 && par.automate1 !== undefined && par.automate1 !== ''){
		delete require.cache[require.resolve(par.automate1)];
		try{
			var automateUn = require(par.automate1, "hiphop");
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateUn =  require("./autoVide1.js", "hiphop");
	}
	if (numAuto === 2 && par.automate2 !== undefined && par.automate2 !== ''){
		delete require.cache[require.resolve(par.automate2)];
		try{
			var automateDeux = require(par.automate2, "hiphop");
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateDeux =  require("./autoVide2.js", "hiphop");
	}
	if (numAuto === 3 && par.automate3 !== undefined && par.automate3 !== ''){
		delete require.cache[require.resolve(par.automate3)];
		try{
			var automateTrois = require(par.automate3, "hiphop");;
		}catch(err){
			console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", err);
			throw err;
		}
	}else{
		var automateTrois =  require("./autoVide3.js", "hiphop");
	}

  	function creationModule( lesSons, numAuto ) {
		return hiphop module (in start, in stop, in tick, in DAWON,
		    out setTimerDivision, out resetMatriceDesPossibles,
		    out cleanQueues, out cleanOneQueue,
		    out pauseQueues, out resumeQueues, out pauseOneQueue, out resumeOneQueue,
		    out patternListLength,
		    out cleanChoiceList,
		    out setComputeScoreClass, out setComputeScorePolicy,
		    in patternSignal, in controlFromVideo, in pulsation, in midiSignal, in emptyQueueSignal)
			implements 
				${automateInt.creationInterfaces(lesSons[numAuto-1])},
			 	${automateInt.creationInterfacesGameIn(par.gameOSCIn)},
 				${automateInt.creationInterfacesGameOut(par.gameOSCOut)}  {

			fork {
				//run spy(...);
			} par {
				every immediate (DAWON.now) {
				 	if ( DAWON.nowval === 1 ) {
						run ${automateUn.trajetModule1}(...);
					} else if ( DAWON.nowval === 2 ){
						run ${automateDeux.trajetModule2}(...);
					} else if ( DAWON.nowval === 3 ){
						run ${automateTrois.trajetModule3}(...);
					}
				}
			}
		}
	}
	var machine = new hh.ReactiveMachine( creationModule( par.groupesDesSons, numAuto) );
	makeSignalsListeners(machine, numAuto-1);
	makeListener(machine);
	return machine;

	*/
}
exports.makeOneAutomatePossibleMachine = makeOneAutomatePossibleMachine;

function makeSignalsListeners(machine, orchestration){

	/*
	// Création des listeners des signaux
	for (var i=0; i < par.groupesDesSons[orchestration].length; i++) {
		var signal = par.groupesDesSons[orchestration][i][0] + "OUT";

		//if (debug1) console.log("Addeventlisterner:signal:",signal);
		machine.addEventListener( signal , function(evt) {
			// Rappel: setInMatriceDesPossibles(groupeClient, groupeSon, status)
			var groupeSonLocal = getGroupeSons(evt.signalName);
			if (groupeSonLocal == -1) {
				console.log("ERR: groupeClientsSons.js:creationModule:Addeventlisterner: signal inconnu:",evt.signalName);
				return;
			}
			if (debug) console.log("groupeClientSOns.js:creationModule:Addeventlisterner: groupeSons:", groupeSonLocal,
				"signalName:", evt.signalName,
				"groupeClientsNo:", evt.signalValue[1],
				"statut:", evt.signalValue[0],
				"signalValue:", evt.signalValue);

			if ( setInMatriceDesPossibles(evt.signalValue[1], groupeSonLocal, evt.signalValue[0]) === -1) {
				return;
			}

			// INFORMATION VERS CLIENT CONTROLEUR POUR AFFICHAGE (son, groupe, status)
			var message = {
				type: "setInMatrix",
				son: groupeSonLocal, 
				groupe: evt.signalValue[1],
				status: evt.signalValue[0]
			}
			//console.log("groupecliensSons:socketControleur automate:", socketControleur);
			if (socketControleur.readyState == 1 ) {
				socketControleur.send(JSON.stringify(message));
			} else {
				console.log("ERR: groupecliensSons:socketControleur automate:problème:", socketControleur.readyState);
			}

			// Info pour les scrutateurs [groupeClient, groupeDeSons, status];
			var messageScrut = [evt.signalValue[1], groupeSonLocal, evt.signalValue[0]];
			hop.broadcast("setInMatriceDesPossibles", messageScrut);

			messageLog.type = "signal";
			messageLog.value = signal;
			logInfoAutomate(messageLog);
		});
	}
	*/
}

function makeListener(machine){

	/*
	// Listener des signaux pour les jeux avec commandes OSC 
	if(par.gameOSCOut !== undefined){
		for (var i=0; i < par.gameOSCOut.length; i++) {
			var signal = par.gameOSCOut[i];
			if(debug) console.log("Signal OSC ajouté:", signal);
			machine.addEventListener( signal , function(evt) {
				if(debug) console.log("groupeClientsSons:Emission d'une commande OSC depuis orchestration:", evt.signalName);
				oscMidiLocal.sendOSCGame(evt.signalName, evt.signalValue);
			});
		}
	}

	// Par ordre alphabétique des messages
	machine.addEventListener( "cleanQueues" , function(evt) {
		DAW.cleanQueues();
		if(debug){ 
		  console.log("INFO: groupeClientSons.js:listerner cleanQueues");
		}
	});

	machine.addEventListener( "cleanOneQueue" , function(evt) {
		DAW.cleanQueue( evt.signalValue);
		if(debug){ 
		  console.log("INFO: groupeClientSons.js:listerner cleanOneQueue:", evt.signalValue);
		}
	});

	machine.addEventListener( "cleanChoiceList" , function(evt) {
		if(debug1) console.log("groupecliensSons.js: cleanChoiceList:", evt.signalValue);
		hop.broadcast('cleanChoiceList', evt.signalValue);
	});

	machine.addEventListener( "patternListLength" , function(evt) {

		function sendMessage(nbePatternsListes){
			if(debug) console.log("groupecliensSons.js: patternListLength:", nbePatternsListes);
			hop.broadcast('nombreDePatternsPossible', nbePatternsListes);
		}

		// Mise à jour du suivi des longueurs de listes
		for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
			if(	nombreDePatternsPossibleEnListe[i][1] === evt.signalValue[1]){
				nombreDePatternsPossibleEnListe[i][0] = evt.signalValue[0];
				sendMessage(nombreDePatternsPossibleEnListe);
				return;
			}
		}
		nombreDePatternsPossibleEnListe.push([evt.signalValue[0], evt.signalValue[1]]);
		sendMessage(nombreDePatternsPossibleEnListe);
	});

	machine.addEventListener( "pauseOneQueue" , function(evt) {
		DAW.pauseQueue( evt.signalValue);
		if(debug1){ 
		  console.log("INFO: groupeClientSons.js:listerner pauseOneQueue",  evt.signalValue);
		}
	});

	machine.addEventListener( "pauseQueues" , function(evt) {
		DAW.pauseQueues();
		if(debug1){
		  console.log("INFO: groupeClientSons.js:listerner pauseQueues");
		}
	});

	machine.addEventListener( "resetMatriceDesPossibles" , function(evt) {
		resetMatriceDesPossibles();
		if(debug){ 
		  console.log("INFO: groupeClientSons.js:listerner resetMatriceDesPossibles");
		}
	});

	machine.addEventListener( "resumeOneQueue" , function(evt) {
		DAW.resumeQueue( evt.signalValue);
		if(debug1){ 
		  console.log("INFO: groupeClientSons.js:listerner resumeOneQueue:", evt.signalValue);
		}
	});

	machine.addEventListener( "resumeQueues" , function(evt) {
		DAW.resumeQueues();
		if(debug1){
		  console.log("INFO: groupeClientSons.js:listerner resumeQueues");
		}
	});

	machine.addEventListener( "setTimerDivision" , function(evt) {
		if(debug1){ 
		  console.log("INFO: groupeClientSons.js:listener setTimerDivision: ", evt.signalValue);
		}
		timerDivision = evt.signalValue;
	});

	machine.addEventListener( "setComputeScorePolicy" , function(evt) {
		if(debug1){ 
		  console.log("INFO: groupeClientSons.js:listener setComputeScorePolicy: ", evt.signalValue);
		}
		computeScorePolicy = evt.signalValue;
	});

	machine.addEventListener( "setComputeScoreClass" , function(evt) {
		if(debug1){ 
		  console.log("INFO: groupeClientSons.js:listener setComputeScoreClass: ", evt.signalValue);
		}
		computeScoreClass = evt.signalValue;
	});

	*/
}