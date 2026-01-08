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
const resevoirTrompettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':2901},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':2915},'direction':'IN','name':'stopReservoir'}),trompettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':2939},'direction':'IN','name':n});
}),trompettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':2993},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3044},'%tag':'dollar'},tank.makeReservoir(255,trompettesEchelle)));
const trompettesTonal=['trompettesTonal1','trompettesTonal2','trompettesTonal3'];
const resevoirTrompettesTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3229},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3244},'direction':'IN','name':'stopReservoir'}),trompettesTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3268},'direction':'IN','name':n});
}),trompettesTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3320},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3369},'%tag':'dollar'},tank.makeReservoir(255,trompettesTonal)));
const corsEchelle=['corsEchelle1','corsEchelle2','corsEchelle3','corsEchelle4','corsEchelle5','corsEchelle6','corsEchelle7'];
const resevoirCorsEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3594},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3609},'direction':'IN','name':'stopReservoir'}),corsEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3633},'direction':'IN','name':n});
}),corsEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3681},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3726},'%tag':'dollar'},tank.makeReservoir(255,corsEchelle)));
const trombonesEchelle=['trombonesEchelle1','trombonesEchelle2','trombonesEchelle3','trombonesEchelle4','trombonesEchelle5','trombonesEchelle6','trombonesEchelle7'];
const resevoirTrombonesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':3993},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4008},'direction':'IN','name':'stopReservoir'}),trombonesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4032},'direction':'IN','name':n});
}),trombonesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4085},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4135},'%tag':'dollar'},tank.makeReservoir(255,trombonesEchelle)));
const flutesEchelle=['flutesEchelle1','flutesEchelle2','flutesEchelle3','flutesEchelle4','flutesEchelle5'];
const resevoirFlutesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4346},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4361},'direction':'IN','name':'stopReservoir'}),flutesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4385},'direction':'IN','name':n});
}),flutesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4435},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4482},'%tag':'dollar'},tank.makeReservoir(255,flutesEchelle)));
const hautboisEchelle=['hautboisEchelle1','hautboisEchelle2','hautboisEchelle3','hautboisEchelle4','hautboisEchelle5'];
const resevoirHautboisEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4705},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4720},'direction':'IN','name':'stopReservoir'}),hautboisEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4744},'direction':'IN','name':n});
}),hautboisEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4796},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':4845},'%tag':'dollar'},tank.makeReservoir(255,hautboisEchelle)));
const clarinettesEchelle=['clarinettesEchelle1','clarinettesEchelle2','clarinettesEchelle3','clarinettesEchelle4','clarinettesEchelle5'];
const resevoirClarinettesEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5090},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5105},'direction':'IN','name':'stopReservoir'}),clarinettesEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5129},'direction':'IN','name':n});
}),clarinettesEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5184},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5236},'%tag':'dollar'},tank.makeReservoir(255,clarinettesEchelle)));
const pianoEchelle=['pianoEchelle1','pianoEchelle2','pianoEchelle3','pianoEchelle4','pianoEchelle5'];
const resevoirPianoEchelle=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5444},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5459},'direction':'IN','name':'stopReservoir'}),pianoEchelle.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5483},'direction':'IN','name':n});
}),pianoEchelle.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5532},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5578},'%tag':'dollar'},tank.makeReservoir(255,pianoEchelle)));
const percu=['percu1','percu2','percu3','percu4','percu5','percu6','percu7','percu8','percu9'];
const reservoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5771},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5786},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5810},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5852},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':5891},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const kinetic=['kinetic1','kinetic2','kinetic3'];
const resevoirKinetic=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6023},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6038},'direction':'IN','name':'stopReservoir'}),kinetic.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6062},'direction':'IN','name':n});
}),kinetic.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6106},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6147},'%tag':'dollar'},tank.makeReservoir(255,kinetic)));
const rise=['rise1','rise2'];
const resevoirRise=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6256},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6271},'direction':'IN','name':'stopReservoir'}),rise.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6295},'direction':'IN','name':n});
}),rise.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6336},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6374},'%tag':'dollar'},tank.makeReservoir(255,rise)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const sessionChromatique=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6827},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6849},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6923},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':6990},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7002},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7009},'name':'stopReservoirsChrom'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7035},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7068},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7104},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION CHROMATIQUE --');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7165},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7175},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7175},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7175},'%tag':'run','autocomplete':true,'stopReservoirsChrom':'stopReservoir','module':reservoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7248},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7262},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7299},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'ctrebassesChrom',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7373},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7384},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7439},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7478},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7536},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7576},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7614},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7647},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7720},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('ctrebassesChromIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7764},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,6,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7822},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7861},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7901},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':7939},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Flutes Chromatiques',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8019},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsChromIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8061},'%tag':'pragma','apply':function () {
transpose(CCTransposeViolins,12,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8120},'%tag':'EMIT','signame':'violonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8161},'%tag':'EMIT','signame':'altosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8200},'%tag':'EMIT','signame':'cellosChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8240},'%tag':'EMIT','signame':'ctrebassesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8284},'%tag':'EMIT','signame':'flutesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8324},'%tag':'EMIT','signame':'bassonsChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8365},'%tag':'EMIT','signame':'clarinettesChromOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8404},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Chromatiques',false);}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':8482},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION CHROMATIQUE --');}})));
const sessionTonale=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22747},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22769},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22843},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22910},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22910},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22910},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22957},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22964},'name':'stopReservoirTrompettesTonal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':22994},'name':'stopReservoirKinetic'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23021},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION TONALE --');gcs.setTimerDivision(4);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23112},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23161},'%tag':'pragma','apply':function () {
setTempo(90);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23194},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23227},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violonsTonal',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23440},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(3,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23489},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus Tonal',serveur);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23552},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23598},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23636},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23678},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23716},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23750},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'cellosTonal',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23821},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23856},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23866},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23866},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23866},'%tag':'run','autocomplete':true,'stopReservoirTrompettesTonal':'stopReservoir','module':resevoirTrompettesTonal,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23965},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23965},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':23965},'%tag':'run','autocomplete':true,'stopReservoirKinetic':'stopReservoir','module':resevoirKinetic,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24039},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24048},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24090},'%tag':'pragma','apply':function () {
transposeAll(5,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24129},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24170},'%tag':'EMIT','signame':'stopReservoirKinetic'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24198},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24207},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosTonalIN','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24248},'%tag':'pragma','apply':function () {
transposeAll(4,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24287},'%tag':'EMIT','signame':'stopReservoirTrompettesTonal'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24328},'%tag':'EMIT','signame':'stopReservoirKinetic'}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24360},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24389},'%tag':'pragma','apply':function () {
transposeAll(3,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24422},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24451},'%tag':'pragma','apply':function () {
transposeAll(2,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24484},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24521},'%tag':'EMIT','signame':'violonsTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24561},'%tag':'EMIT','signame':'cellosTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24600},'%tag':'EMIT','signame':'ctrebassesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24643},'%tag':'EMIT','signame':'flutesTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24682},'%tag':'EMIT','signame':'hautboisTonalOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24719},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Tonal',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':24784},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION TONALE --');transposeAll(0,param);}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27395},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27410},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27527},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27527},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27527},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27527},'direction':'INOUT','name':'stopTransposition'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27602},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27634},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27659},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27666},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27675},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27684}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27695},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27708},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27742},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus 1V2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27815},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27828},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27868},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':27965},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28313},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28366},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(3,serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28416},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28416},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28416},'%tag':'run','autocomplete':true,'module':sessionTonale,'%frame':__frame}));
})([])))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28510},'%tag':'pragma','apply':function () {
console.log('--Arret Opus 1');utilsSkini.alertInfoScoreOFF(serveur);transposeAll(0,param);DAW.cleanQueues();}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28664},'%tag':'EMIT','signame':'resetMatriceDesPossibles'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus1.hh.js','pos':28701},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
