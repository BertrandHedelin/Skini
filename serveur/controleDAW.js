/********************************

  VERSION NODE JS : Fev 2018
  © Copyright 2017-2021, B. Petit-Hédelin

*********************************/
var csv = require('csv-array');

var oscMidi = require("./OSCandMidi");
var fs = require("fs");
var par = require('./skiniParametres');

var debug = false;
var debug1 = true;

var serv;
var nbeDeCommandes;
var tableDesCommandes;

// Il faut initialiser le tableau pour displayQueue au départ.
var filesDattente = [ [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ],
                    [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ] ];

var filesDattenteJouables = new Array(filesDattente.length);

// Il en faut autant que de files d'attente
var compteursDattente = [ 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0 ];

var nbeDeFileDattentes = 0;
var nbeDeSonsCorrespondantAuxCritres = 0;
var nbeDeGroupesSons = 0;
var nombreInstruments = 0;
var automatePossibleMachine;

var avecMusicien = false;
var decalageFIFOavecMusicien = 0;

const typeDebut = 1;
const typeMilieu = 2;
const typeFin = 3;
const typeNeutre = 4;
const typeMauvais = 5;


// ===================  Pour le log du comportements de l'interaction ==========================
var msg = {
    type: "",
  };

var messageLog = {
    date: "",
    source: "controleDAW.js",
    type: "log",
    pseudo: "",
    id: ""
  };

function setAutomatePossible(automate) {
  automatePossibleMachine = automate; 
}
exports.setAutomatePossible = setAutomatePossible;

function logInfoDAW(message){
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

function loadDAWTable(fichier) {
  return new Promise(function(resolve, reject) {
    if (fichier == undefined ) {
      reject("controleDAW: initDAWTable: pas de fichier à lire");   
    }
    
    nbeDeFileDattentes = 0;
    tableDesCommandes = new Array();
    csv.parseCSV(fichier, function(data){
      try{
        // Pour reformater le tableau socker en CSV
        for (var i=0; i < data.length ; i++) {
          data[i][0] = parseInt(data[i][0]);
          data[i][1] = parseInt(data[i][1]);
          data[i][2] = parseInt(data[i][2]);
          // On ne refomate pas les 3 et 4 qui restent des chaines de caractères

          for(var j = 5; j < 11; j++ ) {  // Nbe de colones dans le tableau
            data[i][j] = parseInt(data[i][j]);
          }

          tableDesCommandes.push(data[i]); // ajoute la ligne au tableau
          // Met à jour le nombre de files d'attente selon le numéro max des synthé dans le fichier de config
          if (tableDesCommandes[i][5] > nbeDeFileDattentes) nbeDeFileDattentes = tableDesCommandes[i][5];
        }

        nbeDeGroupesSons = 0;
        var tableLength = tableDesCommandes.length;

        // Calcul du nombre de groupe de sons et du nombre d'instruments
        nombreInstruments = 0;
        nbeDeGroupesSons = 0;

        for (var index=0; index<tableLength; index++) {
          if (tableDesCommandes[index][9] > nbeDeGroupesSons){
              nbeDeGroupesSons  = tableDesCommandes[index][9];
          }

          if (tableDesCommandes[index][5] > nombreInstruments){
              nombreInstruments  = tableDesCommandes[index][5];
          }
        }

        //*****************************
        if(debug1) console.log("ControleDAW.js: loadDAWTable: Nbe d'instruments: ", nombreInstruments);
        // On convertit l'index issu de la config des pattern en nombre de FIFO
        nombreInstruments++;
        filesDattente = new Array(nombreInstruments);
        compteursDattente = new Array(nombreInstruments);
        filesDattenteJouables = new Array(filesDattente.length);

        // Initialisation des tables
        for(var i = 0; i < filesDattente.length ; i++){
          filesDattenteJouables[i] = true;
          compteursDattente[i] = 0;
          filesDattente[i] = [];
        }

        if(debug1) console.log("controleDAW.js: loadDAWTable: Lecture une ligne de: ", fichier, tableDesCommandes[0] );
        if(debug1) console.log("ControleDAW.js: loadDAWTable: Nbe de files d'attente: ", nbeDeFileDattentes);
        if(debug) console.log("ControleDAW.js: filesDattenteJouables: ", filesDattenteJouables);

        //*****************************

        // Prépare le table des locks des instruments
        //initLockInstruments();

        if(debug) console.log("ControleDAW.js: nbeDeGroupesSons:", nbeDeGroupesSons);
        resolve();}
      catch(e) {
        console.log("controlDAW:loadDAW:catch", e);
        throw(e);
      }
    }, false);
  });
}
exports.loadDAWTable = loadDAWTable;

function displaySession(){
  console.log(tableDesCommandes);
}
exports.displaySession = displaySession;

// ======================= Initialisation pour Broadcast =============================

function initBroadCastServer(serveur) {
  if(debug) console.log("controleDAW: initBroadCastServer ");
  serv = serveur;
}
exports.initBroadCastServer = initBroadCastServer;

// ======================= Grestion des fichiers de config ===========================

// 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Niveau1, 7=niveau2, 8=niveau3, 9=groupe, 10=durée
//

function initDAWTable(fichier) { 
    tableDesCommandes = new Array();
    csv.parseCSV(fichier, function(data){
       // Pour reformater le tableau socker en CSV
       for (var i=0; i < data.length ; i++) {
        data[i][0] = parseInt(data[i][0]);
        data[i][1] = parseInt(data[i][1]);
        data[i][2] = parseInt(data[i][2]);

        // On ne refomate pas les 3 et 4 qui restent des chaines de caractères

        for(var j = 5; j < 11; j++ ) {  // Nbe de colones dans le tableau
            data[i][j] = parseInt(data[i][j]);
        }
        tableDesCommandes.push(data[i]); // ajoute la ligne au tableau
        // Met à jour le nombre de files d'attente selon le numéro max des synthé dans le fichier de config
        if (tableDesCommandes[i][5] > nbeDeFileDattentes) nbeDeFileDattentes = tableDesCommandes[i][5];
      }

      if(debug) console.log("controleDAW.js: Lecture une ligne de: ", fichier, tableDesCommandes[0] );
      if(debug) console.log("ControleDAW.js: Nbe de files d'attente: ", nbeDeFileDattentes);
      if(debug) console.log("ControleDAW.js: TableDesCommandes : ", tableDesCommandes);

      nbeDeGroupesSons = 0;
      var tableLength = tableDesCommandes.length;

      // Calcul du nombre de groupe de son
      for (var index=0; index<tableLength; index++) {
        if (tableDesCommandes[index][9] > nbeDeGroupesSons ) nbeDeGroupesSons = tableDesCommandes[index][9]; // nbeDeGroupesSons++ ;
          if (debug) console.log("---------------------------nbeDeGroupesSons:", nbeDeGroupesSons);
      }
    }, false);
};
exports.initDAWTable = initDAWTable;

function getNbeDeGroupesSons() {
  return nbeDeGroupesSons;
}
exports.getNbeDeGroupesSons = getNbeDeGroupesSons;

function getPatternNameFromNote(noteSkini){
  var tableLength = tableDesCommandes.length;
  for (var index=0; index < tableLength; index++) {
    if (tableDesCommandes[index][0] === noteSkini ){
      return tableDesCommandes[index][3];
    }
  }
  return undefined;
}
exports.getPatternNameFromNote = getPatternNameFromNote;

function getPatternFromNote(noteSkini){
  var tableLength = tableDesCommandes.length;
  for (var index=0; index < tableLength; index++) {
    if (tableDesCommandes[index][0] == noteSkini ){ // atention pas de ===, on récupère du texte
      return tableDesCommandes[index];
    }
  }
  return undefined;
}
exports.getPatternFromNote = getPatternFromNote;

// Pour mettre des patterns en file d'attente sans interaction.
// Cette fonction permet d'uitiliser Skini comme un séquenceur sans interaction.
// Le mécanisme de FIFO est utilisé, ce qui permet une combinaison avec les interactions
// et permet tous les usages des mécanismes de lecture des FIFO.
// Assez similaire à pushClipDAW() de websocketServer.
function putPatternInQueue(patternName){
  var tableLength = tableDesCommandes.length;
  var commande;

  // On identifie le pattern par son nom, cad le texte du champ "nom"
  for (var index=0; index < tableLength; index++) {
    if (tableDesCommandes[index][3] === patternName ){
      commande = tableDesCommandes[index];
    }
  }

  if(debug) console.log("controleBAleton: putPatternInQueue: commande :", commande);

  if (commande !== undefined){
    var DAWNote = commande[0];
    var DAWChannel = Math.floor(DAWNote / 127) + 1;
    DAWNote = DAWNote % 127;
    if (DAWChannel > 15) {
      if (debug) console.log("Web Socket Server.js : pushClipDAW: Nombre de canaux midi dépassé.");
      return;
    }
    var nom = commande[3];
    var DAWInstrument = commande[5];
    var dureeClip = commande[10];
    var signal = groupesClientSon.getSignalFromGroup(commande[9]) + "IN";
    var id = 0;

    // Contient le signal et le pattern
    var signalComplet =  { [signal] : commande[9] };


    if(debug) console.log("controleDAW:putPatternInQueue: signalComplet:", signalComplet);
    //if(debug1) console.log("controleDAW:putPatternInQueue:", par.busMidiDAW, DAWChannel, DAWInstrument, DAWNote, 125, id, "Automate", dureeClip, nom, signal);
    //var dureeAttente = pushEventDAW(par.busMidiDAW, DAWChannel, DAWInstrument, DAWNote, 125, id, "Automate", dureeClip, nom, signalComplet, typeNeutre);
    var dureeAttente = pushEventDAW(par.busMidiDAW, DAWChannel, DAWInstrument, DAWNote, 125, id, "Automate", dureeClip, nom, signal, typeNeutre);


  }else{
    console.log("WARN: constroleDAW.js: Le pattern n'existe pas:", patternName);
    return undefined;
  }
  return dureeAttente;
}
exports.putPatternInQueue = putPatternInQueue;


// ================= Gestion des files d'attente ===========================

function pushEventDAW(bus, channel, instrument, note, velocity, wsid, pseudo, dureeClip, nom, signal, typePattern) {
  var dureeAttente =0;
  var messageLog = { date: "" };

  if(debug) console.log("ControleDAW.js: pushEventDAW ", bus, channel, instrument, note, velocity, wsid, pseudo, nom, signal, typePattern); 
  var longeurDeLafile = filesDattente[instrument].length;

  // Scénario spécifique pour les interfaces avec les musiciens.
  if( longeurDeLafile === 0 && avecMusicien){
    // On met une demande vide dans la file d'attente pour décaler le démarrage du premier élément de la FIFO
    // et laisser au musicien le temps de se préparer au pattern.
    // file d'attente = [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
    // On met une note négative qui ne sera pas jouée, bien que dans la FIFO.

    // ATTENTION: Le pseudo devient l'instrument pour le décodage par les clients musiciens.
    // Le serveur nomme le pattern "void" quand il s'agit d'un pattern qu'on ne doit pas jouer.
    // et qui sert à permettre au musicien de se préparer.
    // [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
    filesDattente[instrument].push([0, 0, -1, 0, 0, instrument, decalageFIFOavecMusicien, "void", "void"]);
  }

  if(par.algoGestionFifo !== undefined){
    if(par.algoGestionFifo === 1){
      // Ici on prend en compte le type de pattern pour le placer dans la Fifo
      ordonneFifo(filesDattente[instrument], [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal, typePattern]);
    }else{
      // On met la demande dans la file d'attente sans traitement et sans tenir compte du type qui n'a pas de sens.
      filesDattente[instrument].push([bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]); // Push à la fin du tableau
    }
  }else{
    // On met la demande dans la file d'attente sans traitement et sans tenir compte du type qui n'a pas de sens.
    filesDattente[instrument].push([bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]); // Push à la fin du tableau
  }

  //Structure de la file: par.busMidiDAW en 0, DAW channel en 1, DAWNote en 2, velocity en 3, wsid 4, pseudo en 5
  // Calcul de la durée d'attente en sommant les durées dans la file d'un instrument
  for (var i=0; i < longeurDeLafile; i++) {
      dureeAttente = dureeAttente + filesDattente[instrument][i][6];
  }

  // On retourne la longueur de la file d'attente pour une estimation de la durée d'attente qui sera transmise au spectateur
  return dureeAttente;
}
exports.pushEventDAW  = pushEventDAW;

function getDelayEventDAW(instrument) {
  var dureeAttente =0;

  if(debug) console.log("ControleDAW.js: getDelayEventDAW ", instrument); 
  var longeurDeLafile = filesDattente[instrument].length;
  // Calcul de la durée d'attente en sommant les durées dans la file d'un instrument
  for (var i=0; i < longeurDeLafile; i++) {
      dureeAttente = dureeAttente + filesDattente[instrument][i][6];
  }
  // On retourne la longueur de la file d'attente pour une estimation de la durée d'attente qui sera transmise au spectateur
  return dureeAttente;
}
exports.getDelayEventDAW  = getDelayEventDAW;

// Revu pour node js
function displayQueues() {
  var file = [];
  var contenuDeLaFile = [];

  var messageLog = { date: "" };
  for (var i=0; i < filesDattente.length; i++) {
    if ( filesDattente[i].length  > 0 ) {

/*    messageLog.source = "controleDAW.js";
      messageLog.type = "Etat de la file d'attente";
      messageLog.longeurFileAttente = filesDattente[i].length;
      messageLog.file = filesDattente[i];
      logInfoDAW(messageLog);*/

      contenuDeLaFile = [];
      for ( var j=0; j<filesDattente[i].length; j++){
        // [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
        contenuDeLaFile.push([filesDattente[i][j][5], filesDattente[i][j][7]]);
      }
      //console.log(" File:", i, "--", contenuDeLaFile);
      file.push([i, filesDattente[i].length, contenuDeLaFile]);
    }
  }

  var msg = {
    type: "etatDeLaFileAttente",
    value : filesDattente
  }
  serv.broadcast(JSON.stringify(msg));
  //hop.broadcast('etatDeLaFileAttente', file);

  if(debug) console.log("controleDAW: displayQueue: ", msg);

  // Pour les musiciens
  var msg = {
    type: "lesFilesDattente",
    value : filesDattente
  }
  serv.broadcast(JSON.stringify(msg));
  //hop.broadcast('lesFilesDattente', filesDattente);
}
exports.displayQueues = displayQueues;

// Fonction appelée de façon régulière avec Td = Intervalle d'appel dans HOP > Tqa = Temps de quantization dans Ableton
var compteurTest = 0; // Pour controler la transmission depuis les clients, on le compte.
var laClef;
var leSignal;
var emptyQueueSignal;

function playAndShiftEventDAW(timerDivision) {
  var commandeDAW;
  var messageLog = { date: "" };

  if(debug) console.log(" controleDAW : playAndShiftEventDAW: filesDattente: ", filesDattente);
  if ( filesDattente === undefined ) return; // Protection

  for (var i=0; i < filesDattente.length ; i++) {  // Pour chaque file d'attente
    // Mécanisme de pause d'une file d'attente
    if(filesDattenteJouables[i] !== undefined){
      if(filesDattenteJouables[i] === false){
        continue;
      }
    }
    if(debug) console.log("--- ControleDAW.js:FIFO", i ," length:", filesDattente[i].length);

    if(debug) console.log("---0 ControleDAW.js:compteursDattente:", i, ":", compteursDattente[i]);
    // file d'attente = [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
    // Si la file n'est pas vide
    if(filesDattente[i] !== undefined){
      if(filesDattente[i].length !== 0){
        if(debug) console.log("--- ControleDAW.js:FIFO:", i ,":", filesDattente[i][0][7]);
        if(debug) console.log("--- ControleDAW.js:FIFO:", i ,":", filesDattente[i]);
        if(debug) console.log("\n---0 ControleDAW.js:FIFO:", i, " Durée d'attente du clip:", compteursDattente[i], " timer:", timerDivision);

        // Si l'attente est à 0 on joue le clip suivant
        if(compteursDattente[i] === 0){
          //Passe au clip suivant
          commandeDAW = filesDattente[i].shift();  // On prend l'évenement en tête de la file "i"

          if ( commandeDAW === undefined ) continue;
          
          if(debug) console.log("---1 ControleDAW.js:commande:", commandeDAW[7], "compteursDattente[i]:",compteursDattente[i]);

          // On peut envoyer l'évènement à DAW
          if(debug) console.log("--- ControleDAW.js : playAndShiftEventDAW : COMMANDE DAW A JOUER"); //, commandeDAW);
          // Log pour analyse a posteriori
          messageLog.source = "controleDAW.js";
          messageLog.type = "COMMANDE DAW ENVOYEE";
          messageLog.note = commandeDAW[2];
          messageLog.instrumentNo = i;        
          messageLog.pseudo = commandeDAW[5];        
          messageLog.id = commandeDAW[4];
          messageLog.nomSon = commandeDAW[7];
          logInfoDAW(messageLog);

          compteurTest ++;

          // Joue le clip, mais pas si la note n'est pas négative et que l'on est avec des musiciens.
          // si Note < 0 on est dans le cas d'un pattern d'info pour les musiciens.
          // On fait rien pour la DAW.
          // !! à vérifier.
          if( commandeDAW[2] >= 0 ){
            oscMidi.sendNoteOnDAW(commandeDAW[0],  commandeDAW[1], commandeDAW[2], commandeDAW[3] );
            //Rappel des paramètres oscMidi: par.busMidiDAW, DAWChannel, DAWNote, velocity
          }

          if(commandeDAW[6] % timerDivision !== 0) console.log("WARN: controleDAW.js: playAndShiftEventDAW: le pattern", commandeDAW[7], " a une durée qui n'est pas un multiple de timer division");
          if(debug) console.log("---2 ControleDAW.js:sendNoteOnDAW:", commandeDAW[7]);

          // Via OSC on perd les accents, donc on passe pas une WebSocket
          if (debug) console.log("playAndShiftEventDAW: ", compteurTest, ": ", commandeDAW[7], ":", commandeDAW[5]);

          // Pour affichage avec un programme Processing
          // oscMidi.sendProcessingDisplayNames( "demandeDeSonParPseudo", commandeDAW[7] );

          // La ligne automatePossibleMachine.react(commandeDAW[8]) est activé selon reactOnPlay
          // Si reactOnPlay existe à true on envoie le signal, qui correspond au lancement d'un pattern, au moment de le jouer
          // Au niveau timing cela signifie que l'on prend en compte une activation au moment où elle est jouée
          // et pas au moment où elle est demandée.
          // L'autre scénario est dans websocketserver où on envoie le signal au moment de la demande
          // Ce sont deux scénarios différents. Celui-ci peut poser des pb de performance si les react s'enchainent
          // quand on joue la file d'attente.
          
          // Pour associer le nom du pattern au signal de groupe
          laClef = Object.keys(commandeDAW[8]);
          leSignal = JSON.parse('{"' + laClef[0] + '":"' + commandeDAW[7] + '"}');

          if(debug) console.log("controleDAW:playAndShiftEventDAW: laclef:", laClef,", leSignal: ", leSignal);

          if (par.reactOnPlay !== undefined){
            if (par.reactOnPlay){
              automatePossibleMachine.react(leSignal);
            }
          }

          // Pour avertir le browser du demandeur du son et les musiciens s'il y en a.
          var msg = {
            type: "infoPlayDAW",
            value : filesDattente
          }
          serv.broadcast(JSON.stringify(msg));
          //hop.broadcast('infoPlayDAW', commandeDAW );

          if(debug) console.log("controleDAW:playAndShiftEventDAW: broadcast commandeDAW", commandeDAW);

          //Met à jour l'attente quand on a joué le pattern.
          compteursDattente[i] = commandeDAW[6]; // On recharge le compteur d'attente pour le pattern en cours, en comptant le tick en cours
          
          //Gestion d'une erreur possible dans la programmation de l'orchestration
          //si des patterns ont des durées < timeDivision, donc inférieures au tick.
          // Ce cas n'est plus traité à cause de la ligne 508, mais le pb reste
          if(compteursDattente[i] < 0 ){
            console.log("WARN: Problème sur Pattern", commandeDAW[7], ", sa durée est inférieure au timerDivision");
            compteursDattente[i] = 0;
          }
          if(debug) console.log("---3 ControleDAW.js:compteursDattente:", i, ":", compteursDattente[i]);

        }else{
          if(compteursDattente[i] > 0){
            if(debug) console.log("---4 ControleDAW.js:compteursDattente:", compteursDattente[i]);
          }
        }
      }else{
        emptyQueueSignal = JSON.parse('{"emptyQueueSignal":"' + i + '"}');
        automatePossibleMachine.react(emptyQueueSignal);
        if(debug) console.log("controleDAW.js: playAndShiftEventDAW:", emptyQueueSignal);
      }
    }
  } // Fin du for

  // -- Mettre à jour les attentes
  // On décrémente les compteurs d'attente de la durée du tick
  // Dans la file d'attente la durée du pattern devient le temps d'attente en fonction de la durée du tick.
  // C'est une façon de gérer des patterns plus longs que le tick.
  for (var i=0; i < compteursDattente.length ; i++) {
    if(avecMusicien && decalageFIFOavecMusicien < timerDivision){
      console.log("ERR: Le décalage pour musicien doit être un multiple de timerDivision !");
    }
    if( compteursDattente[i] >= timerDivision){
      compteursDattente[i] -= timerDivision;
    }
  }
  if(debug) console.log("--- ControleDAW.js:FIFO:Durée d'attente des clips:", compteursDattente, " timer:", timerDivision);
  return;
}
exports.playAndShiftEventDAW = playAndShiftEventDAW;

function cleanQueues() {
  var messageLog = { date: "" };
  if(debug) console.log("controleDAW.js : cleanQueues", filesDattenteJouables, compteursDattente, filesDattente);

  for(var i = 0; i < filesDattente.length ; i++){
    filesDattenteJouables[i] = true;
    compteursDattente[i] = 0;
    filesDattente[i] = [];
  }

  messageLog.source = "controleDAW.js";
  messageLog.type = "VIDAGE FILES ATTENTES";
  logInfoDAW(messageLog);
  if (debug) console.log("controleDAW: cleanQueues");

  var msg = {
    type: "etatDeLaFileAttente",
    value : filesDattente
  }
  serv.broadcast(JSON.stringify(msg));
  //hop.broadcast('cleanQueues', 255);
}
exports.cleanQueues = cleanQueues;

// ================= Visualisation de la table des commandes ===============

function nbeDeSpectateursConnectes() {
    var tableLength = tableDesCommandes.length;
    var compteur = 0;

    for (var i=0; i<tableLength; i++) {
          if (tableDesCommandes[i][2] !== 0 ) compteur++;
    }
    return compteur;

}
exports.nbeDeSpectateursConnectes = nbeDeSpectateursConnectes;

function getAllClips(groupeDeClients, matriceDesPossibles) { 
  if ( matriceDesPossibles[groupeDeClients] === undefined || groupeDeClients === undefined) {
    console.log("WARN:controleDAW :getAllClips:cannot get groupeDeClients:", groupeDeClients, "from matriceDesPossibles");
    return -1;
  }

  var clipsActifs  = new Array();

  var tableLength = tableDesCommandes.length;
  // Pour chaque élément (clip, pattern) de la table des commandes, je prend son groupe
  // et je cherche dans la matrice des possibles si ce groupe est actif.
  // Si le groupe est actif, j'ajoute l'élément dans la lsite des clipsActifs.
  // C'est assez consommateur comme traitement.
  for (var i=0; i < tableLength; i++) {
    for (var j=0; j < matriceDesPossibles[groupeDeClients].length ; j ++) {
      if (matriceDesPossibles[groupeDeClients][j] === true) { // "j" me donne un groupe de sons actifs
        // Le groupe est en 9 dans la table des commandes
        if(tableDesCommandes[i][9] !== undefined ) {
          if(tableDesCommandes[i][9] === j ) {
            clipsActifs.push(tableDesCommandes[i]);
            break;
          }
        }
      }
    }
  }
  return clipsActifs;
}
exports.getAllClips = getAllClips;


//================== Algorithmes de sélection V2 ===============================
function getListClips(niv) {
  var clipsNiveau1 = new Array();
  var clipsNiveau2 = new Array();
  var clipsNiveau3 = new Array();

  //if (debug) console.log("controleDAW.js: getListClips: niveaux", niv);

  if (niv[0] == 0 ) return tableDesCommandes;

  // Remplir avec le niveau 1
  var tableLength = tableDesCommandes.length;
  for (var i=0; i<tableLength; i++) {
    if(tableDesCommandes[i][6] === niv[0] ){ // Niveau1
        clipsNiveau1.push(tableDesCommandes[i]);
    }
  }  
  
  //if (debug) console.log("controleDAW.js: getListClips: niveau1", clipsNiveau1 );

  if (niv[1] == 0 ) return clipsNiveau1; // Si pas de niveau2 on renvoie le niveau1
  
  // Filtrer le niveau 2
  var tableLength = clipsNiveau1.length;
  for (var i=0; i<tableLength; i++) {
    if(clipsNiveau1[i][7] === niv[1] ){ // Niveau2
      clipsNiveau2.push(clipsNiveau1[i]);
    }
  }

  //if (debug) console.log("controleDAW.js: getListClips: niveau2", clipsNiveau2 );

  if (niv[2] == 0 ) return clipsNiveau2; // Si pas de niveau3 on renvoie le niveau2

  // Filtrer le niveau 3
  var tableLength = clipsNiveau2.length;
  for (var i=0; i<tableLength; i++) {
  if(clipsNiveau2[i][8] === niv[2] ){ // Niveau3
    clipsNiveau3.push(clipsNiveau2[i]);
    }
  }

  //if (debug) console.log("controleDAW.js: getListClips: niveau3", clipsNiveau3 );

  return clipsNiveau3;
}

exports.getListClips = getListClips;

//************** Réorganisation des Fifos **************
// Le méanisme est décrit dans la doc utilisateur de Skini.
// 

function putPatternBetween(fifo, avant, apres, pattern){
  for( var i=fifo.length-1; i > 0; i--){
    if(debug) console.log("-- putPatternBetween:", fifo.length, i);
    if(fifo[i][9] === apres){
      if(fifo[i-1][9] === avant){
        if(debug) console.log("---- putPatternBetween: On met le pattern:", pattern[7], "de type:", pattern[9], 
          "en", i," (entre types", apres, " et ", avant, ")");
        fifo.splice(i,0, pattern);
        return true;
      }
    }
  }
  return false;
}

function putPatternFirstWithoutSecond(fifo, avant, apres, pattern) {
  if(debug) console.log("---- putPatternFirstWithoutSecond");

  for( var i=fifo.length-1; i > 0; i--){
    if(fifo[i][9] === avant){
      if(fifo[i-1][9] !== apres){
        if(debug1) console.log("---- putPatternFirstWithoutSecond: On met le pattern:", pattern[7], "de type:", pattern[9],
          "en", i," (entre types", apres, " et ", avant, ")");
        fifo.splice(i,0, pattern);
        return true;
      }
    }
  }
  return false;
}

function ordonneFifo(fifo, pattern){
  // On ordonne la fifo en partant de l'indice haut qui correspond au denier pattern entré
  // ceci évite de trop perturber le timing d'éntrée des patterns dans la fifo.
  // pattern en fifo => [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal, typePattern]

  if(fifo.length === 0 || pattern[9] === typeNeutre){
    if(debug) console.log("ordonneFifo: Fifo vide ou pattern N:push le pattern");
    fifo.push(pattern);
    return;
  }

  if(fifo.length === 0 && pattern[9] === typeMilieu){
    if(debug) console.log("ordonneFifo: M tout seul, on le jette");
    return;
  }

  switch(pattern[9]){
    case typeFin : 
      if(fifo.length-1 > 0){
        if(putPatternBetween(fifo, typeDebut, typeDebut, pattern)){ return; }
        if(putPatternBetween(fifo, typeMilieu, typeMilieu, pattern)){ return; }
        if(fifo[fifo.length-1][9] === typeFin){ // le dernier élément est déjà une fin F
          if(putPatternBetween(fifo, typeDebut, typeMilieu, pattern)){ return; }
        }
      }
      break; // On pousse

    case typeDebut :
      if(fifo.length-1 > 0){
        if(putPatternBetween(fifo, typeFin, typeFin, pattern)){ return; }
        if(putPatternBetween(fifo, typeFin, typeMilieu, pattern)){ return; }
      }else{
        if(fifo[0][9] === typeFin){
          if(debug) console.log("---- ordonneFifo: Permuttons F et D");
          fifo.splice(0,0, pattern);
          return;
        }
      }
      break; // On pousse

    case typeMilieu :
      if(fifo.length-1 > 0){
        if(putPatternBetween(fifo, typeDebut, typeFin, pattern)){ return; }
        if(putPatternBetween(fifo, typeMilieu, typeFin, pattern)){ return; }
        if(putPatternBetween(fifo, typeFin, typeFin, pattern)){ return; }
      }else{ // Il n'y a qu'un élément dans la Fifo.
        if(fifo[0][9] === typeFin){ // Si c'est une fin
          if(debug) console.log("---- ordonneFifo: Permuttons F et M");
          fifo.splice(0,0, pattern);
        }
        else{ // C'est qu'on a un debut avant, mais on pourra avoir un début apres ou un autre milieu
          if(debug) console.log("---- Un pattern Milieu seul dans la fifo: on le jette");
          return; // On perd le pattern sinon, donc pas utilisable en interaction.
        }
      }
      // Attention : Ce return est une façon de ne placer un milieu que si on est certain de l'avoir caser proprement.
      // On perd le pattern sinon, donc pas utilisable en interaction.
      if(debug) console.log("---- Un pattern Milieu supprimé");
      return;

      break; // On pousse

    case typeMauvais :
      // On ne fait rien dans ce cas.
      break;

    default: if(debug) console.log("Pattern de type inconnu");
  }
  if(debug) console.log("---- ordonneFifo: On push le pattern aprés traitement:", pattern[7]);
  fifo.push(pattern);
}
