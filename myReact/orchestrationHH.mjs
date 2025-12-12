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
const reservoirPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5205},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5219},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5242},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5283},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5321},'%tag':'dollar'},tank.makeReservoir(255,piano)));
const violons=['ViolonsIntro1','ViolonsIntro2','ViolonsIntro3','ViolonsIntro4','ViolonsIntro5','ViolonsIntro6','ViolonsMilieu1','ViolonsMilieu2','ViolonsMilieu3','ViolonsMilieu4','ViolonsFin1','ViolonsFin2','ViolonsFin3','ViolonsFin4','ViolonsFin5'];
const reservoirViolon=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5667},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5681},'direction':'IN','name':'stopReservoir'}),violons.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5704},'direction':'IN','name':n});
}),violons.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5747},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':5787},'%tag':'dollar'},tank.makeReservoir(255,violons)));
const trompette=['Trompette1','Trompette2','Trompette3','Trompette4','Trompette5','Trompette6','Trompette7','Trompette8','Trompette9'];
const reservoirTrompette=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6015},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6029},'direction':'IN','name':'stopReservoir'}),trompette.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6052},'direction':'IN','name':n});
}),trompette.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6097},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6139},'%tag':'dollar'},tank.makeReservoir(255,trompette)));
const cors=['Cors1','Cors2','Cors3','Cors4'];
const reservoirCors=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6267},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6281},'direction':'IN','name':'stopReservoir'}),cors.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6304},'direction':'IN','name':n});
}),cors.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6344},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6381},'%tag':'dollar'},tank.makeReservoir(255,cors)));
const flute=['FluteDebut1','FluteDebut2','FluteDebut3','FluteDebut4','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteNeutre1','FluteNeutre2','FluteNeutre3'];
const reservoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6710},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6724},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6747},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6788},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':6826},'%tag':'dollar'},tank.makeReservoir(255,flute)));
const clarinette=['ClarinetteDebut1','ClarinetteDebut2','ClarinetteDebut3','ClarinetteMilieu1','ClarinetteMilieu2','ClarinetteMilieu3','ClarinetteMilieu4','ClarinetteMilieu5','ClarinetteFin1','ClarinetteFin2','ClarinetteFin3'];
const reservoirClarinette=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7149},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7163},'direction':'IN','name':'stopReservoir'}),clarinette.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7186},'direction':'IN','name':n});
}),clarinette.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7232},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7275},'%tag':'dollar'},tank.makeReservoir(255,clarinette)));
const basson=['BassonDebut1','BassonDebut2','BassonDebut3','BassonDebut4','BassonMilieu1','BassonMilieu2','BassonMilieu3','BassonMilieu4','BassonMilieu5','BassonNeutre1','BassonNeutre2'];
const reservoirBasson=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7559},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7573},'direction':'IN','name':'stopReservoir'}),basson.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7596},'direction':'IN','name':n});
}),basson.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7638},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7677},'%tag':'dollar'},tank.makeReservoir(255,basson)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const reservoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7840},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7854},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7877},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7918},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':7956},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8865},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8885},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':8957},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9025},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9039},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9046},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9070},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9121},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9135},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9149},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9149},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9149},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':reservoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9226},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9535},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 57;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9577},'%tag':'EMIT','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9702},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9743},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9767},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9852},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9871},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':9943},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10011},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10011},'direction':'IN','name':'stopTransposition'}),$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10044},'%tag':'WEAKABORT','immediate':false,'apply':new $$hiphop.DelaySig('stopTransposition','now')},$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10062}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10076},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10389},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 8;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10423},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10623},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 8;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10657},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':10856},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 8;
}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11000},'%tag':'pragma','apply':function () {
console.log('-- Stop transpositions');}}));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11077},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11092},'%tag':'pragma','apply':function () {
console.log('-- Reset Automate Opus4');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11283},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11299},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11299},'direction':'IN','name':'stopMoveTempo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11327},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11334},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11352},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11398},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11412}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11426},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11443},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11488},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11540}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11558},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11581},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11626},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11801},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11823},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 2;
}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':11866},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12104},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12304},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12319},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12408},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12408},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12408},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12408},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12480},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12508},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12538},'direction':'IN','name':n});
}),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12622},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12628},'%tag':'hop','apply':function () {
sensors=false;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12650}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12663},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12667},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12690},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12694},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12720},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12743},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':12797},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Opus 5',serveur);transposeAll(0,param);gcs.setTimerDivision(1);console.log('-- OPUS5 --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13160},'%tag':'pragma','apply':function () {
setTempo(80,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13236},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13252},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13270},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13303},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13476},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13494},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Opus 5',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13567},'%tag':'EMIT','signame':'NappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13614},'%tag':'EMIT','signame':'NappeAltoOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13658},'%tag':'EMIT','signame':'NappeCelloOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13703},'%tag':'EMIT','signame':'NappeCTBOUT','apply':function () {
return [true,255];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13742},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13781},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13840},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeStrings,2,param);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13978},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13978},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':13978},'%tag':'run','autocomplete':true,'module':reservoirPiano,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14028},'%tag':'EMIT','signame':'NappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14076},'%tag':'EMIT','signame':'NappeAltoOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14121},'%tag':'EMIT','signame':'NappeCelloOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14167},'%tag':'EMIT','signame':'NappeCTBOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14207},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeStrings,0,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14346},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14386},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14386},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14409},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Avec Violon',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14486},'%tag':'pragma','apply':function () {
setTempo(100,param);tempoGlobal=100;}})),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14627},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14655},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14655},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14655},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14757},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [true,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14800},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [true,255];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14844},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14883},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14883},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14883},'%tag':'run','autocomplete':true,'module':reservoirViolon,'%frame':__frame}));
})([]),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14934},'%tag':'EMIT','signame':'S1ActionOUT','apply':function () {
return [false,255];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':14978},'%tag':'EMIT','signame':'NappeCTBRythmeOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15023},'%tag':'pragma','apply':function () {
DAW.cleanQueues();}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15079},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('patternSignal','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15121},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('-- Pattern :',patternSignal.nowval);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15327},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15327},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15327},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15529},'%tag':'EMIT','signame':'stopTransposition'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15561},'%tag':'EMIT','signame':'stopMoveTempo'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15589},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15612},'%tag':'pragma','apply':function () {
console.log('-- Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15655},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Opus 5',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15722},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15722},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15722},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus/opus5.hh.js','pos':15753},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}));
})());
})()));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
