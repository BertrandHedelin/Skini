var Piano, StartTransSaxo, Saxo, Piano1Intro1, Piano1Intro2, Piano1Intro3, Piano1Intro4, Piano1Intro5, Piano1Intro6, Piano1Intro7, Piano1Milieu1, Piano1Milieu2, Piano1Milieu3, Piano1Milieu4, Piano1Milieu5, Piano1Milieu6, Piano1Milieu7, Piano1Fin1, Piano1Fin2, Piano1Fin3, Piano1Fin4, Piano1Fin5, Piano1Fin6, Piano1Fin7, Brass, SaxIntro1, SaxIntro2, SaxIntro3, SaxIntro4, SaxIntro5, SaxIntro6, SaxIntro7, SaxMilieu1, SaxMilieu2, SaxMilieu3, SaxMilieu4, SaxMilieu5, SaxMilieu6, SaxMilieu7, SaxFin1, SaxFin2, SaxFin3, SaxFin4, SaxFin5, SaxFin6, SaxFin7, Flute, Percu, BrassIntro1, BrassIntro2, BrassIntro3, BrassIntro4, BrassIntro5, BrassIntro6, BrassIntro7, BrassMilieu1, BrassMilieu2, BrassMilieu3, BrassMilieu4, BrassMilieu5, BrassMilieu6, BrassMilieu7, BrassFin1, BrassFin2, BrassFin3, BrassFin4, BrassFin5, BrassFin6, BrassFin7, FluteIntro1, FluteIntro2, FluteIntro3, FluteIntro4, FluteIntro5, FluteIntro6, FluteIntro7, FluteMilieu1, FluteMilieu2, FluteMilieu3, FluteMilieu4, FluteMilieu5, FluteMilieu6, FluteMilieu7, FluteFin1, FluteFin2, FluteFin3, FluteFin4, FluteFin5, FluteFin6, FluteFin7, TransPianoEtNappe, Percu1, Percu2, Percu3, Percu4, Percu5, Percu6, Percu7, tick, TransPianoEtNappe2, TransPianoEtNappe3, TransSaxo, nappeViolons, Flesh, Massive;


// Les patterns de cette pièce sont organisés par types et sont dans des réservoirs.
// On a donc un contrôle sur la construction des phrases musicales.
// Le simulateur a des contraintes sur les timers : 3000 min et
// 3010 max avec 20 pulse max d'attente. Ceci permet de faire appel
// aux tanks en contrôlant/limitant les répétitions de patterns.
// Si le simulateur va trop vite, il peut rappeler un
// pattern avant qu'il ait été dévalidé sur le serveur,
// surtout quand le paramètre reactOnPlay est actif.
// Il y a deux groupes 1 et 0. Il faut utiliser simulateurListe.
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Pour cette pièce, il y a un groupe 0. Attention au simulateur.
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

"use strict";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ipConfig = require('../serveur/ipConfig.json');

import * as hh from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";
import * as tank from "../pieces/util/makeReservoir.mjs";

var par;
var debug = false;
var debug1 = true;
var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;

// Avec des valeurs initiales
var CCChannel = 1;
var CCTempo = 100;
var tempoMax = 160;
var tempoMin = 40;
var tempoGlobal = 60;

export function setServ(ser, daw, groupeCS, oscMidi, mix){
  if(debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
  tank.initMakeReservoir(gcs, serveur);
}

function setTempo(value){
  tempoGlobal = value;

  if(midimix.getAbletonLinkStatus()) {
    if(debug) console.log("ORCHESTRATION: set tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }
  if ( value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  var tempo = Math.round(127/(tempoMax - tempoMin) * (value - tempoMin));
  if (debug) {
    console.log("Set tempo blockly:", value, param.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW() );
  }
  oscMidiLocal.sendControlChange(param.busMidiDAW, CCChannel, CCTempo, tempo);
}

var tempoValue = 0;
var tempoRythme = 0;
var tempoLimit = 0;
var tempoIncrease = true;
var transposeValue = 0;
var ratioTranspose = 1.763;
var offsetTranspose = 63.5;

function moveTempo(value, limit){
  if(tempoLimit >= limit){
    tempoLimit = 0;
    tempoIncrease = !tempoIncrease;
  }

  if(tempoIncrease){
    tempoGlobal += value;
  }else{
    tempoGlobal -= value;
  }
  if(debug) console.log("moveTempo:", tempoGlobal);
  setTempo(tempoGlobal);
  tempoLimit++;
}

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];
var halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
var tickCounter = 0;

export function setSignals(param) {
  par = param;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];


    const Piano = hiphop module () {
    in stopReservoir;
    in Piano1Intro1IN;
      in Piano1Intro2IN;
      in Piano1Intro3IN;
      in Piano1Intro4IN;
      in Piano1Intro5IN;
      in Piano1Intro6IN;
      in Piano1Intro7IN;
      in Piano1Milieu1IN;
      in Piano1Milieu2IN;
      in Piano1Milieu3IN;
      in Piano1Milieu4IN;
      in Piano1Milieu5IN;
      in Piano1Milieu6IN;
      in Piano1Milieu7IN;
      in Piano1Fin1IN;
      in Piano1Fin2IN;
      in Piano1Fin3IN;
      in Piano1Fin4IN;
      in Piano1Fin5IN;
      in Piano1Fin6IN;
      in Piano1Fin7IN;
      out Piano1Intro1OUT;
      out Piano1Intro2OUT;
      out Piano1Intro3OUT;
      out Piano1Intro4OUT;
      out Piano1Intro5OUT;
      out Piano1Intro6OUT;
      out Piano1Intro7OUT;
      out Piano1Milieu1OUT;
      out Piano1Milieu2OUT;
      out Piano1Milieu3OUT;
      out Piano1Milieu4OUT;
      out Piano1Milieu5OUT;
      out Piano1Milieu6OUT;
      out Piano1Milieu7OUT;
      out Piano1Fin1OUT;
      out Piano1Fin2OUT;
      out Piano1Fin3OUT;
      out Piano1Fin4OUT;
      out Piano1Fin5OUT;
      out Piano1Fin6OUT;
      out Piano1Fin7OUT;

  	${ tank.makeReservoir(0, ["Piano1Intro1","Piano1Intro2","Piano1Intro3","Piano1Intro4","Piano1Intro5","Piano1Intro6","Piano1Intro7","Piano1Milieu1","Piano1Milieu2","Piano1Milieu3","Piano1Milieu4","Piano1Milieu5","Piano1Milieu6","Piano1Milieu7","Piano1Fin1","Piano1Fin2","Piano1Fin3","Piano1Fin4","Piano1Fin5","Piano1Fin6","Piano1Fin7"]) };
  }

    const Saxo = hiphop module () {
    in stopReservoir;
    in SaxIntro1IN;
      in SaxIntro2IN;
      in SaxIntro3IN;
      in SaxIntro4IN;
      in SaxIntro5IN;
      in SaxIntro6IN;
      in SaxIntro7IN;
      in SaxMilieu1IN;
      in SaxMilieu2IN;
      in SaxMilieu3IN;
      in SaxMilieu4IN;
      in SaxMilieu5IN;
      in SaxMilieu6IN;
      in SaxMilieu7IN;
      in SaxFin1IN;
      in SaxFin2IN;
      in SaxFin3IN;
      in SaxFin4IN;
      in SaxFin5IN;
      in SaxFin6IN;
      in SaxFin7IN;
      out SaxIntro1OUT;
      out SaxIntro2OUT;
      out SaxIntro3OUT;
      out SaxIntro4OUT;
      out SaxIntro5OUT;
      out SaxIntro6OUT;
      out SaxIntro7OUT;
      out SaxMilieu1OUT;
      out SaxMilieu2OUT;
      out SaxMilieu3OUT;
      out SaxMilieu4OUT;
      out SaxMilieu5OUT;
      out SaxMilieu6OUT;
      out SaxMilieu7OUT;
      out SaxFin1OUT;
      out SaxFin2OUT;
      out SaxFin3OUT;
      out SaxFin4OUT;
      out SaxFin5OUT;
      out SaxFin6OUT;
      out SaxFin7OUT;

  	${ tank.makeReservoir(0, ["SaxIntro1","SaxIntro2","SaxIntro3","SaxIntro4","SaxIntro5","SaxIntro6","SaxIntro7","SaxMilieu1","SaxMilieu2","SaxMilieu3","SaxMilieu4","SaxMilieu5","SaxMilieu6","SaxMilieu7","SaxFin1","SaxFin2","SaxFin3","SaxFin4","SaxFin5","SaxFin6","SaxFin7"]) };
  }

    const Brass = hiphop module () {
    in stopReservoir;
    in BrassIntro1IN;
      in BrassIntro2IN;
      in BrassIntro3IN;
      in BrassIntro4IN;
      in BrassIntro5IN;
      in BrassIntro6IN;
      in BrassIntro7IN;
      in BrassMilieu1IN;
      in BrassMilieu2IN;
      in BrassMilieu3IN;
      in BrassMilieu4IN;
      in BrassMilieu5IN;
      in BrassMilieu6IN;
      in BrassMilieu7IN;
      in BrassFin1IN;
      in BrassFin2IN;
      in BrassFin3IN;
      in BrassFin4IN;
      in BrassFin5IN;
      in BrassFin6IN;
      in BrassFin7IN;
      out BrassIntro1OUT;
      out BrassIntro2OUT;
      out BrassIntro3OUT;
      out BrassIntro4OUT;
      out BrassIntro5OUT;
      out BrassIntro6OUT;
      out BrassIntro7OUT;
      out BrassMilieu1OUT;
      out BrassMilieu2OUT;
      out BrassMilieu3OUT;
      out BrassMilieu4OUT;
      out BrassMilieu5OUT;
      out BrassMilieu6OUT;
      out BrassMilieu7OUT;
      out BrassFin1OUT;
      out BrassFin2OUT;
      out BrassFin3OUT;
      out BrassFin4OUT;
      out BrassFin5OUT;
      out BrassFin6OUT;
      out BrassFin7OUT;

  	${ tank.makeReservoir(0, ["BrassIntro1","BrassIntro2","BrassIntro3","BrassIntro4","BrassIntro5","BrassIntro6","BrassIntro7","BrassMilieu1","BrassMilieu2","BrassMilieu3","BrassMilieu4","BrassMilieu5","BrassMilieu6","BrassMilieu7","BrassFin1","BrassFin2","BrassFin3","BrassFin4","BrassFin5","BrassFin6","BrassFin7"]) };
  }

    const Flute = hiphop module () {
    in stopReservoir;
    in FluteIntro1IN;
      in FluteIntro2IN;
      in FluteIntro3IN;
      in FluteIntro4IN;
      in FluteIntro5IN;
      in FluteIntro6IN;
      in FluteIntro7IN;
      in FluteMilieu1IN;
      in FluteMilieu2IN;
      in FluteMilieu3IN;
      in FluteMilieu4IN;
      in FluteMilieu5IN;
      in FluteMilieu6IN;
      in FluteMilieu7IN;
      in FluteFin1IN;
      in FluteFin2IN;
      in FluteFin3IN;
      in FluteFin4IN;
      in FluteFin5IN;
      in FluteFin6IN;
      in FluteFin7IN;
      out FluteIntro1OUT;
      out FluteIntro2OUT;
      out FluteIntro3OUT;
      out FluteIntro4OUT;
      out FluteIntro5OUT;
      out FluteIntro6OUT;
      out FluteIntro7OUT;
      out FluteMilieu1OUT;
      out FluteMilieu2OUT;
      out FluteMilieu3OUT;
      out FluteMilieu4OUT;
      out FluteMilieu5OUT;
      out FluteMilieu6OUT;
      out FluteMilieu7OUT;
      out FluteFin1OUT;
      out FluteFin2OUT;
      out FluteFin3OUT;
      out FluteFin4OUT;
      out FluteFin5OUT;
      out FluteFin6OUT;
      out FluteFin7OUT;

  	${ tank.makeReservoir(0, ["FluteIntro1","FluteIntro2","FluteIntro3","FluteIntro4","FluteIntro5","FluteIntro6","FluteIntro7","FluteMilieu1","FluteMilieu2","FluteMilieu3","FluteMilieu4","FluteMilieu5","FluteMilieu6","FluteMilieu7","FluteFin1","FluteFin2","FluteFin3","FluteFin4","FluteFin5","FluteFin6","FluteFin7"]) };
  }

    const Percu = hiphop module () {
    in stopReservoir;
    in Percu1IN;
      in Percu2IN;
      in Percu3IN;
      in Percu4IN;
      in Percu5IN;
      in Percu6IN;
      in Percu7IN;
      out Percu1OUT;
      out Percu2OUT;
      out Percu3OUT;
      out Percu4OUT;
      out Percu5OUT;
      out Percu6OUT;
      out Percu7OUT;

  	${ tank.makeReservoir(0, ["Percu1","Percu2","Percu3","Percu4","Percu5","Percu6","Percu7"]) };
  }
  // La transposition si fait dans Ableton Live. D'où les
  // ratios dans l'initialisation de la pièce pour cadrer
  // avec le paramètre MIDI des CC. (min -36, max +36).
  // 64 -> 0
  // 67 -> +2 ...
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

    const TransPianoEtNappe = hiphop module() {

      inout tick;


      loop{

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = -2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = 2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

      }

    }
  // La transposition si fait dans Ableton Live. D'où les
  // ratios dans l'initialisation de la pièce pour cadrer
  // avec le paramètre MIDI des CC. (min -36, max +36).
  // 64 -> 0
  // 67 -> +2 ...
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

    const TransPianoEtNappe2 = hiphop module() {

      inout tick;


      loop{

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(2,tick.now);

        host{
          transposeValue = -2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(2,tick.now);

        host{
          transposeValue = 2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(2,tick.now);

      }

    }
  // La transposition si fait dans Ableton Live. D'où les
  // ratios dans l'initialisation de la pièce pour cadrer
  // avec le paramètre MIDI des CC. (min -36, max +36).
  // 64 -> 0
  // 67 -> +2 ...
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

    const TransPianoEtNappe3 = hiphop module() {

      inout tick;


      loop{

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = -2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = 2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = -1; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

        host{
          transposeValue = 1; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(1,tick.now);

      }

    }
  // La transposition si fait dans Ableton Live. D'où les
  // ratios dans l'initialisation de la pièce pour cadrer
  // avec le paramètre MIDI des CC. (min -36, max +36).
  // 64 -> 0
  // 67 -> +2 ...
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

    const TransSaxo = hiphop module() {

      inout tick;

      inout StartTransSaxo;


      await immediate (StartTransSaxo.now);

      await count(2,tick.now);

      loop{

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(4,tick.now);

        host{
          transposeValue = -5; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(4,tick.now);

        host{
          transposeValue = -7; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(4,tick.now);

        await count(1,tick.now);

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(4,tick.now);

        host{
          transposeValue = -1; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

      }

    }


  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };


    inout StartTransSaxo;


    loop{
      await(start.now);
      abort{
        fork {
          every(tick.now){
            host{
              //console.log("tick from HH", tickCounter++);
              gcs.setTickOnControler(tickCounter++);
            }
          }
        }par{

      host {console.log('-- Opus4 Blockly');}

      {

        host{
          serveur.broadcast(JSON.stringify({
            type: 'setListeDesTypes',
          }));
        }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'listeDesTypes',
              text:'1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11'
            }));
      }

      host{
        gcs.setpatternListLength([12,255]);
      }

      }

      {

      host{
        CCChannel= 1;
        CCTempo  = 100;
        tempoMax = 160;
        tempoMin = 40;
      }

      host{setTempo(60);}

      host{gcs.setTimerDivision(1);}

      host{
        serveur.broadcast(JSON.stringify({
              type: 'addSceneScore',
              value:1
            }));
      }
      yield;

      host{
        ratioTranspose = 1.763;
        offsetTranspose = 63.5;
        if(debug) console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
      }

      host{
        transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
        console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
        oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
      }

      }

    abort{
        run ${ Percu} () {*};

    yield;
    } when count(5, tick.now);
    emit stopReservoir();
    yield;

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

    host{
      DAW.cleanQueue(5);
    }

      {

        host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Transposition-1 tick'
            }));
      }

      fork {

        abort{
            run ${ Piano} () {*};

        yield;
        } when count(30, tick.now);
        emit stopReservoir();
        yield;

      }

      par {

        abort{

          fork {

            run ${ TransPianoEtNappe} () {*};

          }

          par {

              emit FleshOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," Flesh", true) }

          }

        } when count(30, tick.now);

      }

      par {

              emit nappeViolonsOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," nappeViolons", true) }
          await count(30, tick.now);

              emit nappeViolonsOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," nappeViolons", false) }
          yield;

      }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

        host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Transposition3-1 tick'
            }));
      }

      fork {

        abort{
            run ${ Piano} () {*};

        yield;
        } when count(30, tick.now);
        emit stopReservoir();
        yield;

      }

      par {

              emit nappeViolonsOUT([true,1]);
              host{gcs.informSelecteurOnMenuChange(1," nappeViolons", true) }
          await count(30, tick.now);

              emit nappeViolonsOUT([false,1]);
              host{gcs.informSelecteurOnMenuChange(1," nappeViolons", false) }
          yield;

      }

      par {

        abort{

          fork {

            run ${ TransPianoEtNappe3} () {*};

          }

        } when count(30, tick.now);

      }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

        host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Transposition2-2 ticks'
            }));
      }

      fork {

        abort{
            run ${ Piano} () {*};

        yield;
        } when count(30, tick.now);
        emit stopReservoir();
        yield;

      }

      par {

              emit nappeViolonsOUT([true,1]);
              host{gcs.informSelecteurOnMenuChange(1," nappeViolons", true) }
          await count(30, tick.now);

              emit nappeViolonsOUT([false,1]);
              host{gcs.informSelecteurOnMenuChange(1," nappeViolons", false) }
          yield;

      }

      par {

        abort{

          fork {

            run ${ TransPianoEtNappe2} () {*};

          }

        } when count(30, tick.now);

      }

        emit nappeViolonsOUT([false,1]);
        host{gcs.informSelecteurOnMenuChange(1," nappeViolons", false) }

      host{
        DAW.cleanQueue(1);
      }

      host{
        DAW.cleanQueue(2);
      }

      host{
        DAW.cleanQueue(3);
      }

      }

    host{setTempo(70);}

    abort{
        run ${ Percu} () {*};

    yield;
    } when count(5, tick.now);
    emit stopReservoir();
    yield;

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreOFF'
          }));
    }

    host{
      DAW.cleanQueue(5);
    }

    fork {

        {

          emit StartTransSaxo(0);

        abort{
            run ${ Saxo} () {*};

        yield;
        } when count(50, tick.now);
        emit stopReservoir();
        yield;

        }

      abort{

        run ${ TransSaxo} () {*};

      } when count(50, tick.now);

    }

    host{
      DAW.cleanQueue(2);
    }

        run ${ Brass} () {*};

        run ${ Percu} () {*};

    abort{
        run ${ Percu} () {*};

    yield;
    } when count(5, tick.now);
    emit stopReservoir();
    yield;

    host{
      DAW.cleanQueue(5);
    }

    fork {

      abort{
          run ${ Flute} () {*};

      yield;
      } when count(40, tick.now);
      emit stopReservoir();
      yield;

            emit MassiveOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Massive", true) }
        await count(10, tick.now);

            emit MassiveOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Massive", false) }
        yield;

    }

    host { DAW.putPatternInQueue('Percu4');}

    host{
      DAW.cleanQueue(6);
    }

    host{
      DAW.cleanQueue(8);
    }

        }
      } when (halt.now);
    }
  }
  if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
  var machine = new hh.ReactiveMachine( Program, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
