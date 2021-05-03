'use strict'
// Programme en myReact

var violon1, violon2, violon3, tick, stopTankViolon, groupePercuON, stopTankPiano, groupeTrompetteON, groupeTrompetteOFF, groupePercuOFF, tankViolon, tankPiano, piano1, piano2, piano3;

var mr = require("./myReact.js");
var gcs = require("../serveur/autocontroleur/groupeClientsSons.js");

var debug1 = true;
var debug = false;

// A mettre dans Blockly pour des retours de l'orchestration
// mais il est mieux de passer par gcs ou atom
var skini;
function setSkini(skiniMaster){
	skini = skiniMaster;
}
exports.setSkini = setSkini;

// A mettre dans Blockly pour les signaux qui ont des listeners
mr.createSignal("tick", 0);
mr.createSignal("DAWON", 0);

var timer = [
  mr._seq(
    [
      mr._atom( ()=> { gcs.alertInfoScoreON('Il reste 10s pour jouer'); } ),
      mr._atom( ()=> { ()=> {console.log('Début timer');} } ),
      mr._await("tick", 2),
      mr._atom( ()=> { gcs.alertInfoScoreON('8s pour jouer'); } ),
      mr._await("tick", 2),
      mr._atom( ()=> { gcs.alertInfoScoreON('6s pour jouer'); } ),
      mr._await("tick", 2),
      mr._atom( ()=> { gcs.alertInfoScoreON('4s pour jouer'); } ),
      mr._await("tick", 2),
      mr._atom( ()=> { gcs.alertInfoScoreON('2s pour jouer'); } ),
      mr._await("tick", 2),
      mr._atom( ()=> { gcs.alertInfoScoreOFF(); } ),
    ]
  ),
];

var instructions = [
  mr._abort("stop",1,
    [
      mr._await("start", 1),

      mr._atom( ()=> { gcs.setTimerDivision(2); } ),
      mr._atom( ()=> { gcs.setpatternListLength([5, 255]); } ),

      mr._atom( ()=> { gcs.alertInfoScoreON('Duel trouve la percu'); } ),
      mr._await("tick", 4),
      mr._atom( ()=> { gcs.alertInfoScoreOFF(); } ),


      mr._atom( ()=> { gcs.setComputeScorePolicy(2); } ),
      mr._atom( ()=> { gcs.setComputeScoreClass(5); } ),

      // Séquence djembé pour groupe 0
      mr._emit("djembeOUT", [true, 2]),
      mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"djembeOUT",true);}),

      mr._atom( ()=> { gcs.alertInfoScoreON(' Djembe pour groupe Skini 0 '); } ),

      mr._emit("groupe5OUT", [true, 0]),
      mr._atom( ()=> { gcs.informSelecteurOnMenuChange(255,"groupe5OUT",true);}),

      mr._await("groupe5IN", 1),
      mr._run(timer),

      mr._emit("groupe5OUT", [false, 0]),
      mr._atom( ()=> { gcs.informSelecteurOnMenuChange(255,"groupe5OUT",true);}),

      mr._atom( ()=> { gcs.cleanChoiceList(0); } ),

    ]
  ),
  mr._atom( ()=> {console.log('Orchestration Stop');} ),
  mr._atom( ()=> { gcs.resetMatrice(); } ),
  mr._atom( ()=> { gcs.cleanQueues(); } ),
  mr._atom( ()=> { gcs.alertInfoScoreON('Orchestration Stop'); } ),
];

// A mettre dans Blockly
var prog = mr.createModule(instructions);

// A mettre dans Blockly
function runProg(){
	  // mr.printProgram(prog, false);
	  mr.runProg(prog);
	  //skini.test1("**** depuis orchestration");
}
exports.runProg = runProg;

// A mettre dans Blockly
function createListener(signal, action){
  if(debug) console.log("orchestration: createListener: ", signal);
  mr.createSignal(signal, 0);
	mr.addEventListener(signal, action);
}
exports.createListener = createListener;

// A mettre dans Blockly
function activateSignal(signal, val){
  mr.activateSignal(signal, val);
}
exports.activateSignal = activateSignal;