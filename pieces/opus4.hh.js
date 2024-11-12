/**
 * @fileOverview Opus4. Reprise de la version créée avec Hop en 2019.
 * Fonctionne avec Ableton, opus4V3.als.
 * Il s'agit d'un forme de pièce orchestrale. Ici on se donne la possibilité
 * de contrôler le déroulement avec des capteurs Interface Z.
 * Cette pièce possédait une version en interaction avec une démo UnrealEngine.
 * Il s'agit d'un exemple de contrôle d'Ableton avec une utilisation
 * systématique des réservoirs.
 * 
 * @copyright (C) 2019-2024 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.3
 */
// @ts-nocheck
"use strict"
"use hopscript"

import { ReactiveMachine } from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";

let midimix;
let oscMidiLocal;
let gcs;
let DAW;
let serveur;
let signals;
let debug = false;
let debug1 = true;

var currentTimePrev = 0;
var currentTime = 0;
var dureeSession = 0;
var dureeSessionPrev = 0;

// Pour des transposition par CC
const CCChannel = 1;
const CCTransposeStrings = 61;
const CCTransposeAltos = 62;
const CCTransposeCellos = 63;
const CCTransposeCtreBasses = 64;
const CCTransposeTrompettes = 65;
const CCTransposeCors = 66;
const CCTransposeTrombones = 67;
const CCTransposeFlutes = 68;
const CCTransposeHaubois = 69;
const CCTransposeClarinettes = 70;
const CCTransposeBassons = 71;
const CCTransposeSaxo = 72;

const CCTempo = 100;
const tempoMax = 160;// Valeur fixée dans DAW
const tempoMin = 40; // Valeur fixée dans DAW

const CCdegre2Mineursaxo = 73;
const CCtonalite = 74;

// Pour des transpositions par patterns
var compteurTransInit = 407;
var compteurTrans = compteurTransInit;
var compteurTransMax = 414;

var transposition = 0;
var tonalite = 0;

var tempoGlobal = 60;
var changeTempo = 0;

var premierAlea = 0;
var deuxiemeAlea = 0;
var troisiemeAlea = 0;

/*************************************************************************
 * Les fonctions JavaScript
 * 
 */
function setTempo(value, par) {
  if (value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  // Dans DAW, pour cette pièce, le controle MIDI du tempo se fait entre 60 et 160
  var tempo = Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
  if (debug) console.log("Set tempo:", value);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

// de -12 à +12 demi-tons avec transpose Chromatic DAW
function transpose(CCinstrument, value, par) {
  var CCTransposeValue;

  CCTransposeValue = Math.round(1763 / 1000 * value + 635 / 10);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCinstrument, CCTransposeValue);
  //if (debug1) console.log("-- Transposition instrument:", CCinstrument, "->", value, "demi-tons" );
}

function transposeAll(value, par) {
  for (var i = 61; i <= 74; i++) {
    transpose(i, value, par);
  }
}

function degre2mineursaxo(value, par) {
  if (value) {
    oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCdegre2Mineursaxo, 100);
  } else {
    oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCdegre2Mineursaxo, 0);
  }
  if (debug) console.log("-- CCdegre2Mineur:", value);
}

function setTonalite(CCtonalite, value, par) {
  var CCTon;

  CCTon = Math.round(1763 / 1000 * value + 635 / 10);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCtonalite, CCTon);
  if (debug) console.log("-- setTonalite:", CCtonalite, "->", value, "demi-tons");
}

/****************************************************************************
 * Appelé par Skini pour mettre en place tous les accès aux fonctions de
 * contrôle.
 * 
 */
export function setServ(ser, daw, groupeCS, oscMidi, mix) {
  if (debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}

// Création réservoir ***********************************************************
function makeAwait(instruments, groupeClient) {
  return hiphop fork ${
    instruments.map(val => hiphop {
      await(this[`${val}IN`].now);
      emit ${`${val}OUT`}([false, groupeClient]);
     //host{ console.log("---------------------------- makeAwait", instruments, groupeClient)}
  })}
}

function makeReservoir(groupeClient, instrument) {
  return hiphop ${hiphop {
      laTrappe: {
        abort immediate(stopReservoir.now) { // To kill  the tank
            host {
              console.log("--- MAKE RESERVOIR:", instrument[0], ", groupeClient: ", groupeClient);
              var msg = {
                type: 'startTank',
                value: instrument[0]
              }
              serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
            }
            ${
                instrument.map(val => hiphop {
                emit ${`${val}OUT`} ([true, groupeClient])
                })
            }
            host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], true); }
            ${ makeAwait(instrument, groupeClient) }
            host { console.log("--- FIN NATURELLE RESERVOIR:", instrument[0]); }
            break  laTrappe;
        }

        host { console.log("--- FIN FORCEE DU RESERVOIR:", instrument[0]); }
        ${
          instrument.map(val => hiphop {
          emit ${`${val}OUT`} ([false, groupeClient])})
        }

        host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], false); }
        host {
          console.log("--- ABORT RESERVOIR:", instrument[0]);
          var msg = {
            type: 'killTank',
            value: instrument[0]
          }
          serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
        }
      }
    }
  }
}

/***************************************************************************
 * Les modules HH pour les réservoirs
 * 
 */
let piano = [
  "Piano1Intro1", "Piano1Intro2", "Piano1Intro3", "Piano1Intro4", "Piano1Intro5",
  "Piano1Intro6", "Piano1Intro7", "Piano1Milieu1", "Piano1Milieu2", "Piano1Milieu3",
  "Piano1Milieu4", "Piano1Milieu5", "Piano1Milieu6", "Piano1Milieu7",
  "Piano1Fin1", "Piano1Fin2", "Piano1Fin3", "Piano1Fin4", "Piano1Fin5",
  "Piano1Fin6", "Piano1Fin7"
]

var resevoirPiano1 = hiphop module () {
  in stopReservoir;
  in ... ${ piano.map(i => `${i}IN`) };
  out ... ${ piano.map(i => `${i}OUT`) };
	${ makeReservoir(255, piano) };
}

let saxo = [
  "SaxIntro1", "SaxIntro2", "SaxIntro3", "SaxIntro4", "SaxIntro5",
  "SaxIntro6", "SaxIntro7", "SaxMilieu1", "SaxMilieu2", "SaxMilieu3",
  "SaxMilieu4", "SaxMilieu5", "SaxMilieu6", "SaxMilieu7",
  "SaxFin1", "SaxFin2", "SaxFin3", "SaxFin4", "SaxFin5",
  "SaxFin6", "SaxFin7"
];

var resevoirSaxo = hiphop module () 
{
  in stopReservoir;
  in ... ${ saxo.map(i => `${i}IN`) };
  out ... ${ saxo.map(i => `${i}OUT`) };
	${ makeReservoir(255, saxo) };
}

let brass = [
  "BrassIntro1", "BrassIntro2", "BrassIntro3", "BrassIntro4", "BrassIntro5",
  "BrassIntro6", "BrassIntro7", "BrassMilieu1", "BrassMilieu2", "BrassMilieu3",
  "BrassMilieu4", "BrassMilieu5", "BrassMilieu6", "BrassMilieu7",
  "BrassFin1", "BrassFin2", "BrassFin3", "BrassFin4", "BrassFin5",
  "BrassFin6", "BrassFin7"
];

var resevoirBrass = hiphop module () 
{
  in stopReservoir;
  in ... ${ brass.map(i => `${i}IN`) };
  out ... ${ brass.map(i => `${i}OUT`) };
	${ makeReservoir(255, brass) };
}

let flute = [
  "FluteIntro1", "FluteIntro2", "FluteIntro3", "FluteIntro4", "FluteIntro5",
  "FluteIntro6", "FluteIntro7", "FluteMilieu1", "FluteMilieu2", "FluteMilieu3",
  "FluteMilieu4", "FluteMilieu5", "FluteMilieu6", "FluteMilieu7",
  "FluteFin1", "FluteFin2", "FluteFin3", "FluteFin4", "FluteFin5",
  "FluteFin6", "FluteFin7"
];

var resevoirFlute = hiphop module () 
{
  in stopReservoir;
  in ... ${ flute.map(i => `${i}IN`) };
  out ... ${ flute.map(i => `${i}OUT`) };
	${makeReservoir(255, flute)};
}

let percu = [
  "Percu1", "Percu2", "Percu3", "Percu4", "Percu5",
  "Percu6", "Percu7"
];

var resevoirPercu = hiphop module () 
{
  in stopReservoir;
  in ... ${ percu.map(i => `${i}IN`) };
  out ... ${ percu.map(i => `${i}OUT`) };
	${ makeReservoir(255, percu) };
}

/***************************************************************************
 * L'ensemble des modules HH pour l'orchestration
 * Tout est évalué avec l'appel à setSignals
 * 
 */
export function setSignals(param) {
  var i = 0;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);
  var IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];

  //console.log("inter:", interTextIN, interTextOUT, IZsignals);

  //************************************* LES SESSIONS *************************
  const soloFlute = hiphop module () {
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick;

    signal stopReservoirFlute;
    host{ console.log("-- DEBUT FLUTE SOLO --"); }
      solo: {
      fork{
        run ${ resevoirFlute } () {*, stopReservoirFlute as stopReservoir };
        }par{
          // Dans le cas de reaction à la selection:Pour attendre effectivement la fin du 
          // reservoir qui occupe 55 ticks + 4 ticks de transitions.
          // Dans le cas de séléction à l'exécution, c'est une durée max. Mais les répétitions seront possibles
          // dans le réservoir.
          await count(40, tick.now);
          emit stopReservoirFlute();
          break solo;
        }
      }
    host{ console.log("-- FIN FLUTE SOLO --"); }
  }

  const soloPiano = hiphop module () {
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick, patternSignal,stopSolo;

    signal stopReservoirPiano;
    solo: {
      fork{
        host{ console.log("-- DEBUT PIANO --"); }
        run ${resevoirPiano1}() {*, stopReservoirPiano as stopReservoir};
      }par{
        // Pour attendre effectivement la fin du reservoir qui occupe 55 ticks + 4 ticks de transitions
        // cf. plus faut
        await count( 55, tick.now);
        emit stopReservoirPiano();
        break solo;
      }par{
        every (patternSignal.now && 
          (patternSignal.nowval[1] === "Piano1Fin1"
          || patternSignal.nowval[1] === "Piano1Fin2"
          || patternSignal.nowval[1] === "Piano1Fin3"
          || patternSignal.nowval[1] === "Piano1Fin4"
          || patternSignal.nowval[1] === "Piano1Fin5"
          || patternSignal.nowval[1] === "Piano1Fin6"
          || patternSignal.nowval[1] === "Piano1Fin7"		
          ))
          {
            host{console.log("--- SoloPiano: Pattern de fin en FIFO:", patternSignal.nowval[1]); }
            await count(2, tick.now);
            //hop{DAW.putPatternInQueue("Percu2");}
          }
      }par{
        every immediate (stopSolo.now){
          emit stopReservoirPiano();
          host{console.log("--- SoloPiano: Tuer par stopSolo")}
          break solo;
        }
      }
    }
    host{ console.log("-- FIN PIANO --");}
  }

  const saxoEtViolons = hiphop module (){
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick;

    signal stopReservoirSax;
    fork{
      host{ gcs.informSelecteurOnMenuChange(255,"Saxo tonal", true); }
      run ${resevoirSaxo} () {*, stopReservoirSax as stopReservoir};
    }par{
      await count( 4, tick.now);
      emit nappeViolonsOUT([true, 255]);
      host{ gcs.informSelecteurOnMenuChange(255,"Nappe", true); }
      // Pour attendre effectivement la fin du reservoir
      // dans le cas de séléction à l'exécution
      // mais aussi pour arrêter la nappe au bon moment
      await count( 12 * 5, tick.now); 
      emit stopReservoirSax();
      emit nappeViolonsOUT([false, 255]);
      host{ gcs.informSelecteurOnMenuChange(255,"Nappe", false); }
      hop{ DAW.cleanQueue(3);} // Nappe
    }
  }

  const brassEtPercu = hiphop module () {
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick;

    signal stopReservoirBrassetPercu;
    brass : {
      fork{
        host{
          setTempo(60, param);
          tempoGlobal = 60;
        }
        fork{
          run ${resevoirBrass}() {*,stopReservoirBrassetPercu as stopReservoir};
        }par{
          await count( 20, tick.now);
          run ${resevoirPercu}() {*,stopReservoirBrassetPercu as stopReservoir};
          await count( 5, tick.now);
          if (deuxiemeAlea > 0) emit MassiveOUT([true, 255]);
          host{ gcs.informSelecteurOnMenuChange(255,"Massive", true); }
        }
      }par{
        // Pour attendre une durée max
        // avant de passer à la suite
        await count( 12 * 7, tick.now);
        // Il faut tuer les reservoirs brass et percu
        emit stopReservoirBrassetPercu();
        break brass;
      }
    }
    if (deuxiemeAlea > 0) emit MassiveOUT([false, 255]);
    host{ gcs.informSelecteurOnMenuChange(255,"Massive", false); }
  }

  var transposeSaxoModal = hiphop module (){
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick;

    loop{
      host{
        transposition = 0;
        transpose(CCTransposeSaxo, transposition, param); // Changement de degré
    
        degre2mineursaxo(false, param); // ajustement du mode
    
        tonalite = (tonalite+2)% 6;
        setTonalite(CCtonalite, tonalite, param); // Tonalité globale
      }
      await count (8, tick.now);
      host{
        transposition = -5;
        degre2mineursaxo(true, param); // ajustement du mode
        transpose(CCTransposeSaxo, transposition, param); // Changement de degré
      }
      await count (8, tick.now);
      host{
        transposition = 2;
        degre2mineursaxo(true, param); // ajustement du mode
        transpose(CCTransposeSaxo, transposition, param); // Changement de degré
      }
      await count (8, tick.now);
    }
  }

  const resetAll = hiphop module (){
    host{
      console.log("--Reset Automate Opus4 sans jeu");
      DAW.cleanQueues();
      // oscMidiLocal.convertAndActivateClipAbleton(300); // n'existe plus
    }
  }
  
  const bougeTempo = hiphop module () {
    in tick;
    signal inverseTempo;

    loop{
      fork {
        every count (10, tick.now) {
            emit inverseTempo();
          }
      }par{
        loop{
          abort(inverseTempo.now){
              every count (2, tick.now) {
                host{
                  tempoGlobal += 2;
                  setTempo(tempoGlobal, param);
                }
              }
          }
          abort(inverseTempo.now){
            every count (2, tick.now) {
              host{
                tempoGlobal -= 2;
                setTempo(tempoGlobal, param);
              }
            }
            }
        }
      }
    }
  }

  const setAleas = hiphop module (){
    host{
      premierAlea = Math.floor(Math.random() * Math.floor(3));
      deuxiemeAlea = Math.floor(Math.random() * Math.floor(3));
      troisiemeAlea = Math.floor(Math.random() * Math.floor(3));
      if (debug1) console.log("-- Aleas:", premierAlea, deuxiemeAlea, troisiemeAlea);
    }
  }

  /****************************************************
   * L'orchestration qui est mise en place par la machine HH
   * 
   */
  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    // Pour basculer d'un scénario avec ou sans capteurs
    let sensors = false;

    loop{
      let tickCounter = 0;
      let patternCounter = 1;
      await(start.now);
      host{ 
        utilsSkini.removeSceneScore(1, serveur);
        utilsSkini.refreshSceneScore(serveur);
        utilsSkini.addSceneScore(1, serveur);
        utilsSkini.alertInfoScoreON("Skini HH", serveur);
        transposeAll(0, param);

        // Manage the types for the patterns
        utilsSkini.setListeDesTypes(serveur);
        utilsSkini.setTypeList("1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11",serveur);
        utilsSkini.setpatternListLength(12, 255, gcs);

        gcs.setTimerDivision(1);
       }
       host{
        setTempo(60, param);
        tempoGlobal = 60;
      }

      abort(halt.now){
        fork {
          every(tick.now){
            host{gcs.setTickOnControler(tickCounter++);}
          }
        } par {
          if(sensors){
            //every(INTERFACEZ_RC0.now) {
              //host{ console.log(" *-*-*-*-*-*-*- Sensor RC0", INTERFACEZ_RC0.nowval ); }
              //host{utilsSkini.alertInfoScoreON("Sensor RC0 : " + INTERFACEZ_RC0.nowval[1], serveur);}
              fork{
                every (INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000) {
                  host{ utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 1", serveur); }
                  hop{ DAW.cleanQueue(1);} // piano
                  run ${ soloPiano } () {*};
                }
              }par{
                every (INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000) {
                  host{ utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 2", serveur); }
                  hop{ DAW.cleanQueue(2);} // Saxo
                  hop{ DAW.cleanQueue(3);} // Violon
                  run ${saxoEtViolons} () {*};
                }
              }
              // else if (INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000) {
              //   host{ utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 3", serveur); }
              //   run ${soloFlute} () {*};
              // }
              // else if (INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500) {
              //   host{ utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 4", serveur); }
              //   run ${ brassEtPercu } () {*};
              // }
            //}
          }
          if(!sensors){
            fork{
              //run ${brassEtPercu} () {*};
              //run ${saxoEtViolons} () {*};
              //run ${soloPiano} () {*};
              //run ${resevoirFlute} () {*}
              run ${soloFlute} () {*};

              //run ${ resevoirPiano1 } () {*}
              //run ${ resevoirSaxo } () {*}
              //run ${ resevoirBrass } () {*}
              // } par {
                //run ${soloFlute} () {*}
              // } par {
              //   run ${ saxoEtViolons } () {*}
              // } par {
              run ${ transposeSaxoModal } () {*}
            } par {
              run ${ soloPiano } () {*}
              //run ${ brassEtPercu } () {*}
            // } par {
            //   run ${ resevoirPercu } () {*}
            } par {
              run ${ bougeTempo } () {*}
            } par {
              every (patternSignal.now) {
                host{ console.log("Pattern counter:", patternCounter++)}
              }
            }
          }
        }
      }
      host{ console.log("Reçu Halt"); }
      //host{ gcs.resetMatrice(); }
      host{ utilsSkini.alertInfoScoreOFF(serveur); }
      //run ${resetAll}(){}
    }
  }

  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

