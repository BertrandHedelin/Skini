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
const resevoirViolonsNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3604},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3617},'direction':'IN','name':'stopReservoir'}),violonsNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3640},'direction':'IN','name':n});
}),violonsNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3687},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3731},'%tag':'dollar'},tank.makeReservoir(255,violonsNoir)));
const cellosNoir=['cellosNoir1','cellosNoir2','cellosNoir3','cellosNoir4','cellosNoir5','cellosNoir6','cellosNoir7','cellosNoir8','cellosNoir9','cellosNoir10'];
const resevoirCellosNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3976},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':3989},'direction':'IN','name':'stopReservoir'}),cellosNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4012},'direction':'IN','name':n});
}),cellosNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4058},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4101},'%tag':'dollar'},tank.makeReservoir(255,cellosNoir)));
const pianoBleu=['pianoBleu1','pianoBleu2','pianoBleu3','pianoBleu4','pianoBleu5','pianoBleu6','pianoBleu7','pianoBleu8','pianoBleu9','pianoBleu10'];
const resevoirPianoBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4334},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4347},'direction':'IN','name':'stopReservoir'}),pianoBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4370},'direction':'IN','name':n});
}),pianoBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4415},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4457},'%tag':'dollar'},tank.makeReservoir(255,pianoBleu)));
const pianoNoir=['pianoNoir1','pianoNoir2','pianoNoir3','pianoNoir4'];
const resevoirPianoNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4610},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4623},'direction':'IN','name':'stopReservoir'}),pianoNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4646},'direction':'IN','name':n});
}),pianoNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4691},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4733},'%tag':'dollar'},tank.makeReservoir(255,pianoNoir)));
const trompettesBleu=['trompettesBleu1','trompettesBleu2','trompettesBleu3','trompettesBleu4','trompettesBleu5'];
const resevoirTrompettesBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4933},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4946},'direction':'IN','name':'stopReservoir'}),trompettesBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':4969},'direction':'IN','name':n});
}),trompettesBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5019},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5066},'%tag':'dollar'},tank.makeReservoir(255,trompettesBleu)));
const trompettesRouge=['trompettesRouge1','trompettesRouge2','trompettesRouge3','trompettesRouge4','trompettesRouge5','trompettesRouge6'];
const resevoirTrompettesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5297},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5310},'direction':'IN','name':'stopReservoir'}),trompettesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5333},'direction':'IN','name':n});
}),trompettesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5384},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5432},'%tag':'dollar'},tank.makeReservoir(255,trompettesRouge)));
const corsBleu=['corsBleu1','corsBleu2','corsBleu3','corsBleu4','corsBleu5'];
const resevoirCorsBleu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5597},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5610},'direction':'IN','name':'stopReservoir'}),corsBleu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5633},'direction':'IN','name':n});
}),corsBleu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5677},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5718},'%tag':'dollar'},tank.makeReservoir(255,corsBleu)));
const corsRouge=['corsRouge1','corsRouge2','corsRouge3','corsRouge4','corsRouge5','corsRouge6'];
const resevoirCorsRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5896},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5909},'direction':'IN','name':'stopReservoir'}),corsRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5932},'direction':'IN','name':n});
}),corsRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':5977},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6019},'%tag':'dollar'},tank.makeReservoir(255,corsRouge)));
const corsTonal=['corsTonal1','corsTonal2','corsTonal3'];
const resevoirCorsTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6158},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6171},'direction':'IN','name':'stopReservoir'}),corsTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6194},'direction':'IN','name':n});
}),corsTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6239},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6281},'%tag':'dollar'},tank.makeReservoir(255,corsTonal)));
const trombonesRouge=['trombonesRouge1','trombonesRouge2','trombonesRouge3','trombonesRouge4','trombonesRouge5','trombonesRouge6'];
const resevoirTrombonesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6499},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6512},'direction':'IN','name':'stopReservoir'}),trombonesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6535},'direction':'IN','name':n});
}),trombonesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6585},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6632},'%tag':'dollar'},tank.makeReservoir(255,trombonesRouge)));
const trombonesTonal=['trombonesTonal1','trombonesTonal2','trombonesTonal3'];
const resevoirTrombonesTonal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6801},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6814},'direction':'IN','name':'stopReservoir'}),trombonesTonal.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6837},'direction':'IN','name':n});
}),trombonesTonal.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6887},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':6934},'%tag':'dollar'},tank.makeReservoir(255,trombonesTonal)));
const flutesRouge=['flutesRouge1','flutesRouge2'];
const resevoirFlutesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7072},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7085},'direction':'IN','name':'stopReservoir'}),flutesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7108},'direction':'IN','name':n});
}),flutesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7155},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7199},'%tag':'dollar'},tank.makeReservoir(255,flutesRouge)));
const flutesNoir=['flutesNoir1','flutesNoir2','flutesNoir3','flutesNoir4','flutesNoir5','flutesNoir6','flutesNoir7','flutesNoir8','flutesNoir9','flutesNoir10'];
const resevoirFlutesNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7445},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7458},'direction':'IN','name':'stopReservoir'}),flutesNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7481},'direction':'IN','name':n});
}),flutesNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7527},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7570},'%tag':'dollar'},tank.makeReservoir(255,flutesNoir)));
const clarinettesRouge=['clarinettesRouge1','clarinettesRouge2'];
const resevoirClarinettesRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7724},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7737},'direction':'IN','name':'stopReservoir'}),clarinettesRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7760},'direction':'IN','name':n});
}),clarinettesRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7812},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':7861},'%tag':'dollar'},tank.makeReservoir(255,clarinettesRouge)));
const hautboisRouge=['hautboisRouge1','hautboisRouge2'];
const resevoirHautboisRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8009},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8022},'direction':'IN','name':'stopReservoir'}),hautboisRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8045},'direction':'IN','name':n});
}),hautboisRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8094},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8140},'%tag':'dollar'},tank.makeReservoir(255,hautboisRouge)));
const bassonsRouge=['bassonsRouge1','bassonsRouge2'];
const resevoirBassonsRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8281},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8294},'direction':'IN','name':'stopReservoir'}),bassonsRouge.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8317},'direction':'IN','name':n});
}),bassonsRouge.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8365},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8410},'%tag':'dollar'},tank.makeReservoir(255,bassonsRouge)));
const bassonsNoir=['bassonsNoir1','bassonsNoir2','bassonsNoir3','bassonsNoir4','bassonsNoir5','bassonsNoir6','bassonsNoir7','bassonsNoir8','bassonsNoir9','bassonsNoir10'];
const resevoirBassonsNoir=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8668},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8681},'direction':'IN','name':'stopReservoir'}),bassonsNoir.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8704},'direction':'IN','name':n});
}),bassonsNoir.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8751},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8795},'%tag':'dollar'},tank.makeReservoir(255,bassonsNoir)));
const percu=['percu1','percu2','percu3'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8916},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8929},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8952},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':8993},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9031},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const marimba=['marimba1','marimba2','marimba3','marimba4','marimba5'];
const resevoirMarimba=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9182},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9195},'direction':'IN','name':'stopReservoir'}),marimba.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9218},'direction':'IN','name':n});
}),marimba.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9261},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9301},'%tag':'dollar'},tank.makeReservoir(255,marimba)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const sessionBleue=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9592},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9610},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9680},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9746},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9746},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9746},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9790},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9797},'name':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':9815},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Bleue --');utilsSkini.alertInfoScoreON('SESSION Bleue',serveur);utilsSkini.addSceneScore(3,serveur);transposition=0;gcs.setTimerDivision(4);transposeAll(0,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10056},'%tag':'EMIT','signame':'cellosBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10086},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'violoncelles bleus',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10162},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10162},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10171},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10201},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10250},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10259},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10289},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,1,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10343},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10352},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10382},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10391},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10421},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,-5,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10476},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10485},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10516},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10525},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10555},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,-2,param);}}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10610},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10619},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10649},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10658},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10688},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,0,param);}}))),$$hiphop.TRAP({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10742},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10752},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10752},'%tag':'SEQUENCE'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10762},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10762},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10762},'%tag':'run','autocomplete':true,'module':resevoirPianoBleu,'%frame':__frame}));
})([]),$$hiphop.EXIT({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10805},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10824},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10847},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transpose(CCTransposeCellos,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10972},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':10981},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11025},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'seq1':'seq1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11052},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11069},'%tag':'pragma','apply':function () {
transpose(CCTransposeCellos,0,param);transposition=0;}}),$$hiphop.TRAP({'seq2':'seq2','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11148},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11158},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11158},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11174},'%tag':'EMIT','signame':'cellosBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11207},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violoncelles bleus',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11285},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11303},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11341},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11419},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('contrebassesBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11471},'%tag':'EMIT','signame':'altosBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11502},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Altos bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11573},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('altosBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11618},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11657},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses bleues',false);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11743},'%tag':'EMIT','signame':'violonsBleuOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11776},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violons bleues',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11849},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsBleuIN','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11895},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'seq2':'seq2','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11922},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':11941},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12037},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})))),$$hiphop.TRAP({'trans':'trans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12154},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12165},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12165},'%tag':'SEQUENCE'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12175},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12186},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12186},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12186},'%tag':'run','autocomplete':true,'module':resevoirTrompettesBleu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12229},'%tag':'par'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12239},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12239},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12239},'%tag':'run','autocomplete':true,'module':resevoirCorsBleu,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12276},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12276},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12276},'%tag':'run','autocomplete':true,'module':resevoirPianoBleu,'%frame':__frame}));
})([]))),$$hiphop.EXIT({'trans':'trans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12325},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12345},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13267},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 3;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13383},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13449},'%tag':'EMIT','signame':'violonsBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13487},'%tag':'EMIT','signame':'altosBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13523},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13692},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Bleue',serveur);console.log('-- FIN SESSION Bleue --');utilsSkini.removeSceneScore(3,serveur);DAW.cleanQueues();}})));
const sessionRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14034},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14052},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14122},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14188},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14188},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14188},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14232},'direction':'IN','name':'abortSessionRouge'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14256},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14263},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14278},'name':'abortTheSession'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14295},'name':'stopEveryAbort'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14315},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Rouge --');utilsSkini.addSceneScore(2,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14496},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14529},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violons Rouges',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14601},'%tag':'FORK'},$$hiphop.TRAP({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14610},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14631},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14643},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('abortSessionRouge','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14680},'%tag':'pragma','apply':function () {
const abortSessionRouge=this.abortSessionRouge;{
console.log('-- depuis SESSION Noire: abortSessionRouge --',abortSessionRouge.nowval);}}},$$hiphop.SIGACCESS({'signame':'abortSessionRouge','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14791},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14819},'%tag':'EMIT','signame':'abortTheSession'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14850},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14898},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14940},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14984},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15027},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15069},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15113},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15172},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15182},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('stopEveryAbort','now')}),$$hiphop.EXIT({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15221},'%tag':'EXIT'})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15250},'%tag':'par'},$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15258},'%tag':'WEAKABORT','immediate':false,'apply':new $$hiphop.DelaySig('abortTheSession','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15274},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15285},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15338},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')})),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15366},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15384},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15384},'%tag':'SEQUENCE'},$$hiphop.TRAP({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15396},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15413},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15427},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15427},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15427},'%tag':'run','autocomplete':true,'module':resevoirCorsRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15468},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15481},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15521},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15552},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15582}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15597},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15624},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeCors,transposition,param);}})))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15782},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15795},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15795},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15795},'%tag':'run','autocomplete':true,'module':resevoirBassonsRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15850},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15850},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15850},'%tag':'run','autocomplete':true,'module':resevoirFlutesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15904},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15904},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15904},'%tag':'run','autocomplete':true,'module':resevoirHautboisRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15960},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15960},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15960},'%tag':'run','autocomplete':true,'module':resevoirClarinettesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16007},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16019},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16044},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeClarinettes,transposition,param);transpose(CCTransposeFlutes,transposition,param);transpose(CCTransposeHaubois,transposition,param);transpose(CCTransposeBassons,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16359},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16371},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16410},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16456},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16456},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16474},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16523},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16566},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16611},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16654},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16696},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [true,255];
}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16751},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16764},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16764},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16764},'%tag':'run','autocomplete':true,'module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16801},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16814},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16854},'%tag':'EMIT','signame':'stopReservoir'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16894},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16968},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17010},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17027},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17043},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17085},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses rouges',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17170},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17206},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violoncelles rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17286},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17329}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17342},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17367},'%tag':'pragma','apply':function () {
oscMidiLocal.convertAndActivateClip(MIDITrans0369plusStrings);}}))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17462},'%tag':'pragma','apply':function () {
oscMidiLocal.convertAndActivateClip(MIDITrans0Strings);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17530},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17541},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17541},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17541},'%tag':'run','autocomplete':true,'module':resevoirTrompettesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17595},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17595},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17595},'%tag':'run','autocomplete':true,'module':resevoirTrombonesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17638},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17648},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17685},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17717},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17758},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17798},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17839},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17901},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Rouge',serveur);DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18057},'%tag':'EMIT','signame':'stopEveryAbort'})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18116},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18136},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Rouge --');DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}})))));
const sessionNoire=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18369},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18387},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18457},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18524},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18524},'direction':'IN','name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18524},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18590},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18590},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18590},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18634},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18658},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Noire --');utilsSkini.alertInfoScoreON('SESSION Noire',serveur);utilsSkini.addSceneScore(1,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18894},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('abortSessionNoire','now')},$$hiphop.SUSPEND({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18923},'immediate':false,'apply':function () {
return ((() => {
const suspendSessionNoire=this.suspendSessionNoire;return suspendSessionNoire.nowval === true;
})());
}},$$hiphop.SIGACCESS({'signame':'suspendSessionNoire','pre':false,'val':true,'cnt':false}),$$hiphop.TRAP({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18937},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18951},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18963},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18976},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18976},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18976},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19028},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19054},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transpose(CCTransposePianos,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19194},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19206},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19240},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19240},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19240},'%tag':'run','autocomplete':true,'module':resevoirViolonsNoir,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19282},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19294},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19328},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19328},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19328},'%tag':'run','autocomplete':true,'module':resevoirCellosNoir,'%frame':__frame}));
})([]))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19376},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19387},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EXIT({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19426},'%tag':'EXIT'})))),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19463},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19481},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19493},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19493},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19493},'%tag':'run','autocomplete':true,'module':resevoirFlutesNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19544},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19544},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19544},'%tag':'run','autocomplete':true,'module':resevoirBassonsNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19596},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19646},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19671},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19790},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19801},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 7;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19839},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19868},'%tag':'EXIT'})))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19990},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20072},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20132},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Noire --');utilsSkini.removeSceneScore(1,serveur);utilsSkini.alertInfoScoreON('FIN SESSION Noire',serveur);}}));
let aleaJaune=0;
const sessionJaune=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20351},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20369},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20439},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20505},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20505},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20505},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20549},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20556},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20571},'name':'stopReservoirSessionNoire'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20600},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20607},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20628},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20647},'name':'abortSessionRouge'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20666},'name':'stopSustainSessionNoire'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20694},'%tag':'pragma','apply':function () {
aleaJaune=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- aleaJaune:',aleaJaune);
}}),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20822},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20838},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20848},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20848},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20859},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Jaune --');utilsSkini.alertInfoScoreON('SESSION Jaune',serveur);utilsSkini.addSceneScore(4,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21119},'%tag':'if','apply':function () {
return aleaJaune === 0;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21142},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21150},'%tag':'pragma','apply':function () {
setTempo(200,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21191},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21231},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21272},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21347},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21380},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21437},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21478},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21512},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21587},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21626},'%tag':'if','apply':function () {
return aleaJaune === 1;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21647},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21655},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21696},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21737},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21771},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21846},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21879},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21936},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21976},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22017},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22092},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 15;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22132},'%tag':'if','apply':function () {
return aleaJaune === 2;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22153},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22161},'%tag':'pragma','apply':function () {
setTempo(160);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22195},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22236},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22311},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22344},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22401},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22437},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22512},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22551},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22587},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22662},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22700},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22734},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22809},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22856},'%tag':'pragma','apply':function () {
console.log('aleaJaune X:',aleaJaune);}})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22922},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22962},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23008},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23049},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23083},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23158},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Jaune --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23209},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23261},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23299},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23337},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23390},'%tag':'EMIT','signame':'abortSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23422},'%tag':'EMIT','signame':'abortSessionRouge'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23454},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25227}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25240},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune1' || patternSignal.nowval[1] === 'VioloncelleJaune3' || patternSignal.nowval[1] === 'VioloncelleJaune6');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25450},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25546},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25559},'%tag':'if','apply':function () {
return aleaJaune > 1;
}},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25587},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25587},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25587},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25639},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25654},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25654},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25654},'%tag':'run','autocomplete':true,'stopReservoirSessionNoire':'stopReservoir','module':sessionNoire,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25749},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25749},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25765},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune2' || patternSignal.nowval[1] === 'VioloncelleJaune4' || patternSignal.nowval[1] === 'VioloncelleJaune5');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25991},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26091},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26177},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return true;
}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26223},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26238},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune1');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26337},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26437},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: FIN Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26527},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26592},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26604},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune2');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26700},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26802},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26842},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26926},'%tag':'EMIT','signame':'abortSessionNoire','apply':function () {
return 1;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26960},'%tag':'EMIT','signame':'abortSessionRouge','apply':function () {
return 1;
}}))))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27016},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27040},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27159},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Jaune',serveur);utilsSkini.removeSceneScore(4,serveur);DAW.cleanQueues();}}))));
let choiceRandom=0;
const journey=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27348},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27366},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27436},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27502},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27530},'direction':'OUT','name':'setComputeScorePolicy'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27559},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27559},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27559},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27603},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27610},'name':'choixHasard','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27626},'name':'theEnd'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27634},'name':'stopReservoir'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27764},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27771},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27792},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27811},'name':'abortSessionRouge'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27833},'%tag':'pragma','apply':function () {
console.log('-- DEBUT JOURNEY --');}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27879}},$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27889},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27900},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27950},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28000},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(3,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28050},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28100},'%tag':'pragma','apply':function () {
utilsSkini.refreshSceneScore(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28149},'%tag':'pragma','apply':function () {
choiceRandom=Math.random();}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28208},'%tag':'pragma','apply':function () {
console.log('-- Journey random:',choiceRandom);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28267},'%tag':'if','apply':function () {
return choiceRandom <= 0.25;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28293},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28299},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28348},'%tag':'pragma','apply':function () {
setTempo(100,param);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28418},'%tag':'FORK'},$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28473},'%tag':'NOTHING'}),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28527},'%tag':'NOTHING'}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28540},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28540},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28540},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([]))),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28592},'%tag':'if','apply':function () {
return choiceRandom <= 0.50;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28618},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28624},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28658},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28707},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28707},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28707},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([])),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28751},'%tag':'if','apply':function () {
return choiceRandom <= 0.75;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28777},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28788},'%tag':'EMIT','signame':'setTimerDivision','apply':function () {
return 4;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28836},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28869},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28906},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28957},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28957},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28957},'%tag':'run','autocomplete':true,'module':sessionBleue,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29005},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29011},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29062},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29062},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29062},'%tag':'run','autocomplete':true,'module':sessionJaune,'%frame':__frame}));
})([]))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29123},'%tag':'pragma','apply':function () {
console.log('-- FIN JOURNEY, ON RECOMMENCE--');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29295},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN',serveur);}})))));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29390},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29404},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29517},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29517},'direction':'OUT','name':'setComputeScorePolicy'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29572},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29600},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29728},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29735},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29744},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29752}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29761},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29772},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29805},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29873},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29884},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29923},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29954},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30303},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30303},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30303},'%tag':'run','autocomplete':true,'module':journey,'%frame':__frame}));
})([]),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30535},'%tag':'NOTHING'})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30540},'%tag':'pragma','apply':function () {
console.log('--Arret d\'Automate Opus 2');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30709},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30744},'%tag':'pragma','apply':function () {
console.log('-- STOP Opus 2');DAW.cleanQueues();oscMidiLocal.convertAndActivateClip(300);}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
