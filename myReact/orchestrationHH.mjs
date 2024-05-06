import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
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
var compteurTransInit=407;
var compteurTrans=compteurTransInit;
var compteurTransMax=414;
var transposition=0;
var tonalite=0;
var tempoGlobal=60;
var changeTempo=0;
var premierAlea=0;
var deuxiemeAlea=0;
var troisiemeAlea=0;
const Instruments=['sensor2','sensor3','sensor4'];
const setTempo = function (value,par) {
if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) console.log('Set tempo:',value);
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCTempo,tempo);};const transpose = function (CCinstrument,value,par) {
var CCTransposeValue;
CCTransposeValue=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCinstrument,CCTransposeValue);};const transposeAll = function (value) {
for (var i=61;i <= 74;i++) {
transpose(i,value);}
};const degre2mineursaxo = function (value) {
if (value) {
oscMidiLocal.controlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,100);} else {
oscMidiLocal.controlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,0);}
if (debug) console.log('-- CCdegre2Mineur:',value);
};const setTonalite = function (CCtonalite,value) {
var CCTon;
CCTon=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.controlChange(par.busMidiDAW,CCChannel,CCtonalite,CCTon);if (debug) console.log('-- setTonalite:',CCtonalite,'->',value,'demi-tons');
};const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':3327},'%tag':'fork'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':3369},'%tag':'sequence'},((g3399) => $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':3377},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g3399].now;
})());
}},$$hiphop.SIGACCESS({'signame':g3399,'pre':false,'val':false,'cnt':false})))(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':3416},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':3626},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':3643},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':3653},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':3663},'%tag':'abort','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':3733},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4105},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4176},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4259},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4348},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4401},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':4489},'%tag':'break'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4518},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4577},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4637},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4723},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};var reservoirSensor=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5151},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5165},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5165},'direction':'IN','name':'stopReservoir'}),Instruments.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5194},'direction':'IN','name':n})),Instruments.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5241},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5285},'%tag':'dollar'},makeReservoir(1,Instruments)));
let piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
var resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5705},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5719},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5742},'direction':'IN','name':n})),piano.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':5783},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5820},'%tag':'dollar'},makeReservoir(0,piano)));
let saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
var resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6171},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6186},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6209},'direction':'IN','name':n})),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6249},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6285},'%tag':'dollar'},makeReservoir(0,saxo)));
let brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
var resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6679},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6694},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6717},'direction':'IN','name':n})),brass.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6758},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6795},'%tag':'dollar'},makeReservoir(0,brass)));
let flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
var resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7190},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7205},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7228},'direction':'IN','name':n})),flute.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7269},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7306},'%tag':'dollar'},makeReservoir(0,flute)));
let percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
var resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7457},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7472},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7495},'direction':'IN','name':n})),percu.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7536},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7573},'%tag':'dollar'},makeReservoir(0,percu)));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
console.log('inter:',interTextIN,interTextOUT,IZsignals);const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8322},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8340},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8410},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8476},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8487},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8494},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':8515},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':8566},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':8576},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8585},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':8585},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':8585},'%tag':'run','autocomplete':true,'stopReservoirFlute':'stopReservoir','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8661},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':8970},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9007},'%tag':'emit','signame':'stopReservoirFlute'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9043},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9064},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9139},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9154},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9243},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9243},'direction':'INOUT','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9286},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9314},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9344},'direction':'IN','name':n})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9371},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9392},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9414},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9464},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9527},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('sensor0-1');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9576},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9576},'%tag':'fork'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9589},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':9614},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9641},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i++);}}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9772},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9812},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':9877},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':10096},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10180},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':10322},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10394},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10406},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10490},'%tag':'emit','signame':'stopReservoir'})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':10530},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10614},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':10706},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10788},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10881},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10893},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10957},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10957},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10957},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10989},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10989},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10989},'%tag':'run','autocomplete':true,'module':resevoirPiano1,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11026},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11026},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':11026},'%tag':'run','autocomplete':true,'module':resevoirSaxo,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11061},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11061},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':11061},'%tag':'run','autocomplete':true,'module':resevoirBrass,'%frame':__frame}));
})([]))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
