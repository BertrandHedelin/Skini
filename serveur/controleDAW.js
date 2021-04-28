/********************************

  VERSION NODE JS : Fev 2018
  © Copyright 2017-2021, B. Petit-Hédelin

*********************************/
var csv = require('csv-array');

var oscMidi = require("./OSCandMidi");
var fs = require("fs");

var debug = false;
var debug1 = true;

var serv;
var nbeDeCommandes;
var tableDesCommandes;

// Il faut initialiser le tableau pour displayQueue au départ.
var filesDattente = [ [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ],
                    [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ] ];

var nbeDeFileDattentes = 0;
var nbeDeSonsCorrespondantAuxCritres = 0;
var nbeDeGroupesSons = 0;
var nombreInstruments = 0;

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
        console.log("controlABleton:loadDAW:catch", e);
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

      if(debug) console.log("controleAbleton.js: Lecture une ligne de: ", fichier, tableDesCommandes[0] );
      if(debug) console.log("ControleAbleton.js: Nbe de files d'attente: ", nbeDeFileDattentes);
      if(debug) console.log("ControleAbleton.js: TableDesCommandes : ", tableDesCommandes);

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
// Assez similaire à pushClipAbleton() de websocketServer.
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
    var abletonNote = commande[0];
    var abletonChannel = Math.floor(abletonNote / 127) + 1;
    abletonNote = abletonNote % 127;
    if (abletonChannel > 15) {
      if (debug) console.log("Web Socket Server.js : pushClipAbleton: Nombre de canaux midi dépassé.");
      return;
    }
    var nom = commande[3];
    var abletonInstrument = commande[5];
    var dureeClip = commande[10];
    var signal = groupesClientSon.getSignalFromGroup(commande[9]) + "IN";
    var id = 0;

    var signalComplet =  { [signal] : commande[9] };

    if(debug) console.log("controleAbleton:putPatternInQueue: signalComplet:", signalComplet);
    //if(debug1) console.log("controleAbleton:putPatternInQueue:", par.busMidiAbleton, abletonChannel, abletonInstrument, abletonNote, 125, id, "Automate", dureeClip, nom, signal);
    var dureeAttente = pushEventAbleton(par.busMidiAbleton, abletonChannel, abletonInstrument, abletonNote, 125, id, "Automate", dureeClip, nom, signalComplet, typeNeutre);

  }else{
    console.log("WARN: constroleAbleton.js: Le pattern n'existe pas:", patternName);
    return undefined;
  }
  return dureeAttente;
}
exports.putPatternInQueue = putPatternInQueue;


// ================= Gestion des files d'attente ===========================
function pushEventDAW(bus, channel, instrument, note, velocity, wsid, pseudo, dureeClip, nom) {
  var dureeAttente =0;

  if(debug) console.log("ControleDAW.js: pushEventDAW ", bus, channel, instrument, note, velocity, wsid, pseudo, nom); 
  var longeurDeLafile = filesDattente[instrument].length;

  //Structure de la file: par.busMidiDAW en 0, DAW channel en 1, DAWNote en 2, velocity en 3, wsid 4, pseudo en 5

  // Protection contre les répétitions abusives sur le clip et le wsid, à approfondir c'est trop simpliste
  if ( longeurDeLafile  > 2 ) {
    if (filesDattente[instrument][longeurDeLafile -1][4] === filesDattente[instrument][longeurDeLafile -2][4] &&
        filesDattente[instrument][longeurDeLafile -1][2] === filesDattente[instrument][longeurDeLafile -2][2] ) {
        if(debug) console.log("ControleDAW.js: REPETITION DETECTEE dans pushEventDAW", filesDattente[instrument][longeurDeLafile -1] ); 

        // Log des répétitions
        messageLog.type = "REPETITION DETECTEE";
        messageLog.note = filesDattente[instrument][longeurDeLafile -1][2];
        messageLog.instrumentNo = instrument;       
        messageLog.pseudo = filesDattente[instrument][longeurDeLafile -1][5];  
        messageLog.id = filesDattente[instrument][longeurDeLafile -1][4];
        logInfoDAW(messageLog);
        return -1; // On n'envoi un code d'erreur car il y a répétition systématique de la même note par la même personne
    }
  }

  // Calcul de la durée d'attente en sommant les durées dans la file d'un instrument
  for (var i=0; i < longeurDeLafile; i++) {
      dureeAttente = dureeAttente + filesDattente[instrument][i][6];
  }

  // On met la demande dans la file d'attente
  filesDattente[instrument].push([bus, channel, note, velocity, wsid, pseudo, dureeClip, nom]); // Push à la fin du tableau

  // On retourne la longueur de la file d'attente pour une estimation de la durée d'attente qui sera transmise au spectateur
  return dureeAttente;
}
exports.pushEventDAW  = pushEventDAW;

// Revu pour node js
function displayQueues() {
  var file = [];
  var contenuDeLaFile = [];

  var messageLog = { date: "" };
  for (var i=0; i < filesDattente.length; i++) {
    if ( filesDattente[i].length  > 0 ) {
      messageLog.source = "controleDAW.js";
      messageLog.type = "Etat de la file d'attente";
      messageLog.longeurFileAttente = filesDattente[i].length;
      messageLog.file = filesDattente[i];
      logInfoDAW(messageLog);

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

  // Pour les musiciens
  var msg = {
    type: "lesFilesDattente",
    value : filesDattente
  }
  serv.broadcast(JSON.stringify(msg));
  //hop.broadcast('lesFilesDattente', filesDattente);
}
exports.displayQueues = displayQueues;

// Fontion appelée de façon régulière avec Td = Intervalle d'appel dans HOP > Tqa = Temps de quantization dans DAW
function playAndShiftEventDAW() {
  var commandeDAW;

  //console.log(" controleDAW : playAndShiftEventDAW: filesDattente: ", filesDattente);
  if ( filesDattente === undefined ) return; // Protection

  for (var i=0; i < filesDattente.length; i++) {      // Pour chaque file d'attente

        commandebDAW = filesDattente[i].shift();  // On prend l'évenement en tête de la file "i"
        if ( commandebDAW === undefined ) continue;

        // On peut envoyer l'évènement à DAW
        if(debug) console.log("ControleDAW.js : playAndShiftEventDAW : COMMANDE ABLETON A JOUER", commandebDAW);
  
        // Log pour analyse a posteriori
        messageLog.type = "COMMANDE ABLETON ENVOYEE";
        messageLog.note = commandebDAW[2];
        messageLog.instrumentNo = i;        
        messageLog.pseudo = commandebDAW[5];        
        messageLog.id = commandebDAW[4];
        messageLog.nomSon = commandebDAW[7];
        logInfoDAW(messageLog);

        oscMidi.sendNoteOnDAW(commandebDAW[0],  commandebDAW[1], commandebDAW[2], commandebDAW[3]);
        
        //Rappel des paramètres: par.busMidiDAW, DAWChannel, DAWNote, velocity
        //oscMidi.sendProcessing( "/DAWPseudo", commandebDAW[5] ).post();
        // Pour avertir le browser du demandeur du son
        msg.type = "infoPlayDAW";
        msg.id = commandebDAW[4];
        msg.nom = commandebDAW[7];
        serv.broadcast(JSON.stringify(msg));
        //hop.broadcast('infoPlayDAW', commandebDAW );

    }
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
    console.log("WARN:controleAbleton:getAllClips:cannot get groupeDeClients:", groupeDeClients, "from matriceDesPossibles");
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
