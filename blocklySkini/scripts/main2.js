"use strict"
/**************************************************

Editeur Skini sur Node avec Blockly

© Copyright 2017-2022, Bertrand Petit-Hédelin

****************************************************/

var myBlocks;
var myServeur;
var debug = false;
var debug1 = true;
var ws;
var workspace;
var prog;

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
  console.log("initWSSocket", serverIPAddress);

  ws = new WebSocket("ws://" + serverIPAddress + ":8383"); // NODE JS

  ws.onopen = function (event) {
    var id = Math.floor((Math.random() * 1000000) + 1); // Pour identifier le client
    var msg = {
      type: "startSpectateur",
      text: "controleur",
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

      default: if (debug) console.log("Le Client reçoit un message inconnu", msgRecu);
    }
  };

  ws.onerror = function (event) {
    console.log("main2.js : received error on WS", ws.socket, " ", event);
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

  /*  function saveBlocks(){
      let fichierSelectionne = document.getElementById('saveFile').value;
      console.log("saveBlocks:", fichierSelectionne);
      let xmlDom = Blockly.Xml.workspaceToDom(workspace);
      let pretty = Blockly.Xml.domToPrettyText(xmlDom);
      console.log("saveBlocks XML :", pretty.length);
      //saveBlocksServer(fichierSelectionne, pretty).post();
    }
    window.saveBlocks=saveBlocks;*/

  function loadBlocks() {
    let fichierSelectionne = document.getElementById('loadFile').files[0].name;
    console.log("loadBlocks fichier:", fichierSelectionne);
    document.getElementById("saveFile").value = fichierSelectionne.slice(0, -4);
    // domToPrettyText(dom) 
    // textToDom(text) 
    var msg = {
      type: "loadBlocks",
      fileName: fichierSelectionne
    }
    ws.send(JSON.stringify(msg));
    console.log("loadBlocks", fichierSelectionne);

    // To allow a reload of the same file
    document.getElementById('loadFile').value = "";
  }
  window.loadBlocks = loadBlocks;

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

  //*********** Blocks ********************************************
  var toolbox = {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "categorystyle": "loop_category",
        "name": "Orchestration",
        "contents": [
          {
            "kind": "block",
            "type": "hh_ORCHESTRATION"
          },
          {
            "kind": "block",
            "type": "hh_module"
          },
          {
            "kind": "block",
            "type": "hh_run"
          },
          {
            "kind": "block",
            "type": "hh_declare_signal"
          },
          {
            "kind": "block",
            "type": "set_timer_division"
          },
          {
            "kind": "block",
            "type": "reset_orchestration"
          },
          {
            "kind": "block",
            "type": "random_body"
          }
          /* {
             "kind": "block",
             "type": "random_block"
           }*/
        ]
      },
      {
        "kind": "category",
        "categorystyle": "loop_category",
        "name": "Tanks and Groups",
        "contents": [
          {
            "kind": "block",
            "type": "tank"
          },
          {
            "kind": "block",
            "type": "lists_create_with"
          },
          {
            "kind": "block",
            "type": "text"
          },
          {
            "kind": "block",
            "type": "run_tank"
          },
          {
            "kind": "block",
            "type": "stopTanks"
          },
          {
            "kind": "block",
            "type": "open_tank"
          },
          {
            "kind": "block",
            "type": "run_tank_during_patterns_in_groups"
          },
          {
            "kind": "block",
            "type": "run_tank_waiting_for_patterns"
          },
          {
            "kind": "block",
            "type": "random_tank"
          },
          {
            "kind": "block",
            "type": "set_group"
          },
          {
            "kind": "block",
            "type": "unset_group"
          },
          {
            "kind": "block",
            "type": "set_group_during_ticks"
          },
          {
            "kind": "block",
            "type": "set_groups_during_patterns"
          },
          {
            "kind": "block",
            "type": "set_groups_waiting_for_patterns"
          },
          {
            "kind": "block",
            "type": "random_group"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Instruments",
        "categorystyle": "list_category",
        "contents": [
          {
            "kind": "block",
            "type": "cleanqueues"
          },
          {
            "kind": "block",
            "type": "cleanOneQueue"
          },
          {
            "kind": "block",
            "type": "pauseQueues"
          },
          {
            "kind": "block",
            "type": "pauseOneQueue"
          },
          {
            "kind": "block",
            "type": "resumeQueues"
          },
          {
            "kind": "block",
            "type": "resumeOneQueue"
          },
          {
            "kind": "block",
            "type": "waitForEmptyQueue"
          },
          {
            "kind": "block",
            "type": "putPatternInQueue"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Variables",
        "categorystyle": "list_category",
        "custom": "VARIABLE",
        "contents": [
          {
            "kind": "block",
            "type": "variables_get"
          },
          {
            "kind": "block",
            "type": "variables_set"
          },
          {
            "kind": "block",
            "type": "variables_get_dynamic"
          },
          {
            "kind": "block",
            "type": "variables_set_dynamic"
          }
        ]
      },
      {
        "kind": "category",
        "categorystyle": "loop_category",
        "name": "Patterns",
        "contents": [
          {
            "kind": "block",
            "type": "wait_for_signal_in_group"
          },
          {
            "kind": "block",
            "type": "await_pattern"
          },
          {
            "kind": "block",
            "type": "text"
          }
        ]
      },
      {
        "kind": "category",
        "categorystyle": "loop_category",
        "name": "Score",
        "contents": [
          {
            "kind": "block",
            "type": "addSceneScore"
          },
          {
            "kind": "block",
            "type": "removeSceneScore"
          },
          {
            "kind": "block",
            "type": "refreshSceneScore"
          },
          {
            "kind": "block",
            "type": "alertInfoScoreON"
          },
          {
            "kind": "block",
            "type": "alertInfoScoreOFF"
          }
        ]
      },
      {
        "kind": "category",
        "categorystyle": "loop_category",
        "name": "Game",
        "contents": [
          {
            "kind": "block",
            "type": "patternListLength"
          },
          {
            "kind": "block",
            "type": "cleanChoiceList"
          },
          {
            "kind": "block",
            "type": "bestScore"
          },
          {
            "kind": "block",
            "type": "displayScore"
          },
          {
            "kind": "block",
            "type": "displayScoreGroup"
          },
          {
            "kind": "block",
            "type": "totalGameScore"
          },
          {
            "kind": "block",
            "type": "set_score_policy"
          },
          {
            "kind": "block",
            "type": "set_score_class"
          }
        ]
      },
      {
        "kind": "category",
        "name": "DAW",
        "categorystyle": "loop_category",
        "contents": [
          {
            "kind": "block",
            "type": "tempo_parameters"
          },
          {
            "kind": "block",
            "type": "set_tempo"
          },
          {
            "kind": "block",
            "type": "move_tempo"
          },
          {
            "kind": "block",
            "type": "abort_move_tempo"
          },
          {
            "kind": "block",
            "type": "send_midi_cc"
          },
          {
            "kind": "block",
            "type": "send_midi_command"
          },
          {
            "kind": "block",
            "type": "send_osc_midi"
          },
          {
            "kind": "block",
            "type": "send_OSC_command"
          },
          {
            "kind": "block",
            "type": "transpose_parameters"
          },
          {
            "kind": "block",
            "type": "transpose"
          },
          {
            "kind": "block",
            "type": "reset_transpose"
          }
        ]
      },
      {
        "kind": "category",
        "name": "HipHop",
        "categorystyle": "list_category",
        "contents": [
          {
            "kind": "block",
            "type": "hh_ORCHESTRATION"
          },
          {
            "kind": "block",
            "type": "hh_module"
          },
          {
            "kind": "block",
            "type": "hh_run"
          },
          {
            "kind": "block",
            "type": "hh_declare_signal"
          },
          {
            "kind": "block",
            "type": "hh_emit_value"
          },
          {
            "kind": "block",
            "type": "hh_wait_for"
          },
          {
            "kind": "block",
            "type": "hh_print_serveur"
          },
          {
            "kind": "block",
            "type": "hh_pause"
          },
          {
            "kind": "block",
            "type": "hh_sequence"
          },
          {
            "kind": "block",
            "type": "hh_fork"
          },
          {
            "kind": "block",
            "type": "hh_loop"
          },
          {
            "kind": "block",
            "type": "hh_loopeach"
          },
          {
            "kind": "block",
            "type": "hh_every"
          },
          {
            "kind": "block",
            "type": "hh_abort"
          },
          {
            "kind": "block",
            "type": "hh_trap"
          },
          {
            "kind": "block",
            "type": "hh_break"
          }
        ]
      }
    ]
  }

  var blocklyArea = document.getElementById('blocklyArea');
  var blocklyDiv = document.getElementById('blocklyDiv');
  options.toolbox = toolbox;
  workspace = Blockly.inject('blocklyDiv', options);
  var onresize = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
  };
  window.addEventListener('resize', onresize, false);
  onresize();
  Blockly.svgResize(workspace);
}
window.init = init;
