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
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':4447},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4485},'%tag':'sequence'},((g4515) => {
return $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4492},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4515].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4515,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4532},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4576},'%tag':'pragma','apply':function () {
console.log('makeAwait',val);}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4689},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':4716},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4726},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4736},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4807},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5180},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5232},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5297},'%tag':'pragma','apply':function () {
console.log('----------------- gcs = ',typeof gcs);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5370},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5458},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5509},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':5597},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5626},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5674},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5733},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5819},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
const resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6646},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6660},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6683},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6724},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6762},'%tag':'dollar'},makeReservoir(255,piano)));
const saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
const resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7116},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7130},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7153},'direction':'IN','name':n});
}),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7193},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7229},'%tag':'dollar'},makeReservoir(255,saxo)));
const brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
const resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7629},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7643},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7666},'direction':'IN','name':n});
}),brass.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7707},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7744},'%tag':'dollar'},makeReservoir(255,brass)));
const flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
const resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8145},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8159},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8182},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8223},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8260},'%tag':'dollar'},makeReservoir(255,flute)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8415},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8429},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8452},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8493},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8530},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9375},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9395},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9467},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9535},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9549},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9556},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9580},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9631},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9645},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9659},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9659},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':9659},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9737},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10056},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10098},'%tag':'EMIT','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10223},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10264},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10292},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10369},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10389},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10461},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10529},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10529},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10529},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10567},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10574},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10598},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':10612},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10612},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10626},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10676},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10676},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10676},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10749},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10891},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 58;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10932},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10962},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':11001},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':11027},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11471},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano: Pattern de fin en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11570},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':11680},'%tag':'EVERY','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11727},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11759},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11794},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':11864},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11898},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11973},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11992},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12064},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12132},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12146},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12153},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12175},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12175},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12187},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12258},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12258},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12258},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12326},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12337},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12375},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12411},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12638},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12678},'%tag':'EMIT','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12709},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12746},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12813},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12853},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12927},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12947},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13019},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13087},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13101},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13108},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':13139},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':13155},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13155},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13169},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':13252},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13268},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13268},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':13268},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13348},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13363},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13401},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13401},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':13401},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13482},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':13519},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13546},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13581},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13660},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13750},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13849},'%tag':'EMIT','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':13892},'%tag':'EXIT'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':13917},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13944},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13974},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14076},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14095},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14167},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14235},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14249}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14261},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14567},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14600},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14790},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14823},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15012},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15076},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15091},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4 sans jeu');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15292},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15308},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15321},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15328},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15347}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':15359},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15374},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15420},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15468}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15484},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15523},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15567},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15713},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15750},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15792},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15975},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15990},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16444},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16459},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16548},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16548},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16548},'direction':'INOUT','name':'stopSolo'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16601},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16629},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16659},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':16775}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16788},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16792},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16815},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16819},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16845},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16868},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16893},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Skini HH',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17451},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':17526},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':17551},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':17567},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17596},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':17769},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17831},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17831},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':17831},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17931},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17931},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':17931},'%tag':'run','autocomplete':true,'module':resevoirSaxo,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17995},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17995},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':17995},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18068},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18068},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18068},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':18132},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18177},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18280},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18280},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18280},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([])))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18343},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}));
})());
})()),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18387},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18419},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18419},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18419},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18444},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
