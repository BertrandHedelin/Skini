/*********************************************************************
Opus 2 et 3, 2019-2026
Pièce basée sur des patterns assez longs pour opus2, sauf pour la partie Bleue.
4 sessions possibles: Bleue, dodécaphonique, transposition limitée en DO et SOL

C'est le programme d'une orchestration complexe avec des évenemnts aléatoires.
Ici on comprend l'intérêt d'écrire en HH.
La question demeure de savoir qui
sont les compositeurs capables de gérer ce type de complexité ?

Fonctionne avec opus2 et opus3 dans Ableton.
Opus3 possède 7 clips de transistion en plus et n'utilise pas les clips de transposition d'opus2.
Charger opus2.csv ou opus3.csv

***/
'use strict'
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
const debug = false;
const debug1 = true;
let currentTimePrev = 0;
let currentTime = 0;

var socketControleur;

// Pour des transpositions par patterns, clip 407 à 414 pour transposition dans Ableton
var compteurTransInit = 407;
var compteurTrans = compteurTransInit;
var compteurTransMax = 414;
var transposition = 0;

// Pour des transposition par CC
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

const MIDITrans0369plusStrings = 415;
const MIDITrans0369minusStrings = 416;
const MIDITrans0Strings = 417;

const CCTempo = 100;
const tempoMax = 240;// Valeur fixé dans Ableton
const tempoMin = 60; // Valeur fixé dans Ableton

const opus3 = true;

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

// de -12 à +12 demi-tons avec transpose Chromatic Ableton
function transpose(CCinstrument, value, par){
	var CCTransposeValue;

	CCTransposeValue = Math.round(1.763*value + 63.5);
	oscMidiLocal.sendControlChange(par.busMidiAbleton, CCChannel, CCinstrument, CCTransposeValue);
	//if (debug1) console.log("-- Transposition instrument:", CCinstrument, "->", value, "demi-tons" );
}

function transposeAll(value, par) {
	for (var i=61; i <= 72; i++){
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

const violonsNoir = [ "violonsNoir1", "violonsNoir2", "violonsNoir3","violonsNoir4","violonsNoir5", "violonsNoir6","violonsNoir7","violonsNoir8","violonsNoir9","violonsNoir10"];
const resevoirViolonsNoir = hiphop module() {
  in stopReservoir;
  in ... ${ violonsNoir.map(i => `${i}IN`) };
  out ... ${ violonsNoir.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, violonsNoir) }
}

const cellosNoir = [ "cellosNoir1", "cellosNoir2", "cellosNoir3","cellosNoir4","cellosNoir5","cellosNoir6","cellosNoir7","cellosNoir8","cellosNoir9","cellosNoir10"];
const resevoirCellosNoir = hiphop module() {
  in stopReservoir;
  in ... ${ cellosNoir.map(i => `${i}IN`) };
  out ... ${ cellosNoir.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, cellosNoir) }
}

const pianoBleu =  [ "pianoBleu1", "pianoBleu2", "pianoBleu3","pianoBleu4","pianoBleu5","pianoBleu6","pianoBleu7","pianoBleu8","pianoBleu9","pianoBleu10"];
const resevoirPianoBleu = hiphop module() {
  in stopReservoir;
  in ... ${ pianoBleu.map(i => `${i}IN`) };
  out ... ${ pianoBleu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, pianoBleu) }
}

const pianoNoir =  [ "pianoNoir1", "pianoNoir2", "pianoNoir3","pianoNoir4"];
const resevoirPianoNoir = hiphop module() {
  in stopReservoir;
  in ... ${ pianoNoir.map(i => `${i}IN`) };
  out ... ${ pianoNoir.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, pianoNoir) }
}

const trompettesBleu = [ "trompettesBleu1", "trompettesBleu2", "trompettesBleu3","trompettesBleu4","trompettesBleu5"];
const resevoirTrompettesBleu = hiphop module() {
  in stopReservoir;
  in ... ${ trompettesBleu.map(i => `${i}IN`) };
  out ... ${ trompettesBleu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trompettesBleu) }
}

const trompettesRouge = [ "trompettesRouge1", "trompettesRouge2", "trompettesRouge3","trompettesRouge4","trompettesRouge5","trompettesRouge6"];
const resevoirTrompettesRouge = hiphop module() {
  in stopReservoir;
  in ... ${ trompettesRouge.map(i => `${i}IN`) };
  out ... ${ trompettesRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trompettesRouge) }
}

const corsBleu = [ "corsBleu1", "corsBleu2", "corsBleu3",
"corsBleu4","corsBleu5"];
const resevoirCorsBleu = hiphop module() {
  in stopReservoir;
  in ... ${ corsBleu.map(i => `${i}IN`) };
  out ... ${ corsBleu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, corsBleu) }
}

const corsRouge = [ "corsRouge1", "corsRouge2", "corsRouge3",
"corsRouge4","corsRouge5","corsRouge6"];
const resevoirCorsRouge = hiphop module() {
  in stopReservoir;
  in ... ${ corsRouge.map(i => `${i}IN`) };
  out ... ${ corsRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, corsRouge) }
}

const corsTonal = [ "corsTonal1", "corsTonal2", "corsTonal3"];
const resevoirCorsTonal = hiphop module() {
  in stopReservoir;
  in ... ${ corsTonal.map(i => `${i}IN`) };
  out ... ${ corsTonal.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, corsTonal) }
}

const trombonesRouge = [ "trombonesRouge1", "trombonesRouge2", "trombonesRouge3","trombonesRouge4","trombonesRouge5","trombonesRouge6"];
const resevoirTrombonesRouge = hiphop module() {
  in stopReservoir;
  in ... ${ trombonesRouge.map(i => `${i}IN`) };
  out ... ${ trombonesRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trombonesRouge) }
}

const trombonesTonal = [ "trombonesTonal1", "trombonesTonal2", "trombonesTonal3"];
const resevoirTrombonesTonal = hiphop module() {
  in stopReservoir;
  in ... ${ trombonesTonal.map(i => `${i}IN`) };
  out ... ${ trombonesTonal.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, trombonesTonal) }
}

const flutesRouge = [ "flutesRouge1", "flutesRouge2"];
const resevoirFlutesRouge = hiphop module() {
  in stopReservoir;
  in ... ${ flutesRouge.map(i => `${i}IN`) };
  out ... ${ flutesRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, flutesRouge) }
}

const flutesNoir =  [ "flutesNoir1", "flutesNoir2", "flutesNoir3","flutesNoir4","flutesNoir5","flutesNoir6","flutesNoir7","flutesNoir8","flutesNoir9","flutesNoir10"];
const resevoirFlutesNoir = hiphop module() {
  in stopReservoir;
  in ... ${ flutesNoir.map(i => `${i}IN`) };
  out ... ${ flutesNoir.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, flutesNoir) }
}

const clarinettesRouge = [ "clarinettesRouge1", "clarinettesRouge2"];
const resevoirClarinettesRouge = hiphop module() {
  in stopReservoir;
  in ... ${ clarinettesRouge.map(i => `${i}IN`) };
  out ... ${ clarinettesRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, clarinettesRouge) }
}
 
const hautboisRouge = ["hautboisRouge1", "hautboisRouge2"];
const resevoirHautboisRouge = hiphop module() {
  in stopReservoir;
  in ... ${ hautboisRouge.map(i => `${i}IN`) };
  out ... ${ hautboisRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, hautboisRouge) }
}

const bassonsRouge =  ["bassonsRouge1", "bassonsRouge2"];
const resevoirBassonsRouge = hiphop module() {
  in stopReservoir;
  in ... ${ bassonsRouge.map(i => `${i}IN`) };
  out ... ${ bassonsRouge.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, bassonsRouge) }
}

const bassonsNoir =[ "bassonsNoir1", "bassonsNoir2", "bassonsNoir3","bassonsNoir4","bassonsNoir5",
"bassonsNoir6","bassonsNoir7","bassonsNoir8","bassonsNoir9","bassonsNoir10"];
const resevoirBassonsNoir = hiphop module() {
  in stopReservoir;
  in ... ${ bassonsNoir.map(i => `${i}IN`) };
  out ... ${ bassonsNoir.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, bassonsNoir) }
}

const percu = [ "percu1", "percu2", "percu3"];
const resevoirPercu = hiphop module() {
  in stopReservoir;
  in ... ${ percu.map(i => `${i}IN`) };
  out ... ${ percu.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, percu) }
}

const marimba = [ "marimba1",  "marimba2", "marimba3", "marimba4" , "marimba5"];
const resevoirMarimba = hiphop module() {
  in stopReservoir;
  in ... ${ marimba.map(i => `${i}IN`) };
  out ... ${ marimba.map(i => `${i}OUT`) };
  ${ tank.makeReservoir(255, marimba) }
}

//**** LES SESSIONS 
export function setSignals(param) {
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

	// ATONAL
	const sessionBleue = hiphop module () {
		out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
		in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick, setTimerDivision, patternSignal;
		signal stopReservoir;

		host{ 
			console.log("-- DEBUT SESSION Bleue --"); 
			utilsSkini.alertInfoScoreON("SESSION Bleue", serveur);
			utilsSkini.addSceneScore(3, serveur);
			transposition = 0;
			if(opus3){
				gcs.setTimerDivision(2);
			} else {
				gcs.setTimerDivision(4);
			}
			transposeAll(0, param);
		}
		emit  cellosBleuOUT([true, 255]);
		host{ gcs.informSelecteurOnMenuChange(255,"violoncelles bleus", true); }

		fork{
			await count (2, tick.now);
			host{utilsSkini.alertInfoScoreOFF(serveur);}

		}par{
				await (cellosBleuIN.now);
				host{ transpose(CCTransposeCellos, 1, param);}
		}

		fork{
			await count (2, tick.now);
		}par{
				await (cellosBleuIN.now);
				host{ transpose(CCTransposeCellos, -5, param);}
		}

		fork{
			await count (2, tick.now);
			}par{
				await (cellosBleuIN.now);
				host{ transpose(CCTransposeCellos, -2, param);}
		}

		fork{
			await count (2, tick.now);
		}par{
				await (cellosBleuIN.now);
				host{ transpose(CCTransposeCellos, 0, param);}
		}

		seq1:{
			fork{
				run ${resevoirPianoBleu} () {*};
				break seq1;
			}par{
				every (tick.now){
					host{
						transposition = (transposition+1)% 6;
						transpose(CCTransposeCellos, transposition, param);
					}
				}
			}par{
				await count (5, cellosBleuIN.now);
				emit stopReservoir();
				break seq1;			}
		}

		host{ 
			transpose(CCTransposeCellos, 0, param);
			transposition = 0;
		}

		seq2:{
			fork{
				emit  cellosBleuOUT([false, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Violoncelles bleus", false); }
				yield;

				emit  contrebassesBleuOUT([true, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Contrebasses bleues", true); }
				await count (5, contrebassesBleuIN.now);

				emit  altosBleuOUT([true, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Altos bleues", true); }
				await count (5, altosBleuIN.now);

				emit  contrebassesBleuOUT([false, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Contrebasses bleues", false); }

				emit  violonsBleuOUT([true, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Violons bleues", true); }
				await count (5, violonsBleuIN.now);

				emit stopReservoir();
				break seq2;
			}par{
				every (tick.now){ // Transposition contrôlée par hiphop, donc au niveau du pattern complet
					host{
						transposition = (transposition+1)% 6;
						transposeAll(transposition, param);
					}
				}
			}
		}

		trans:{
			fork{
				fork{
					run ${resevoirTrompettesBleu} () {*};
				}par{
					run ${resevoirCorsBleu} () {*};
					run ${resevoirPianoBleu} () {*};
				}
				break trans;
			}par{
				every (tick.now){ 
					
					// Exemple de transposition à l'aide de clips de transposition dans Ableton
					// La transposition est faite dans des patterns activés en MIDI, ces patterns 
					// Les clip 407 à 414 dans opus2 transposent, voir dans Ableton ce qui est 
					// effectivement en place.
					// envoie des CC dans Ableton. Ce n'est pas une transposition par HipHop.
					// La différence est que dans un clip on peut commander plusieurs transpositions
					// sur la durée d'un tick. Faire ceci en hiphop nécessite de diviser le tick.

/*	    		host{
						oscMidiLocal.convertAndActivateClip(compteurTrans); 
						console.log("-- Trans par pattern (midi command):", compteurTrans, " --");
						compteurTrans++;
						if (compteurTrans > compteurTransMax){
							compteurTrans = compteurTransInit;
						}
					}*/

					// Transposition contrôlée par hiphop, avec donc une transposition par tick.
					host{
						transposition = (transposition+1)% 3;
						transposeAll(transposition, param);
					}
				}
			}
		}
		host{ gcs.informSelecteurOnMenuChange(255,"Fin", true); }
		emit  violonsBleuOUT([false, 255]);
		emit  altosBleuOUT([false, 255]);
		emit  contrebassesBleuOUT([false, 255]);
		//emit resetMatriceDesPossibles(); 
		// Nécessaire pour des reservoirs tués en cours de route et qui laissent des groupes actifs
		host{ 
			utilsSkini.alertInfoScoreON("FIN SESSION Bleue", serveur);
			console.log("-- FIN SESSION Bleue --");
			utilsSkini.removeSceneScore(3, serveur);
			DAW.cleanQueues();
		}
	}

	// Module avec des durées de pattern longues, donc moins de possibiltés d'interaction
	// réservoirs percu à ajouter
	// TLC

	const sessionRouge = hiphop module () {
		out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
		in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick, setTimerDivision, patternSignal;
		in abortSessionRouge;
		signal stopReservoir, abortTheSession, stopEveryAbort ;

		host{
			console.log("-- DEBUT SESSION Rouge --");
			utilsSkini.addSceneScore(2, serveur);
			transposition = 0;
			if(opus3){
				gcs.setTimerDivision(2);
			}else{
				gcs.setTimerDivision(16);
			}
			transposeAll(0, param);
		}
		emit violonsRouge1OUT([true, 255]);
		host{ gcs.informSelecteurOnMenuChange(255,"Violons Rouges", true); }

		fork{
			trapPourAbort: {
				fork {
					every (abortSessionRouge.now){
						host{console.log("-- depuis SESSION Noire: abortSessionRouge --", 					abortSessionRouge.nowval); }
						emit stopReservoir();
						emit abortTheSession();

						emit contrebassesRouge1OUT([false, 255]);
						emit cellosRouge1OUT([false, 255]);
						emit violonsRouge1OUT([false, 255]);

						emit violonsRouge2OUT([false, 255]);
						emit cellosRouge2OUT([false, 255]);
						emit contrebassesRouge2OUT([false, 255]);

						host{utilsSkini.removeSceneScore(2, serveur);}
					}
				}par{
					await (stopEveryAbort.now);
					break trapPourAbort;
				}
			}
		}par{
			weakabort {
				fork{
					await count (2, violonsRouge1IN.now);
				}par{
					await (tick.now);
				}
				trapTrans: {
					fork{
						trapCor:{
							fork{
								run ${resevoirCorsRouge} () {*};
							}par{
								await count (4, tick.now);
								emit stopReservoir();
								break trapCor;
							}par{
								loop{
									await (tick.now);
									host{
										transposition = (transposition+3)% 9;
										transpose(CCTransposeCors, transposition, param);
									}
								}
							}
						}
						fork{
							run ${resevoirBassonsRouge} () {*};
						}par{
							run ${resevoirFlutesRouge} () {*};
						}par{
							run ${resevoirHautboisRouge} () {*};
						}par{
							run ${resevoirClarinettesRouge} () {*};
						}par{
							await (tick.now);
							host{
								transposition = (transposition+3)% 9;
								transpose(CCTransposeClarinettes, transposition, param);
								transpose(CCTransposeFlutes, transposition, param);
								transpose(CCTransposeHaubois, transposition, param);
								transpose(CCTransposeBassons, transposition, param);
							}
						}par{
							if(opus3){
								await count (12, tick.now);
							}else{
								await count (2, tick.now);
							}
							emit stopReservoir();
						}
						//yield;
						fork{
							emit contrebassesRouge1OUT([false, 255]);
							emit cellosRouge1OUT([false, 255]);
							emit violonsRouge1OUT([false, 255]);

							emit violonsRouge2OUT([true, 255]);
							emit cellosRouge2OUT([true, 255]);
							emit contrebassesRouge2OUT([true, 255]);
						}par{
							fork{
							run ${resevoirPercu} () {*};
							}par{
								if(opus3){
									await count (12, tick.now);
								}else{
									await count (2, tick.now);
								}
								emit stopReservoir();
							}
						}
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Rouges", true); }
						await count (12, tick.now);			
						break trapTrans;
					}par{
						emit contrebassesRouge1OUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Contrebasses rouges", true); }
						emit cellosRouge1OUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Violoncelles rouges", true); }
						await count (2, cellosRouge1IN.now);
						loop{
							await (tick.now);
							host{oscMidiLocal.convertAndActivateClip(MIDITrans0369plusStrings);}
						}
					}
				}

				host{ oscMidiLocal.convertAndActivateClip(MIDITrans0Strings);}

				fork{
					run ${resevoirTrompettesRouge} () {*};
				}par{
					run ${resevoirTrombonesRouge} () {*};
				}par{
					if(opus3){
						await count (12, tick.now);
					}else{
						await count (5, tick.now);
					}
					emit stopReservoir();
				}
				emit violonsRouge2OUT([false, 255]);
				emit cellosRouge2OUT([false, 255]);
				emit contrebassesRouge2OUT([false, 255]);
				host{ gcs.informSelecteurOnMenuChange(255,"Fin", true); }
				host{ 
					utilsSkini.alertInfoScoreON("FIN SESSION Rouge", serveur);
					DAW.cleanQueues();
					utilsSkini.removeSceneScore(2, serveur);
				}
				emit stopReservoir();
				emit stopEveryAbort();
				emit abortTheSession();
			} when (abortTheSession.now);
			emit stopReservoir();
			host{
				console.log("-- FIN SESSION Rouge --"); 
				DAW.cleanQueues();
				utilsSkini.removeSceneScore(2, serveur);
			}
		}
	}

	// Session dodécaphonique à partir de reservoirs uniquement
	// Dodéca

	const sessionNoire =hiphop module () {
		out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
		in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };

		in suspendSessionNoire, abortSessionNoire, suspendSessionNoire;
		in tick, setTimerDivision, patternSignal;
		inout stopReservoir;

		host{ 
			console.log("-- DEBUT SESSION Noire --");
			utilsSkini.alertInfoScoreON("SESSION Noire", serveur);
			utilsSkini.addSceneScore(1, serveur);
			transposition = 0;
			gcs.setTimerDivision(16);
			transposeAll(0, param);
		}

		abort { // ou weakabort ?
			suspend {
				part1: {
					fork{
						fork{
							run ${resevoirPianoNoir} () {*};
						}par{
							every (tick.now){
								host{
									transposition = (transposition+1)% 6;
									transpose(CCTransposePianos, transposition, param);
								}
							}
						}par{
							await count (2, tick.now);
							run ${resevoirViolonsNoir} () {*};
						}par{
							await count (3, tick.now);
							run ${resevoirCellosNoir} () {*};
						}
					}par{
						await count (5, tick.now);
						break part1;
					}
				}
				//yield;
				trapTrans: {
					fork{
						run ${resevoirFlutesNoir} () {*};
					}par{
						run ${resevoirBassonsNoir} () {*};
					}par{
						run ${resevoirPianoNoir} () {*};
					}par{
						every (tick.now){
							host{
								transposition = (transposition+1)% 6;
								transposeAll(transposition, param);
							}
						}
					}par{
						await count (7, tick.now);
						emit stopReservoir();
						break trapTrans;
					}
				}
			} when (suspendSessionNoire.nowval === true);
		} when immediate(abortSessionNoire.now)
		emit stopReservoir(); // Si abort a tué les reservoirs avant, cet emit ne fait rien.
		host{ gcs.informSelecteurOnMenuChange(255,"Fin", true); }
		host{ console.log("-- FIN SESSION Noire --");
			utilsSkini.removeSceneScore(1, serveur);
			utilsSkini.alertInfoScoreON("FIN SESSION Noire", serveur);
		}
	}

	let aleaJaune = 0;
	// TLG

	const sessionJaune  = hiphop module () {
		out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
		in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		in tick, setTimerDivision, patternSignal;
		signal stopReservoir, stopReservoirSessionNoire;
		signal suspendSessionNoire, abortSessionNoire, abortSessionRouge, stopSustainSessionNoire;

		host{ 
			aleaJaune =  Math.floor(Math.random() * Math.floor(3));
			if (debug1) console.log("-- aleaJaune:", aleaJaune);
		}
		trapTrans: {
			fork{
				fork{
					host{ 
						console.log("-- DEBUT SESSION Jaune --");
						utilsSkini.alertInfoScoreON("SESSION Jaune", serveur);
						utilsSkini.addSceneScore(4, serveur);
						transposition = 0;
						if(opus3){
							gcs.setTimerDivision(2);
						} else {
							gcs.setTimerDivision(16);
						}
						transposeAll(0, param);
					}

					if ( aleaJaune === 0 ) {
						host{ setTempo(200, param); }
						emit cellosJauneOUT([true, 255]);
						emit contrebassesJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (5, tick.now);
						host{utilsSkini.alertInfoScoreOFF(serveur);}

						emit violonsJauneOUT([true, 255]);
						emit altosJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (5, tick.now);

					}else if( aleaJaune === 1) {
						host{ setTempo(120, param); }
						emit violonsJauneOUT([true, 255]);
						emit altosJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (5, tick.now);
						host{utilsSkini.alertInfoScoreOFF(serveur);}

						emit cellosJauneOUT([true, 255]);
						emit contrebassesJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (15, tick.now);

					}else if( aleaJaune === 2) {
						host{ setTempo(160); }
						emit contrebassesJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (2, tick.now);
						host{utilsSkini.alertInfoScoreOFF(serveur);}

						emit cellosJauneOUT([true, 255]);

						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (3, tick.now);

						emit violonsJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (5, tick.now);
						emit altosJauneOUT([true, 255]);
						host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", true); }

						await count (10, tick.now);

					}else{
						host{ console.log("aleaJaune X:", aleaJaune); }
					}

					emit cellosJauneOUT([false, 255]);
					emit contrebassesJauneOUT([false, 255]);
					emit violonsJauneOUT([false, 255]);
					emit altosJauneOUT([false, 255]);
					host{ gcs.informSelecteurOnMenuChange(255,"Cordes Jaunes", false); }

					host{console.log("-- FIN SESSION Jaune --");}
					host{utilsSkini.removeSceneScore(4, serveur);}
					host{DAW.cleanQueues();}
		
					emit suspendSessionNoire(false);
					emit stopReservoirSessionNoire();
					//yield;
					emit abortSessionNoire();

					emit abortSessionRouge();
					break trapTrans;

				// Les patterns pivots	
				/*}par{

					// Avec l'every qui suit, on émet jamais abortSessionNoire. Pourquoi ?
					// Eh bien, voici la réponse: Run sessionNoire doit se terminer pour traiter de nouveau
					// patternSignal.now. On passera donc jamais dans le else if, ou du moins il sera sans effet puisque
					// sessionNoire sera déjà terminée.

					every (patternSignal.now){ // On ne reçoit jamais le signal abortSessionNoire dans le module sessionNoire
						if (patternSignal.nowval[1] === "VioloncelleJaune1") {
							host{console.log("Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
							run sessionNoire(...);  // On doit attendre la fin de sessionNoire pour passer au prochain every !!!
						}
						else if (patternSignal.nowval[1] === "ContrebasseJaune2") {
							host{console.log("Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
							emit abortSessionNoire(1);
						}
					}*/

				/* Voici un secénario qui fonctionne mais qui interompt facilement session noire.
				}par{
					every (patternSignal.now && 
							(patternSignal.nowval[1] === "VioloncelleJaune1"
							|| patternSignal.nowval[1] === "VioloncelleJaune3"
							|| patternSignal.nowval[1] === "VioloncelleJaune6")) {
						host{console.log("Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
						run sessionNoire(...);
					}
				}par{
					every count (3, (patternSignal.now && patternSignal.nowval[1] === "ContrebasseJaune2")) {
						host{console.log("Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
						emit abortSessionNoire(1);
					}
				}
				*/

				// Une façon d'introduire sessionNoire ou sessionRouge dans sessionJaune selon des occurences de patterns.
				}par{
					loop {
						await (patternSignal.now && 
							(patternSignal.nowval[1] === "VioloncelleJaune1"
							|| patternSignal.nowval[1] === "VioloncelleJaune3"
							|| patternSignal.nowval[1] === "VioloncelleJaune6"));
						host{console.log("--- Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
						fork{
							if (aleaJaune > 1){
								run ${sessionRouge} () {*};
							} else {
								fork{
									run ${sessionNoire} () {*, stopReservoir as stopReservoirSessionNoire};
								}par{
									fork{
										await (patternSignal.now && 
											(patternSignal.nowval[1] === "VioloncelleJaune2"
											|| patternSignal.nowval[1] === "VioloncelleJaune4"
											|| patternSignal.nowval[1] === "VioloncelleJaune5"));
										host{console.log("--- Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
										host{console.log("--- Opus2: session Jaune: Suspend Session Noire"); }
										emit suspendSessionNoire(true);									
									}par{
										await count (5, (patternSignal.now && patternSignal.nowval[1] === "ContrebasseJaune1"));
										host{console.log("--- Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
										host{console.log("--- Opus2: session Jaune: FIN Suspend Session Noire"); }
										emit suspendSessionNoire(false);
									}
								}
							}
						}par{
							await count (5, (patternSignal.now && patternSignal.nowval[1] === "ContrebasseJaune2"));
							host{console.log("--- Opus2: session Jaune: Pattern activé:", patternSignal.nowval[1]); }
							emit suspendSessionNoire(false);
							emit stopReservoirSessionNoire(); // Il faut tuer les réservoirs avant abort
							emit abortSessionNoire(1);
							emit abortSessionRouge(1);
						}
					}
				}
			}par{
				every (tick.now){
						host{
							transposition = (transposition+1)% 6;
							transposeAll(transposition, param);
						}
				}
			}
		}
		host{
			utilsSkini.alertInfoScoreON("FIN SESSION Jaune", serveur);
			utilsSkini.removeSceneScore(4, serveur);
			DAW.cleanQueues();
		}
	}

	let choiceRandom = 0;
	const journey = hiphop module () {
		out ... ${ utilsSkini.creationInterfacesOUT(param.groupesDesSons) };
		in ... ${ utilsSkini.creationInterfacesIN(param.groupesDesSons) };
		out setComputeScoreClass;
		out setComputeScorePolicy;
		in tick, setTimerDivision, patternSignal;
		signal choixHasard =0, theEnd, stopReservoir;

		// ON a besoin de ces signaux pour être cohérent avec l'utilisation de la session noire dans un autre module.
		signal suspendSessionNoire, abortSessionNoire, abortSessionRouge;

		host{ console.log("-- DEBUT JOURNEY --"); }
		loop {
			yield;

			host{utilsSkini.removeSceneScore(1, serveur);}
			host{utilsSkini.removeSceneScore(2, serveur);}
			host{utilsSkini.removeSceneScore(3, serveur);}
			host{utilsSkini.removeSceneScore(4, serveur);}
			host{utilsSkini.refreshSceneScore(serveur);}

			choiceRandom = Math.random();
			//choiceRandom = 0.1;

			host{console.log("-- Journey random:", choiceRandom);}

			if (choiceRandom <= 0.25) {
				host{utilsSkini.alertInfoScoreOFF(serveur);}
				host{ setTempo(100, param); }
				
				// Polytonalités complexes, ça met la panique entre les timerDivisions
				fork{
					//run ${sessionNoire} () {*}; // Dodéca
				} par {
					//run ${sessionJaune} () {*}; // TLG
				} par {
					run ${sessionRouge} () {*}; // TLC
				}

			} else if (choiceRandom <= 0.50) {
				host{ setTempo(50, param); }	
				host{utilsSkini.alertInfoScoreOFF(serveur);}
				run ${sessionRouge} () {*}; // TLC
			}else if (choiceRandom <= 0.75) {
				emit setTimerDivision(4); // 4 noires = 1 mesure
				host{ setTempo(50, param); }
				host{ transposeAll(0, param); } 
				host{utilsSkini.alertInfoScoreOFF(serveur);}		
				run ${sessionBleue} () {*}; // Atonal
			} else {
				host{utilsSkini.alertInfoScoreOFF(serveur);}		
				run ${sessionJaune} () {*}; // TLG + Dodeca ou rouge
			}
			host{
				console.log("-- FIN JOURNEY, ON RECOMMENCE--");
				DAW.cleanQueues();
				oscMidiLocal.convertAndActivateClip(300); // Commande d'arrêt global Ableton
				} 
			host{utilsSkini.alertInfoScoreON("FIN", serveur);}
		}
	}

	const Program = hiphop module () {
		in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal, resetMatriceDesPossibles;
		out setComputeScoreClass, setComputeScorePolicy;
		out ... ${ interTextOUT };
		in ... ${ interTextIN };
		signal temps=0, size;
		loop{
			abort{
				await immediate (start.now);
				host{ console.log("--Démarrage automate des possibles Opus2");}
				fork{
					every immediate (tick.now){
						emit temps(temps.preval + 1);
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
					run ${journey} () {*};
				}par{
					if(debug){
						every immediate (patternSignal.now){
							if (patternSignal.nowval[1] !== undefined){
								host{console.log("Opus2: Pattern activé:", patternSignal.nowval[1]); }
							}
						}
					}
				}
			host{
				console.log("--Arret d'Automate Opus 2");
				DAW.cleanQueues();
				oscMidiLocal.convertAndActivateClip(300); // Commande d'arrêt global Ableton
			}
			emit temps(0);
			} when (halt.now);
			host{
				console.log("-- STOP Opus 2");
				DAW.cleanQueues();
				oscMidiLocal.convertAndActivateClip(300); // Commande d'arrêt global Ableton
			}
		}
	}
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}