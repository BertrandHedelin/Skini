for(var i=0; i < 5; i++){
  console.log(i, " ----------------");
  mr.activateSignal("titi", 1);
  mr.runProg(prog);
}

  mr.activateSignal("yaya", 1);
  mr.runProg(prog);

for(var i=0; i < 5; i++){
  console.log(i, " ----------------");
  mr.activateSignal("titi", 1);
  mr.runProg(prog);
}


  console.log(" 1 ----------------");
  mr.activateSignal("violon1", 1);
  mr.runProg(prog);

  console.log(" 2 ----------------");
  mr.activateSignal("violon1", 1);
  mr.activateSignal("violon2", 1);
  mr.runProg(prog);

  console.log(" 3 ----------------");
  mr.activateSignal("violon2", 1);
  mr.activateSignal("stopReservoir", 1);
  mr.runProg(prog);

  mr.printProgram(prog, false);
