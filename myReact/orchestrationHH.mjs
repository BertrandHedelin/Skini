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
const resevoirTrompettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3283},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3297},'direction':'IN','name':'stopReservoir'}),trompettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3321},'direction':'IN','name':n});
}),trompettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3375},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3426},'%tag':'dollar'},tank.makeReservoir(255,trompettesEchelle)));
const trompettesTonal=['trompettesTonal1','trompettesTonal2','trompettesTonal3'];
const resevoirTrompettesTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3611},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3626},'direction':'IN','name':'stopReservoir'}),trompettesTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3650},'direction':'IN','name':n});
}),trompettesTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3702},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3751},'%tag':'dollar'},tank.makeReservoir(255,trompettesTonal)));
const corsEchelle=['corsEchelle1','corsEchelle2','corsEchelle3','corsEchelle4','corsEchelle5','corsEchelle6','corsEchelle7'];
const resevoirCorsEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3976},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3991},'direction':'IN','name':'stopReservoir'}),corsEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4015},'direction':'IN','name':n});
}),corsEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4063},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4108},'%tag':'dollar'},tank.makeReservoir(255,corsEchelle)));
const trombonesEchelle=['trombonesEchelle1','trombonesEchelle2','trombonesEchelle3','trombonesEchelle4','trombonesEchelle5','trombonesEchelle6','trombonesEchelle7'];
const resevoirTrombonesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4375},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4390},'direction':'IN','name':'stopReservoir'}),trombonesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4414},'direction':'IN','name':n});
}),trombonesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4467},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4517},'%tag':'dollar'},tank.makeReservoir(255,trombonesEchelle)));
const flutesEchelle=['flutesEchelle1','flutesEchelle2','flutesEchelle3','flutesEchelle4','flutesEchelle5'];
const resevoirFlutesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4728},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4743},'direction':'IN','name':'stopReservoir'}),flutesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4767},'direction':'IN','name':n});
}),flutesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4817},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4864},'%tag':'dollar'},tank.makeReservoir(255,flutesEchelle)));
const hautboisEchelle=['hautboisEchelle1','hautboisEchelle2','hautboisEchelle3','hautboisEchelle4','hautboisEchelle5'];
const resevoirHautboisEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5087},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5102},'direction':'IN','name':'stopReservoir'}),hautboisEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5126},'direction':'IN','name':n});
}),hautboisEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5178},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5227},'%tag':'dollar'},tank.makeReservoir(255,hautboisEchelle)));
const clarinettesEchelle=['clarinettesEchelle1','clarinettesEchelle2','clarinettesEchelle3','clarinettesEchelle4','clarinettesEchelle5'];
const resevoirClarinettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5472},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5487},'direction':'IN','name':'stopReservoir'}),clarinettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5511},'direction':'IN','name':n});
}),clarinettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5566},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5618},'%tag':'dollar'},tank.makeReservoir(255,clarinettesEchelle)));
const pianoEchelle=['pianoEchelle1','pianoEchelle2','pianoEchelle3','pianoEchelle4','pianoEchelle5'];
const resevoirPianoEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5826},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5841},'direction':'IN','name':'stopReservoir'}),pianoEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5865},'direction':'IN','name':n});
}),pianoEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5914},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5960},'%tag':'dollar'},tank.makeReservoir(255,pianoEchelle)));
const percu=['percu1','percu2','percu3','percu4','percu5','percu6','percu7','percu8','percu9'];
const reservoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6153},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6168},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6192},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6234},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6273},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const kinetic=['kinetic1','kinetic2','kinetic3'];
const resevoirKinetic=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6405},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6420},'direction':'IN','name':'stopReservoir'}),kinetic.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6444},'direction':'IN','name':n});
}),kinetic.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6488},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6529},'%tag':'dollar'},tank.makeReservoir(255,kinetic)));
const rise=['rise1','rise2'];
const resevoirRise=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6638},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6653},'direction':'IN','name':'stopReservoir'}),rise.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6677},'direction':'IN','name':n});
}),rise.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6718},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6756},'%tag':'dollar'},tank.makeReservoir(255,rise)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const sessionChromatique=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7207},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7229},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7303},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7370},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7382},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7389},'name':'stopReservoirsChrom'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7415},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7448},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7484},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION CHROMATIQUE --');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7545},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7555},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7555},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7555},'%tag':'run','autocomplete':true,'stopReservoirsChrom':'stopReservoir','module':reservoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7628},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7642},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7679},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'ctrebassesChrom',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7753},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7764},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7819},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7858},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7916},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7956},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7994},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8027},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8100},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8144},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,6,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8202},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8241},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8281},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8319},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Flutes Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8399},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsChromIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8441},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,12,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8500},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8541},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8580},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8620},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8664},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8704},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8745},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8784},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',false);}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8862},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION CHROMATIQUE --');}})));
const sessionEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9673},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9695},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9769},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9836},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9836},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9836},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9884},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9891},'name':'stopReservoirsEchelle'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9914},'name':'stopCuivreEchelle'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9933},'name':'tickEchelle','init_func':function () {
return 0;
}}),(function () {
let nbeDeChoix=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9952},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9956},'%tag':'hop','apply':function () {
nbeDeChoix=2;}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':9977},'%tag':'pragma','apply':function () {
setTempo(108);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10001},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10052},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10067},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10078},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10107},'%tag':'EMIT','signame':'tickEchelle'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10144},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('patternSignal','now')},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10187},'%tag':'if','apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.nowval[1] !== undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10238},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('Opus1V2 Echelle: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10339},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10349},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION ECHELLE --');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10411},'%tag':'EMIT','signame':'setTimerDivision','apply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10442},'%tag':'EMIT','signame':'cellosEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10478},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'cellosEchelle',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10553},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10565},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosEchelleIN','now'),'countapply':function () {
return 4;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10620},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tickEchelle','now'),'countapply':function () {
return 3;
}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10702},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10742},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10789},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10830},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':10946},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Alto, Contrebasse ou Trompette',serveur);}}),$$hiphop.TRAP({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11031},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11052},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11052},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11065},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('AltosIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11124},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11160},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11203},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11239},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11298},'%tag':'EMIT','signame':'altosEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11335},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'altosEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11409},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('altosEchelleIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11482},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11521},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11599},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11659},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11704},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11747},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11820},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11841},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11853},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ContrebassesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11919},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11955},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':11998},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12034},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12093},'%tag':'EMIT','signame':'ctrebassesEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12135},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'ctrebassesEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12214},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12308},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12347},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12425},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12485},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12530},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12573},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12646},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12667},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12679},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrompettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12743},'%tag':'EMIT','signame':'AltosOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12779},'%tag':'EMIT','signame':'ContrebassesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12822},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12858},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12913},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12913},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12913},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrompettesEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12997},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12997},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':12997},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirCorsEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13080},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13124},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13167},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'AtloCtbTromp':'AtloCtbTromp','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13240},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13557},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Bassons (7), Trompettes (6), Piano (8), Trombones (9)',serveur);}}),$$hiphop.TRAP({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13663},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13682},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13682},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13695},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('BassonsIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13756},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13794},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13830},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13871},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13906},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':13965},'%tag':'EMIT','signame':'bassonsEchelleOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14004},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'bassonsEchelle',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14080},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('bassonsEchelleIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14183},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14227},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14267},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix après bassons',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14354},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14373},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14385},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrompettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14449},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14487},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14528},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14564},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14599},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14653},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14653},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14653},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrompettesEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14737},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14737},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14737},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirCorsEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14839},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14882},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':14924},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix après trompette',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15013},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15032},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15044},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('PianoIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15103},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15139},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15177},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15218},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15253},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15307},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15307},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15307},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirPianoEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15389},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15389},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15389},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15495},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15542},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15587},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15659},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15678},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15690},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrombonesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15753},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15789},'%tag':'EMIT','signame':'BassonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15827},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15867},'%tag':'EMIT','signame':'TrompettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15903},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15957},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15957},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':15957},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrombonesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16063},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16108},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16144},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'BaTroPiTro':'BaTroPiTro','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16217},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16423},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Piano (10, 8), flutes (11, 12), trombones (9), Fin (13), hautbois (15), clarinettes (14)',serveur);}}),$$hiphop.TRAP({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16566},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16585},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16585},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16598},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('PianoIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16663},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16699},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16736},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16776},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16815},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16857},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16886},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16940},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16940},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':16940},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirPianoEchelle,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17022},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17022},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17022},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17129},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17176},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17221},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17294},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17313},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17325},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FlutesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17392},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17429},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17465},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17505},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17544},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17586},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17615},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17669},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17669},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17669},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17776},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17823},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17874},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17893},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17905},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('TrombonesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':17968},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18004},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18041},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18081},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18120},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18162},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18191},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18245},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18245},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18245},'%tag':'run','autocomplete':true,'stopCuivreEchelle':'stopReservoir','module':resevoirTrombonesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18351},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18396},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18433},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'PiFluTroFi':'PiFluTroFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18506},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18525},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18537},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18600},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18636},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18673},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18713},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18752},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18794},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18823},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18877},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18877},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18877},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':18963},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19026},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19043},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19055},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19121},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19157},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19194},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19234},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19273},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19315},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19344},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19404},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19404},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19404},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19493},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19556},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19573},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19585},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FinIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19643},'%tag':'EMIT','signame':'PianoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19679},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19716},'%tag':'EMIT','signame':'TrombonesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19756},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19795},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19837},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19866},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19920},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':19983},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20071},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Haubois (15), clarinettes (14), flutes (12), fin (13)',serveur);}}),$$hiphop.TRAP({'HaClaFluFi':'HaClaFluFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20179},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20198},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20198},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20211},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20274},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20313},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20355},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20392},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20421},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20475},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20544},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20544},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20544},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20630},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20693},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20710},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20722},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20788},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20827},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20869},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20906},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20935},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':20989},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21058},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21058},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21058},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21147},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21210},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21227},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21239},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FlutesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21300},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21339},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21381},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21418},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21447},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21501},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21501},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21501},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirFlutesEchelle,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21608},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21655},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21700},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Choix',true);}}),$$hiphop.EXIT({'HaClaFluFi':'HaClaFluFi','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21773},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21792},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21804},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('FinIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21862},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21901},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21943},'%tag':'EMIT','signame':'FlutesOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':21980},'%tag':'EMIT','signame':'FinOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22009},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22063},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22126},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22216},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Clarinettes (14), Hautbois (15)',serveur);}}),$$hiphop.TRAP({'ClaHau':'ClaHau','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22300},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22315},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22315},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22328},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ClarinettesIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22394},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22433},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22470},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22524},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22524},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22524},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirClarinettesEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22613},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22676},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22693},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22705},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('HautboisIN','now'),'countapply':function () {
return nbeDeChoix;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22768},'%tag':'EMIT','signame':'HautboisOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22807},'%tag':'EMIT','signame':'ClarinettesOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22844},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22898},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22898},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22898},'%tag':'run','autocomplete':true,'stopReservoirsEchelle':'stopReservoir','module':resevoirHautboisEchelle,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22984},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION ECHELLE --');}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23047},'%tag':'EXIT'}))))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23091},'%tag':'EMIT','signame':'altosEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23130},'%tag':'EMIT','signame':'violonsEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23171},'%tag':'EMIT','signame':'cellosEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23211},'%tag':'EMIT','signame':'ctrebassesEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23255},'%tag':'EMIT','signame':'bassonsEchelleOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23291},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23353},'%tag':'pragma','apply':function () {
DAW.cleanQueues();console.log('-- FIN --');utilsSkini.alertInfoScoreON('FIN',serveur);}}));
})()));
const sessionTonale=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23503},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23525},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23599},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23666},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23666},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23666},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23713},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23720},'name':'stopReservoirTrompettesTonal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23750},'name':'stopReservoirKinetic'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23777},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION TONALE --');gcs.setTimerDivision(4);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23868},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23917},'%tag':'pragma','apply':function () {
setTempo(90);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23950},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23983},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsTonal',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24196},'%tag':'pragma','apply':function () {
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24310},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus Tonal',serveur);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24373},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24419},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24457},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24499},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24537},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24571},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'cellosTonal',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24642},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24677},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24687},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24687},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24687},'%tag':'run','autocomplete':true,'stopReservoirTrompettesTonal':'stopReservoir','module':resevoirTrompettesTonal,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24786},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24786},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24786},'%tag':'run','autocomplete':true,'stopReservoirKinetic':'stopReservoir','module':resevoirKinetic,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24860},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24869},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24911},'%tag':'pragma','apply':function () {
transposeAll(5,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24950},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24991},'%tag':'EMIT','signame':'stopReservoirKinetic'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25019},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25028},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25069},'%tag':'pragma','apply':function () {
transposeAll(4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25108},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25149},'%tag':'EMIT','signame':'stopReservoirKinetic'}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25181},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25210},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25243},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25272},'%tag':'pragma','apply':function () {
transposeAll(2,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25305},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25342},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25382},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25421},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25464},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25503},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25540},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Tonal',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25605},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION TONALE --');transposeAll(0,param);}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25907},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':25922},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26039},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26039},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26039},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26039},'direction':'INOUT','name':'stopTransposition'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26114},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26146},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26171},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26178},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26187},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26196}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26207},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26355},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus 1',serveur);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26418},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26431},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26465},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus 1V2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26538},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26551},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26591},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':26688},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27126},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27126},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27126},'%tag':'run','autocomplete':true,'module':sessionEchelle,'%frame':__frame}));
})([]))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27221},'%tag':'pragma','apply':function () {
console.log('--Arret Opus 1');utilsSkini.alertInfoScoreON('Stop Opus 4',serveur);transposeAll(0,param);DAW.cleanQueues();}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27435},'%tag':'EMIT','signame':'resetMatriceDesPossibles'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27472},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
