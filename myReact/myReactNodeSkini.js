"use strict"

/*------------------------------------------------------------------------------

 myReact.js

 Début : 14/4/2021

 Il s'agit de simuler (mimer) quelques fonctions de bases de la programmation
 réactive utiles pour Skini.
 Il ne s'agit pas d'un compilateur Estérel ni HipHop (loin de là).
	
 On utilise la notion de signaux et la notion de réaction.

 Un programme ou une branche de programme sont des tableaux d'objets 'instructions'
 qui sont exécutées en séquence.
 Une 'instruction' peuvent inclure
 d'autres branches d'instructions comme par, seq ou abort.

 L'exécution du programme consiste à dérouler les branches.
 Le principe de base est qu'une instruction qui a été exécutée
 ne l'est plus par la suite si on ne la réactive pas.

 Les commandes réactives sont:
 -----------------------------
 await_do: d'un signal et de son décompte
 await: d'un signal et de son décompte
 atom: execution d'une fonction
 emit: pour l'émission d'un signal dans le programme
 seq: pour une branche à jouer en séquence
 par: pour une branche dont les sous branches se jouent en parallèle
 every: pour une branche qui est joué à chaque occurence d'un signal
 abort: pour tuer une branche à l'occurence d'un signal
 loop: boucle
 printSignals: pour debug dans le code myReact

 En préparation de la réaction:
 -----------------------------
 addEventListener: sur emit 
 activateSignal: avant l'appel d'une réaction

 A faire:
 --------
 sustain
 run

 Ce qu'il n'y a pas:
 -------------------
 Opérations logique sur les signaux, faisable mais est-ce utile pour Skini
 trap, abort serait équivalent
 suspend
 preval
 nowval
 de deteriminisme, de détection de cycle de causalité.

--------------------------------------------------------------------------------*/

var signals = [];
var debug = false;
var debug1 = true;
var program;

/*============================================================
*
* Les objets signaux et leurs traitements
*
=============================================================*/

function createSignal( sig ){
	var oneSignal = {
		name: sig,
		activated: false, // devient True si a été joué
		action: undefined,
		value: undefined
	}
	signals.push(oneSignal);
}
exports.createSignal =createSignal;

function addEventListener(sig , action) {
	for(var i=0; i < signals.length; i++){
		if (signals[i].name === sig ){
			signals[i].action = action;
			return true;
		}
	}
	console.log("ERR: addEventListener: signal inconnu:", sig);
	return -1;
}
exports.addEventListener = addEventListener;

function playEventListener(sig) {
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			if (signals[i].action !== undefined){
					signals[i].action();
					return true;
			}else{
				return true;
			}
		}
	}
	console.log("ERR: playEventListener: signal inconnu:", sig);
	return -1;
}
exports.playEventListener = playEventListener;

// Test si le signal est actif
// return true si il l'est et le rend inactif
// false si inactif
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
	console.log("ERR: isSignalActivated: signal inconnu:", sig);
	return -1;
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
	console.log("ERR: activateSignal: signal inconnu:", sig);
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
	console.log("ERR: deactivateSignal: signal inconnu:", sig);
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

/*============================================================
*
* Déclenchement d'une réaction. 
* S'arrête si un signal est attendu dans le déroulement.
* La notion de programme constitué de module est une façon
* d'éviter une instruction seq en début de programme
* Est-ce bien utile ?
*
=============================================================*/

function runProg(prog){
	if(debug) console.log("\nrunProg", prog.length);
	runBranch(prog.instructions);
	program = prog;
	deactivateSignals();
}
exports.runProg = runProg;

function reRunProg(program){
	if(debug) console.log("\nreRunProg", program);
	if(program !== undefined){
		runBranch(program.instructions);
	}
}

function createProg(prog){
	program = prog;
}
exports.createProg = createProg;

/*============================================================
*
* Gestion des instructions du programme
* Un programme est un arbre d'objets instructions
*
=============================================================*/
 
var instrIndex = 0;

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
		nextInstr: nextInstr,
		index: instrIndex
	};

	instrIndex++;
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

			case "abort":
				if(isSignalActivated(command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						command.burnt = true;
						return true;
					}
				}else{
					// On joue la branche comme une séquence
					for(var i=0; i < command.nextInstr.length ; i++){
						if(!runBranch(command.nextInstr[i])){
							command.burnt = false;
							return false;
						}
						// Si on est à la dernière branche, c'est fini.
						if(i === command.nextInstr.length - 1) {
							command.burnt = true;
							return true;
						}
					}
				}
				break;

			case "atom":
				if(debug) console.log("atom");
				command.action();
				command.burnt = true;
				return true;

			case "await":
				// Si le signal est actif
				if(isSignalActivated(command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						command.burnt = true;
						return true;
					}
				}else{
					command.burnt = false;
					return false;
				}
				break;

			case "await_do":
				if(debug) console.log("await_do: ", command.signal, signals);

				// Si le signal est actif
				if(isSignalActivated(command.signal)){
					command.action();
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						command.burnt = true;
						return true;
					}
				}else{
					command.burnt = false;
					return false;
				}
				break;

			case "emit":
				if(debug) console.log("emit: ", command.signal, command.value);
				activateSignal(command.signal, command.signalValue);
				playEventListener(command.signal);
				command.burnt = true;
				return true;

			case "every":
				if(isSignalActivated(command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						if(debug) console.log("every: command.branch", i, command.nextInstr[0]);

						// reset des instructions selon la sémantique Estérel
						// pour repartir du début de la branche.
						// On pourrait aussi ne pas recommencer du début
						// de la branche en commentant cette ligne.
						unburnBranch(command.nextInstr);

						for(var i=0; i < command.nextInstr.length ; i++){
							if(debug) console.log("every: seq command.branch", i, command.nextInstr[i].name);
							if(!runBranch(command.nextInstr[i])){
								return false;
							}
							// Si on est à la dernière branche, la branche du every est fini.
							// mais pas every.
							if(i === command.nextInstr.length - 1){
								command.burnt = false; // every n'est jamais terminé
								return false;
							}
						}
					}else{
						command.burnt = false;
						return false;
					}
				}else{
					command.burnt = false;
					return false;
				}

			case "loop":
				if(debug) console.log("loop command.branch", command.nextInstr);

				for(var i=0; i < command.nextInstr.length ; i++){
					if(debug) console.log("seq command.branch", i, command.nextInstr[i]);
					if(!runBranch(command.nextInstr[i])){
						return false;
					}
					// Si on est à la dernière branche on reset
					// les instructions de la branche et on recommence
					if(i === command.nextInstr.length - 1){
						// reset des instructions
						unburnBranch(command.nextInstr);
						command.burnt = false;
						return false;
					}
				}
				break;

			case "par":
				var countBranch = 0;
				// Les branches sont les éléments d'un tableau
				for(var i=0; i < command.nextInstr.length ; i++){
					if(runBranch(command.nextInstr[i])){
						if(debug) console.log("Par:", i);
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

			case "seq":
				if(debug) console.log("seq command.branch", command.nextInstr);
				for(var i=0; i < command.nextInstr.length ; i++){
					if(debug) console.log("seq command.branch", i, command.nextInstr[i]);
					if(!runBranch(command.nextInstr[i])){
						return false;
					}
					// Si on est à la dernière branche, c'est fini.
					if(i === command.nextInstr.length -1){
						command.burnt = true;
						return true;
					}
				}
				break;

			case "printSignals":
				if(debug) console.log("printSignals");
				command.action();
				command.burnt = true;
				return true;

			default: console.log("Instruction inconnue");
		}
	}else{ // La commande a déjà été jouée
		if(debug) console.log("execInstruction: Instruction :", command.name, "déjà jouée");
		return true;
	}
}

/*============================================================
*
* Pour l'execution du programme
* 
=============================================================*/

// Exécute la liste d'instructions qui constitue une branche
// Reçoit comme paramètre un tableau d'objets instructions.
// Retourne true si la branche a été executée
// false si en cours
function runBranch(instructions){
	if(debug) console.log("\nrunBranch: length: ", instructions.length);

	// On est sur une instruction "finale" et plus sur une branche
	// Il y a peut-être mieux à faire que tester la longueur
	if(instructions.length === undefined){
		if(!execInstruction( instructions )){
			return false;
		}
		return true;
	}

	// On est sur une suite d'instructions
	for(var i=0; i < instructions.length; i++){
		if(debug) console.log("\n--- runBranch1", i, instructions[i].name, instructions[i].index);
		if(!execInstruction( instructions[i] )){
			return false;
		}
	}
	return true;
}

// Restauration des instructions dans une branche
function unburnBranch(instructions){
	// On est sur une instruction "finale" et plus sur une branche
	// Il y a peut-être mieux à faire que tester le longueur
	if(instructions === undefined){
		return true;
	}

	if(instructions.length === undefined){
		if(debug) console.log("unburnBranch 1:", instructions);
		instructions.burnt = false;
		return true;
	}

	// On est sur une suite d'instructions
	for(var i=0; i < instructions.length; i++){
		if(debug) console.log("\n--- unburnBranch", i, instructions[i].name);
		if(instructions[i].burnt !== undefined){
			if(debug) console.log("unburnBranch 2:", instructions[i].name);
			instructions[i].burnt = false;
		}else{
			unburnBranch(instructions[i]);
		}
	}
	return true;
}

/*============================================================
*
* Pour une vision du programme à exécuter
*
=============================================================*/

function printInstructions(instr, option){
	if(instr === undefined) return;


	for(var i=0; i < instr.length; i++){
		if(option === true){
			console.log(instr[i]);
			console.log("------------------------------");
		}else{
			console.log("-> ", instr[i].name, ": index:", instr[i].index);
			 //"nextInstr:", instr[i].nextInstr, "signal:", instr[i].signal, );
		}

		//console.log("-> ", instr[i].name, ": index:", instr[i].index, "signal:", instr[i].signal);
		//console.log("** instr[",i,"].nextInstr: ", instr[i].nextInstr);

		printInstructions(instr[i].nextInstr, option);
	}
}

function printProgram(prog, option){
	console.log("------ PROGRAM ---------------");
	//console.log(prog);
	printInstructions(prog.instructions, option);
	console.log("------------------------------");
}
exports.printProgram = printProgram;

/*============================================================
*
* Couche de simplification des créations
* d'instructions pour export
*
=============================================================*/

function _emit(signal, value){
	return createInstruction("emit", signal, value, undefined, undefined, undefined);
}
exports._emit = _emit;

function _await(signal, count){
	return createInstruction("await",signal, undefined, count, undefined, undefined);
}
exports._await = _await;

function _await_do(signal, count, action){
	return createInstruction("await_do",signal, undefined, count, action, undefined);
}
exports._await_do = _await_do;

function _abort(signal, count, instructions){
	return createInstruction("abort",signal, undefined, count, undefined, instructions);
}
exports._abort = _abort;

function _every(signal, count, instructions){
	return createInstruction("every",signal, undefined, count, undefined, instructions);
}
exports._every = _every;

function _seq(instructions){
	return createInstruction("seq", undefined, undefined, undefined, undefined, instructions);
}
exports._seq = _seq;

function _par(instructions){
	return createInstruction("par", undefined, undefined, undefined, undefined, instructions);
}
exports._par = _par;

function _loop(instructions){
	return createInstruction("loop", undefined, undefined, undefined, undefined, instructions);
}
exports._loop = _loop;

function _atom(action){
	return createInstruction("atom",undefined, undefined, undefined, action, undefined);
}
exports._atom = _atom;

function _printSignals(){
	return createInstruction("printSignals",undefined, undefined, undefined, () => {console.log(signals);}, undefined);
}
exports._printSignals = _printSignals;