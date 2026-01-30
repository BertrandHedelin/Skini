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
})([]))),$$hiphop.EXIT({'trans':'trans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12325},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':12345},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13274},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 3;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13390},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13456},'%tag':'EMIT','signame':'violonsBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13494},'%tag':'EMIT','signame':'altosBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13530},'%tag':'EMIT','signame':'contrebassesBleuOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':13699},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Bleue',serveur);console.log('-- FIN SESSION Bleue --');utilsSkini.removeSceneScore(3,serveur);DAW.cleanQueues();}})));
const sessionRouge=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14069},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14087},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14157},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14223},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14223},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14223},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14267},'direction':'IN','name':'abortSessionRouge'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14291},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14298},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14313},'name':'abortTheSession'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14330},'name':'stopEveryAbort'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14350},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Rouge --');utilsSkini.addSceneScore(2,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14531},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14564},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violons Rouges',true);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14636},'%tag':'FORK'},$$hiphop.TRAP({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14645},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14666},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14678},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('abortSessionRouge','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14715},'%tag':'pragma','apply':function () {
const abortSessionRouge=this.abortSessionRouge;{
console.log('-- depuis SESSION Noire: abortSessionRouge --',abortSessionRouge.nowval);}}},$$hiphop.SIGACCESS({'signame':'abortSessionRouge','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14826},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14854},'%tag':'EMIT','signame':'abortTheSession'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14885},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14933},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':14975},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15019},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15062},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15104},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15148},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15207},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15217},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('stopEveryAbort','now')}),$$hiphop.EXIT({'trapPourAbort':'trapPourAbort','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15256},'%tag':'EXIT'})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15285},'%tag':'par'},$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15293},'%tag':'WEAKABORT','immediate':false,'apply':new $$hiphop.DelaySig('abortTheSession','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15309},'%tag':'FORK'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15320},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('violonsRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15373},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')})),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15401},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15419},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15419},'%tag':'SEQUENCE'},$$hiphop.TRAP({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15431},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15448},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15462},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15462},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15462},'%tag':'run','autocomplete':true,'module':resevoirCorsRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15503},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15516},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15556},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapCor':'trapCor','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15587},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15617}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15632},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15659},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeCors,transposition,param);}})))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15817},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15830},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15830},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15830},'%tag':'run','autocomplete':true,'module':resevoirBassonsRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15885},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15885},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15885},'%tag':'run','autocomplete':true,'module':resevoirFlutesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15939},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15939},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15939},'%tag':'run','autocomplete':true,'module':resevoirHautboisRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15995},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15995},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':15995},'%tag':'run','autocomplete':true,'module':resevoirClarinettesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16042},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16054},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16079},'%tag':'pragma','apply':function () {
transposition=(transposition + 3) % 9;transpose(CCTransposeClarinettes,transposition,param);transpose(CCTransposeFlutes,transposition,param);transpose(CCTransposeHaubois,transposition,param);transpose(CCTransposeBassons,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16394},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16406},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16445},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16491},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16491},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16509},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16558},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16601},'%tag':'EMIT','signame':'violonsRouge1OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16646},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16689},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16731},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [true,255];
}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16786},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16799},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16799},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16799},'%tag':'run','autocomplete':true,'module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16836},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16849},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16889},'%tag':'EMIT','signame':'stopReservoir'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':16929},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17003},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17045},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17062},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17078},'%tag':'EMIT','signame':'contrebassesRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17120},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Contrebasses rouges',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17205},'%tag':'EMIT','signame':'cellosRouge1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17241},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Violoncelles rouges',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17321},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('cellosRouge1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17364}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17377},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17402},'%tag':'pragma','apply':function () {
}}))))),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17601},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17612},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17612},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17612},'%tag':'run','autocomplete':true,'module':resevoirTrompettesRouge,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17666},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17666},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17666},'%tag':'run','autocomplete':true,'module':resevoirTrombonesRouge,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17709},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17719},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17756},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17788},'%tag':'EMIT','signame':'violonsRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17829},'%tag':'EMIT','signame':'cellosRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17869},'%tag':'EMIT','signame':'contrebassesRouge2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17910},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':17972},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Rouge',serveur);DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18128},'%tag':'EMIT','signame':'stopEveryAbort'})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18187},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18207},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Rouge --');DAW.cleanQueues();utilsSkini.removeSceneScore(2,serveur);}})))));
const sessionNoire=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18440},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18458},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18528},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18595},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18595},'direction':'IN','name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18595},'direction':'IN','name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18661},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18661},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18661},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18705},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18729},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Noire --');utilsSkini.alertInfoScoreON('SESSION Noire',serveur);utilsSkini.addSceneScore(1,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18965},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('abortSessionNoire','now')},$$hiphop.SUSPEND({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':18994},'immediate':false,'apply':function () {
return ((() => {
const suspendSessionNoire=this.suspendSessionNoire;return suspendSessionNoire.nowval === true;
})());
}},$$hiphop.SIGACCESS({'signame':'suspendSessionNoire','pre':false,'val':true,'cnt':false}),$$hiphop.TRAP({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19008},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19022},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19034},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19047},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19047},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19047},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19099},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19125},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transpose(CCTransposePianos,transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19265},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19277},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19311},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19311},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19311},'%tag':'run','autocomplete':true,'module':resevoirViolonsNoir,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19353},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19365},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19399},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19399},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19399},'%tag':'run','autocomplete':true,'module':resevoirCellosNoir,'%frame':__frame}));
})([]))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19447},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19458},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EXIT({'part1':'part1','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19497},'%tag':'EXIT'})))),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19534},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19552},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19564},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19564},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19564},'%tag':'run','autocomplete':true,'module':resevoirFlutesNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19615},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19615},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19615},'%tag':'run','autocomplete':true,'module':resevoirBassonsNoir,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19667},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19667},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19667},'%tag':'run','autocomplete':true,'module':resevoirPianoNoir,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19717},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19742},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19861},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19872},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 7;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19910},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':19939},'%tag':'EXIT'})))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20061},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20143},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Fin',true);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20203},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Noire --');utilsSkini.removeSceneScore(1,serveur);utilsSkini.alertInfoScoreON('FIN SESSION Noire',serveur);}}));
let aleaJaune=0;
const sessionJaune=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20422},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20440},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20510},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20576},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20576},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20576},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20620},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20627},'name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20642},'name':'stopReservoirSessionNoire'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20671},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20678},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20699},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20718},'name':'abortSessionRouge'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20737},'name':'stopSustainSessionNoire'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20765},'%tag':'pragma','apply':function () {
aleaJaune=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- aleaJaune:',aleaJaune);
}}),$$hiphop.TRAP({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20893},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20909},'%tag':'FORK'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20919},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20919},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':20930},'%tag':'pragma','apply':function () {
console.log('-- DEBUT SESSION Jaune --');utilsSkini.alertInfoScoreON('SESSION Jaune',serveur);utilsSkini.addSceneScore(4,serveur);transposition=0;gcs.setTimerDivision(16);transposeAll(0,param);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21190},'%tag':'if','apply':function () {
return aleaJaune === 0;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21213},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21221},'%tag':'pragma','apply':function () {
setTempo(200,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21262},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21302},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21343},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21418},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21451},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21508},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21549},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21583},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21658},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21697},'%tag':'if','apply':function () {
return aleaJaune === 1;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21718},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21726},'%tag':'pragma','apply':function () {
setTempo(120,param);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21767},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21808},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21842},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21917},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':21950},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22007},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22047},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22088},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22163},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 15;
}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22203},'%tag':'if','apply':function () {
return aleaJaune === 2;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22224},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22232},'%tag':'pragma','apply':function () {
setTempo(160);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22266},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22307},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22382},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22415},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22472},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22508},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22583},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22622},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22658},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22733},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22771},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22805},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22880},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22927},'%tag':'pragma','apply':function () {
console.log('aleaJaune X:',aleaJaune);}})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':22993},'%tag':'EMIT','signame':'cellosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23033},'%tag':'EMIT','signame':'contrebassesJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23079},'%tag':'EMIT','signame':'violonsJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23120},'%tag':'EMIT','signame':'altosJauneOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23154},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Cordes Jaunes',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23229},'%tag':'pragma','apply':function () {
console.log('-- FIN SESSION Jaune --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23280},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23376},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23414},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23467},'%tag':'EMIT','signame':'abortSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23499},'%tag':'EMIT','signame':'abortSessionRouge'}),$$hiphop.EXIT({'trapTrans':'trapTrans','%location':{'filename':'./pieces/opus/opus2.hh.js','pos':23531},'%tag':'EXIT'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25304}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25317},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune1' || patternSignal.nowval[1] === 'VioloncelleJaune3' || patternSignal.nowval[1] === 'VioloncelleJaune6');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25527},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25623},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25636},'%tag':'if','apply':function () {
return aleaJaune > 1;
}},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25664},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25664},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25664},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25716},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25731},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25731},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25731},'%tag':'run','autocomplete':true,'stopReservoirSessionNoire':'stopReservoir','module':sessionNoire,'%frame':__frame}));
})([]),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25826},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25826},'%tag':'SEQUENCE'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':25842},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'VioloncelleJaune2' || patternSignal.nowval[1] === 'VioloncelleJaune4' || patternSignal.nowval[1] === 'VioloncelleJaune5');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26068},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26168},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26254},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return true;
}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26300},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26315},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune1');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26414},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26514},'%tag':'pragma','apply':function () {
console.log('--- Opus2: session Jaune: FIN Suspend Session Noire');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26604},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26669},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26681},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return (patternSignal.now && patternSignal.nowval[1] === 'ContrebasseJaune2');
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26777},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- Opus2: session Jaune: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26879},'%tag':'EMIT','signame':'suspendSessionNoire','apply':function () {
return false;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':26919},'%tag':'EMIT','signame':'stopReservoirSessionNoire'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27003},'%tag':'EMIT','signame':'abortSessionNoire','apply':function () {
return 1;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27037},'%tag':'EMIT','signame':'abortSessionRouge','apply':function () {
return 1;
}}))))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27093},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27117},'%tag':'pragma','apply':function () {
transposition=(transposition + 1) % 6;transposeAll(transposition,param);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27236},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN SESSION Jaune',serveur);utilsSkini.removeSceneScore(4,serveur);DAW.cleanQueues();}}))));
let choiceRandom=0;
const journey=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27425},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27443},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27513},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27579},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27607},'direction':'OUT','name':'setComputeScorePolicy'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27636},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27636},'direction':'IN','name':'setTimerDivision'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27636},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27680},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27687},'name':'choixHasard','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27703},'name':'theEnd'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27711},'name':'stopReservoir'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27841},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27848},'name':'suspendSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27869},'name':'abortSessionNoire'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27888},'name':'abortSessionRouge'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27910},'%tag':'pragma','apply':function () {
console.log('-- DEBUT JOURNEY --');}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27957}},$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27967},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':27978},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28028},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(2,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28078},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(3,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28128},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(4,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28178},'%tag':'pragma','apply':function () {
utilsSkini.refreshSceneScore(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28262},'%tag':'pragma','apply':function () {
choiceRandom=0.75;}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28287},'%tag':'pragma','apply':function () {
console.log('-- Journey random:',choiceRandom);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28346},'%tag':'if','apply':function () {
return choiceRandom <= 0.25;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28372},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28378},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28499},'%tag':'FORK'},$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28554},'%tag':'NOTHING'}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28567},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28567},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28567},'%tag':'run','autocomplete':true,'module':sessionJaune,'%frame':__frame}));
})([]),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28660},'%tag':'NOTHING'}))),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28673},'%tag':'if','apply':function () {
return choiceRandom <= 0.50;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28699},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28705},'%tag':'pragma','apply':function () {
setTempo(90,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28739},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28788},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28788},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28788},'%tag':'run','autocomplete':true,'module':sessionRouge,'%frame':__frame}));
})([])),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28832},'%tag':'if','apply':function () {
return choiceRandom <= 0.75;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28858},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28869},'%tag':'EMIT','signame':'setTimerDivision','apply':function () {
return 4;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28917},'%tag':'pragma','apply':function () {
setTempo(90,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28950},'%tag':'pragma','apply':function () {
transposeAll(0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':28987},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29038},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29038},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29038},'%tag':'run','autocomplete':true,'module':sessionBleue,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29086},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29092},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29143},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29143},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29143},'%tag':'run','autocomplete':true,'module':sessionJaune,'%frame':__frame}));
})([]))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29204},'%tag':'pragma','apply':function () {
console.log('-- FIN JOURNEY, ON RECOMMENCE--');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29391},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('FIN',serveur);}})))));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29486},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29500},'direction':'IN','name':'resetMatriceDesPossibles'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29613},'direction':'OUT','name':'setComputeScoreClass'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29613},'direction':'OUT','name':'setComputeScorePolicy'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29668},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29696},'direction':'IN','name':n});
}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29824},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29831},'name':'temps','init_func':function () {
return 0;
}}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29840},'name':'size'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29848}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29857},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29868},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29901},'%tag':'pragma','apply':function () {
console.log('--Démarrage automate des possibles Opus2');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29969},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':29980},'%tag':'EVERY','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30019},'%tag':'EMIT','signame':'temps','apply':function () {
return ((() => {
const temps=this.temps;return temps.preval + 1;
})());
}},$$hiphop.SIGACCESS({'signame':'temps','pre':true,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30050},'%tag':'pragma','apply':function () {
const temps=this.temps;{
if (debug) {
currentTime=Date.now();console.log('--Automate des possibles: tick ',temps.nowval,'intervale du tick:',currentTime - currentTimePrev);currentTimePrev=currentTime;}
gcs.setTickOnControler(temps.nowval);}}},$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'temps','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30399},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30399},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30399},'%tag':'run','autocomplete':true,'module':journey,'%frame':__frame}));
})([]),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30631},'%tag':'NOTHING'})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30636},'%tag':'pragma','apply':function () {
console.log('--Arret d\'Automate Opus 2');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus2.hh.js','pos':30820},'%tag':'EMIT','signame':'temps','apply':function () {
return 0;
}})))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
