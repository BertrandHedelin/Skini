  var mr = require("./myReactNodeSkini.js");
    mr.createSignal("tata");
  mr.createSignal("tutu");
  mr.createSignal("titi");
  mr.createSignal("yaya");

  var instructions = [
    // Debut de seq
    mr._seq([
      // Debut de abort
      mr._abort("yaya",1,
          [  mr._loop( [
        mr._atom( ()=> {console.log('titi');} ),
      ]),
    ]
        ),
      ]),
    ];

  var prog = mr.createModule(prog, instructions);

  mr.createProg(prog);

  console.log(" 1 ----------------");
  mr.runProg(prog);

  console.log(" 2 ----------------");
  mr.runProg(prog);

  mr.printProgram(prog, false);
