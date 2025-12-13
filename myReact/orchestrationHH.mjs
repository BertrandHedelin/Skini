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
var dureeSession=0;
var dureeSessionPrev=0;
const CCChannel=1;
const CCTransposeStrings=61;
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
const CCTransposeSaxo=72;
const CCTempo=100;
const tempoMax=160;
const tempoMin=40;
const CCdegre2Mineursaxo=73;
const CCtonalite=74;
const pianoNb=1;
const violonNb=2;
const corsNb=9;
const fluteNb=10;
const clarinetteNb=11;
const bassonsNb=12;
const percuNb=14;
const trompetteNb=8;
let compteurTransInit=407;
let compteurTrans=compteurTransInit;
let compteurTransMax=414;
let transposition=0;
let tonalite=0;
let tempoGlobal=60;
let changeTempo=0;
let premierAlea=0;
let deuxiemeAlea=0;
let troisiemeAlea=0;
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
};const degre2mineursaxo = function (value,par) {
if (value) {
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,100);} else {
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,0);}
if (debug) console.log('-- CCdegre2Mineur:',value);
};const setTonalite = function (CCtonalite,value,par) {
let CCTon=undefined;
CCTon=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCtonalite,CCTon);if (debug) console.log('-- setTonalite:',CCtonalite,'->',value,'demi-tons');
};const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('-- HH_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5'];
const reservoirPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':4745},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':4759},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':4782},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':4823},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':4861},'%tag':'dollar'},tank.makeReservoir(255,piano)));
const violons=['ViolonsIntro1','ViolonsIntro2','ViolonsIntro3','ViolonsIntro4','ViolonsIntro5','ViolonsIntro6','ViolonsMilieu1','ViolonsMilieu2','ViolonsMilieu3','ViolonsMilieu4','ViolonsFin1','ViolonsFin2','ViolonsFin3','ViolonsFin4','ViolonsFin5'];
const reservoirViolon=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5207},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5221},'direction':'IN','name':'stopReservoir'}),violons.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5244},'direction':'IN','name':n});
}),violons.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5287},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5327},'%tag':'dollar'},tank.makeReservoir(255,violons)));
const trompette=['Trompette1','Trompette2','Trompette3','Trompette4','Trompette5','Trompette6','Trompette7','Trompette8','Trompette9'];
const reservoirTrompette=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5555},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5569},'direction':'IN','name':'stopReservoir'}),trompette.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5592},'direction':'IN','name':n});
}),trompette.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5637},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5679},'%tag':'dollar'},tank.makeReservoir(255,trompette)));
const cors=['Cors1','Cors2','Cors3','Cors4'];
const reservoirCors=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5807},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5821},'direction':'IN','name':'stopReservoir'}),cors.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5844},'direction':'IN','name':n});
}),cors.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5884},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5921},'%tag':'dollar'},tank.makeReservoir(255,cors)));
const flute=['FluteDebut1','FluteDebut2','FluteDebut3','FluteDebut4','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteNeutre1','FluteNeutre2','FluteNeutre3'];
const reservoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6250},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6264},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6287},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6328},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6366},'%tag':'dollar'},tank.makeReservoir(255,flute)));
const clarinette=['ClarinetteDebut1','ClarinetteDebut2','ClarinetteDebut3','ClarinetteMilieu1','ClarinetteMilieu2','ClarinetteMilieu3','ClarinetteMilieu4','ClarinetteMilieu5','ClarinetteFin1','ClarinetteFin2','ClarinetteFin3'];
const reservoirClarinette=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6689},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6703},'direction':'IN','name':'stopReservoir'}),clarinette.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6726},'direction':'IN','name':n});
}),clarinette.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6772},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6815},'%tag':'dollar'},tank.makeReservoir(255,clarinette)));
const basson=['BassonDebut1','BassonDebut2','BassonDebut3','BassonDebut4','BassonMilieu1','BassonMilieu2','BassonMilieu3','BassonMilieu4','BassonMilieu5','BassonNeutre1','BassonNeutre2'];
const reservoirBasson=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7099},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7113},'direction':'IN','name':'stopReservoir'}),basson.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7136},'direction':'IN','name':n});
}),basson.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7178},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7217},'%tag':'dollar'},tank.makeReservoir(255,basson)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const reservoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7380},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7394},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7417},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7458},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7496},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8404},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8419},'%tag':'pragma','apply':function () {
console.log('-- Reset Automate Opus4');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8610},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8626},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8626},'direction':'IN','name':'stopMoveTempo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8654},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8661},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8679},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8725},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8739}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8753},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8770},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8815},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8867}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8885},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8908},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8953},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9128},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9150},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9193},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9431},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9631},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9646},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9735},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9735},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9735},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9735},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9807},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9835},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9865},'direction':'IN','name':n});
}),(function () {
let debut=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9892},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9898},'%tag':'hop','apply':function () {
debut=true;}}),(function () {
let avecPiano=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9916},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9922},'%tag':'hop','apply':function () {
avecPiano=false;}}),(function () {
let avecViolon=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9945},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9951},'%tag':'hop','apply':function () {
avecViolon=false;}}),(function () {
let cuiveBoisPercu=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9975},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9981},'%tag':'hop','apply':function () {
cuiveBoisPercu=true;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10009}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10022},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10026},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10049},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10053},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10079},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10102},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10156},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Opus 5',serveur);transposeAll(0,param);gcs.setTimerDivision(1);console.log('-- OPUS5 --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10519},'%tag':'pragma','apply':function () {
setTempo(80,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10595},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10611},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10629},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10662},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10835},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10851},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus 5',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10922},'%tag':'EMIT','signame':'NappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10967},'%tag':'EMIT','signame':'NappeAltoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11009},'%tag':'EMIT','signame':'NappeCelloOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11052},'%tag':'EMIT','signame':'NappeCTBOUT','apply':function () {
return [true,255];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11089},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11126},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11183},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeStrings,2,param);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11298},'%tag':'if','apply':function () {
return avecPiano;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11311},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11325},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11345},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11345},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11345},'%tag':'run','autocomplete':true,'module':reservoirPiano,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11411},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 25;
}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11508},'%tag':'EMIT','signame':'NappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11556},'%tag':'EMIT','signame':'NappeAltoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11601},'%tag':'EMIT','signame':'NappeCelloOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11647},'%tag':'EMIT','signame':'NappeCTBOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11687},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeStrings,0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11810},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}}))),$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11859},'%tag':'yield'}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11877},'%tag':'if','apply':function () {
return avecViolon;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11891},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11905},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11905},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11926},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Avec Violon',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12001},'%tag':'pragma','apply':function () {
setTempo(100,param);tempoGlobal=100;}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12110},'%tag':'par'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12130},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12154},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12154},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12154},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([])),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12239},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12300},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12325},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12370},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [true,255];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12416},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12462},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12508},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12555},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12616},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12638},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12638},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12638},'%tag':'run','autocomplete':true,'module':reservoirViolon,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12686},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12708},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12756},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12789},'%tag':'pragma','apply':function () {
DAW.cleanQueue(violonNb);}})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12881},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12925},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [false,255];
}}))),$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12980},'%tag':'yield'}),$$hiphop.IF({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12998},'%tag':'if','apply':function () {
return cuiveBoisPercu;
}},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13017},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13031},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Cuivre Bois Percu',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13110},'%tag':'pragma','apply':function () {
setTempo(90,param);tempoGlobal=90;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13210},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13249},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13249},'%tag':'SEQUENCE'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13270},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13292},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13292},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13292},'%tag':'run','autocomplete':true,'module':reservoirPercu,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13339},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13361},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13409},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13457},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13518},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13559},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13581},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13581},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13581},'%tag':'run','autocomplete':true,'module':reservoirBasson,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13629},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13651},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13699},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13761},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13802},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13824},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13824},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13824},'%tag':'run','autocomplete':true,'module':reservoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13871},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13893},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13941},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13989},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14030},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14052},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14052},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14052},'%tag':'run','autocomplete':true,'module':reservoirTrompette,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14103},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14125},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14173},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14221},'%tag':'pragma','apply':function () {
DAW.cleanQueue(fluteNb);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14268},'%tag':'pragma','apply':function () {
DAW.cleanQueue(trompetteNb);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14320},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14361},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14383},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14383},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14383},'%tag':'run','autocomplete':true,'module':reservoirCors,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14429},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14451},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14499},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14547},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14588},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14610},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14610},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14610},'%tag':'run','autocomplete':true,'module':reservoirClarinette,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14662},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14684},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14732},'%tag':'EMIT','signame':'stopReservoir'}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14797},'%tag':'EMIT','signame':'stopTransposition'})),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14851},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('stopTransposition','now')},$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14874}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14899},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14943},'%tag':'pragma','apply':function () {
transpose(CCTransposeTrompettes,1,param);transpose(CCTransposeCors,1,param);transpose(CCTransposeTrombones,1,param);transpose(CCTransposeFlutes,1,param);transpose(CCTransposeClarinettes,1,param);transpose(CCTransposeBassons,1,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15359},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15403},'%tag':'pragma','apply':function () {
transpose(CCTransposeTrompettes,2,param);transpose(CCTransposeCors,2,param);transpose(CCTransposeTrombones,2,param);transpose(CCTransposeFlutes,2,param);transpose(CCTransposeClarinettes,2,param);transpose(CCTransposeBassons,2,param);}})))))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15909},'%tag':'EMIT','signame':'NappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15955},'%tag':'EMIT','signame':'NappeAltoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15998},'%tag':'EMIT','signame':'NappeCelloOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16042},'%tag':'EMIT','signame':'NappeCTBOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16084},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16126},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16170},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16207},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Fin Opus5',serveur);}})))),$$hiphop.PAUSE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16308},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16453},'%tag':'EMIT','signame':'stopTransposition'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16485},'%tag':'EMIT','signame':'stopMoveTempo'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16513},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16536},'%tag':'pragma','apply':function () {
console.log('-- Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16579},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Opus 5',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16646},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16646},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16646},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':16677},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}));
})());
})()));
})());
})());
})());
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
