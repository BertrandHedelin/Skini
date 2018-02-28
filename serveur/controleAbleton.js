/********************************

  VERSION NODE JS : Fev 2018

*********************************/
var csv = require('csv-array');
var debug = true;
var oscMidi = require("./logosOSCandMidiLocal");
var fs = require("fs");
var serv;

var nbeDeCommandes;
var tableDesCommandes;
// Il y a 20 files, donc 20 instruments possibles. Il faut initialiser le tableau pour pouvoir pusher et poper!!
var filesDattente = [ [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ],
                      [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ] ];

var nbeDeFileDattentes = 0;
var nbeDeSonsCorrespondantAuxCritres = 0;

// ===================  Pour le log du comportements de l'interaction ==========================
var msg = {
    type: "",
  };

var messageLog = {
    date: "",
    source: "controleAbleton.js",
    type: "log",
    pseudo: "",
    id: ""
  };

function logInfoAbleton(message){
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

// ======================= Initialisation pour Broadcast =============================

function initBroadCastServer(serveur) {
  if(debug) console.log("controleAbleton: initBroadCastServer ");
  serv = serveur;
}
exports.initBroadCastServer = initBroadCastServer;

// ======================= Grestion des fichiers de config ===========================

// 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Niveau1, 7=niveau2, 8=niveau3, 9=groupe, 10=durée
//

function initAbletonTable(fichier) { 
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
      if(debug) console.log("controleAbleton.js: Lecture ", fichier, tableDesCommandes );
      if(debug) console.log("ControleAbleton.js: Nbe de files d'attente: ", nbeDeFileDattentes);
      //if(debug) console.log("ControleAbleton.js: TableDesCommandes : ", tableDesCommandes);
    }, false);
};
exports.initAbletonTable = initAbletonTable;

// ================= Gestion des files d'attente ===========================
function pushEventAbleton(bus, channel, instrument, note, velocity, wsid, pseudo, dureeClip, nom) {
  var dureeAttente =0;

  if(debug) console.log("ControleAbleton.js: pushEventAbleton ", bus, channel, instrument, note, velocity, wsid, pseudo, nom); 
  var longeurDeLafile = filesDattente[instrument].length;

  //Structure de la file: par.busMidiAbleton en 0, ableton channel en 1, abletonNote en 2, velocity en 3, wsid 4, pseudo en 5

  // Protection contre les répétitions abusives sur le clip et le wsid, à approfondir c'est trop simpliste
  if ( longeurDeLafile  > 2 ) {
    if (filesDattente[instrument][longeurDeLafile -1][4] === filesDattente[instrument][longeurDeLafile -2][4] &&
        filesDattente[instrument][longeurDeLafile -1][2] === filesDattente[instrument][longeurDeLafile -2][2] ) {
        if(debug) console.log("ControleAbleton.js: REPETITION DETECTEE dans pushEventAbleton", filesDattente[instrument][longeurDeLafile -1] ); 

        // Log des répétitions
        messageLog.type = "REPETITION DETECTEE";
        messageLog.note = filesDattente[instrument][longeurDeLafile -1][2];
        messageLog.instrumentNo = instrument;       
        messageLog.pseudo = filesDattente[instrument][longeurDeLafile -1][5];  
        messageLog.id = filesDattente[instrument][longeurDeLafile -1][4];
        logInfoAbleton(messageLog);
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
exports.pushEventAbleton  = pushEventAbleton;

function displayQueues() {
  for (var i=0; i < filesDattente.length; i++) {
      if ( filesDattente[i].length  > 0 ) {
        messageLog.type = "Etat de la file d'attente";
        messageLog.longeurFileAttente = filesDattente[i].length;
        messageLog.file = filesDattente[i];
        delete messageLog.id;
        delete messageLog.pseudo;
        delete messageLog.note;
        delete messageLog.instrument;
        delete messageLog.instrumentNo;
        delete messageLog.nomSon;
        logInfoAbleton(messageLog);
        delete messageLog.longeurFileAttente;
        delete messageLog.file;
      }
  }
}
exports.displayQueues = displayQueues;

// Fontion appelée de façon régulière avec Td = Intervalle d'appel dans HOP > Tqa = Temps de quantization dans Ableton
function playAndShiftEventAbleton() {
  var commandeAbleton;

  //console.log(" controleAbleton : playAndShiftEventAbleton: filesDattente: ", filesDattente);
  if ( filesDattente === undefined ) return; // Protection

  for (var i=0; i < filesDattente.length; i++) {      // Pour chaque file d'attente

        commandebAbleton = filesDattente[i].shift();  // On prend l'évenement en tête de la file "i"
        if ( commandebAbleton === undefined ) continue;

        // On peut envoyer l'évènement à Ableton
        if(debug) console.log("ControleAbleton.js : playAndShiftEventAbleton : COMMANDE ABLETON A JOUER", commandebAbleton);
  
        // Log pour analyse a posteriori
        messageLog.type = "COMMANDE ABLETON ENVOYEE";
        messageLog.note = commandebAbleton[2];
        messageLog.instrumentNo = i;        
        messageLog.pseudo = commandebAbleton[5];        
        messageLog.id = commandebAbleton[4];
        messageLog.nomSon = commandebAbleton[7];
        logInfoAbleton(messageLog);

        // A REVOIR SANS SERVICE POUR NODE JS
        //oscMidi.sendNoteOnAbleton(commandebAbleton[0],  commandebAbleton[1], commandebAbleton[2], commandebAbleton[3] ).post();
        oscMidi.sendNoteOnAbleton(commandebAbleton[0],  commandebAbleton[1], commandebAbleton[2], commandebAbleton[3]);
        //Rappel des paramètres: par.busMidiAbleton, abletonChannel, abletonNote, velocity
        //oscMidi.sendProcessing( "/abletonPseudo", commandebAbleton[5] ).post();
        // Pour avertir le browser du demandeur du son
        msg.type = "infoPlayAbleton";
        msg.id = commandebAbleton[4];
        msg.nom = commandebAbleton[7];
        serv.broadcast(JSON.stringify(msg));
        //hop.broadcast('infoPlayAbleton', commandebAbleton );

    }
    return;
}
exports.playAndShiftEventAbleton = playAndShiftEventAbleton;

function cleanQueues() {
  filesDattente = [ [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ],
                  [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ] ];
  messageLog.type = "VIDAGE FILES ATTENTES";
  logInfoAbleton(messageLog);
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

//================== Algorithmes de sélection V2 ===============================
function getListClips(niv) {
  var clipsNiveau1 = new Array();
  var clipsNiveau2 = new Array();
  var clipsNiveau3 = new Array();

  //if (debug) console.log("controleAbleton.js: getListClips: niveaux", niv);

  if (niv[0] == 0 ) return tableDesCommandes;

  // Remplir avec le niveau 1
  var tableLength = tableDesCommandes.length;
  for (var i=0; i<tableLength; i++) {
    if(tableDesCommandes[i][6] === niv[0] ){ // Niveau1
        clipsNiveau1.push(tableDesCommandes[i]);
    }
  }  
  
  //if (debug) console.log("controleAbleton.js: getListClips: niveau1", clipsNiveau1 );

  if (niv[1] == 0 ) return clipsNiveau1; // Si pas de niveau2 on renvoie le niveau1
  
  // Filtrer le niveau 2
  var tableLength = clipsNiveau1.length;
  for (var i=0; i<tableLength; i++) {
    if(clipsNiveau1[i][7] === niv[1] ){ // Niveau2
      clipsNiveau2.push(clipsNiveau1[i]);
    }
  }

  //if (debug) console.log("controleAbleton.js: getListClips: niveau2", clipsNiveau2 );

  if (niv[2] == 0 ) return clipsNiveau2; // Si pas de niveau3 on renvoie le niveau2

  // Filtrer le niveau 3
  var tableLength = clipsNiveau2.length;
  for (var i=0; i<tableLength; i++) {
  if(clipsNiveau2[i][8] === niv[2] ){ // Niveau3
    clipsNiveau3.push(clipsNiveau2[i]);
    }
  }

  //if (debug) console.log("controleAbleton.js: getListClips: niveau3", clipsNiveau3 );

  return clipsNiveau3;
}

exports.getListClips = getListClips;


// ========== Algorithmes de sélection V1 ==================================================
/*function getAbletonNotes(id) {
    var tableLength = tableDesCommandes.length;
    for (var i=0; i<tableLength; i++) {
  		if(tableDesCommandes[i][2] === 0){
  		    tableDesCommandes[i][2] = id;
  		    if(debug) console.log("Controle Ableton.js: getAbletonNote\n", tableDesCommandes );
  		    return tableDesCommandes[i];
  		}
    }
    return [-1, -1, id, " "];
}
exports.getAbletonNotes = getAbletonNotes;

function getSelectedAbletonNotes(index) {
          return tableDesCommandes[index];
}
exports.getSelectedAbletonNotes = getSelectedAbletonNotes;


function nextAbletonNotes(id) {
    var tableLength = tableDesCommandes.length;
    var index = 0;
    
    // Libère la case id
    for (var i=0; i<tableLength; i++) {
  		if(tableDesCommandes[i][2] === id) {
  		    tableDesCommandes[i][2] = 0;
  		    index = i;
  		}
    }

    // On regarde s'il y a qqc de libre après index
    for (var i=index+1; i<tableLength; i++) {
  		if(tableDesCommandes[i][2] === 0){
  		    tableDesCommandes[i][2] = id;
  		    //console.log("Controle Ableton: getAbletonNotes ", tableDesCommandes[i][0], "id: ", id );
  		    return tableDesCommandes[i];
  		}
    }
    
    // Sinon on regarde si il y a qqc de libre avant index
    for (var i=0; i<index; i++) {
  		if(tableDesCommandes[i][2] === 0){
  		    tableDesCommandes[i][2] = id;
  		    //console.log("Controle Ableton: getAbletonNotes ", tableDesCommandes[i][0], "id: ", id );
  		    return tableDesCommandes[i];
  		}
    }

    if(debug) console.log("Controle Ableton.js: getAbletonNote, table pleine");
    if(debug) console.log("Controle Ableton.js: nextAbletonNotes\n", tableDesCommandes );
    return [-1, -1, id, " "];
}
exports.nextAbletonNotes = nextAbletonNotes;

function libereDansTableDesCommandes (id) {
    var tableLength = tableDesCommandes.length;
    var index = 0;
    
    // Libère la case id
    for (var i=0; i<tableLength; i++) {
  		if(tableDesCommandes[i][2] === id) {
  		    tableDesCommandes[i][2] = 0;
  		    index = i;
  		}
    }
    if(debug) console.log("Controle Ableton.js: ", id, " libéré");
    return;
}
exports.libereDansTableDesCommandes = libereDansTableDesCommandes;

function getSelectAbletonNotes(id, criteres) { // A tester, pas utilisé
  var index;
  index = rechercheIndexDuSon(criteres);
  if ( index != -1) {
	  	tableDesCommandes[index][2] = id;
	  	return tableDesCommandes[i];
  }
  return [-1, -1, id, " "];
}
exports.getSelectAbletonNotes = getSelectAbletonNotes;

function rechercheIndexDuSon(c, id){ // En fonction des critères et affectation de l'id client au son sélectionné
  var tableLength = tableDesCommandes.length;
  var tableDesPoids = new Array();
  var max = 0;
  var indexMax = -1;
  var indexPourUnSonMax = 0;
  var tableDesIndexMax = new Array();

  // Libère la case de référence id
    for (var i=0; i<tableLength; i++) {
      if(tableDesCommandes[i][2] === id) {
          tableDesCommandes[i][2] = 0;
          index = i;
      }
    }

  // On évalue chaque son en fonction des critères
  for (var i=0; i< tableLength; i++) {
  	//if(debug) console.log("ControleAbleton.js : Poids pour son ", i, " = ",
    //         poidsSurCritere( tableDesCommandes[i], c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8] ), " ", tableDesCommandes[i][3]);
  	tableDesPoids[i] = poidsSurCritere( tableDesCommandes[i], c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8] );
   }
  
   // Recherche du max selon les critères et les sons libres
   for (var i=0; i < tableLength; i++){
        if ( tableDesPoids[i] > max && tableDesCommandes[i][2] === 0 ) {
          max = tableDesPoids[i];
        }
   }
  if(debug) console.log("controlAbleton: rechercheIndexDuSon, Max des poids: ", max);


  // Remplir la table intermédiaire des sons libres au même niveau que le max
  for (var i=0; i < tableLength; i++){
        if ( tableDesPoids[i] === max && tableDesCommandes[i][2] === 0 ) {
          tableDesIndexMax.push(i);
        }
   }

  // Prendre un son au hasard dans la table intermédiaire
  indexPourUnSonMax = Math.floor((Math.random() * tableDesIndexMax.length));
  indexMax = tableDesIndexMax[indexPourUnSonMax];
  if(debug) console.log("controlAbleton: rechercheIndexDuSon, indexMax: ", indexMax, " Table des IndexMax: ", tableDesIndexMax);

  // Pour donner une information sur le nombre de son correspondant aux critères
  nbeDeSonsCorrespondantAuxCritres = tableDesIndexMax.length;

   tableDesCommandes[indexMax][2] = id; // Affectation de l'id client au son
   return indexMax;
}
exports.rechercheIndexDuSon = rechercheIndexDuSon;

function getNbeDeSonsCorrespondantAuxCritres() {
  return nbeDeSonsCorrespondantAuxCritres;
}
exports.getNbeDeSonsCorrespondantAuxCritres = getNbeDeSonsCorrespondantAuxCritres;

function poidsSurCritere(ligne, c1, c2, c3, c4, c5, c6, c7, c8, c9) {
  var poids = 0;
   if (ligne[4] === c1) poids++;
   if (ligne[5] === c2) poids++;
   if (ligne[6] === c3) poids++;
   if (ligne[7] === c4) poids++;
   if (ligne[8] === c5) poids++;
   if (ligne[9] === c6) poids++;
   if (ligne[10] === c7) poids++;
   if (ligne[11] === c8) poids++;
   if (ligne[12] === c9) poids++;
   return poids;
}

function getAbletonSoundFileName(id) {
  var tableLength = tableDesCommandes.length;
  for (var i=0; i<tableLength; i++) {
      if(tableDesCommandes[i][2] === id){
      return tableDesCommandes[i][3];
    }
  }
  return -1;
}
exports.getAbletonSoundFileName = getAbletonSoundFileName;*/