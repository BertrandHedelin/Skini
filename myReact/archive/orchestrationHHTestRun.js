var moduleTest;



"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
var gcs;
var DAW;

var debug = false;
var debug1 = true;

//var serveur;

function setServ(ser, daw, groupeCS){
  console.log("setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
}
exports.setServ = setServ;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];
var signalsText = [];

for (var i=0; i < par.groupesDesSons.length; i++) {
  var signame = par.groupesDesSons[i][0] + "OUT";
  signalsText.push(signame);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"OUT",
    "name":signame,
    "init_func":function (){return [false, -1];}
  });
  signals.push(signal);
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  var signame = par.groupesDesSons[i][0] + "IN";
  signalsText.push(signame);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signame
  });
  signals.push(signal);
}

function setSignals(){
  if(debug) console.log("orchestrationHH: setSignals: ", signals);
  var machine = new hh.ReactiveMachine( orchestration );
  return machine;
}
exports.setSignals = setSignals;


  moduleTest = hh.MODULE({"id":"moduleTest","%location":{},"%tag":"module"},


    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('module de test');}
      }
    ),

  );


var orchestration = hh.MODULE(
    {"id":"Orchestration","%location":{},"%tag":"module"},
    signals,

    hh.SIGNAL({"%location":{},"direction":"IN","name":"start"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"halt"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"tick"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"DAWON"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"patternSignal"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"controlFromVideo"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"pulsation"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"midiSignal"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"emptyQueueSignal"}),




  hh.RUN({
    "%location":{},
    "%tag":"run",
    "module": hh.getModule(  "moduleTest", {}),
    "''":"",

  }),


);
exports.orchestration = orchestration;
