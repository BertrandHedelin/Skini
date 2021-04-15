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
