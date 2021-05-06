// Programme en myReact

var violon1, violon2, violon3, tick, stopTankViolon, groupePercuON, stopTankPiano, groupeTrompetteON, groupeTrompetteOFF, groupePercuOFF, tankViolon, tankPiano, piano1, piano2, piano3;

var mr = require("./myReact.js");
var debug1 = true;
var debug = false;

// A mettre dans Blockly
var skini;
function setSkini(skiniMaster){
	skini = skiniMaster;
	//console.log("******* orchestration: setSkini:", skini);
}
exports.setSkini = setSkini;

/*	mr.createSignal("violon1", 0);
	mr.createSignal("violon2", 0);
	mr.createSignal("violon3", 0);*/
	mr.createSignal("stopTankViolon", 0);
	mr.createSignal("stopTankPiano", 0);
  //mr.createSignal("start", 0);

  // A mettre dans Blockly
  mr.createSignal("tick", 0);
  mr.createSignal("DAWON", 0);

    // Debut de module
tankViolon = [
  // Debut de abort
  mr._abort("stopTankViolon",1,
    [
      mr._atom( ()=> {console.log('Attend Percu1');} ),
      mr._await("Percu1", 1),

      mr._atom( ()=> {console.log('Attend Percu2');} ),
      mr._await("Percu2", 1),

      mr._atom( ()=> {console.log('Attend Percu3');} ),
      mr._await("Percu3", 1),
    ]
  ),
  mr._atom( ()=> {console.log('Tank Violon tué !');} ),
];

    // Debut de module
tankPiano = [
  // Debut de abort
  mr._abort("stopTankPiano",1,
    [
      mr._atom( ()=> {console.log('Attend Percu4');} ),
      mr._await("Percu4", 1),

      mr._atom( ()=> {console.log('Attend Percu5');} ),
      mr._await("Percu5", 1),

      mr._atom( ()=> {console.log('Attend Percu6');} ),
      mr._await("Percu6", 1),
    ]
  ),
  mr._atom( ()=> {console.log('Tank Piano tué !');} ),
];

  var instructions = [
    // Debut de par
    mr._await("start", 1),
    mr._par(
      [
      // Debut de seq
        mr._seq(
          [
            mr._atom( ()=> {console.log('Début orchestration 1');} ),
            mr._emit("groupe1OUT", [true, 255]),
            mr._await("tick", 5),
            mr._atom( ()=> {console.log('Après 5 ticks');} ),

        // Debut de par
            mr._par(
              [
                // Debut de par
                mr._par(
                  [
                    // Debut de run module
                      mr._run(tankViolon),

                      // Debut de seq
                      mr._seq(
                        [  
                          mr._await("tick", 5),
                          mr._atom( ()=> {console.log('Après 5 ticks violon');} ),
                          mr._emit("stopTankViolon",0),
                        ]
                      ),
                    ]
                  ),

                // Debut de par
                mr._par(
                  [
                    // Debut de run module
                    mr._run(tankPiano),
                    // Debut de seq
                    mr._seq(
                      [ 
                        mr._await("tick", 5),
                        mr._atom( ()=> {console.log('Après 5 ticks piano');} ),
                        mr._emit("stopTankPiano",0),
                      ]
                    ),
                  ]
                ),
              ]
            ),

            mr._emit("groupe1OUT",[false, 255]),
            mr._emit("groupe2OUT",[true, 255]),
            mr._await("tick", 5),
            mr._emit("groupe2OUT",[false, 255]),
            mr._atom( ()=> {console.log('Fin orchestration');} ),
          ]
        ),

        // Debut de every
        mr._every("start",1,
          [
            mr._atom( ()=> {console.log('orchestration: start');} ),
          ]
        ),
        mr._every("tick",1,
          [
            mr._atom( ()=> {console.log('orchestration: tick');} ),
          ]
        ),
      ]
    ),
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