var violon1, stopReservoir, violon2, violon3;



  var mr = require("./myReactNodeSkini.js");
    mr.createSignal("violon1");
  mr.createSignal("violon2");
  mr.createSignal("violon3");
  mr.createSignal("stopReservoir");

  var instructions = [
    // Debut de abort
    mr._abort("stopReservoir",1,
      [
      // Debut de par
      mr._par(
        [
        // Debut de seq
        mr._seq(
          [  mr._await("violon1", 1),

        mr._atom( ()=> {console.log('violon 1 joué');} ),
      ]
        ),

        // Debut de seq
        mr._seq(
          [  mr._await("violon2", 1),

        mr._atom( ()=> {console.log('violon 2 joué');} ),
      ]
        ),

        // Debut de seq
        mr._seq(
          [  mr._await("violon3", 1),

        mr._atom( ()=> {console.log('violon 3 joué');} ),
      ]
        ),
        ]
      ),
      ]
    ),
    ];

  var prog = mr.createModule(prog, instructions);

  mr.createProg(prog);

  console.log(" 1 ----------------");
  mr.runProg(prog);

  console.log(" 2 ----------------");
  mr.runProg(prog);

  mr.printProgram(prog, false);
