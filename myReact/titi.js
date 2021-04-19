  var mr = require("./myReactNodeSkini.js");
    mr.createSignal("toto");

  var instructions = [
    // Debut de par
    mr._par([
      // Debut de body
      [
      mr._emit("toto",0),
      mr._emit("titi",0),
      ],

      // Debut de body
      [
      mr._await_do("toto",1,() => {console.log("await do ->toto"); return true;}),
      mr._emit("tutu",0),
      mr._emit("tata",0),
      ],
      ]),

    // Debut de seq
    mr._seq([
    mr._emit("tata",0),
    mr._await_do("toto",1,() => {console.log("await do ->toto"); return true;}),
    mr._emit("tutu",0),]),
    ];

  var prog = mr.createModule(prog, instructions);
