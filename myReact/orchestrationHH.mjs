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
CCTransposeValue=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCinstrument,CCTransposeValue);if (debug1) console.log('-- Transposition instrument:',CCinstrument,'->',value,'demi-tons');
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
if (debug1) console.log('hh_ORCHESTRATION: setServ OPUS4V3');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4565},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4607},'%tag':'sequence'},((g4637) => {
return $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4615},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4637].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4637,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4655},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4815},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4V2.hh.js','pos':4832},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4842},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4852},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4920},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5276},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5324},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5375},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5462},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5513},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4V2.hh.js','pos':5599},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5628},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5665},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5716},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5802},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
const resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6629},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6643},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6666},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6707},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6745},'%tag':'dollar'},makeReservoir(255,piano)));
const saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
const resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7155},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7169},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7192},'direction':'IN','name':n});
}),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7232},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7268},'%tag':'dollar'},makeReservoir(255,saxo)));
const brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
const resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7668},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7682},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7705},'direction':'IN','name':n});
}),brass.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7746},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7783},'%tag':'dollar'},makeReservoir(255,brass)));
const flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
const resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8184},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8198},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8221},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8262},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8299},'%tag':'dollar'},makeReservoir(255,flute)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8456},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8470},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8493},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8534},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8571},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9415},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9435},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9507},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9575},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9589},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9596},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9620},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':9671},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9685},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9699},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9699},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9699},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9775},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10084},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10126},'%tag':'EMIT','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10251},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10291},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10315},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10392},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10412},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10484},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10552},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10552},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10552},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10591},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10598},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10622},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10636},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10636},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10650},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10700},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10700},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10700},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10777},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10919},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 58;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10959},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10989},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':11029},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11055},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11503},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano: Pattern de fin en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11601},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11657},'%tag':'EVERY','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11703},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11735},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11771},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':11843},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11877},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11953},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11972},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12044},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12112},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12126},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12133},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12155},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12155},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12167},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12239},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12239},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12239},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12310},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12321},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12358},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12394},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12622},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12661},'%tag':'EMIT','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12692},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12729},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12797},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12838},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12913},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12933},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13005},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13073},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13087},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13094},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':13125},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13140},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13140},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13154},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13237},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13253},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13253},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13253},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13338},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13353},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13390},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13390},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13390},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13476},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13512},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13539},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13574},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13654},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13744},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13842},'%tag':'EMIT','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':13885},'%tag':'EXIT'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13910},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13937},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13967},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14070},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14089},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14161},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14229},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14243}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14255},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14556},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14588},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14778},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14810},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14999},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15062},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15077},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15267},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15283},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15296},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15303},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15322}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15334},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15349},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15394},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15440}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15456},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15495},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15538},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15676},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15713},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15754},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15937},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15952},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16402},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16417},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16506},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16506},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16506},'direction':'INOUT','name':'stopSolo'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16559},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16587},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16617},'direction':'IN','name':n});
}),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16701},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16707},'%tag':'hop','apply':function () {
sensors=false;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16729}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16742},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16746},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16769},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16773},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16799},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16822},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16847},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Opus 4',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);console.log('-- OPUS4V2 --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17439},'%tag':'pragma','apply':function () {
setTempo(80,param);tempoGlobal=80;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17514},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17539},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17555},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17584},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17755},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17837},'%tag':'if','apply':function () {
return sensors;
}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17866},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17889},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17970},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18022},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
console.log(' *-*-*-*-*-*-*- Sensor RC0',INTERFACEZ_RC0.nowval);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18115},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
utilsSkini.alertInfoScoreON('Sensor RC0 : ' + INTERFACEZ_RC0.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18221},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18221},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18221},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18546},'%tag':'NOTHING'})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18583},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18583},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18583},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18636},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18654},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18695},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18717},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18717},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18717},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18784},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18784},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18784},'%tag':'run','autocomplete':true,'module':transposeSaxoModal,'%frame':__frame}));
})([]))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18845},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18863},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18904},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18904},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18904},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18955},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18973},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19014},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19014},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19014},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19074},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19116},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19221},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19221},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19221},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([])))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19284},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19324},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Opus 4',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19391},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19391},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19391},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19422},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}));
})());
})()),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19567},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19599},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19599},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19599},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19628},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Fin Opus 4',serveur);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19692},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
