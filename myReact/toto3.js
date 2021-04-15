'use strict'
"use hopscript"
'use hiphop'

var par = require('../logosParametres');
var ableton = require('../controleAbleton');
var oscMidiLocal = require("../logosOSCandMidiLocal.js");
var gcs = require("./groupeClientsSons.js");
var orch = require("./orchestration.js", "hiphop");
const opus4Int = require("./automateInt.js");
var hh = require("hiphop");

var CCChannel = 1;
var CCTempo = 100;
var tempoMax = 160;// Valeur fixée dans DAW
var tempoMin = 40; // Valeur fixée dans DAW
var trajet = 1-1;
var tempoGlobal = 60;
var aleaRandomBlock281289 = 0;
var transposeValue = 0;

function setTempo(value){
  if ( value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  var tempo = Math.round(127/(tempoMax - tempoMin) * (value - tempoMin));
  //console.log("--- Set tempo:", value);
  tempoGlobal = value;
  oscMidiLocal.controlChange(par.busMidiAbleton, CCChannel, CCTempo, tempo);
}

var countInverseBougeTempo = 10;
var bougeTempoRythme = 2;
var bougeTempoValue = 2;

var bougeTempo = hiphop module (tick, abortBougeTempo)
implements ${opus4Int.creationInterfaces(par.groupesDesSons[trajet])}{
 signal inverseTempo;
  abort (abortBougeTempo.now){
    loop{
      fork {
        every count (countInverseBougeTempo, tick.now) {
          emit inverseTempo();
        }
      }par{
        loop{
          abort(inverseTempo.now){
              every count (bougeTempoRythme, tick.now) {
                hop{
                  tempoGlobal += bougeTempoValue;
                  setTempo(tempoGlobal);
                }
              }
            }
          abort(inverseTempo.now){
            every count (bougeTempoRythme, tick.now) {
              hop{
                tempoGlobal -= bougeTempoValue;
                setTempo(tempoGlobal);
              }
            }
          }
        }
      }
    }
  }
}



var trajetModule1= hiphop module (in start, stop, tick, abletonON,
  setTimerDivision, resetMatriceDesPossibles, in patternSignal, in midiSignal, in emptyQueueSignal,
  out cleanChoiceList, out patternListLength, out setComputeScoreClass, out setComputeScorePolicy)
  implements ${opus4Int.creationInterfaces(par.groupesDesSons[0])}{
  signal temps=0, size, stopReservoir, abortBougeTempo;
  emit setTimerDivision(1);
  loop{
    abort(stop.now){
      await immediate (start.now);
      hop{console.log("-- Démarrage automate des possibles");}
      fork{
        every immediate (tick.now){
          emit temps(temps.preval + 1);
          hop{gcs.setTickOnControler(temps.nowval);}
        }
      }par{
        fork{
  }par{
  }

      }
    }
    emit resetMatriceDesPossibles();
    hop{ ableton.cleanQueues();}
    emit temps(0);
    yield;
  }
}
exports.trajetModule1= trajetModule1;