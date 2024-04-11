"use strict"
/**************************************************
Controler Skini for HipHop files
© Copyright 2017-2024, Bertrand Petit-Hédelin
****************************************************/

var myBlocks;
var myServeur;
var debug = false;
var debug1 = true;
var ws;
var workspace;
var prog;
var websocketServeurPort = 8383;

var DAWTableEnCours = 0;
var automateEncours = false;
var descriptorLoaded = false;

var options = {
  comments: true,
  collapse: true,
  disable: true,
  maxBlocks: Infinity,
  media: '',
  oneBasedIndex: true,
  readOnly: false,
  //rtl: false,
  scrollbars: true,
  trashcan: true,
  //toolbox: null,
  //horizontalLayout: false,
  //toolboxPosition: 'start',
  zoom: {
    controls: true,
    wheel: false,
    startScale: 1.0,
    maxScale: 4,
    minScale: 0.25,
    scaleSpeed: 1.1
  }
};

function initWSSocket(serverIPAddress) {
  var toggle = true;
  console.log("initWSSocket", serverIPAddress);

  ws = new WebSocket("ws://" + serverIPAddress + ":" + websocketServeurPort);

  ws.onopen = function (event) {
    var id = Math.floor((Math.random() * 1000000) + 1); // Pour identifier le client
    var msg = {
      type: "startSpectateur",
      text: "controleurHH",
      id: id
    }
    ws.send(JSON.stringify(msg));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function (event) {
    var msgRecu = JSON.parse(event.data);

    //console.log( "Client: received [%s]", event.data );
    switch (msgRecu.type) {
      case "message":
        break;

      case "blocksLoaded":
        if (debug1) console.log("blocksLoaded:\n", msgRecu.data);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(msgRecu.data), workspace);
        break;

      case "consoleBlocklySkini":
        document.getElementById('consoleArea').value = msgRecu.text;
        break;

      case "alertBlocklySkini":
        alert(msgRecu.text)
        document.getElementById('consoleArea').value = msgRecu.text;
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

      default: if (debug) console.log("Le Client reçoit un message inconnu", msgRecu);
    }
  };

  ws.onerror = function (event) {
    console.log("controleurHH.js : received error on WS", ws.socket, " ", event);
  }

  ws.onclose = function (event) {
  }
}
window.initWSSocket = initWSSocket;

function init(host) {
  let currentButton;
  console.log("init");
  initWSSocket(host);

  function saveBlocksAndGenerateHH() {
    // Enregistre le fichier Blockly
    let fichierSelectionne = document.getElementById('saveFile').value;
    console.log("saveBlocks:", fichierSelectionne);
    let xmlDom = Blockly.Xml.workspaceToDom(workspace);
    let pretty = Blockly.Xml.domToPrettyText(xmlDom);
    console.log("saveBlocks XML :", pretty.length);

    console.log("-------- Début code JS ");
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log(code);
    console.log("--------code JS ");

    var msg = {
      type: "saveBlocklyGeneratedFile",
      fileName: fichierSelectionne,
      xmlBlockly: pretty,
      text: code
    }

    DAWTableEnCours = 1;
    ws.send(JSON.stringify(msg));
  }
  window.saveBlocksAndGenerateHH = saveBlocksAndGenerateHH;

  function loadBlocks() {
    console.log("loadBlocks", fichierSelectionne);

    // To allow a reload of the same file
    document.getElementById('loadFile').value = "";
  }
  window.loadBlocks = loadBlocks;

  function launchSimulator() {
    document.getElementById("launchSimulator").style.display = "none";
    document.getElementById("stopSimulator").style.display = "inline";
    var msg = {
      type: "startSimulator",
    }
    ws.send(JSON.stringify(msg));
  }
  window.launchSimulator = launchSimulator;

  function stopSimulator() {
    document.getElementById("launchSimulator").style.display = "inline";
    document.getElementById("stopSimulator").style.display = "none";
    var msg = {
      type: "stopSimulator",
    }
    ws.send(JSON.stringify(msg));
  }
  window.stopSimulator = stopSimulator;

  function cleanQueues() {
    var msg = {
      type: "cleanQueues",
    };
    ws.send(JSON.stringify(msg));
  }
  cleanQueues = cleanQueues;

  function loadDAW(val) {
    if (!automateEncours) {
      console.log("clientControleur:loadDAW:", val);
      var msg = {
        type: "compileHH", //"loadDAWTable",
        value: val - 1, // Pour envoyer un index
      }
      DAWTableEnCours = val;
      ws.send(JSON.stringify(msg));
    } else {
      alert("WARNING: Orchestration running, stop before selecting another one.")
    }
  }
  window.loadDAW = loadDAW;

  function startAutomate() {
    if (DAWTableEnCours !== 0 && !automateEncours && descriptorLoaded) {
      var msg = {
        type: "setDAWON",
        value: DAWTableEnCours
      }
      ws.send(JSON.stringify(msg));

      document.getElementById("buttonStartAutomate").style.display = "none";
      document.getElementById("buttonStopAutomate").style.display = "inline";

      msg.type = "startAutomate";
      ws.send(JSON.stringify(msg));
      automateEncours = true;
    } else {
      alert("WARNING: Orchestration not compiled or no descriptor ");
    }
  }
  window.startAutomate = startAutomate;

  function stopAutomate() {
    document.getElementById("buttonStartAutomate").style.display = "inline";
    document.getElementById("buttonStopAutomate").style.display = "none";
    var msg = {
      type: "stopAutomate"
    }
    ws.send(JSON.stringify(msg));
    automateEncours = false;
    cleanQueues();
  }
  window.stopAutomate = stopAutomate;

  function loadSession() {
    let fichierSelectionne = document.getElementById('loadSession').files[0].name;
    console.log("loadSession fichier:", fichierSelectionne);
    document.getElementById("loadSessionTxt").value = fichierSelectionne;

    if (fichierSelectionne === undefined || fichierSelectionne === '') return;

    var fileName;
    fileName = fichierSelectionne;
    if (debug1) console.log("loadSession:", fileName);
    var msg = {
      type: "loadSession",
      fileName: fileName
    }
    ws.send(JSON.stringify(msg));
    descriptorLoaded = true;

    // To allow a reload of the same file
    document.getElementById('loadSession').value = "";
  }
  window.loadSession = loadSession;

  function createSession() {
    console.log("createSession");
    var fileName = window.prompt('Give a descriptor name');
    if (fileName === undefined || fileName === '') return;
    document.getElementById("loadSessionTxt").value = fileName + ".csv";

    if (debug1) console.log("createDescriptors:", fileName);
    var msg = {
      type: "createSession",
      fileName: fileName
    }
    ws.send(JSON.stringify(msg));
    descriptorLoaded = true;

    // To allow a reload of the same file
    document.getElementById('loadSession').value = "";
  }
  window.createSession = createSession;

  function saveSessionAs() {
    var fileName = document.getElementById("loadSessionTxt").value;
    console.log("Save As:", fileName);
    if (fileName === undefined || fileName === '') {
      alert("The descriptor must be a csv file with a name");
      return;
    }
    var msg = {
      type: "saveSessionAs",
      fileName: fileName
    }
    ws.send(JSON.stringify(msg));
  }
  window.saveSessionAs = saveSessionAs;


}
window.init = init;
