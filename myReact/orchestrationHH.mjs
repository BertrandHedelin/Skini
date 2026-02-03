import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';import * as tank from '../pieces/util/makeReservoir.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let signals=undefined;
const debug=false;
const debug1=true;
let currentTimePrev=0;
let currentTime=0;
var socketControleur;
var compteurTransInit=407;
var compteurTrans=compteurTransInit;
var compteurTransMax=414;
var transposition=0;
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
const MIDITrans0369plusStrings=415;
const MIDITrans0369minusStrings=416;
const MIDITrans0Strings=417;
const CCTempo=100;
const tempoMax=240;
const tempoMin=60;
const opus3=true;
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
var CCTransposeValue;
CCTransposeValue=Math.round(1.763 * value + 63.5);oscMidiLocal.sendControlChange(par.busMidiAbleton,CCChannel,CCinstrument,CCTransposeValue);};const transposeAll = function (value,par) {
for (var i=61;i <= 72;i++) {
transpose(i,value,par);}
};const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug1) console.log('-- HH_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};const violonsNoir=['violonsNoir1','violonsNoir2','violonsNoir3','violonsNoir4','violonsNoir5','violonsNoir6','violonsNoir7','violonsNoir8','violonsNoir9','violonsNoir10'];
const resevoirViolonsNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3819},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3832},'direction':'IN','name':'stopReservoir'}),violonsNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3855},'direction':'IN','name':n});
}),violonsNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3902},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3946},'%tag':'dollar'},tank.makeReservoir(255,violonsNoir)));
const cellosNoir=['cellosNoir1','cellosNoir2','cellosNoir3','cellosNoir4','cellosNoir5','cellosNoir6','cellosNoir7','cellosNoir8','cellosNoir9','cellosNoir10'];
const resevoirCellosNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4191},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4204},'direction':'IN','name':'stopReservoir'}),cellosNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4227},'direction':'IN','name':n});
}),cellosNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4273},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4316},'%tag':'dollar'},tank.makeReservoir(255,cellosNoir)));
const pianoBleu=['pianoBleu1','pianoBleu2','pianoBleu3','pianoBleu4','pianoBleu5','pianoBleu6','pianoBleu7','pianoBleu8','pianoBleu9','pianoBleu10'];
const resevoirPianoBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4549},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4562},'direction':'IN','name':'stopReservoir'}),pianoBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4585},'direction':'IN','name':n});
}),pianoBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4630},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4672},'%tag':'dollar'},tank.makeReservoir(255,pianoBleu)));
const pianoNoir=['pianoNoir1','pianoNoir2','pianoNoir3','pianoNoir4'];
const resevoirPianoNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4825},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4838},'direction':'IN','name':'stopReservoir'}),pianoNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4861},'direction':'IN','name':n});
}),pianoNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4906},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4948},'%tag':'dollar'},tank.makeReservoir(255,pianoNoir)));
const trompettesBleu=['trompettesBleu1','trompettesBleu2','trompettesBleu3','trompettesBleu4','trompettesBleu5'];
const resevoirTrompettesBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5148},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5161},'direction':'IN','name':'stopReservoir'}),trompettesBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5184},'direction':'IN','name':n});
}),trompettesBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5234},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5281},'%tag':'dollar'},tank.makeReservoir(255,trompettesBleu)));
const trompettesRouge=['trompettesRouge1','trompettesRouge2','trompettesRouge3','trompettesRouge4','trompettesRouge5','trompettesRouge6'];
const resevoirTrompettesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5512},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5525},'direction':'IN','name':'stopReservoir'}),trompettesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5548},'direction':'IN','name':n});
}),trompettesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5599},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5647},'%tag':'dollar'},tank.makeReservoir(255,trompettesRouge)));
const corsBleu=['corsBleu1','corsBleu2','corsBleu3','corsBleu4','corsBleu5'];
const resevoirCorsBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5812},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5825},'direction':'IN','name':'stopReservoir'}),corsBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5848},'direction':'IN','name':n});
}),corsBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5892},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5933},'%tag':'dollar'},tank.makeReservoir(255,corsBleu)));
const corsRouge=['corsRouge1','corsRouge2','corsRouge3','corsRouge4','corsRouge5','corsRouge6'];
const resevoirCorsRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6111},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6124},'direction':'IN','name':'stopReservoir'}),corsRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6147},'direction':'IN','name':n});
}),corsRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6192},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6234},'%tag':'dollar'},tank.makeReservoir(255,corsRouge)));
const corsTonal=['corsTonal1','corsTonal2','corsTonal3'];
const resevoirCorsTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6373},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6386},'direction':'IN','name':'stopReservoir'}),corsTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6409},'direction':'IN','name':n});
}),corsTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6454},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6496},'%tag':'dollar'},tank.makeReservoir(255,corsTonal)));
const trombonesRouge=['trombonesRouge1','trombonesRouge2','trombonesRouge3','trombonesRouge4','trombonesRouge5','trombonesRouge6'];
const resevoirTrombonesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6714},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6727},'direction':'IN','name':'stopReservoir'}),trombonesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6750},'direction':'IN','name':n});
}),trombonesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6800},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6847},'%tag':'dollar'},tank.makeReservoir(255,trombonesRouge)));
const trombonesTonal=['trombonesTonal1','trombonesTonal2','trombonesTonal3'];
const resevoirTrombonesTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7016},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7029},'direction':'IN','name':'stopReservoir'}),trombonesTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7052},'direction':'IN','name':n});
}),trombonesTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7102},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7149},'%tag':'dollar'},tank.makeReservoir(255,trombonesTonal)));
const flutesRouge=['flutesRouge1','flutesRouge2'];
const resevoirFlutesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7287},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7300},'direction':'IN','name':'stopReservoir'}),flutesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7323},'direction':'IN','name':n});
}),flutesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7370},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7414},'%tag':'dollar'},tank.makeReservoir(255,flutesRouge)));
const flutesNoir=['flutesNoir1','flutesNoir2','flutesNoir3','flutesNoir4','flutesNoir5','flutesNoir6','flutesNoir7','flutesNoir8','flutesNoir9','flutesNoir10'];
const resevoirFlutesNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7660},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7673},'direction':'IN','name':'stopReservoir'}),flutesNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7696},'direction':'IN','name':n});
}),flutesNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7742},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7785},'%tag':'dollar'},tank.makeReservoir(255,flutesNoir)));
const clarinettesRouge=['clarinettesRouge1','clarinettesRouge2'];
const resevoirClarinettesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7939},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7952},'direction':'IN','name':'stopReservoir'}),clarinettesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7975},'direction':'IN','name':n});
}),clarinettesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8027},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8076},'%tag':'dollar'},tank.makeReservoir(255,clarinettesRouge)));
const hautboisRouge=['hautboisRouge1','hautboisRouge2'];
const resevoirHautboisRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8224},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8237},'direction':'IN','name':'stopReservoir'}),hautboisRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8260},'direction':'IN','name':n});
}),hautboisRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8309},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8355},'%tag':'dollar'},tank.makeReservoir(255,hautboisRouge)));
const bassonsRouge=['bassonsRouge1','bassonsRouge2'];
const resevoirBassonsRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8496},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8509},'direction':'IN','name':'stopReservoir'}),bassonsRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8532},'direction':'IN','name':n});
}),bassonsRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8580},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8625},'%tag':'dollar'},tank.makeReservoir(255,bassonsRouge)));
const bassonsNoir=['bassonsNoir1','bassonsNoir2','bassonsNoir3','bassonsNoir4','bassonsNoir5','bassonsNoir6','bassonsNoir7','bassonsNoir8','bassonsNoir9','bassonsNoir10'];
const resevoirBassonsNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8883},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8896},'direction':'IN','name':'stopReservoir'}),bassonsNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8919},'direction':'IN','name':n});
}),bassonsNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8966},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9010},'%tag':'dollar'},tank.makeReservoir(255,bassonsNoir)));
const percu=['percu1','percu2','percu3'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9131},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9144},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9167},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9208},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9246},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const marimba=['marimba1','marimba2','marimba3','marimba4','marimba5'];
const resevoirMarimba=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9397},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9410},'direction':'IN','name':'stopReservoir'}),marimba.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9433},'direction':'IN','name':n});
}),marimba.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9476},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9516},'%tag':'dollar'},tank.makeReservoir(255,marimba)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const sessionBleue=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9807},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9825},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9895},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9961},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9961},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9961},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10005},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10012},'name':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10030},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Bleue --');utilsSkini.alertInfoScoreON('SESSION Bleue',serveur);utilsSkini.addSceneScore(3,serveur);transposition=0;if (opus3) {
gcs.setTimerDivision(2);} else {
gcs.setTimerDivision(4);}
transposeAll(0,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10332},'%tag':'EMIT','signame':'cellosBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10362},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violoncelles bleus',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10438},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10438},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10447},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10477},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10526},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10535},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10565},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,1,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10619},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10628},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10658},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10667},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10697},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,-5,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10752},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10761},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10792},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10801},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10831},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,-2,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10886},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10895},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10925},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10934},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10964},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,0,param);}}))),$$hiphop.TRAP({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11018},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11028},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11028},'%tag':'SEQUENCE'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11038},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11038},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11038},'%tag':'run','autocomplete':true,'module':resevoirPianoBleu,'%frame':__frame}));
})([]),$$hiphop.EXIT({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11081},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11100},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11123},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transpose(CCTransposeCellos,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11248},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11257},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11301},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11328},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11345},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,0,param);transposition=0;}}),$$hiphop.TRAP({'seq2':'seq2','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11424},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11434},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11434},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11450},'%tag':'EMIT','signame':'cellosBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11483},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violoncelles bleus',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11561},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11579},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11617},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11695},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('contrebassesBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11747},'%tag':'EMIT','signame':'altosBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11778},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Altos bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11849},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('altosBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11894},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11933},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses bleues',false);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12019},'%tag':'EMIT','signame':'violonsBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12052},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violons bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12125},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12171},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'seq2':'seq2','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12198},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12217},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12313},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})))),$$hiphop.TRAP({'trans':'trans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12430},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12441},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12441},'%tag':'SEQUENCE'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12451},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12462},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12462},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12462},'%tag':'run','autocomplete':true,'module':resevoirTrompettesBleu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12505},'%tag':'par'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12515},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12515},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12515},'%tag':'run','autocomplete':true,'module':resevoirCorsBleu,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12552},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12552},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12552},'%tag':'run','autocomplete':true,'module':resevoirPianoBleu,'%frame':__frame}));
})([]))),$$hiphop.EXIT({'trans':'trans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12601},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12621},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13543},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 3;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13659},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13725},'%tag':'EMIT','signame':'violonsBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13763},'%tag':'EMIT','signame':'altosBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13799},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13968},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Bleue',serveur);console.log('-- FIN SESSION Bleue --');utilsSkini.removeSceneScore(3,serveur);DAW.cleanQueues();}})));
const sessionRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14310},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14328},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14398},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14464},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14464},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14464},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14508},'direction':'IN','name':'abortSessionRouge'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14532},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14539},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14554},'name':'abortTheSession'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14571},'name':'stopEveryAbort'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14591},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Rouge --');utilsSkini.addSceneScore(2,serveur);transposition=0;if (opus3) {
gcs.setTimerDivision(2);} else {
gcs.setTimerDivision(16);}
transposeAll(0,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14831},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14864},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violons Rouges',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14936},'%tag':'FORK'},$$hiphop.TRAP({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14945},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14966},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14978},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('abortSessionRouge','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15015},'%tag':'pragma','apply':function () {
const abortSessionRouge=this.abortSessionRouge;{
console.log('-- depuis SESSION Noire: abortSessionRouge --',abortSessionRouge.nowval);}}},$$hiphop.SIGACCESS({'signame':'abortSessionRouge','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15126},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15154},'%tag':'EMIT','signame':'abortTheSession'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15185},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15233},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15275},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15319},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15362},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15404},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15448},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15507},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15517},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('stopEveryAbort','now')}),$$hiphop.EXIT({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15556},'%tag':'EXIT'})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15585},'%tag':'par'},$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15593},'%tag':'WEAKABORT','immediate':false,'apply':new $$hiphop.DelaySig('abortTheSession','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15609},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15620},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15673},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')})),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15701},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15719},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15719},'%tag':'SEQUENCE'},$$hiphop.TRAP({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15731},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15748},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15762},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15762},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15762},'%tag':'run','autocomplete':true,'module':resevoirCorsRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15803},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15816},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15856},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15887},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15917}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15932},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15959},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeCors,transposition,param);}})))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16117},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16130},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16130},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16130},'%tag':'run','autocomplete':true,'module':resevoirBassonsRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16185},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16185},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16185},'%tag':'run','autocomplete':true,'module':resevoirFlutesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16239},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16239},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16239},'%tag':'run','autocomplete':true,'module':resevoirHautboisRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16295},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16295},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16295},'%tag':'run','autocomplete':true,'module':resevoirClarinettesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16342},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16354},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16379},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeClarinettes,transposition,param);transpose(CCTransposeFlutes,transposition,param);transpose(CCTransposeHaubois,transposition,param);transpose(CCTransposeBassons,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16694},'%tag':'par'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16706},'%tag':'if','apply':function () {
return opus3;
}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16725},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 12;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16775},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16823},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16869},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16869},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16887},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16936},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16979},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17024},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17067},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17109},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [true,255];
}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17164},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17177},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17177},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17177},'%tag':'run','autocomplete':true,'module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17214},'%tag':'par'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17227},'%tag':'if','apply':function () {
return opus3;
}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17247},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 12;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17299},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17349},'%tag':'EMIT','signame':'stopReservoir'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17389},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17463},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 12;
}}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17506},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17523},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17539},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17581},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses rouges',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17666},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17702},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violoncelles rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17782},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17825}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17838},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17863},'%tag':'pragma','apply':function () {
oscMidiLocal.convertAndActivateClip(MIDITrans0369plusStrings);}}))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17958},'%tag':'pragma','apply':function () {
oscMidiLocal.convertAndActivateClip(MIDITrans0Strings);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18026},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18037},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18037},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18037},'%tag':'run','autocomplete':true,'module':resevoirTrompettesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18091},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18091},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18091},'%tag':'run','autocomplete':true,'module':resevoirTrombonesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18134},'%tag':'par'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18144},'%tag':'if','apply':function () {
return opus3;
}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18161},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 12;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18207},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18251},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18283},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18324},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18364},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18405},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18467},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Rouge',serveur);DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18623},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18649},'%tag':'EMIT','signame':'stopEveryAbort'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18676},'%tag':'EMIT','signame':'abortTheSession'})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18736},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18756},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Rouge --');DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}})))));
const sessionNoire=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18989},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19007},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19077},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19144},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19144},'direction':'IN','name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19144},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19210},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19210},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19210},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19254},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19278},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Noire --');utilsSkini.alertInfoScoreON('SESSION Noire',serveur);utilsSkini.addSceneScore(1,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19514},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('abortSessionNoire','now')},$$hiphop.SUSPEND({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19543},'immediate':false,'apply':function () {
return ((() => {
const suspendSessionNoire=this.suspendSessionNoire;return suspendSessionNoire.nowval === true;
})());
}},$$hiphop.SIGACCESS({'signame':'suspendSessionNoire','pre':false,'val':true,'cnt':false}),$$hiphop.TRAP({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19557},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19571},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19583},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19648},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19674},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transpose(CCTransposePianos,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19814},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19826},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19860},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19860},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19860},'%tag':'run','autocomplete':true,'module':resevoirViolonsNoir,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19902},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19914},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19948},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19948},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19948},'%tag':'run','autocomplete':true,'module':resevoirCellosNoir,'%frame':__frame}));
})([]))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19996},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20007},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EXIT({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20046},'%tag':'EXIT'})))),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20083},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20101},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20113},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20113},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20113},'%tag':'run','autocomplete':true,'module':resevoirFlutesNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20164},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20164},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20164},'%tag':'run','autocomplete':true,'module':resevoirBassonsNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20216},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20216},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20216},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20266},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20291},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20410},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20421},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 7;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20459},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20488},'%tag':'EXIT'})))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20610},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20692},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20752},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Noire --');utilsSkini.removeSceneScore(1,serveur);utilsSkini.alertInfoScoreON('FIN SESSION Noire',serveur);}}));
let aleaJaune=0;
const sessionJaune=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20971},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20989},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21059},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21125},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21125},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21125},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21169},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21176},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21191},'name':'stopReservoirSessionNoire'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21220},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21227},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21248},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21267},'name':'abortSessionRouge'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21286},'name':'stopSustainSessionNoire'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21314},'%tag':'pragma','apply':function () {
aleaJaune=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- aleaJaune:',aleaJaune);
}}),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21442},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21458},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21468},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21468},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21479},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Jaune --');utilsSkini.alertInfoScoreON('SESSION Jaune',serveur);utilsSkini.addSceneScore(4,serveur);transposition=0;if (opus3) {
gcs.setTimerDivision(2);} else {
gcs.setTimerDivision(16);}
transposeAll(0,param);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21812},'%tag':'if','apply':function () {
return aleaJaune === 0;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21835},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21843},'%tag':'pragma','apply':function () {
setTempo(200,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21884},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21924},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21965},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22040},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22073},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22130},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22171},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22205},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22280},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22319},'%tag':'if','apply':function () {
return aleaJaune === 1;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22340},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22348},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22389},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22430},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22464},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22539},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22572},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22629},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22669},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22710},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22785},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 15;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22825},'%tag':'if','apply':function () {
return aleaJaune === 2;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22846},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22854},'%tag':'pragma','apply':function () {
setTempo(160);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22888},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22929},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23004},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23037},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23094},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23130},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23205},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23244},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23280},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23355},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23393},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23427},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23502},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23549},'%tag':'pragma','apply':function () {
console.log('aleaJaune X:',aleaJaune);}})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23615},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23655},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23701},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23742},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23776},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23851},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Jaune --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23902},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23954},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23992},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':24030},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':24083},'%tag':'EMIT','signame':'abortSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':24115},'%tag':'EMIT','signame':'abortSessionRouge'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':24147},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25920}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25933},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune1' || patternSignal.nowval[1] === 'VioloncelleJaune3' || patternSignal.nowval[1] === 'VioloncelleJaune6');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26143},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26239},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26252},'%tag':'if','apply':function () {
return aleaJaune > 1;
}},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26280},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26280},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26280},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26332},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26347},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26347},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26347},'%tag':'run','autocomplete':true,'stopReservoirSessionNoire':'stopReservoir','module':sessionNoire,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26442},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26442},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26458},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune2' || patternSignal.nowval[1] === 'VioloncelleJaune4' || patternSignal.nowval[1] === 'VioloncelleJaune5');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26684},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26784},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26870},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return true;
}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26916},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26931},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune1');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27030},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27130},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: FIN Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27220},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27285},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27297},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune2');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27393},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27495},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27535},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27619},'%tag':'EMIT','signame':'abortSessionNoire','apply':function () {
return 1;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27653},'%tag':'EMIT','signame':'abortSessionRouge','apply':function () {
return 1;
}}))))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27709},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27733},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27852},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Jaune',serveur);utilsSkini.removeSceneScore(4,serveur);DAW.cleanQueues();}}))));
let choiceRandom=0;
const journey=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28041},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28059},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28129},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28195},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28223},'direction':'OUT','name':'setComputeScorePolicy'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28252},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28252},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28252},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28296},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28303},'name':'choixHasard','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28319},'name':'theEnd'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28327},'name':'stopReservoir'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28457},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28464},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28485},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28504},'name':'abortSessionRouge'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28526},'%tag':'pragma','apply':function () {
console.log('-- DEBUT JOURNEY --');}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28572}},$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28582},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28593},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28643},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28693},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(3,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28743},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28793},'%tag':'pragma','apply':function () {
utilsSkini.refreshSceneScore(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28842},'%tag':'pragma','apply':function () {
choiceRandom=Math.random();}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28901},'%tag':'pragma','apply':function () {
console.log('-- Journey random:',choiceRandom);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28960},'%tag':'if','apply':function () {
return choiceRandom <= 0.25;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28986},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28992},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29041},'%tag':'pragma','apply':function () {
setTempo(100,param);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29155},'%tag':'FORK'},$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29210},'%tag':'NOTHING'}),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29264},'%tag':'NOTHING'}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29277},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29277},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29277},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([]))),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29329},'%tag':'if','apply':function () {
return choiceRandom <= 0.50;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29355},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29361},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29395},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29444},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29444},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29444},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([])),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29488},'%tag':'if','apply':function () {
return choiceRandom <= 0.75;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29514},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29525},'%tag':'EMIT','signame':'setTimerDivision','apply':function () {
return 4;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29573},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29606},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29643},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29694},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29694},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29694},'%tag':'run','autocomplete':true,'module':sessionBleue,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29742},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29748},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29799},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29799},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29799},'%tag':'run','autocomplete':true,'module':sessionJaune,'%frame':__frame}));
})([]))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29860},'%tag':'pragma','apply':function () {
console.log('-- FIN JOURNEY, ON RECOMMENCE--');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30032},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN',serveur);}})))));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30115},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30129},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30242},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30242},'direction':'OUT','name':'setComputeScorePolicy'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30297},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30325},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30349},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30356},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30365},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30373}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30382},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30393},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30426},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30494},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30505},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30544},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30575},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30924},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30924},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30924},'%tag':'run','autocomplete':true,'module':journey,'%frame':__frame}));
})([]),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30962},'%tag':'if','apply':function () {
return debug;
}},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30979},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('patternSignal','now')},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':31023},'%tag':'if','apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.nowval[1] !== undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':31075},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('Opus2: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':31179},'%tag':'pragma','apply':function () {
console.log('--Arret d\'Automate Opus 2');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':31348},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':31383},'%tag':'pragma','apply':function () {
console.log('-- STOP Opus 2');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
