/**
 * @fileOverview Opus4. Reprise de la version créée avec Hop en 2019.
 * Fonctionne avec Ableton, opus4V3.als.
 * Il s'agit d'un forme de pièce orchestrale. Ici on se donne la possibilité
 * de contrôler le déroulement avec des capteurs Interface Z.
 * Cette pièce possédait une version en interaction avec une démo UnrealEngine.
 * Il s'agit d'un exemple de contrôle d'Ableton avec une utilisation
 * systématique des réservoirs.
 * 
 * Il y a quasiment tout ce que l'on peut faire avec Skini:
 * - Groupes
 * - Réservoirs
 * - Controles Midi, CC, transpositions...
 * - Controle de tempo
 * - Affichage
 * - Scénarios aléatoires
 * - Test des patterns joués par Live
 * - Utilisation de capteurs (ici IZ)
 * - Ordonnancement des clips en FIFO
 * 
 * Pour debug dans /tests:
 * node ..\..\node_modules\@hop\hiphop\bin\hhc.mjs .\opus4test.hh.js -o .\opus4test.mjs
 *
 * Fonctionne avec Opus4V3.als dans Ableton 10
 * 
 * @copyright (C) 2019-2025 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.4
 */
// @ts-nocheck
"use strict"
"use hopscript"

import { ReactiveMachine } from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";
import * as tank from "../pieces/util/makeReservoir.mjs";

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
let compteurTransInit = 407;
let compteurTrans = compteurTransInit;
let compteurTransMax = 414;

let transposition = 0;
let tonalite = 0;

let tempoGlobal = 60;
let changeTempo = 0;

let premierAlea = 0;
let deuxiemeAlea = 0;
let troisiemeAlea = 0;

/*************************************************************************
 * Les fonctions JavaScript
 * 
 */
function setTempo(value, par) {

  // Assez instable sur mon PC.
  // if(midimix.getAbletonLinkStatus()) {
  //     if(debug) console.log("Opus4 : set tempo Link:", value);
  //     midimix.setTempoLink(value);
  //   return;
  // }

  if (value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  // Dans DAW, pour cette pièce, le controle MIDI du tempo se fait entre 60 et 160
  let tempo = Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
  if (debug) console.log("Set tempo:", value);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

// de -12 à +12 demi-tons avec transpose Chromatic DAW
function transpose(CCinstrument, value, par) {
  let CCTransposeValue;

  CCTransposeValue = Math.round(1763 / 1000 * value + 635 / 10);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCinstrument, CCTransposeValue);
  if (debug) console.log("-- Transposition instrument:", CCinstrument, "->", value, "demi-tons");
}

function transposeAll(value, par) {
  for (let i = 61; i <= 74; i++) {
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
  let CCTon;
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
  if (debug) console.log("-- HH_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
  //Les objets gcs et serveur ne passent pas en paramètres de makereservoir !!??
  //On initialise tank.
  tank.initMakeReservoir(gcs, serveur);
}

/***************************************************************************
 * Les modules HH pour les réservoirs
 * 
 */
const piano = [
  "Piano1Intro1", "Piano1Intro2", "Piano1Intro3", "Piano1Intro4", "Piano1Intro5",
  "Piano1Milieu1", "Piano1Milieu2", "Piano1Milieu3", "Piano1Milieu4", "Piano1Milieu5",
  "Piano1Milieu6", "Piano1Milieu7", "Piano1Fin1", "Piano1Fin2", "Piano1Fin3",
  "Piano1Fin4", "Piano1Fin5"
];

const reservoirPiano = hiphop module () {
  in stopReservoir;
  in ... ${ piano.map(i => `${i}IN`) };
  out ... ${ piano.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, piano) }
}

const violons = [
  "ViolonsIntro1", "ViolonsIntro2", "ViolonsIntro3", "ViolonsIntro4", "ViolonsIntro5",
  "ViolonsIntro6", "ViolonsMilieu1", "ViolonsMilieu2", "ViolonsMilieu3", "ViolonsMilieu4",
  "ViolonsFin1", "ViolonsFin2", "ViolonsFin3", "ViolonsFin4", "ViolonsFin5"
];

const reservoirViolon = hiphop module () {
  in stopReservoir;
  in ... ${ violons.map(i => `${i}IN`) };
  out ... ${ violons.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, violons) }
}

const trompette = [
  "Trompette1", "Trompette2", "Trompette3", "Trompette4", "Trompette5",
  "Trompette6", "Trompette7", "Trompette8", "Trompette9"
];

const reservoirTrompette = hiphop module () {
  in stopReservoir;
  in ... ${ trompette.map(i => `${i}IN`) };
  out ... ${ trompette.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trompette) }
}

const cors = [
  "Cors1", "Cors2", "Cors3", "Cors4"
];

const reservoirCors = hiphop module () {
  in stopReservoir;
  in ... ${ cors.map(i => `${i}IN`) };
  out ... ${ cors.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, cors) }
}

const flute = [
  "FluteDebut1", "FluteDebut2", "FluteDebut3", "FluteDebut4", "FluteMilieu1",
  "FluteMilieu2", "FluteMilieu3", "FluteFin1", "FluteFin2", "FluteFin3",
  "FluteFin4", "FluteFin5", "FluteFin6", "FluteNeutre1", "FluteNeutre2",
  "FluteNeutre3"
];

const reservoirFlute = hiphop module () {
  in stopReservoir;
  in ... ${ flute.map(i => `${i}IN`) };
  out ... ${ flute.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, flute) }
}

const clarinette = [
  "ClarinetteDebut1", "ClarinetteDebut2", "ClarinetteDebut3", "ClarinetteMilieu1", "ClarinetteMilieu2",
  "ClarinetteMilieu3", "ClarinetteMilieu4", "ClarinetteMilieu5", "ClarinetteFin1", "ClarinetteFin2",
  "ClarinetteFin3"
];

const reservoirClarinette = hiphop module () {
  in stopReservoir;
  in ... ${ clarinette.map(i => `${i}IN`) };
  out ... ${ clarinette.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, clarinette) }
}

const basson = [
  "BassonDebut1", "BassonDebut2", "BassonDebut3", "BassonDebut4", "BassonMilieu1",
  "BassonMilieu2", "BassonMilieu3", "BassonMilieu4", "BassonMilieu5", "BassonNeutre1",
  "BassonNeutre2"
];

const reservoirBasson = hiphop module () {
  in stopReservoir;
  in ... ${ basson.map(i => `${i}IN`) };
  out ... ${ basson.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, basson) }
}

const percu = [
  "Percu1", "Percu2", "Percu3", "Percu4", "Percu5",
  "Percu6", "Percu7"
];

const reservoirPercu = hiphop module () {
  in stopReservoir;
  in ... ${ percu.map(i => `${i}IN`) };
  out ... ${ percu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, percu) }
}

/***************************************************************************
 * L'ensemble des modules HH pour l'orchestration
 * Tout est évalué avec l'appel à setSignals
 * 
 */
export function setSignals(param) {
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  // Pour les capteur Interface Z avec la carte contrôleur.
  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
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
        run ${ reservoirFlute } () {*, stopReservoirFlute as stopReservoir };
      }par{
        // Dans le cas de reaction à la selection:Pour attendre effectivement la fin du 
        // reservoir qui occupe 55 ticks + 4 ticks de transitions.
        // Dans le cas de séléction à l'exécution, c'est une durée max. Mais les répétitions seront possibles
        // dans le réservoir.
        await count(57, tick.now);
          emit stopReservoirFlute();
          // Si on ne vide pas la FIFO ça continue à jouer, c'est un choix musical possible.
          host{ DAW.cleanQueue(6); }
        break solo;
      }
    }
    host{ console.log("-- FIN FLUTE SOLO --"); }
  }

   var transposeSaxoModal = hiphop module (){
    out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
    in tick, stopTransposition;

    weakabort {
      loop{
        host{
          transposition = 0;
          transpose(CCTransposeSaxo, transposition, param); // Changement de degré
          degre2mineursaxo(false, param); // ajustement du mode
          tonalite = (tonalite + 2) % 6;
          setTonalite(CCtonalite, tonalite, param); // Tonalité globale
        }
        await count(8, tick.now);
        host{
          transposition = -5;
          degre2mineursaxo(true, param); // ajustement du mode
          transpose(CCTransposeSaxo, transposition, param); // Changement de degré
        }
        await count(8, tick.now);
        host{
          transposition = 2;
          degre2mineursaxo(true, param); // ajustement du mode
          transpose(CCTransposeSaxo, transposition, param); // Changement de degré
        }
        await count(8, tick.now);
      }
    } when (stopTransposition.now);
    // Ne s'affiche pas quand le run global est tué en cours de route
    host { console.log("-- Stop transpositions")}
  }

  const resetAll = hiphop module (){
    host{
      console.log("-- Reset Automate Opus4");
      DAW.cleanQueues();
      // oscMidiLocal.convertAndActivateClipAbleton(300); // n'existe plus
    }
  }

  const bougeTempo = hiphop module () {
    in tick, stopMoveTempo;
    signal inverseTempo;
    host {console.log("-- Start move tempo")}
    abort {
      loop{
        fork {
          every count(10, tick.now) {
            emit inverseTempo();
          }
        }par{
          loop{
            abort{
                every count(2, tick.now) {
                  host{
                  tempoGlobal += 2;
                  setTempo(tempoGlobal, param);
                }
              }
            } when (inverseTempo.now);
            abort {
              every count(2, tick.now) {
                host{
                  tempoGlobal -= 2;
                  setTempo(tempoGlobal, param);
                }
              }
            } when (inverseTempo.now);
          }
        }
      }
    } when immediate(stopMoveTempo.now);
    host {console.log("-- Stop move tempo")}
  }

  /****************************************************
   * L'orchestration qui est mise en place par la machine HH
   * 
   */
  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    // Pour basculer d'un scénario avec ou sans capteurs
    const sensors = false;

    loop {
      let tickCounter = 0;
      let patternCounter = 1;
      await(tick.now);
      await(start.now);

      //Initialisation en JS
      host{
        gcs.setpatternListLength([1, 255]);
        utilsSkini.removeSceneScore(1, serveur);
        utilsSkini.refreshSceneScore(serveur);
        utilsSkini.addSceneScore(1, serveur);
        utilsSkini.alertInfoScoreON("Opus 5", serveur);
        transposeAll(0, param);
        gcs.setTimerDivision(1);
        console.log("-- OPUS5 --");
      }
      host{
        setTempo(80, param);
        tempoGlobal = 60;
      }

      abort {
        fork{
            every(tick.now){
                host{
                    //console.log("tick from HH", tickCounter++);
                    gcs.setTickOnControler(tickCounter++);
                }
            }
        } par {
            host{ utilsSkini.alertInfoScoreON("Opus 5", serveur); }
            emit NappeViolonsOUT([true, 255]);
            emit NappeAltoOUT([true, 255]);
            emit NappeCelloOUT([true, 255]);
            emit NappeCTBOUT([true, 255]);

            await count(10, tick.now);
            host{ utilsSkini.alertInfoScoreOFF(serveur); }
            host{ 
                    transposition = 0;
                    transpose(CCTransposeStrings, 2, param );
                }
            run ${ reservoirPiano } () {*};

            emit NappeViolonsOUT([false, 255]);
            emit NappeAltoOUT([false, 255]);
            emit NappeCelloOUT([false, 255]);
            emit NappeCTBOUT([false, 255]);

            host{ 
                    transposition = 0;
                    transpose(CCTransposeStrings, 0, param );
                }

            host{ DAW.cleanQueues(); }

            fork {
                host{ utilsSkini.alertInfoScoreON("Avec Violon", serveur); }
                host{
                    setTempo(100, param);
                    tempoGlobal = 100;
                }
            } par {
                abort {
                    run ${ bougeTempo } () {*}
                } when count(10, tick.now);
            }
            emit S1ActionOUT([true, 255]);
            emit NappeCTBRythmeOUT([true, 255]);
            await count(10, tick.now);
            run ${ reservoirViolon } () {*};

            emit S1ActionOUT([false, 255]);
            emit NappeCTBRythmeOUT([false, 255]);
            host{ DAW.cleanQueues(); }

        } par {
            every(patternSignal.now) { 
              host{ 
                // console.log("-- Pattern counter:", patternCounter++);
                console.log("-- Pattern :", patternSignal.nowval);
               }
            }
        } par {
            run ${ bougeTempo } () {*}
        }
    } when (halt.now);
      //Ces signaux activent bien les abort des modules qui
      //pour qu'ils ne continuent pas leurs déroulement après le halt.
      emit stopTransposition();
      emit stopMoveTempo();
      emit stopReservoir();
      host{ console.log("-- Reçu Halt"); }
      host{ utilsSkini.alertInfoScoreON("Stop Opus 5", serveur); }
      run ${ resetAll } (){ };
      host{ gcs.resetMatrice(); }
    }
  }
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}


