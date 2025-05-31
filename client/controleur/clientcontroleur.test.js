// Refactor du fichier original
"use strict";

const ipConfig = require('../../serveur/ipConfig');

let ws;
const id = Math.floor((Math.random() * 1000000) + 1);

let par;
let nbeLignesPad, nbeColonesPad;
let etatScrutateurs = [];

const debug = false;
const debug1 = true;
const automateEncours = true;

const msg = { type: "configuration" };

const COLORS = {
  BLEU: "padBoutonBleu",
  DEFAULT: "padBouton",
};

function resetSequenceur() {
  ws.send(JSON.stringify({ type: "resetSequenceur" }));
}
window.resetSequenceur = resetSequenceur;

function creationPad() {
  const place = document.getElementById("listBoutonsLiens");
  place.innerHTML = '';

  // Première ligne
  const emHeader = document.createElement("a");
  emHeader.className = "texteSon";
  emHeader.innerHTML = "-";
  place.appendChild(emHeader);

  for (let j = 0; j < nbeColonesPad; j++) {
    const button = document.createElement("button");
    button.dataset.colone = j;
    button.className = "numColone";
    button.innerHTML = j;
    button.addEventListener("click", () => clickColoneBouton(j));
    place.appendChild(button);
  }
  place.appendChild(document.createElement("br"));

  // Le PAD
  let compteurBouton = 0;
  for (let i = 0; i < nbeLignesPad; i++) {
    const rowLabel = document.createElement("a");
    rowLabel.className = "texteSon";
    rowLabel.innerHTML = i;
    place.appendChild(rowLabel);

    for (let j = 0; j < nbeColonesPad; j++) {
      const button = document.createElement("button");
      button.id = `padBouton${compteurBouton++}`;
      button.dataset.ligne = i;
      button.dataset.colone = j;
      button.className = COLORS.DEFAULT;
      button.addEventListener("click", () => clickPadBouton(button.id));
      place.appendChild(button);
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
    const button = document.createElement("button");
    button.className = "etatScrut";
    button.id = `etatScrut${j}`;
    button.innerHTML = "-";
    place.appendChild(button);
  }
  place.appendChild(document.createElement("br"));
}

function setPadButton(son, groupe, status) {
  if (groupe === 255) {
    let id = parseInt(son);
    for (let j = 0; j < nbeLignesPad; j++) {
      const button = document.getElementById(`padBouton${id}`);
      if (!button) return console.error("ERR setAllPad: bouton undefined", id);
      button.className = status ? COLORS.BLEU : COLORS.DEFAULT;
      id += nbeColonesPad;
    }
    return;
  }

  if (groupe >= par.nbeDeGroupesClients || son >= nbeColonesPad) {
    return console.error("ERR: setPadButton out of bounds", { son, groupe });
  }

  const index = parseInt(son) + groupe * nbeColonesPad;
  const button = document.getElementById(`padBouton${index}`);
  if (button) {
    button.className = status ? COLORS.BLEU : COLORS.DEFAULT;
  }
}

function clickColoneBouton(colone) {
  let id = parseInt(colone);
  let status;

  for (let j = 0; j < nbeLignesPad; j++) {
    const button = document.getElementById(`padBouton${id}`);
    if (!button) return console.error("ERR clickColoneBouton: bouton undefined", id);

    const isActive = button.className === COLORS.BLEU;
    status = !isActive;
    button.className = status ? COLORS.BLEU : COLORS.DEFAULT;

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

function updateAllPad(status) {
  if (!automateEncours) return alert("WARNING: Nothing to update");

  let id = 0;
  for (let j = 0; j < nbeLignesPad; j++) {
    for (let i = 0; i < nbeColonesPad; i++) {
      const button = document.getElementById(`padBouton${id++}`);
      if (!button) return console.error("updateAllPad: undefined button", id);
      button.className = status ? COLORS.BLEU : COLORS.DEFAULT;
    }
  }

  ws.send(JSON.stringify({
    type: status ? "setAllMatriceDesPossibles" : "ResetMatriceDesPossibles",
  }));
}

window.resetAllPad = () => updateAllPad(false);
window.setAllPad = () => updateAllPad(true);

function cleanQueues() {
  ws.send(JSON.stringify({ type: "cleanQueues" }));
}
window.cleanQueues = cleanQueues;

function getNbeDeSpectateurs() {
  ws.send(JSON.stringify({ type: "getGroupesClientLength" }));
}

function initialisation() {
  document.getElementById("MessageDuServeur").style.display = "inline";
  document.getElementById("listBoutonsLiens").style.display = "block";
  initServerListener();
  setInterval(getNbeDeSpectateurs, 1000);
}
exports.initialisation = initialisation;

function initControleur(serverHostname) {
  initWSSocket(serverHostname);
  initialisation();
}
window.initControleur = initControleur;

window.onbeforeunload = () => {
  msg.type = "closeSpectateur";
  msg.text = "DISCONNECT_SPECTATEUR";
  ws.send(JSON.stringify(msg));
  ws.close();
};

window.checkSession = () => {
  msg.type = "checkSession";
  ws.send(JSON.stringify(msg));
};

function initWSSocket(host) {
  ws = new WebSocket(`ws://${host}:${ipConfig.websocketServeurPort}`);

  if (debug1) console.log("WebSocket initialized at", host);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "startSpectateur", text: "controleur", id }));
  };

  ws.onmessage = ({ data }) => {
    const msgRecu = JSON.parse(data);
    if (debug) console.log("WS Message Received:", msgRecu);

    switch (msgRecu.type) {
      case "DAWTableNotReady":
        alert(msgRecu.text);
        document.getElementById("buttonStartAutomate").style.display = "inline";
        document.getElementById("buttonStopAutomate").style.display = "none";
        break;

      case "etatDeLaFileAttente":
        const texte = msgRecu.value?.map((v, i) => v.length ? `[${i}:${v[1]}]` : " ").join(" ") || " ";
        document.getElementById("FileAttente").innerHTML = texte;
        break;

      case "groupesClientLength":
        document.getElementById("tailleDesGroupes").innerHTML = msgRecu.longueurs.map(n => `[${n}]`).join("");
        break;

      case "sessionLoaded":
        document.getElementById("MessageDuServeur").innerHTML = `Session loaded: ${msgRecu.fileName}`;
        break;

      case "message":
        if (debug) console.log(msgRecu.text);
        break;

      case "resetMatriceDesPossibles":
        updateAllPad(false);
        break;

      case "setInMatrix":
        setPadButton(msgRecu.son, msgRecu.groupe, msgRecu.status);
        break;

      case "setControlerPadSize":
        nbeLignesPad = msgRecu.nbeDeGroupesClients;
        nbeColonesPad = msgRecu.nbeDeGroupesSons + 1;
        creationPad();
        break;

      case "setTickAutomate":
        document.getElementById("MessageDuServeur").innerHTML = `Tick: ${msgRecu.tick}`;
        break;

      case "skiniParametres":
        par = msgRecu.value;
        break;

      case "synchroSkini":
        const synchro = document.getElementById('synchro');
        synchro.style.display = (synchro.style.display === "none") ? "inline" : "none";
        break;

      default:
        if (debug1) console.log("Unrecognized message", msgRecu);
    }
  };

  ws.onerror = (event) => {
    if (debug) console.log("WebSocket error:", event);
  };

  ws.onclose = () => {
    if (debug1) console.log("WebSocket closed");
  };
}

function initServerListener() {
  // Placeholder for potential future server event listeners
}
