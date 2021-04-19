(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**************************************************

Editeur Skini sur Node avec Blockly

© Copyright 2017-2021, Bertrand Petit-Hédelin

****************************************************/

var mr = require("./myReact.js");

var myBlocks;
var myServeur;
var debug = true;
var ws;
var workspace;

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
          {
            "kind": "block",
            "type": "fork_body"
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
            "type": "random_body"
          },
          {
            "kind": "block",
            "type": "random_block"
          }
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
            "type": "refer_signals"
          },
          {
            "kind": "block",
            "type": "emit"
          },
          {
            "kind": "block",
            "type": "emit_value"
          },
          {
            "kind": "block",
            "type": "wait_for"
          },
          {
            "kind": "block",
            "type": "sustain"
          },
          {
            "kind": "block",
            "type": "now"
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
            "type": "immediate"
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
          }
        ]
      },
      {
        "kind": "category",
        "name": "Module",
        "categorystyle" : "list_category",
        "contents": [
          {
            "kind": "block",
            "type": "submoduleHH"
          },
          {
            "kind": "block",
            "type": "run_module"
          },{
            "kind": "block",
            "type": "fork_body"
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
          {
            "kind": "block",
            "type": "yield"
          },
          {
            "kind": "block",
            "type": "every"
          },
          {
            "kind": "block",
            "type": "abort"
          },
          {
            "kind": "block",
            "type": "suspend"
          },
          {
            "kind": "block",
            "type": "trap"
          },
          {
            "kind": "block",
            "type": "break"
          },
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "exec_serveur"
          },
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

/*      {
        "kind": "category",
        "categorystyle" : "list_category",
        "name": "Javascript",
        "contents": [
          {
            "kind": "block",
            "type": "JS_statement"
          },
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "procedures_ifreturn"
          },
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "controls_ifelse"
          },
          {
            "kind": "block",
            "type": "logic_boolean"
          },
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "logic_operation"
          },
          {
            "kind": "block",
            "type": "logic_negate"
          }
        ]
      },
      {
        "kind": "category",
        "categorystyle" : "list_category",
        "name": "Functions",
        "contents": [
          {
            "kind": "block",
            "type": "procedures_defnoreturn"
          },
          {
            "kind": "block",
            "type": "procedures_defreturn"
          }
        ]
      },
      {
        "kind": "category",
        "categorystyle" : "loop_category",
        "name": "Modules HH",
        "contents": [
          {
            "kind": "block",
            "type": "moduleHH"
          }
        ]
      },*/
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

},{"./myReact.js":2}],2:[function(require,module,exports){
"use strict"

/*------------------------------------------------------------------------------

Début : 14/4/2021

 Il s'agit de simuler quelques fonctions de bases de la programmation
 réactive utiles pour Skini.
	
 On utilise la notion de signaux et la notion de réaction.

 Un programme est un tableau d'objets 'branche' qui sont exécutées en séquence
 Une branche et un objet contenant un tabeau d'objets 'instruction' qui peuvent inclure
 d'autres branches comme par, seq ou abort.

 L'exécution du programme consiste à dérouler les branches et pour
 chacune des branches à dérouler les instructions de cette branche.
 Une instruction qui a déjà été exécutée ne l'est plus quand elle est terminée.

 Les commandes réactives sont:
 await_do d'un signal et de son décompte
 emit pour l'émission d'un signal dans le programme
 activateSignal avant l'appel d'une réaction
 seq pour une branche à jouer en séquence
 par pour une branche dont les sous branches se jouent en parallèle
 every_do pour une branche qui est joué à chaque occurence d'un signal
 abort pour tuer une branche à l'occurence d'un signal

 A faire:
 loop
 atom
 sustain
 vérifier l'existence des signaux
 run

 Ce qu'il n'y a pas:
 Opérations logique sur les signaux
 trap
 suspend
 preval
 nowval
 de deteriminisme

--------------------------------------------------------------------------------*/

var signals = [];
var debug = false;
var debug1 = true;

// Les objets signaux ---------------------------------------
function createSignal( sig ){
	var oneSignal = {
		name: sig,
		activated: false, // devient True si a été joué
		value: undefined
	}
	signals.push(oneSignal);
}
exports.createSignal =createSignal;

function isSignalActivated(sig){
	for(var i=0; i < signals.length; i++){
		if (signals[i].name === sig ){
			if (signals[i].activated){
				if(debug) console.log("isSignalBurnt : ", sig, "a été activated");
				return true;
			}else{
				if(debug) console.log("isSignalBurnt : ", sig, "n'a pas été activated");
				return false;
			}
		}
	}
	console.log("signal inconnu:", sig);
	return -1; // Signal inconnu
}

function activateSignal(sig, val){
	if(debug) console.log("activateSignal", sig, val);
	for(var i=0; i < signals.length; i++){
		if (signals[i].name === sig ){
			signals[i].activated = true;
			signals[i].value = val;
			return true;
		}
	}
	return -1;
}
exports.activateSignal = activateSignal;

function deactivateSignal(sig){
	for(var i=0; i < signals.length; i++){
		if (signals[i].name === sig ){
			signals[i].activated = false;
			signals[i].value = undefined;
			return true;
		}
	}
	return -1;
}

function deactivateSignals(){
	for(var i=0; i < signals.length; i++){
			signals[i].activated = false;
	}
}

function createModule(prog, instr){
	var module = {
		burnt: false,
		instructions: instr
	}
	return module;
}
exports.createModule = createModule;

// Déclenchement d'une réaction. 
// S'arrête si un signal est attendu dans le déroulement.
// La notion de programme constitué de module est un façon
// d'éviter une instruction seq en début de programme
// Est-ce bien utile ?
function runProg(prog){
	if(debug) console.log("\nrunProg", prog.length);
	runBranch(prog.instructions);
	deactivateSignals();
}
exports.runProg = runProg;

// Une autre Mise en oeuvre ------------------------------------------------------------------------------
// Un programme est un arbre d'objets instructions
function createInstruction(name, signal, signalValue, count, action, nextInstr){
	var instruction = {
		name: name,
		signal: signal,
		signalValue: signalValue,
		count: 0,
		countMax: count,
		action: action,
		burnt: false,
		broadcast: false,
		nextInstr: nextInstr
	};
	return instruction;
}
exports.createInstruction = createInstruction;

// Retourne true si l'instruction se joue à l'instant
// ou a déjà été jouée (elle est brulée).
// false si pas terminée
function execInstruction(command){
	if(debug) console.log("execInstruction: Instruction :", command.name, command.signal);

	if(!command.burnt){ // Elle n'a pas encore été jouée
		switch(command.name){
			case "await_do":
				// Si le signal est actif
				if(isSignalActivated(command.signal)){
					command.action();
					command.count++;
					if(command.count >= command.countMax){
						command.burnt = true;
						return true;
					}
				}else{
					command.burnt = false;
					return false;
				}
				break;

			case "abort": // faire le décompte comme pour await_do
				if(isSignalActivated(command.signal)){
					command.burnt = true;
					return true;
				}else{
					// On joue la branche comme une séquence
					if(debug) console.log("abort command.branch", i, command.nextInstr[i]);
					for(var i=0; i < command.nextInstr.length ; i++){
						if(!runBranch(command.nextInstr[i])){
							return false;
						}
						// Si on est à la dernière branche, c'est fini.
						if(i === command.nextInstr.length - 1) command.burnt = true;
					}
				}
				break;

			case "every_do": // C'est un await qui ne s'arrête jamais, faire le décompte comme pour await_do et jouer les branches
				if(isSignalActivated(command.signal)){
					command.action();
					command.burnt = false;
					return false;
				}
				break;

			case "emit":
				activateSignal(command.signal, command.signalValue);
				command.burnt = true;
				return true;

			case "seq":
				if(debug) console.log("seq command.branch", command.nextInstr);
				for(var i=0; i < command.nextInstr.length ; i++){
					if(debug) console.log("seq command.branch", i, command.nextInstr[i]);
					if(!runBranch(command.nextInstr[i])){
						return false;
					}
					// Si on est à la dernière branche, c'est fini.
					if(i === command.nextInstr.length - 1) command.burnt = true;
				}
				break;

			case "par":
				var countBranch = 0;
				for(var i=0; i < command.nextInstr.length ; i++){
					if(runBranch(command.nextInstr[i])){
						countBranch++;
					}
				}
				// Si le décompte des branches terminées
				// correspond à l'ensembles des instructions
				// c'est qu'on a terminé le parallèle
				if(countBranch === command.nextInstr.length){
					command.burnt = true;
					return true;
				}else{
					return false;
				}
				break;

			default: console.log("Instruction inconnue");
		}
	}else{ // La commande a déjà été jouée
		if(debug) console.log("execInstruction: Instruction :", command.name, "déjà jouée");
		return true;
	}
}

// Pour l'execution du programme ----------

// Exécute la liste d'instructions qui constitue une branche
// Reçoit comme paramètre un tableau d'objets instructions.
// Retourne true si la branche a été executée
// false si en cours
function runBranch(instructions){
	if(debug) console.log("\nrunBranch", instructions);
	for(var i=0; i < instructions.length; i++){
		if(debug) console.log("\nrunBranch", i, instructions[i]);
		if(!execInstruction( instructions[i] )){
			return false;
		}
	}
	return true;
}

function _emit(signal, value, branch){
	branch.push(createInstruction("emit", signal, value, undefined, undefined));
}
exports._emit = _emit;

function _await_do(signal, count, action, branch){
	branch.push(createInstruction("await_do",signal, undefined, count, action, undefined));
}
exports._await_do = _await_do;

function _seq(instructions, branch){
	branch.push(mr.createInstruction("seq", undefined, undefined, undefined, undefined, instructions));
}
exports._seq = _seq;

function _par(instructions, branch){
	branch.push(mr.createInstruction("par", undefined, undefined, undefined, undefined, instructions));
}
exports._par = _par;

},{}]},{},[1]);
