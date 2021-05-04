"use strict"

/*------------------------------------------------------------------------------
3052021-1

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
 par: pour une branche dont les sous branches se jouent en parallèle, !! l'ordre dans 'par' joue.
 every: pour une branche qui est joué à chaque occurence d'un signal
 abort: pour tuer une branche à l'occurence d'un signal
 loop: boucle
 run: en fait comme seq

 En intégration de la réaction dans un programme JavaScript:
 -----------------------------
 addEventListener: sur emit 
 activateSignal: avant l'appel d'une réaction

 A faire:
 --------
 sustain
 suspend

 Ce qu'il n'y a pas:
 -------------------
 -> trap: La difficulté de trap est la mise en place de l'exit du trap. A réfléchir.
 Nous n'avons pas la finesse d'Estérel sur la gestion des signaux. trap et abort seraient
 sans doute équivalents ici.
  
 -> nowval, preval : les signaux sont des paramètres des instructions.
 Il n'existe pas de façon globale. La notion de signal globale existe (objet signal)
 pour créer un lien d'un signal vers une action pour les eventListeners.
 On a donc une même action pour plusieurs signaux de même nom qui sont associés
 à des instructions. On pourrait traiter des valeurs au niveau global,
 il faut être prudent sur l'impact et la confusion que ça peut créer avec
 les signaux associés aux instructions. nowval de quoi ? de l'objet signal global ou
 du signal présent dans l'instruction ?
 S'il s'agit uniquement de valeurs pour des tests les objets "signal" devrait être suffisants.

 -> Opérations logique sur les signaux, faisable si nowal, mais est-ce utile pour Skini ?

 de deteriminisme, de détection de cycle de causalité.

--------------------------------------------------------------------------------*/
// signals est utilisé pour les addEventListeners,
// les véritables signaux sont locaux aux instructions
var signals = []; 
var instrIndex = 0;

var debug = false;
var debug1 = true;
var program;

/*============================================================
*
* Les objets signaux pour les listeneres et les emits
* ainsi que leurs traitements
*
=============================================================*/

// La décalaration des signaux ne sert que 
// pour les actions de playEventListener
// utlisées par emit.
function createSignal( sig, val ){
	var oneSignal = {
		name: sig,
		activated: false,
		value: val,
		action: undefined,
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

function playEventListener(sig, val) {
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			if (signals[i].action !== undefined){
					signals[i].action(val);
					return true;
			}else{
				return true;
			}
		}
	}
	console.log("ERR: playEventListener: signal inconnu:", sig, val);
	return -1;
}
exports.playEventListener = playEventListener;

// Pour mis à jour de la valeur dans le tableau signals
// Pas utile pour le moment avec le playEventListener ci-dessus qui
// prend la valeur en paramètre. Mais pourra être utile pour des test sur des 
// valeur de signaux.
function setSignalValue(val){
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			signals[i].value = val;
			return true;
		}
	}
	console.log("ERR: setSignalValue: signal inconnu:", sig);
	return -1;
}
exports.setSignalValue = setSignalValue;

function getSignalValue(val){
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			return signals[i].value;
		}
	}
	console.log("ERR: getSignalValue: signal inconnu:", sig);
	return -1;
}
exports.getSignalValue = getSignalValue;

function isSignalActivated(sig){
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			return signals[i].activated;
		}
	}
	console.log("ERR: isSignalActivated: signal inconnu:", sig);
	return -1;
}

function setSignalActivated(sig, val){
	for(var i=0; i < signals.length; i++){
		if(signals[i].name === sig){
			signals[i].activated = val;
			return true;
		}
	}
	console.log("ERR: setSignalValue: signal inconnu:", sig);
	return -1;
}

/*============================================================
*
* Les objets signaux dans les commandes et leurs traitements
*
=============================================================*/

function isSignalActivatedInInstruction(instr, signal){
	if(instr.signal === signal){
		if(instr.signalActivated) return true;
	}
	return false;
}

// Quand on active un signal c'est pour tout le programme
// idée de broadcast
function activateSignal(sig){
	if(debug) console.log("activateSignal", sig);
	setSignalAll(program, sig, true);
	return true;
}
exports.activateSignal = activateSignal;

function setSignal(instr, sig, activated){
	if(instr === undefined) return;

	for(var i=0; i < instr.length; i++){
		if(instr[i].signal === sig){
			instr[i].signalActivated = activated;
		}
		if(debug) console.log("-- setSignal", instr[i].name,
			instr[i].signal, instr[i].signalActivated);

		setSignal(instr[i].nextInstr, sig, activated);
	}
}

function setSignalAll(prog, sig, activated){
	if(debug) console.log("- setSignalAll");
	setSignal(prog.instructions, sig, activated);
}
exports.setSignalAll = setSignalAll;

function resetSignal(instr){
	if(debug) console.log("-- resetSignal: ", instr);

	if(instr === undefined) return;

	for(var i=0; i < instr.length; i++){
		instr[i].signalActivated = false;

		if(debug) console.log("-- resetSignal", instr[i].name,
			instr[i].signal, instr[i].signalActivated);

		resetSignal(instr[i].nextInstr);
	}
}
exports.resetSignal = resetSignal;

function resetSignalAll(prog){
	if(debug) console.log("- resetSignalAll :", prog);
	resetSignal(prog);
}
exports.resetSignalAll = resetSignalAll;

/*============================================================
*
* Gestion des instructions du programme
* Un programme est un arbre d'objets instructions
*
=============================================================*/
 
function createInstruction(name, signal, signalValue, count, action, nextInstr){
	var instruction = {
		name: name,
		signal: signal,
		signalActivated: false,
		signalValue: signalValue,
		count: 0,
		countMax: count,
		action: action,
		burnt: false,
		broadcast: false,
		nextInstr: nextInstr,
		index: instrIndex,
		branchStarted: false
	};

	if(debug) console.log("createInstruction", instruction.name, instruction.signal,
		instruction.signalValue, instruction.index);

	instrIndex++;
	return instruction;
}
exports.createInstruction = createInstruction;

// Retourne true si l'instruction se joue à l'instant
// ou a déjà été jouée (elle est brulée).
// false si pas terminée donc bloquée (en attente de signaux)
function execInstruction(command, branch){
	if(debug) console.log("execInstruction: Instruction :", command.name,  command.signal);

	if(!command.burnt){ // Elle n'a pas encore été jouée
		switch(command.name){

			// Si dans un par, emit AVANT abort, prise en compte immédiate
			// Si dans un par, emit APRES abort, prise en compte à la prochaine réaction
			case "abort":
				if(debug) console.log("abort: signal", command.signal, 
					", abort burnt:", command.burnt,
					", abort index:", command.index);

				if(isSignalActivatedInInstruction(command, command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						command.burnt = true;
						if(debug) console.log("abort brulé car signal actif:", command);
						return true;
					}else{
					// On joue la branche comme une séquence
						for(var i=0; i < command.nextInstr.length ; i++){
							if(!runBranch(command.nextInstr[i], command.nextInstr)){
								command.burnt = false;
								return false;
							}
							// Si on est à la dernière branche, c'est fini.
							if(i === command.nextInstr.length - 1) {
								command.count = 0;
								command.burnt = true;
								return true;
							}
						}
					}
				}else{
					// On joue la branche comme une séquence
					for(var i=0; i < command.nextInstr.length ; i++){
						if(!runBranch(command.nextInstr[i], branch)){
							command.burnt = false;
							return false;
						}
						// Si on est à la dernière branche, c'est fini.
						if(i === command.nextInstr.length - 1) {
							command.count = 0;
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
				if(isSignalActivatedInInstruction(command, command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						// On brule le signal pour cet await
						command.signalActivated = false;
						// On le brule pour la branch de cet await
						// pour éviter la prise en compte du signal
						// absorbé par cette await
						if(debug) console.log("await dans la branche:", branch);
						setSignal(branch, command.signal,
							command.signalValue, false);
						// Brule la commande
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
				if(isSignalActivatedInInstruction(command, command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.action();
						command.count = 0;
						// On brule le signal pour cet await
						command.signalActivated = false;
						// On le brule pour la branch de cet await
						// pour éviter la prise en compte du signal
						// absorbé par cette await
						setSignal(branch, command.signal, 
							command.signalValue, false);
						// Brule la commande
						command.burnt = true;
						return true;
					}
				}else{
					command.burnt = false;
					return false;
				}

			case "emit":
				if(debug) console.log("-- emit --", command.signal, command.signalValue, command.index);
				// Une sorte de broadcast du signal
				// qui consiste à mettre à jour tous les signaux
				// command.signal qui se trouvent dans les instructions
				activateSignal(command.signal, command.signalValue);

				// Inspiré de HipHop. Assicié une action à une emission dans le programme.
				playEventListener(command.signal, command.signalValue);

				if(debug) console.log("-- emit activé : ", command.signal, command.burnt);
				command.burnt = true;

				// Broadcast ?
				//reRunProg(); // marche pas avec every qui remet les intr à unbrunt

				return true;

			// A revoir n'est pas conforme à la sémantique HH
			// Quand le signal est actif on déclenche le corps de l'every
			// en remettant les instructions en unburnt. On joue alors le corps du every.
			// A la prochaine réaction si le signal n'est pas actif on ne fait rien du tout.
			// Ce qui n'est pas correct. Il faudrait continuer à jouer le corps de l'every.

			case "every":
				// Le corps du every a déjà été commencé
				if(command.branchStarted){
					// Continue le corps de l'every
					for(var i=0; i < command.nextInstr.length ; i++){
						if(debug) console.log("every: branchStarted nextInstr[i].name", i, command.nextInstr[i].name, command.nextInstr.length);
						if(!runBranch(command.nextInstr[i], command.nextInstr)){
							return false;
						}
						// Si on est à la dernière branche, le corps du every est fini.
						// mais pas every.
						if(i === command.nextInstr.length -1){
							command.burnt = false; // every n'est jamais terminé
							// Mais on est au bout de la branche
							command.branchStarted = false;
							return false;
						}
					}
					// On n'est pas au bout de la branche et le corps a été commencé.
					command.burnt = false;
					return false;
				}

				if(isSignalActivatedInInstruction(command, command.signal)){
					command.count++;
					if(command.count >= command.countMax){
						command.count = 0;
						if(debug) console.log("every: command.branch", i, command.nextInstr[0]);

						// On a pris le signal en compte, il faudra
						// ne pas tout recommencer la prochaine fois s'il n'est plus là...
						command.signalActivated = false;

						// reset des instructions
						// pour repartir du début de la branche puisqu'on repoart du début de l'every.
						// On pourrait aussi ne pas recommencer du début
						// de la branche en commentant cette ligne.
						unburnBranch(command.nextInstr);

						// Le corps du every est donc commencée
						command.branchStarted = true;

						// Joue le corps de l'every
						for(var i=0; i < command.nextInstr.length ; i++){
							if(debug) console.log("every: seq command.branch", i, command.nextInstr[i].name);
							if(!runBranch(command.nextInstr[i], command.nextInstr)){
								return false;
							}
							// Si on est à la dernière branche, le corps du every est fini.
							// mais pas every.
							if(i === command.nextInstr.length - 1){
								command.burnt = false; // every n'est jamais terminé
								// Mais on est au bout de la branche
								command.branchStarted = false;
								return false;
							}
						}
					}else{ // On n'a pas atteint le décompte.
						command.burnt = false;
						return false;
					}
				}else{ // Signal non activé
					command.burnt = false;
					return false;
				}

			case "loop":
				if(debug) console.log("loop command.branch", command.nextInstr);

				for(var i=0; i < command.nextInstr.length ; i++){
					if(debug) console.log("seq command.branch", i,
						command.nextInstr[i]);
					if(!runBranch(command.nextInstr[i], command.nextInstr)){
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
					if(runBranch(command.nextInstr[i], command.nextInstr)){
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

			case "restart":
				if(debug1) console.log("restart:");
				command.burnt = true;
				reRunProg();
				return true;

			case "run":
			case "seq":
				if(debug) console.log("seq command.branch", command.nextInstr);

				for(var i=0; i < command.nextInstr.length ; i++){
					if(debug) console.log("seq command.branch", i, command.nextInstr[i]);
					if(!runBranch(command.nextInstr[i], command.nextInstr)){
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
			// devenu inutile sou cette forme
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
* Déclenchement d'une réaction. 
* S'arrête si un signal est attendu dans le déroulement.
* La notion de programme constitué de module est une façon
* d'éviter une instruction seq en début de programme
* Est-ce bien utile ?
*
=============================================================*/
function runProg(){
	if(debug) console.log("\nrunProg", prog.length);
	runBranch(program.instructions, undefined);
}
exports.runProg = runProg;

function reRunProg(){
	if(debug) console.log("\nreRunProg", program);
	if(program !== undefined){
		runBranch(program.instructions, undefined);
	}
}

// Création du point de départ du programme
function createModule(instr){
	var module = {
		name: "Program",
		signal: undefined,
		signalActivated: false,
		burnt: false,
		instructions: instr
	}
	program = module;
	return module;
}
exports.createModule = createModule;

/*============================================================
*
* Pour l'execution du programme
* 
=============================================================*/

// Exécute la liste d'instructions qui constitue une branche
// Reçoit comme paramètre un tableau d'objets instructions.
// S'arrête et retourne true si la branche a été executée
// false si on tombe sur une instruction en attente.
function runBranch(instructions, branch){
	if(debug) console.log("\nrunBranch: length: ", instructions.length);

	// --> Cas d'une instruction seule
	if(instructions.length === undefined){
		if(debug) console.log("runBranch: instruction seule:", instructions.name);
		// Si l'instruction est bloquée
		if(!execInstruction( instructions, branch )){
			return false;
		}
		// Si l'instruction est ou a été jouée
		return true;
	}

	// --> Cas d'un tableau d'instructions
	for(var i=0; i < instructions.length; i++){
		if(debug) console.log("-- runBranch: tableau d'instructions:", i,
			instructions[i].name, instructions[i].index);
		// On tombe sur une instruction bloquée
		if(!execInstruction( instructions[i], instructions )){
			return false;
		}
		// On joue la suivante
	}
	// On a joué la branche complétement
	return true;
}

// Restauration des instructions dans une branche
function unburnBranch(instructions){
	// On est sur une instruction "finale" et plus sur une branche
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
			unburnBranch(instructions[i].nextInstr);
		}else{
			unburnBranch(instructions[i].nextInstr);
		}
	}
	return true;
}

/*============================================================
*
* Pour une vision du programme à exécuter
* Balayage de l'arbre du programme
*
=============================================================*/

function printInstructions(instr, option){
	if(instr === undefined) return;

	for(var i=0; i < instr.length; i++){
		if(option === true){
			console.log(instr[i]);
			console.log("------------------------------");
		}else{
			console.log("-> ", instr[i].name, ": index:", instr[i].index,  ", signal :", instr[i].signal, ", signalActivated :", instr[i].signalActivated);
		}
		printInstructions(instr[i].nextInstr, option);
	}
}

function printProgram(prog, option){
	console.log("------ PROGRAM ---------------");
	printInstructions(prog.instructions, option);
	console.log("------------------------------");
}
exports.printProgram = printProgram;

/*============================================================
*
* Couche de simplification des créations
* d'instructions pour export et utilisation dans Blockly
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

function _run(module){
	//var instructions = _seq(module);
	return createInstruction("run", undefined, undefined, undefined, undefined, module);
}
exports._run = _run;

function _atom(action){
	return createInstruction("atom",undefined, undefined, undefined, action, undefined);
}
exports._atom = _atom;

function _printSignals(){
	return createInstruction("printSignals",undefined, undefined, undefined, () => {console.log(signals);}, undefined);
}
exports._printSignals = _printSignals;

function _restart(){
	return createInstruction("restart",undefined, undefined, undefined, undefined, undefined);
}
exports._restart = _restart;