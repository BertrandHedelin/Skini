/**************************************************

Editeur Skini sur Node avec Blockly

© Copyright 2017-2021, Bertrand Petit-Hédelin

****************************************************/

var myBlocks;
var myServeur;
var debug = true;
var ws;
var workspace;
var prog;

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

//var par = require('../../serveur/logosParametres');

function initWSSocket(serverIPAddress) {
  console.log("initWSSocket", serverIPAddress);

  ws = new WebSocket("ws://" + serverIPAddress + ":8383"); // NODE JS

  ws.onopen = function( event ) {
    var id = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client
    var msg = {
      type: "startSpectateur",
      text: "blockly",
      id: id
    }
    ws.send(JSON.stringify(msg));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function( event ) {
    var msgRecu = JSON.parse(event.data);
    //console.log( "Client: received [%s]", event.data );
    switch(msgRecu.type) {
      case "message":  
            break;

      case "blocksLoaded":
        if(debug1) console.log("blocksLoaded:\n", msgRecu.data);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(msgRecu.data), workspace);
        break;

      case "consoleBlocklySkini":
        document.getElementById('consoleArea').value = msgRecu.text;
        break;

      default: console.log("Le Client reçoit un message inconnu", msgRecu );
    }
  };

  ws.onerror = function (event) {
    console.log( "main2.js : received error on WS", ws.socket, " ", event );
  }

  ws.onclose = function( event ) {
   }
}
window.initWSSocket = initWSSocket;

function init() {
  let currentButton;
  console.log("init");
  initWSSocket("localhost"); // En dur en attendant de faire un bundle

  function saveBlocksAndGenerateHH(){
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
    ws.send(JSON.stringify(msg));
  }
  window.saveBlocksAndGenerateHH=saveBlocksAndGenerateHH;

/*  function saveBlocks(){
    let fichierSelectionne = document.getElementById('saveFile').value;
    console.log("saveBlocks:", fichierSelectionne);
    let xmlDom = Blockly.Xml.workspaceToDom(workspace);
    let pretty = Blockly.Xml.domToPrettyText(xmlDom);
    console.log("saveBlocks XML :", pretty.length);
    //saveBlocksServer(fichierSelectionne, pretty).post();
  }
  window.saveBlocks=saveBlocks;*/

  function loadBlocks(){
    let fichierSelectionne = document.getElementById('loadFile').files[0].name;
    console.log("loadBlocks fichier:", fichierSelectionne);
    document.getElementById("saveFile").value = fichierSelectionne.slice(0,-4);
    // domToPrettyText(dom) 
    // textToDom(text) 
    var msg = {
      type: "loadBlocks",
      fileName: fichierSelectionne
    }
    ws.send(JSON.stringify(msg));
  }
  window.loadBlocks=loadBlocks;

//*********** Blocks ********************************************
  var toolbox = {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "categorystyle" : "loop_category",
        "name": "Orchestration",
        "contents": [
          {
            "kind": "block",
            "type": "orchestration"
          },
/*
          {
            "kind": "block",
            "type": "fork_body"
          },*/
/*          {
            "kind": "block",
            "type": "branch_body"
          },
*/
          {
            "kind": "block",
            "type": "par_body"
          },
          {
            "kind": "block",
            "type": "seq_body"
          },
/*          {
            "kind": "block",
            "type": "random_body"
          },
          {
            "kind": "block",
            "type": "random_block"
          }*/
        ]
      },
      {
        "kind": "category",
        "categorystyle" : "loop_category",
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
        "categorystyle" : "loop_category",
        "name": "Parameters",
        "contents": [
          {
            "kind": "block",
            "type": "set_timer_division"
          },
          {
            "kind": "block",
            "type": "reset_orchestration"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Instruments",
        "categorystyle" : "list_category",
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
        "categorystyle" : "list_category",
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
        "categorystyle" : "loop_category",
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
        "categorystyle" : "loop_category",
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
        "categorystyle" : "loop_category",
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
        "categorystyle" : "loop_category",
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
        "categorystyle" : "list_category",
        "name": "Signals",
        "contents": [
         {
            "kind": "block",
            "type": "declare_signal"
          },
          {
            "kind": "block",
            "type": "emit_value"
          },          
          {
            "kind": "block",
            "type": "await_do"
          },
          {
            "kind": "block",
            "type": "wait_for"
          },
          /*{
            "kind": "block",
            "type": "sustain"
          },
          {
            "kind": "block",
            "type": "nowval"
          },
          {
            "kind": "block",
            "type": "await"
          },
          {
            "kind": "block",
            "type": "count_signal"
          },
          {
            "kind": "block",
            "type": "logic_operationHH"
          },
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "logic_boolean"
          }*/
        ]
      },
      {
        "kind": "category",
        "name": "Module",
        "categorystyle" : "list_category",
        "contents": [
          {
            "kind": "block",
            "type": "module_myReact"
          },
          {
            "kind": "block",
            "type": "run_module"
          },
          {
            "kind": "block",
            "type": "par_body"
          },
          {
            "kind": "block",
            "type": "seq_body"
          },
          {
            "kind": "block",
            "type": "loop_body"
          },
/*          {
            "kind": "block",
            "type": "yield"
          },*/
          {
            "kind": "block",
            "type": "every"
          },
          {
            "kind": "block",
            "type": "abort"
          },
/*          {
            "kind": "block",
            "type": "suspend"
          },
          {
            "kind": "block",
            "type": "controls_if"
          },
*/
          {
            "kind": "block",
            "type": "print_serveur"
          },
          {
            "kind": "block",
            "type": "text"
          }
        ]
      },
      {
        "kind": "category",
        "name": "HipHop",
        "categorystyle" : "list_category",
        "contents": [
          {
            "kind": "block",
            "type": "hh_orchestration"
          },
          {
            "kind": "block",
            "type": "hh_ORCHESTRATION"
          },
          {
            "kind": "block",
            "type": "hh_declare_signal"
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
          }
        ]
      }
    ]
  }

  var blocklyArea = document.getElementById('blocklyArea');
  var blocklyDiv = document.getElementById('blocklyDiv');
  options.toolbox = toolbox;
  workspace = Blockly.inject('blocklyDiv', options);
  var onresize = function(e) {
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
