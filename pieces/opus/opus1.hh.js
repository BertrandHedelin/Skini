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

const CCChannel = 1;
const CCTransposeViolins = 61;
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
const CCTransposePianos = 72;

const CCTempo = 100;
const tempoMax = 160;// Valeur fixé dans Ableton
const tempoMin = 60; // Valeur fixé dans Ableton

function setTempo(value, par) {
  // Assez instable sur mon PC.
  if(midimix.getAbletonLinkStatus()) {
      if(debug) console.log("Opus4 : set tempo Link:", value);
      midimix.setTempoLink(value);
    return;
  }

  if (value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  // Dans DAW, pour cette pièce, le controle MIDI du tempo se fait entre 60 et 160
  let tempo = Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
  if (debug) console.log("Set tempo:", value);
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

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

/****************************************************************************
 * Appelé par Skini pour mettre en place tous les accès aux fonctions de
 * contrôle.
 *
 */
export function setServ(ser, daw, groupeCS, oscMidi, mix) {
  if (debug1) console.log("-- HH_ORCHESTRATION: setServ");
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

const trompettesEchelle = [ "trompettesEchelle1", "trompettesEchelle2", "trompettesEchelle3","trompettesEchelle4"];

const resevoirTrompettesEchelle = hiphop module() {
  in stopReservoir;
  in ... ${ trompettesEchelle.map(i => `${i}IN`) };
  out ... ${ trompettesEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trompettesEchelle) }
}

const trompettesTonal =  [ "trompettesTonal1",  "trompettesTonal2", "trompettesTonal3"];

const resevoirTrompettesTonal = hiphop module () {
  in stopReservoir;
  in ... ${ trompettesTonal.map(i => `${i}IN`) };
  out ... ${ trompettesTonal.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trompettesTonal) }
}

const corsEchelle = [ "corsEchelle1", "corsEchelle2", "corsEchelle3",
		"corsEchelle4","corsEchelle5","corsEchelle6","corsEchelle7"];

const resevoirCorsEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ corsEchelle.map(i => `${i}IN`) };
  out ... ${ corsEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, corsEchelle) }
}

const trombonesEchelle = [ "trombonesEchelle1", "trombonesEchelle2", "trombonesEchelle3",
		"trombonesEchelle4","trombonesEchelle5","trombonesEchelle6","trombonesEchelle7"];

const  resevoirTrombonesEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ trombonesEchelle.map(i => `${i}IN`) };
  out ... ${ trombonesEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trombonesEchelle) }
}

const flutesEchelle= [ "flutesEchelle1",  "flutesEchelle2", "flutesEchelle3",
		"flutesEchelle4", "flutesEchelle5"];

const resevoirFlutesEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ flutesEchelle.map(i => `${i}IN`) };
  out ... ${ flutesEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, flutesEchelle) }
}

const hautboisEchelle = [ "hautboisEchelle1",  "hautboisEchelle2", "hautboisEchelle3",
		"hautboisEchelle4", "hautboisEchelle5"];

const resevoirHautboisEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ hautboisEchelle.map(i => `${i}IN`) };
  out ... ${ hautboisEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, hautboisEchelle) }
}

const clarinettesEchelle =[ "clarinettesEchelle1",  "clarinettesEchelle2", "clarinettesEchelle3",
		"clarinettesEchelle4", "clarinettesEchelle5"];

const resevoirClarinettesEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ clarinettesEchelle.map(i => `${i}IN`) };
  out ... ${ clarinettesEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, clarinettesEchelle) }
}

const pianoEchelle =  [ "pianoEchelle1",  "pianoEchelle2", "pianoEchelle3",
		"pianoEchelle4", "pianoEchelle5"];

const resevoirPianoEchelle = hiphop module () {
  in stopReservoir;
  in ... ${ pianoEchelle.map(i => `${i}IN`) };
  out ... ${ pianoEchelle.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, pianoEchelle) }
}

const percu = [ "percu1",  "percu2", "percu3",
		"percu4", "percu5", "percu6", "percu7", "percu8", "percu9"];

const reservoirPercu = hiphop module () {
  in stopReservoir;
  in ... ${ percu.map(i => `${i}IN`) };
  out ... ${ percu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, percu) }
}

const kinetic = [ "kinetic1",  "kinetic2", "kinetic3"];

const resevoirKinetic = hiphop module () {
  in stopReservoir;
  in ... ${ kinetic.map(i => `${i}IN`) };
  out ... ${ kinetic.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, kinetic) }
}

const rise = [ "rise1", "rise2"];

const resevoirRise = hiphop module () {
  in stopReservoir;
  in ... ${ rise.map(i => `${i}IN`) };
  out ... ${ rise.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, rise) }
}


/***************************************************************************
 * L'ensemble des modules HH pour l'orchestration
 * Tout est évalué avec l'appel à setSignals
 *
 */
export function setSignals(param) {
	let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
	let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

	const sessionChromatique = hiphop module () {
	   	out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    	in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick;
		signal stopReservoirsChrom;

		host{ setTempo(120, param); }
		host{transposeAll(0, param);} 

		host{ console.log("-- DEBUT SESSION CHROMATIQUE --"); }

		fork{
			run ${reservoirPercu} () {* , stopReservoir as stopReservoirsChrom};
		}par{
			emit ctrebassesChromOUT([true, 255]);
			host{ gcs.informSelecteurOnMenuChange(255,"ctrebassesChrom", true); }
			fork{
				await count (5, ctrebassesChromIN.now);
			}par{
				await count (3, tick.now);
			}

			host{ transpose(CCTransposeViolins, 4, param);}
			emit  violonsChromOUT([true, 255]);
			emit  altosChromOUT([true, 255]);
			emit  cellosChromOUT([true, 255]);
			host{ gcs.informSelecteurOnMenuChange(255,"Chromatiques", true); }

			await count (5, ctrebassesChromIN.now);
			host{ transpose(CCTransposeViolins, 6, param);}
			emit  flutesChromOUT([true, 255]);
			emit  bassonsChromOUT([true, 255]);
			emit  clarinettesChromOUT([true, 255]);
			host{ gcs.informSelecteurOnMenuChange(255,"Flutes Chromatiques", true); }

			await count (10, violonsChromIN.now);
			host{ transpose(CCTransposeViolins, 12, param);}
			emit  violonsChromOUT([false, 255]);
			emit  altosChromOUT([false, 255]);
			emit  cellosChromOUT([false, 255]);
			emit  ctrebassesChromOUT([false, 255]);
			emit  flutesChromOUT([false, 255]);
			emit  bassonsChromOUT([false, 255]);
			emit  clarinettesChromOUT([false, 255]);
			host{ gcs.informSelecteurOnMenuChange(255,"Chromatiques", false); }
		}

		host{ 
			console.log("-- FIN SESSION CHROMATIQUE --");
		}
	}
	
	/************************************************************************************************
	Module sessionEchelle à lire avec "carto opus1.odg"
	Les transitions sont numérotées:
	-> 1 signifie en résultat de la transition 1. Ici ce sont des await sur des instruments.
	7 -> signifie création de la transition 7, via un choix possible par émission 
	d'un signal OUT sur un instrument

	Les choix sont créés à partir des signaux définis pas des noms d'instruments.
	On peut les utiliser dans toutes les sessions.
	Les choix sont des patterns avec des commandes MIDI négatives (voir le fichier csv)
	Quand il y a des choix selecteurSimple n'affiche que les choix, même s'il y a des groupes actifs.

	Dans ce module, les groupes de sons ne sont pas désactivés.

	**************************************************************************************************/
	
	/*
	const sessionEchelle = hiphop module () {
	   	out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    	in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick, setTimerDivision, patternSignal;
	
		signal stopReservoirsEchelle, stopCuivreEchelle, tickEchelle =0;

		host{ setTempo(108); }
		host{transposeAll(0, param);} // Par sécurité

		laTrappe:{
			fork{
				every(tick.now) {
					emit tickEchelle();
				}
			}par{
				every immediate (patternSignal.now){
					if (patternSignal.nowval[1] !== undefined){
						host{console.log("Opus1V2 Echelle: Pattern activé:", patternSignal.nowval[1]); }
					}
				}
			}par{
				host{ console.log("-- DEBUT SESSION ECHELLE --"); }
				emit setTimerDivision(4);
				emit cellosEchelleOUT([true, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"cellosEchelle", true); }

				fork{
					await count (4, cellosEchelleIN.now);
				}par{
					await count (3, tickEchelle.now);
				}
				// Proposition de choix
				emit AltosOUT([true, 255]); // 1->
				emit ContrebassesOUT([true, 255]); // 2->
				emit TrompettesOUT([true, 255]); // 3 ->
				host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }

				// Le premier choix qui atteint 5 votes gagne
				host{hop.broadcast('alertInfoScoreON', "Le premier choisi 5 fois gagne");}

				AtloCtbTromp:{
					fork{
						await count (5, AltosIN.now); // -> 1
						emit AltosOUT([false, 255]);
						emit ContrebassesOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						emit altosEchelleOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"altosEchelle", true); }
						await count (5, altosEchelleIN.now); // On attend qq altos

						emit violonsEchelleOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"violonsEchelle", true); }

						await count (5, violonsEchelleIN.now);
						emit BassonsOUT([true, 255]); // 7 ->
						emit TrompettesOUT([true, 255]); // 6 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break AtloCtbTromp;
					}par{
						await count (5, ContrebassesIN.now); // -> 2
						emit AltosOUT([false, 255]);
						emit ContrebassesOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						emit ctrebassesEchelleOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"ctrebassesEchelle", true); }
						await count (5, ctrebassesEchelleIN.now); // On attend qq contrebasses

						emit violonsEchelleOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"violonsEchelle", true); }

						await count (5, violonsEchelleIN.now);
						emit BassonsOUT([true, 255]); // 7 ->
						emit TrompettesOUT([true, 255]); // 6 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break AtloCtbTromp;
					}par{
						await count (5, TrompettesIN.now); // -> 3
						emit AltosOUT([false, 255]);
						emit ContrebassesOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						host {hop.broadcast('alertInfoScoreOFF');}

						run ${resevoirTrompettesEchelle} () (*, stopReservoir as stopCuivreEchelle);
						run resevoirCorsEchelle(..., stopReservoir as stopCuivreEchelle);
						emit PianoOUT([true, 255]); //  8 ->
						emit TrombonesOUT([true, 255]); //  9 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break AtloCtbTromp;
					}
				}

				// En plus des cellosEchelle.
				// Ici on a soit des altoEchelle + violonsEchelle
				// soit des contrebassesEchelle + violonsEchelle
				// soit des trompettesEchelle, 
				
				// Ici on a comme choix possibles: Bassons (7), Trompettes (6), Piano (8), Trombones (9)
				host{hop.broadcast('alertInfoScoreON', "Les 5 premiers gagnent");}

				BaTroPiTro:{
					fork{
						await count (5, BassonsIN.now); // -> 7
						emit BassonsOUT([false, 255]);
						emit PianoOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						emit bassonsEchelleOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"bassonsEchelle", true); }
						await count (5, bassonsEchelleIN.now); // On attend qq bassons

						// Choix 
						emit PianoOUT([true, 255]); // 10 ->
						emit FlutesOUT([true, 255]); // 11 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix après bassons", true); }
						break BaTroPiTro;
					}par{
						await count (5, TrompettesIN.now); // -> 6
						emit BassonsOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						emit PianoOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirTrompettesEchelle(..., stopReservoir as stopCuivreEchelle);
						run resevoirCorsEchelle(..., stopReservoir as stopCuivreEchelle);

						// Choix 
						emit PianoOUT([true, 255]); // 8 ->
						emit TrombonesOUT([true, 255]); // 9 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix après trompette", true); }
						break BaTroPiTro;
					}par{
						await count (5, PianoIN.now); // -> 8
						emit PianoOUT([false, 255]);
						emit BassonsOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirPianoEchelle(...,stopReservoir as stopReservoirsEchelle);
						run resevoirFlutesEchelle(..., stopReservoir as stopReservoirsEchelle);

						// Choix
						emit HautboisOUT([true, 255]); // 15 ->
						emit ClarinettesOUT([true, 255]); // 14 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break BaTroPiTro;
					}par{
						await count (5, TrombonesIN.now); // -> 9
						emit PianoOUT([false, 255]);
						emit BassonsOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit TrompettesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirTrombonesEchelle(..., stopReservoir as stopCuivreEchelle);

						// Choix
						emit FlutesOUT([true, 255]); // 12 ->
						emit FinOUT([true, 255]); //13 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break BaTroPiTro;
					}
				}

				// On a potentiellement ajouté bassons, flutes
				// Choix possibles bleus: piano (10, 8), flutes (11, 12), trombones (9), Fin (13), hautbois (15), clarinettes (14)
				host{hop.broadcast('alertInfoScoreON', "Nouveaux choix");}

				PiFluTroFi:{
					fork{
						await count (5, PianoIN.now); // -> 10 et 8
						emit PianoOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirPianoEchelle(...,stopReservoir as stopReservoirsEchelle);
						run resevoirFlutesEchelle(..., stopReservoir as stopReservoirsEchelle);

						// Choix
						emit HautboisOUT([true, 255]); // 15 ->
						emit ClarinettesOUT([true, 255]); // 14 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break PiFluTroFi;
					}par{
						await count (5, FlutesIN.now); // -> 11 et 12
						emit FlutesOUT([false, 255]);
						emit PianoOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirFlutesEchelle(..., stopReservoir as stopReservoirsEchelle);

						// Choix
						emit HautboisOUT([true, 255]); // 15 ->
						emit ClarinettesOUT([true, 255]); // 14 ->
						break PiFluTroFi;
					}par{
						await count (5, TrombonesIN.now); // -> 9
						emit PianoOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirTrombonesEchelle(..., stopReservoir as stopCuivreEchelle);

						// Choix
						emit FlutesOUT([true, 255]); // 12 ->
						emit FinOUT([true, 255]); // 13 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break PiFluTroFi;
					}par{
						await count (5, HautboisIN.now); // -> 15
						emit PianoOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirHautboisEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}par{
						await count (5, ClarinettesIN.now); // -> 14
						emit PianoOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}
						
						run resevoirClarinettesEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}par{
						await count (5, FinIN.now); // -> 13
						emit PianoOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit TrombonesOUT([false, 255]);
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}
				}

				// Choix possibles: haubois (15), clarinettes (14), flutes (12), fin (13)
				host{hop.broadcast('alertInfoScoreON', "Faites votre choix");}

				HaClaFluFi:{
					fork{
						await count (5, HautboisIN.now); // -> 15
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }

						run resevoirHautboisEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}par{
						await count (5, ClarinettesIN.now); // -> 14
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }

						run resevoirClarinettesEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}par{
						await count (5, FlutesIN.now); // -> 12
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirFlutesEchelle(..., stopReservoir as stopReservoirsEchelle);

						// Choix
						emit HautboisOUT([true, 255]); // 15 ->
						emit ClarinettesOUT([true, 255]); // 14 ->
						host{ gcs.informSelecteurOnMenuChange(255,"Choix", true); }
						break HaClaFluFi;
					}par{
						await count (5, FinIN.now); // -> 13
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						emit FlutesOUT([false, 255]);
						emit FinOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}
				}

				// Choix possibles : clarinettes (14), hautbois (15)
				host{hop.broadcast('alertInfoScoreON', " Clarinettes, Haubois ou fin ");}

				ClaHau:{
					fork{
						await count (5, ClarinettesIN.now); // -> 14
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirClarinettesEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}par{
						await count (5, HautboisIN.now); // -> 15
						emit HautboisOUT([false, 255]);
						emit ClarinettesOUT([false, 255]);
						host{hop.broadcast('alertInfoScoreOFF');}

						run resevoirHautboisEchelle(..., stopReservoir as stopReservoirsEchelle);
						host{ console.log("-- FIN SESSION ECHELLE --"); }
						break laTrappe;
					}
				}
			}
		}
		emit altosEchelleOUT([false, 255]);
		emit violonsEchelleOUT([false, 255]);
		emit cellosEchelleOUT([false, 255]);
		emit ctrebassesEchelleOUT([false, 255]);
		emit bassonsEchelleOUT([false, 255]);
		host{ gcs.informSelecteurOnMenuChange(255,"Fin", true); }
		host{hop.broadcast('alertInfoScoreON', "FIN");}
	}

*/


	const sessionTonale = hiphop module () {
	   	out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    	in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick, setTimerDivision, patternSignal;

		signal stopReservoirTrompettesTonal, stopReservoirKinetic;

		host{ 
			console.log("-- DEBUT SESSION TONALE --");
			gcs.setTimerDivision(4);
		}
		host{transposeAll(0, param);} // Par sécurité
		host{ setTempo(90); }

		emit  violonsTonalOUT([true, 255]);
		host{ gcs.informSelecteurOnMenuChange(255,"violonsTonal", true); }

		//host{utilsSkini.alertInfoScoreOFF();}
		//host{utilsSkini.addSceneScore(1, serveur);}
		//host{utilsSkini.addSceneScore(2, serveur);}
		host{utilsSkini.addSceneScore(3, serveur);}

		host{utilsSkini.alertInfoScoreON("Opus Tonal", serveur);}

		await count (5, violonsTonalIN.now);
		emit  cellosTonalOUT([true, 255]);
		emit  ctrebassesTonalOUT([true, 255]);
		emit  flutesTonalOUT([true, 255]);
		emit  hautboisTonalOUT([true, 255]);
		host{ gcs.informSelecteurOnMenuChange(255,"cellosTonal", true); }

		host{transposeAll(3, param);}

		fork{
			run ${resevoirTrompettesTonal} () {*, stopReservoir as stopReservoirTrompettesTonal};
		}par{
			run ${resevoirKinetic} () {*, stopReservoir as stopReservoirKinetic};
		}par{
			await count (10, violonsTonalIN.now);
			host{transposeAll(5, param);}
			emit stopReservoirTrompettesTonal();
			emit stopReservoirKinetic();
		}par{
			await count (10, cellosTonalIN.now);
			host{transposeAll(4, param);}
			emit stopReservoirTrompettesTonal();
			emit stopReservoirKinetic();
		}
		await count(5, tick.now);
		host{transposeAll(3, param);}
		await count(5, tick.now);
		host{transposeAll(2, param);}
		await count(5, tick.now);

		emit  violonsTonalOUT([false, 255]);
		emit  cellosTonalOUT([false, 255]);
		emit  ctrebassesTonalOUT([false, 255]);
		emit  flutesTonalOUT([false, 255]);
		emit  hautboisTonalOUT([false, 255]);

		host { gcs.informSelecteurOnMenuChange(255,"Tonal", false); }
		host { 
			console.log("-- FIN SESSION TONALE --");
			transposeAll(0, param);
			// Notes finales
			//oscMidiLocal.convertAndActivateClipAbleton(325);
			//oscMidiLocal.convertAndActivateClipAbleton(60);
			//oscMidiLocal.convertAndActivateClipAbleton(654);
		}
	}


/*
	const journey = hiphop module (tick, setTimerDivision, patternSignal) {
		in tick, setTimerDivision, patternSignal;
    	out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
    	in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };

		out ShostakovichOUT, MessiaenOUT, BrittenOUT;
		in ShostakovichIN, MessiaenIN, BrittenIN;

		signal choixHasard =0, theEnd;
		host{ console.log("-- DEBUT JOURNEY --"); }
		host{transposeAll(0, param);} // Par sécurité

		loop {
			host{utilsSkini.removeSceneScore(1, serveur);}
			host{utilsSkini.removeSceneScore(2, serveur);}
			host{utilsSkini.removeSceneScore(3, serveur);}

			host{utilsSkini.refreshSceneScore(serveur);}
			host{utilsSkini.addSceneScore(5, serveur);}
			host{utilsSkini.alertInfoScoreON("Messiaen, Britten ou Shostakovitch", serveur);}

			//emit MessiaenOUT([true, 255]);
			emit ShostakovichIN([true, 255]);
			//emit BrittenOUT([true, 255]);

			weakabort{ // Avec abort ça ne marche pas
				fork{
					await (ShostakovichIN.now);
					host{utilsSkini.alertInfoScoreOFF();}
					host{utilsSkini.addSceneScore(2, serveur);}
					emit ShostakovichOUT([false, 255]);
					emit MessiaenOUT([false, 255]);
					emit BrittenOUT([false, 255]);
					run ${sessionChromatique} () {*};
					//run sessionEchelle(...);
					//run sessionTonale(...);
					emit theEnd();
				}par{
					await count ( 2, MessiaenIN.now);
					host{utilsSkini.alertInfoScoreOFF();}
					host{utilsSkini.addSceneScore(1, serveur);}
					emit ShostakovichOUT([false, 255]);
					emit MessiaenOUT([false, 255]);
					emit BrittenOUT([false, 255]);
					//run sessionEchelle(...);
					//run sessionChromatique(...);
					//run sessionTonale(...);
					emit theEnd();
				}par{
					await count ( 2, BrittenIN.now);
					host{utilsSkini.alertInfoScoreOFF();}		
					host{utilsSkini.addSceneScore(3, serveur);}
					emit ShostakovichOUT([false, 255]);
					emit MessiaenOUT([false, 255]);
					emit BrittenOUT([false, 255]);
					//run sessionTonale(...);
					//run sessionChromatique(...);
					//run sessionEchelle(...);
					emit theEnd();
				}
			} when (theEnd.now);
			host{console.log("-- FIN JOURNEY --");}
			host{utilsSkini.alertInfoScoreON("FIN", serveur);}
		}
	}
*/
	const Program = hiphop module () {
		in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal, resetMatriceDesPossibles;
    	inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
	    out ... ${ interTextOUT };
    	in ... ${ interTextIN };
		signal temps=0, size;
		loop {
			abort {
				await immediate (start.now);
				host{  console.log("--Démarrage automate des possibles Opus 1V2");}
				fork {
					every immediate (tick.now){
						emit temps(temps.preval + 1); // attention à la causalité de temps, l'émettre avant de le lire
						host{ // Pour suivre le temps sur le controleur
							if (debug) {
								currentTime = Date.now();
								console.log("--Automate des possibles: tick ", temps.nowval, "intervale du tick:", currentTime - currentTimePrev );
								currentTimePrev = currentTime;
							}
							gcs.setTickOnControler(temps.nowval);
						}
					}
				}par{
					//run ${sessionChromatique} () {*};
					host{utilsSkini.addSceneScore(3, serveur);}
					run ${sessionTonale} () {*};
					//run ${journey} () {*};
				}
			} when (halt.now);
			host{
				console.log("--Arret Opus 1");
				utilsSkini.alertInfoScoreOFF(serveur);
				transposeAll(0, param);
				DAW.cleanQueues();
			}
			emit resetMatriceDesPossibles();
			emit temps(0);
		}
	}
	const prg = new ReactiveMachine(Program, "orchestration");
  	return prg;
}

