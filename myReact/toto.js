  var mr = require("./myReactNodeSkini.js");
    mr.createSignal("tata");
  mr.createSignal("tutu");
  mr.createSignal("titi");
  mr.createSignal("yaya");

  var instructions = [
    // Debut de par
    mr._par(
      [
      // Debut de seq
      mr._seq(
        [
      mr._emit("tata",0),
      mr._emit("tutu",0),]
      ),

      // Debut de seq
      mr._seq(
        [  mr._await("tata", 1),

      mr._atom( ()=> {console.log('tata');} ),
      mr._await("tutu", 1),

      mr._atom( ()=> {console.log('tutu');} ),
    ]
      ),

      // Debut de seq
      mr._seq(
        [
        // Debut de abort
        mr._abort("yaya",1,
          [
          // Debut de every
          mr._every("titi",1,
            [
          mr._atom( ()=> {console.log('titi');} ),
        ]
          ),
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
