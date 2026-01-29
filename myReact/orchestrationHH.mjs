import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';import * as tank from '../pieces/util/makeReservoir.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let signals=undefined;
let debug=false;
let debug1=true;
var currentTimePrev=0;
var currentTime=0;
const CCChannel=1;
const CCTransposeViolins=61;
const CCTransposeAltos=62;
const CCTransposeCellos=63;
const CCTransposeCtreBasses=64;
const CCTransposeTrompettes=65;
const CCTransposeCors=66;
const CCTransposeTrombones=67;
const CCTransposeFlutes=68;
const CCTransposeHaubois=69;
const CCTransposeClarinettes=70;
const CCTransposeBassons=71;
const CCTransposePianos=72;
const CCTempo=100;
const tempoMax=160;
const tempoMin=60;
const setTempo = function (value,par) {
if (midimix.getAbletonLinkStatus()) {
if (debug) console.log('Opus4 : set tempo Link:',value);
midimix.setTempoLink(value);return undefined;
}
if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
let tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) console.log('Set tempo:',value);
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCTempo,tempo);};const transpose = function (CCinstrument,value,par) {
let CCTransposeValue=undefined;
CCTransposeValue=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCinstrument,CCTransposeValue);if (debug) console.log('-- Transposition instrument:',CCinstrument,'->',value,'demi-tons');
};const transposeAll = function (value,par) {
for (let i=61;i <= 74;i++) {
transpose(i,value,par);}
};const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug1) console.log('-- HH_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};const trompettesEchelle=['trompettesEchelle1','trompettesEchelle2','trompettesEchelle3','trompettesEchelle4'];
const resevoirTrompettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3182},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3195},'direction':'IN','name':'stopReservoir'}),trompettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3218},'direction':'IN','name':n});
}),trompettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3271},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3321},'%tag':'dollar'},tank.makeReservoir(255,trompettesEchelle)));
const trompettesTonal=['trompettesTonal1','trompettesTonal2','trompettesTonal3'];
const resevoirTrompettesTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3501},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3515},'direction':'IN','name':'stopReservoir'}),trompettesTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3538},'direction':'IN','name':n});
}),trompettesTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3589},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3637},'%tag':'dollar'},tank.makeReservoir(255,trompettesTonal)));
const corsEchelle=['corsEchelle1','corsEchelle2','corsEchelle3','corsEchelle4','corsEchelle5','corsEchelle6','corsEchelle7'];
const resevoirCorsEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3858},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3872},'direction':'IN','name':'stopReservoir'}),corsEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3895},'direction':'IN','name':n});
}),corsEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3942},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3986},'%tag':'dollar'},tank.makeReservoir(255,corsEchelle)));
const trombonesEchelle=['trombonesEchelle1','trombonesEchelle2','trombonesEchelle3','trombonesEchelle4','trombonesEchelle5','trombonesEchelle6','trombonesEchelle7'];
const resevoirTrombonesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4249},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4263},'direction':'IN','name':'stopReservoir'}),trombonesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4286},'direction':'IN','name':n});
}),trombonesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4338},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4387},'%tag':'dollar'},tank.makeReservoir(255,trombonesEchelle)));
const flutesEchelle=['flutesEchelle1','flutesEchelle2','flutesEchelle3','flutesEchelle4','flutesEchelle5'];
const resevoirFlutesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4594},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4608},'direction':'IN','name':'stopReservoir'}),flutesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4631},'direction':'IN','name':n});
}),flutesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4680},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4726},'%tag':'dollar'},tank.makeReservoir(255,flutesEchelle)));
const hautboisEchelle=['hautboisEchelle1','hautboisEchelle2','hautboisEchelle3','hautboisEchelle4','hautboisEchelle5'];
const resevoirHautboisEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4945},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4959},'direction':'IN','name':'stopReservoir'}),hautboisEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4982},'direction':'IN','name':n});
}),hautboisEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5033},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5081},'%tag':'dollar'},tank.makeReservoir(255,hautboisEchelle)));
const clarinettesEchelle=['clarinettesEchelle1','clarinettesEchelle2','clarinettesEchelle3','clarinettesEchelle4','clarinettesEchelle5'];
const resevoirClarinettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5322},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5336},'direction':'IN','name':'stopReservoir'}),clarinettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5359},'direction':'IN','name':n});
}),clarinettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5413},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5464},'%tag':'dollar'},tank.makeReservoir(255,clarinettesEchelle)));
const pianoEchelle=['pianoEchelle1','pianoEchelle2','pianoEchelle3','pianoEchelle4','pianoEchelle5'];
const resevoirPianoEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5668},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5682},'direction':'IN','name':'stopReservoir'}),pianoEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5705},'direction':'IN','name':n});
}),pianoEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5753},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5798},'%tag':'dollar'},tank.makeReservoir(255,pianoEchelle)));
const percu=['percu1','percu2','percu3','percu4','percu5','percu6','percu7','percu8','percu9'];
const reservoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5987},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6001},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6024},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6065},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6103},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const kinetic=['kinetic1','kinetic2','kinetic3'];
const resevoirKinetic=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6230},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6244},'direction':'IN','name':'stopReservoir'}),kinetic.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6267},'direction':'IN','name':n});
}),kinetic.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6310},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6350},'%tag':'dollar'},tank.makeReservoir(255,kinetic)));
const rise=['rise1','rise2'];
const resevoirRise=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6454},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6468},'direction':'IN','name':'stopReservoir'}),rise.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6491},'direction':'IN','name':n});
}),rise.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6531},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6568},'%tag':'dollar'},tank.makeReservoir(255,rise)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const sessionChromatique=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7010},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7032},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7105},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7173},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7186},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7193},'name':'stopReservoirsChrom'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7219},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7253},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7287},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);utilsSkini.removeSceneScore(3,serveur);utilsSkini.addSceneScore(2,serveur);utilsSkini.alertInfoScoreON('OPUS1 CHROMATIQUE',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7507},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION CHROMATIQUE --');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7568},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7580},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7580},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7580},'%tag':'run','autocomplete':true,'stopReservoirsChrom':'stopReservoir','module':reservoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7654},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7670},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7709},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'ctrebassesChrom',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7785},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7799},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7847},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7860},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7895},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7955},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8015},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8057},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8097},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8132},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8206},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8252},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,6,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8312},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8353},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8395},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8435},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Flutes Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8516},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsChromIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8560},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,12,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8621},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8664},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8705},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8747},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8793},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8835},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8878},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8919},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',false);}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8998},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION CHROMATIQUE --');utilsSkini.alertInfoScoreON('FIN Chromatique',serveur);DAW.cleanQueues();}})));
const sessionEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10000},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10022},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10095},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10163},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10163},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10163},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10210},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10217},'name':'stopReservoirsEchelle'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10240},'name':'stopCuivreEchelle'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10259},'name':'tickEchelle','init_func':function () {
return 0;
}}),(function () {
let nbeDeChoix=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10279},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10283},'%tag':'hop','apply':function () {
nbeDeChoix=2;}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10304},'%tag':'pragma','apply':function () {
setTempo(108);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10329},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10379},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);utilsSkini.removeSceneScore(3,serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('OPUS1 ECHELLE',serveur);}}),$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10595},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10612},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10626},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10659},'%tag':'EMIT','signame':'tickEchelle'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10704},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('patternSignal','now')},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10751},'%tag':'if','apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.nowval[1] !== undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10807},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('Opus1V2 Echelle: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10917},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10930},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION ECHELLE 1--');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10996},'%tag':'EMIT','signame':'setTimerDivision','apply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11030},'%tag':'EMIT','signame':'cellosEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11069},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'cellosEchelle',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11146},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11162},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosEchelleIN','now'),'countapply':function () {
return 4;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11209},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11224},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tickEchelle','now'),'countapply':function () {
return 3;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11268},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11369},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11412},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11462},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11506},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11628},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Alto, Contrebasse ou Trompette',serveur);}}),$$hiphop.TRAP({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11715},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11740},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11740},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11758},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('AltosIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11822},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11863},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11911},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11952},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12015},'%tag':'EMIT','signame':'altosEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12057},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'altosEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12136},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('altosEchelleIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12213},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12257},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12339},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12404},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12454},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12502},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12580},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12605},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12622},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ContrebassesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12693},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12734},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12782},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12823},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12886},'%tag':'EMIT','signame':'ctrebassesEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12933},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'ctrebassesEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13017},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13115},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13159},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13241},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13306},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13356},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13404},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13482},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13507},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13524},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrompettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13593},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13634},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13682},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13723},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13782},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13782},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13782},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrompettesEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13871},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13871},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13871},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirCorsEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13959},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14008},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14056},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14134},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14469},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Bassons (7), Trompettes (6), Piano (8), Trombones (9)',serveur);}}),$$hiphop.TRAP({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14578},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14601},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14601},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14619},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('BassonsIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14685},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14728},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14769},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14815},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14855},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14918},'%tag':'EMIT','signame':'bassonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14962},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'bassonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15043},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('bassonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15154},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15203},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15248},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix après bassons',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15340},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15363},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15380},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrompettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15449},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15492},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15538},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15579},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15619},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15677},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15677},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15677},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrompettesEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15766},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15766},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15766},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirCorsEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15876},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15924},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15971},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix après trompette',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16065},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16088},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16105},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('PianoIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16169},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16210},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16253},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16299},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16339},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16397},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16397},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16397},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirPianoEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16484},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16484},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16484},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16599},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16651},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16701},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16778},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16801},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16818},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrombonesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16886},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16927},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16970},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17015},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17056},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17114},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17114},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17114},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrombonesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17229},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17279},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17320},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17398},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17619},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Piano (10, 8), flutes (11, 12), trombones (9), Fin (13), hautbois (15), clarinettes (14)',serveur);}}),$$hiphop.TRAP({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17764},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17787},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17787},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17805},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('PianoIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17875},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17916},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17958},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18003},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18047},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18094},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18128},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18186},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18186},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18186},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirPianoEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18273},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18273},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18273},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18389},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18441},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18491},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18569},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18592},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18609},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FlutesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18681},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18723},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18764},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18809},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18853},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18900},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18934},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18992},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18992},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18992},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19108},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19160},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19216},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19239},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19256},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrombonesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19324},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19365},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19407},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19452},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19496},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19543},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19577},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19635},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19635},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19635},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrombonesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19750},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19800},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19842},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19920},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19943},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19960},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20028},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20069},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20111},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20156},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20200},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20247},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20281},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20339},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20339},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20339},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20430},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20498},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20519},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20536},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20607},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20648},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20690},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20735},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20779},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20826},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20860},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20918},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20918},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20918},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21012},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21080},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21101},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21118},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FinIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21181},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21222},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21264},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21309},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21353},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21400},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21434},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21492},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21560},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21660},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Haubois (15), clarinettes (14), flutes (12), fin (13)',serveur);}}),$$hiphop.TRAP({'HaClaFluFi':'HaClaFluFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21770},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21793},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21793},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21811},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21879},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21923},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21970},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22012},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22046},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22104},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22177},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22177},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22177},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22268},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22336},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22357},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22374},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22445},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22489},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22536},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22578},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22612},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22670},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22743},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22743},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22743},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22837},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22905},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22926},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22943},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FlutesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23009},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23053},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23100},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23142},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23176},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23234},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23234},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23234},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23350},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23402},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23452},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'HaClaFluFi':'HaClaFluFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23530},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23553},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23570},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FinIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23633},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23677},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23724},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23766},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23800},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23858},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23926},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24028},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Clarinettes (14), Hautbois (15)',serveur);}}),$$hiphop.TRAP({'ClaHau':'ClaHau','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24115},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24134},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24134},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24152},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24223},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24267},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24309},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24367},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24367},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24367},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24461},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24529},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24550},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24567},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24635},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24679},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24721},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24779},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24779},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24779},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24870},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24938},'%tag':'EXIT'}))))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24993},'%tag':'EMIT','signame':'altosEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25033},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25075},'%tag':'EMIT','signame':'cellosEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25116},'%tag':'EMIT','signame':'ctrebassesEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25161},'%tag':'EMIT','signame':'bassonsEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25198},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25260},'%tag':'pragma','apply':function () {
DAW.cleanQueues();console.log('-- FIN --');utilsSkini.alertInfoScoreON('FIN ECHELLE',serveur);}}));
})()));
const sessionTonale=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25424},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25446},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25519},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25587},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25587},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25587},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25634},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25641},'name':'stopReservoirTrompettesTonal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25671},'name':'stopReservoirKinetic'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25698},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION TONALE --');utilsSkini.alertInfoScoreON('OPUS1 TONAL',serveur);gcs.setTimerDivision(4);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25853},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25903},'%tag':'pragma','apply':function () {
setTempo(90);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25929},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);utilsSkini.removeSceneScore(1,serveur);utilsSkini.addSceneScore(3,serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26090},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26124},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsTonal',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26195},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26242},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26281},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26324},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26363},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26398},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'cellosTonal',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26469},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26504},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26516},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26516},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26516},'%tag':'run','autocomplete':true,'stopReservoirTrompettesTonal':'stopReservoir','module':resevoirTrompettesTonal,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26618},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26618},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26618},'%tag':'run','autocomplete':true,'stopReservoirKinetic':'stopReservoir','module':resevoirKinetic,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26693},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26704},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26748},'%tag':'pragma','apply':function () {
transposeAll(5,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26789},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26832},'%tag':'EMIT','signame':'stopReservoirKinetic'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26861},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26872},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26915},'%tag':'pragma','apply':function () {
transposeAll(4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26956},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26999},'%tag':'EMIT','signame':'stopReservoirKinetic'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27028},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27039},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27070},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27125},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27155},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27205},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27239},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27269},'%tag':'pragma','apply':function () {
transposeAll(2,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27303},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27340},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27381},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27421},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27465},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27505},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27542},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Tonal',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27608},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION TONALE --');utilsSkini.alertInfoScoreON('FIN TONAL',serveur);transposeAll(0,param);DAW.cleanQueues();}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28003},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28019},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28135},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28135},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28135},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28135},'direction':'INOUT','name':'stopTransposition'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28210},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28241},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28267},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28274},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28283},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28293}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28306},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus 1',serveur);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28366},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28382},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28419},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus 1V2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28495},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28512},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28557},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28659},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29058},'%tag':'par'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29073},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29073},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29073},'%tag':'run','autocomplete':true,'module':sessionChromatique,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29117},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29117},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29117},'%tag':'run','autocomplete':true,'module':sessionTonale,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29156},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29156},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29156},'%tag':'run','autocomplete':true,'module':sessionEchelle,'%frame':__frame}));
})([])))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29227},'%tag':'pragma','apply':function () {
console.log('--Arret Opus 1');utilsSkini.alertInfoScoreON('Stop Opus 4',serveur);transposeAll(0,param);DAW.cleanQueues();}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29460},'%tag':'EMIT','signame':'resetMatriceDesPossibles'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':29499},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
