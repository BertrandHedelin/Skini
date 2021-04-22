var tete, unModule, titi, tutu, yaya;



  var mr = require("./myReact.min.js");
    mr.createSignal("tete");
  mr.createSignal("titi");
  mr.createSignal("tutu");
  mr.createSignal("yaya");

    // Debut de module
    unModule = [

    mr._atom( ()=> {console.log('debut de un module');} ),
    mr._await("tete", 1),
    mr._await("tutu", 1),

    ];

  var instructions = [
    // Debut de run module
      mr._seq(unModule),

    // Debut de par
    mr._par(
      [
      // Debut de seq
      mr._seq(
        [
      mr._emit("tete",0),
      mr._emit("tutu",0),]
      ),

      // Debut de seq
      mr._seq(
        [  mr._await("tete", 1),

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

  var prog = mr.createModule(instructions);

  console.log(" 1 ----------------");
  mr.runProg(prog);

  console.log(" 2 ----------------");
  mr.runProg(prog);

  mr.printProgram(prog, false);
