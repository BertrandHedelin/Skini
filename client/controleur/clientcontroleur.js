/**
 * @fileOverview 
 * Controle de la matrice des possibles
 * entre groupe de sons et groupe de clients
 * 
 * browserify .\clientcontroleur.js -o .\controleurbundle.js
 * sur Mac
 * browserify ./clientcontroleur.js -o ./controleurbundle.js
 * 
 * @copyright (C) 2022-2025 Bertrand Petit-Hédelin
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * @version 1.4
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 */
"use strict"

var par;
var ipConfig = require('../../serveur/ipConfig');

var port;
var ws;
var id = Math.floor((Math.random() * 1000000) + 1); // Pour identifier le client;

var matricePad;

var nbeLignesPad;
var nbeColonesPad;
var etatScrutateurs = [];

var bleu = "#008CBA";
var rouge = '#CF1919';
var vert = "#4CAF50";
var marron = '#666633';
var violet = '#797bbf';
var orange = '#b3712d';

var debug = false;
var debug1 = true;

var DAWTableEnCours = 0;
var automateEncours = true;
var serverHostname;
// Autres déclarations

// On met des valeurs pas defaut, mais ce n'est pas nécessaire.
const msg = { type: "configuration" };

const COLORS = {
  BLEU: "padBoutonBleu",
  DEFAULT: "padBouton",
};

// Cette fonction est activée à la demande de chaque client sequenceur
// Le client séquenceur peut envoyer cette ordre de deux façon:
// - clic sur erase par le client sequenceur
// - réception par le client séquenceur d'un broadcast  'resetSequenceur' émis par websocketServeur lorsqu'il reçoit une demande du controleur:
// controleur ---- ws "resetSequenceur" --->  websocketserveur  ----- broadcast "resetSequenceur" ---->   clientsequenceur ----------  ws vers Processing "erasePatern"  -----> Processing  vide
// C'est un montage compliqué mais Processing ne reçoit pas les broadcast de hop.
function resetSequenceur() {
  ws.send(JSON.stringify({ type: "resetSequenceur" }));
}
window.resetSequenceur = resetSequenceur;

function creationPad() {

  const place = document.getElementById("listBoutonsLiens");
  let compteurBouton = 0;

  // On vide le PAD
  place.innerHTML = '';

  // Première ligne
  var em = document.createElement("a");
  em.setAttribute("class", "texteSon");
  place.appendChild(em);
  em.innerHTML = "-";

  for (let j = 0; j < nbeColonesPad; j++) {
    var em = document.createElement("button");
    em.dataset.colone = j;
    em.setAttribute("class", "numColone");
    em.addEventListener("click", function (event) { clickColoneBouton(this.dataset.colone); });
    place.appendChild(em);
    em.innerHTML = j;
  }

  place.appendChild(document.createElement("br"));

  // Le PAD
  for (let i = 0; i < nbeLignesPad; i++) {
    const em = document.createElement("a");
    em.setAttribute("class", "texteSon");
    place.appendChild(em);
    em.innerHTML = i;

    for (let j = 0; j < nbeColonesPad; j++) {
      const bouton = document.createElement("button");
      bouton.id = "padBouton" + compteurBouton;
      compteurBouton++;
      bouton.dataset.ligne = i;
      bouton.dataset.colone = j;

      bouton.setAttribute("class", "padBouton");
      bouton.addEventListener("click", () => clickPadBouton(bouton.id));
      place.appendChild(bouton);
    }
    place.appendChild(document.createElement("br"));
  }

  // Etat des scrutateurs
  etatScrutateurs = Array(nbeColonesPad).fill(0);
  const scrutHeader = document.createElement("a");
  scrutHeader.className = "texteSon";
  scrutHeader.innerHTML = "-";
  place.appendChild(scrutHeader);

  for (let j = 0; j < nbeColonesPad; j++) {
    const em = document.createElement("button");
    em.setAttribute("class", "etatScrut");
    em.setAttribute("id", "etatScrut" + j);
    place.appendChild(em);
    em.innerHTML = "-";
  }
  place.appendChild(document.createElement("br"));
}

function setPadButton(son, groupe, status) {
  // Traite une colone complète
  if (groupe === 255) {
    let id = parseInt(son);
    for (let j = 0; j < nbeLignesPad; j++) {
      const button = document.getElementById(`padBouton${id}`);
      if (!button) return console.error("ERR setAllPad: boutton undefined", id);
      button.className = status ? COLORS.BLEU : COLORS.DEFAULT;
      id += nbeColonesPad;
    }
    return;
  }

 if (groupe >= par.nbeDeGroupesClients || son >= nbeColonesPad) {
    return console.error("ERR: setPadButton out of bounds", { son, groupe });
  }

  const index = parseInt(son) + groupe * nbeColonesPad;
  const idBouton = "padBouton" + index;
  if (debug) console.log("clientcontroleur:setPadButton:idBouton", idBouton);
  const leBouton = document.getElementById(idBouton);
  leBouton.className = status ? COLORS.BLEU : COLORS.DEFAULT;
}

function clickColoneBouton(colone) {
  let id = parseInt(colone);
  let status;

  if (debug) console.log("clickColoneBouton: bouton:", id, " nbeColonesPad:", nbeColonesPad);

  for (let j = 0; j < nbeLignesPad; j++) {
    const bouton = document.getElementById("padBouton" + id.toString());

    if (bouton == undefined) {
      console.log("ERR setAlclickColoneBouton: bouton undefined", id);
      return;
    }

    if (bouton.getAttribute("class") == "padBoutonBleu") { // Désactive le lien entre groupes
      bouton.setAttribute("class", "padBouton");
      status = false;

    } else { // Active le lien
      bouton.setAttribute("class", "padBoutonBleu");
      status = true;
    }

    ws.send(JSON.stringify({
      type: "putInMatriceDesPossibles",
      clients: j,
      sons: colone,
      status
    }));

    id += nbeColonesPad;
  }
}
window.clickColoneBouton = clickColoneBouton;

// Quand on clique un bouton (X,Y)
function clickPadBouton(padBoutonId) {
  const button = document.getElementById(padBoutonId);
  const isActive = button.className === COLORS.BLEU;
  const status = !isActive;
  button.className = status ? COLORS.BLEU : COLORS.DEFAULT;

  ws.send(JSON.stringify({
    type: "putInMatriceDesPossibles",
    clients: button.dataset.ligne,
    sons: button.dataset.colone,
    status
  }));
}
exports.clickPadBouton = clickPadBouton;

function resetAllPad() {
  if (automateEncours) {
    let id = 0;
    for (let j = 0; j < nbeLignesPad; j++) {
      for (let i = 0; i < nbeColonesPad; i++) {
        const bouton = document.getElementById("padBouton" + id.toString());
        if (bouton == undefined) {
          console.log("setAllPad:undefined", colone);
          return;
        }
        bouton.setAttribute("class", "padBouton");
        id++;
      }
    }

    const msg = {
      type: "ResetMatriceDesPossibles",
    };
    ws.send(JSON.stringify(msg));
  } else {
    alert("WARNING: Nothing to reset")
  }
}
window.resetAllPad = resetAllPad;

function cleanPad() {
  if (automateEncours) {
    var id = 0;
    for (var j = 0; j < nbeLignesPad; j++) {
      for (var i = 0; i < nbeColonesPad; i++) {
        var bouton = document.getElementById("padBouton" + id.toString());
        if (bouton == undefined) {
          console.log("setAllPad:undefined", colone);
          return;
        }
        bouton.setAttribute("class", "padBouton");
        id++;
      }
    }
  }
}

function setAllPad() {
  if (automateEncours) {
    var id = 0;
    for (var j = 0; j < nbeLignesPad; j++) {
      for (var i = 0; i < nbeColonesPad; i++) {
        var bouton = document.getElementById("padBouton" + id.toString());
        if (bouton == undefined) {
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
window.setAllPad = setAllPad;

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
  var el = document.getElementById("listBoutonsLiens");
  el.style.display = "block";

  initServerListener();

  setInterval(function () {
    getNbeDeSpectateurs();
  }, 1000);
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

function checkSession() {
  msg.type = "checkSession";
  ws.send(JSON.stringify(msg));
}
window.checkSession = checkSession;

/* function loadSession() {
  var reponse = window.prompt("Descriptor file");
  if (reponse === undefined || reponse === '') return;

  var fileName;
  fileName = par.sequencerFilePath + reponse + '.csv';
  if (debug1) console.log("loadSession:", fileName);
  msg.type = "loadSession";
  msg.fileName = fileName;
  ws.send(JSON.stringify(msg));
}
window.loadSession = loadSession; */

/* function saveSession() {
  var reponse = window.prompt("Descriptor file");
  if (reponse === undefined || reponse === '') return;

  var fileName;
  fileName = par.sequencerFilePath + reponse + '.csv';
  if (debug1) console.log("saveSession:", fileName);
  msg.type = "saveSession";
  msg.fileName = fileName;
  ws.send(JSON.stringify(msg));
}
window.saveSession = saveSession; */

//************ WEBSOCKET et listener BROADCAST ******************************
function initWSSocket(host) {
  var toggle = true;
  ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);

  if (debug1) console.log("clientcontroleur.js ws://" + host + ":" + ipConfig.websocketServeurPort);
  ws.onopen = function (event) {
    msg.type = "startSpectateur";
    msg.text = "controleur";
    msg.id = id;
    console.log("ID sent to server:", msg.id);
    ws.send(JSON.stringify(msg));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function (event) {
    //console.log( "Client: received [%s]", event.data );

    var msgRecu = JSON.parse(event.data);
    if (debug) console.log("message reçu: ", msgRecu.type);

    switch (msgRecu.type) {
      case "DAWTableNotReady": // Si la table n'est pas chargée on garde le bouton start
        alert(msgRecu.text);
        document.getElementById("buttonStartAutomate").style.display = "inline";
        document.getElementById("buttonStopAutomate").style.display = "none";
        break;

      case "etatDeLaFileAttente":
        if (debug) console.log("etatDeLaFileAttente:", msgRecu);

        var texteAffiche = ' ';

        if (msgRecu.value === undefined) {
          console.log("WARN: clientcontroleur: etatDeLaFileAttente undefined");
          break;
        }
        for (var i = 0; i < msgRecu.value.length; i++) {
          if (msgRecu.value[i].length !== 0) {
            texteAffiche += "[" + i + ":" + msgRecu.value[i][1] + "] ";
          } else {
            texteAffiche += " ";
          }
        }

        document.getElementById("FileAttente").innerHTML = texteAffiche;
        break;

      case "groupesClientLength":
        if (debug) console.log("groupesClientLength:", msgRecu.longueurs);

        var groupesDisplay = " ";
        for (var i = 0; i < msgRecu.longueurs.length; i++) {
          groupesDisplay += "[";
          groupesDisplay = groupesDisplay + msgRecu.longueurs[i] + "]";
        }
        document.getElementById("tailleDesGroupes").innerHTML = groupesDisplay;
        break;

      case "lesFilesDattente":
        break;

      case "sessionLoaded":
        document.getElementById("MessageDuServeur").innerHTML = "Session loaded :" + msgRecu.fileName;
        break;

      case "message":
        if (debug) console.log(msgRecu.text);
        break;

      case "resetMatriceDesPossibles":
        cleanPad();
        break;

      case "setInMatrix":
        setPadButton(msgRecu.son, msgRecu.groupe, msgRecu.status);
        break;

      case "setControlerPadSize":
        if (debug1) console.log("setControlerPadSize:", msgRecu.nbeDeGroupesClients, msgRecu.nbeDeGroupesSons);
        nbeLignesPad = msgRecu.nbeDeGroupesClients;
        nbeColonesPad = msgRecu.nbeDeGroupesSons + 1; // Conversion d'un index en nombre de colone
        // Création du pad
        creationPad();
        //resetAllPad();
        break;

      case "setTickAutomate":
        document.getElementById("MessageDuServeur").innerHTML = "Tick:" + msgRecu.tick;
        break;

      case "skiniParametres":
        if (debug1) console.log("skiniParametres:", msgRecu.value);
        par = msgRecu.value;
        break;

      case "synchroSkini":
        if (debug) console.log("Reçu synchro Skini");
        if (toggle) {
          document.getElementById('synchro').style.display = "none";
          toggle = false;
        } else {
          document.getElementById('synchro').style.display = "inline";
          toggle = true;
        }
        break;

      default: if (debug1) console.log("Le Client reçoit un message inconnu", msgRecu);
    }
  };

  ws.onerror = function (event) {
    if (debug) console.log("clientcontroleur.js : received error on WS", ws.socket, " ", event);
  }

  // Mécanisme de reconnexion automatique si le serveur est tombé.
  // Le service Ping permet de vérifier le présence du serveur
  ws.onclose = function (event) {
    if (debug1) console.log("clientcontroleur.js : ON CLOSE");
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
