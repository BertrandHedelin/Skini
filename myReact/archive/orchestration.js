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

// A mettre dans Blockly pour les signaux locaux
mr.createSignal("tick", 0);
mr.createSignal("startTimer", 0);
mr.createSignal("stopTimer", 0);

// On utilise un loop pour que timer reste actif
// le run au sens HH n'existe pas, quand on appelle
// un module c'est toujours le même et pas un nouvel objet
// Le module ici n'est qu'une facilité de présentation du code.
var timer = [
  mr._loop([
      mr._seq([
          mr._await("startTimer", 1),
          mr._atom( ()=> { gcs.alertInfoScoreON('Il reste 10s pour jouer'); } ),
          mr._atom( ()=> {console.log('Début timer');} ),
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
          mr._emit("stopTimer", 0),
        ]),
    ]),
];

var timeCounter = 0;

var instructions = [
  mr._abort("stop",1,
    [
      mr._par(
        [
          mr._every("tick", 1,
            [
              mr._atom( ()=> { 
                  timeCounter++;
                  gcs.setTickOnControler(timeCounter); 
                } 
              ),
            ]
          ),
          mr._run(timer),
          mr._seq(
            [
              mr._await("start", 1),

              mr._atom( ()=> { gcs.setTimerDivision(2); } ),
              mr._atom( ()=> { gcs.setpatternListLength([5, 255]); } ),

              mr._atom( ()=> { gcs.alertInfoScoreON('Duel trouve la percu'); } ),
              mr._await("tick", 4),

              mr._atom( ()=> { gcs.alertInfoScoreOFF(); } ),
              mr._atom( ()=> { gcs.setComputeScorePolicy(2); } ),

              // djembé ---------------------------------------
              mr._atom( ()=> { gcs.setComputeScoreClass(5); } ),

              mr._emit("djembeOUT", [true, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"djembeOUT",true);}),

              // Séquence djembé pour groupe 0
              mr._atom( ()=> { gcs.alertInfoScoreON(' Djembe pour groupe Skini 0 '); } ),

              mr._emit("groupe5OUT", [true, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe5OUT",true);}),

              mr._await("groupe5IN", 1),
              mr._atom( ()=> { console.log("groupe5IN djembé"); } ),

/*              mr._emit("startTimer", 0),
              mr._abort("stopTimer", 1 ,
                [
                  mr._loop(
                    [
                      mr._await("groupe5IN", 1),
                      mr._atom( ()=> { console.log("groupe5IN"); } ),
                    ]
                  ),
                ]
              ),*/
                
              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe5OUT", [false, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe5OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(0); } ),

              // Séquence djembé pour groupe 1
              mr._atom( ()=> { gcs.alertInfoScoreON(' Djembe pour groupe Skini 1 '); } ),

              mr._emit("groupe6OUT", [true, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe6OUT",true);}),

              mr._await("groupe6IN", 1),
              mr._atom( ()=> { console.log("groupe6IN djembé"); } ),

/*              mr._emit("startTimer", 0),
              mr._abort("stopTimer", 1 ,
                [
                  mr._loop(
                    [
                      mr._await("groupe5IN", 1),
                      mr._atom( ()=> { console.log("groupe5IN"); } ),
                    ]
                  ),
                ]
              ),
*/
              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe6OUT", [false, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe6OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(1); } ),

              // Fin djembé
              mr._emit("djembeOUT", [false, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"djembeOUT",false);}),
              mr._atom( ()=> { gcs.cleanQueues(); } ),

              // derwish -------------------------------------------
              mr._atom( ()=> { gcs.setComputeScoreClass(1); } ),

              mr._emit("derwishOUT", [true, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"derwishOUT",true);}),

              // Séquence derwish pour groupe 0
              mr._atom( ()=> { gcs.alertInfoScoreON(' derwish pour groupe Skini 0 '); } ),

              mr._emit("groupe1OUT", [true, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe1OUT",true);}),

              mr._await("groupe1IN", 1),
              mr._atom( ()=> { console.log("groupe1IN derwish"); } ),

              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe1OUT", [false, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe1OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(0); } ),

              // Séquence derwish pour groupe 1
              mr._atom( ()=> { gcs.alertInfoScoreON(' derwish pour groupe Skini 1 '); } ),

              mr._emit("groupe2OUT", [true, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe1OUT",true);}),

              mr._await("groupe2IN", 1),
              mr._atom( ()=> { console.log("groupe1IN derwish 2"); } ),

              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe2OUT", [false, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe1OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(1); } ),

              // Fin derwish
              mr._emit("derwishOUT", [false, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"derwishOUT",false);}),
              mr._atom( ()=> { gcs.cleanQueues(); } ),

              // Latino -------------------------------------------
              mr._atom( ()=> { gcs.setComputeScoreClass(7); } ),

              mr._emit("pianoOUT", [true, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"pianoOUT",true);}),

              // Séquence derwish pour groupe 0
              mr._atom( ()=> { gcs.alertInfoScoreON(' Latino pour groupe Skini 0 '); } ),

              mr._emit("groupe7OUT", [true, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe7OUT",true);}),

              mr._await("groupe7IN", 1),
              mr._atom( ()=> { console.log("groupe7IN latino"); } ),

              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe7OUT", [false, 0]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(0,"groupe7OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(0); } ),

              // Séquence Latino pour groupe 1
              mr._atom( ()=> { gcs.alertInfoScoreON(' Latino pour groupe Skini 1 '); } ),

              mr._emit("groupe3OUT", [true, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe7OUT",true);}),

              mr._await("groupe3IN", 1),
              mr._atom( ()=> { console.log("groupe7IN latino 2"); } ),

              mr._emit("startTimer", 0),
              mr._await("stopTimer", 1),

              mr._emit("groupe3OUT", [false, 1]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(1,"groupe7OUT",false);}),

              mr._atom( ()=> { gcs.cleanChoiceList(1); } ),

              // Fin Latino
              mr._emit("pianoOUT", [false, 2]),
              mr._atom( ()=> { gcs.informSelecteurOnMenuChange(2,"pianoOUT",false);}),
              mr._atom( ()=> { gcs.cleanQueues(); } ),

              // Pour finir ----------------------------------------------------------
              mr._await("tick", 20),
              mr._atom( ()=> { gcs.alertInfoScoreON('Jeu terminé'); } ),
            ]
          ),
        ],
      ),
    ]
  ),
  mr._atom( ()=> {console.log('Orchestration Stop');} ),
  mr._atom( ()=> { gcs.resetMatrice(); } ),
  mr._atom( ()=> { gcs.cleanQueues(); } ),

];

//mr.addEventListener("startTimer", function(val) {console.log("*** emit startTimer")});

// A mettre dans Blockly
var prog = mr.createModule(instructions);

//mr.printProgram(prog, false);

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