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
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4758},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4800},'%tag':'sequence'},((g4830) => {
return $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4808},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4830].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4830,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':4848},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5008},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4V2.hh.js','pos':5025},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5035},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5045},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5113},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5469},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5517},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5568},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5655},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5706},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4V2.hh.js','pos':5792},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5821},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5858},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5909},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5995},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
const resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6821},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6835},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6858},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6899},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6937},'%tag':'dollar'},makeReservoir(255,piano)));
const saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
const resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7507},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7521},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7544},'direction':'IN','name':n});
}),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7584},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7620},'%tag':'dollar'},makeReservoir(255,saxo)));
const brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
const resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8020},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8034},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8057},'direction':'IN','name':n});
}),brass.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8098},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8135},'%tag':'dollar'},makeReservoir(255,brass)));
const flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
const resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8536},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8550},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8573},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8614},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8651},'%tag':'dollar'},makeReservoir(255,flute)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8808},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8822},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8845},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8886},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8923},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9767},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9787},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9859},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9927},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9941},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9948},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9972},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10023},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10037},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10051},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10051},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10051},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10127},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10436},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10478},'%tag':'EMIT','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10603},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10643},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10667},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10744},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10764},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10836},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10904},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10904},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10904},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10943},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10950},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10974},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10988},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10988},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11002},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11052},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11052},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11052},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11129},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11271},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 58;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11311},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11341},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':11381},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11407},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11859},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano: Pattern de fin en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11957},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12013},'%tag':'EVERY','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12059},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12091},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12127},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':12199},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12233},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12309},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12328},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12400},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12468},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12482},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12489},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12511},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12511},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12523},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12595},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12595},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12595},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12666},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12677},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12714},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12750},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12978},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13017},'%tag':'EMIT','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13048},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13085},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13153},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13194},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13269},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13289},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13361},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13429},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13443},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13450},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':13481},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13496},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13496},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13510},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13593},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13609},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13609},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13609},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13694},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13709},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13746},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13746},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13746},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13832},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13868},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13895},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13930},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14010},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14100},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14198},'%tag':'EMIT','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':14241},'%tag':'EXIT'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14266},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14293},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14323},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14426},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14445},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14517},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14585},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14585},'direction':'IN','name':'stopTransposition'}),$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14618},'%tag':'WEAKABORT','immediate':false,'apply':function () {
return ((() => {
const stopTransposition=this.stopTransposition;return stopTransposition.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopTransposition','pre':false,'val':false,'cnt':false}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14659}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14673},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14986},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15020},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15220},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15254},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15453},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15567},'%tag':'pragma','apply':function () {
console.log('-- Stop transpositions');}}));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15644},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15659},'%tag':'pragma','apply':function () {
console.log('-- Reset Automate Opus4');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15850},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15866},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15866},'direction':'IN','name':'stopMoveTempo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15894},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15901},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15919},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15965},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopMoveTempo=this.stopMoveTempo;return stopMoveTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopMoveTempo','pre':false,'val':false,'cnt':false}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16007}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16021},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16038},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16085},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16137}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16155},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16196},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16241},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16391},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16430},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16473},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16651},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16723},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16738},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17187},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17202},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17291},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17291},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17291},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17291},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17363},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17391},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17421},'direction':'IN','name':n});
}),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17505},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17511},'%tag':'hop','apply':function () {
sensors=false;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17533}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17546},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17550},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17573},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17577},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17603},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17626},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17650},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Opus 4',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);console.log('-- OPUS4V1 --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18242},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18317},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18342},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18358},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18387},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18558},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18576},'%tag':'if','apply':function () {
return sensors;
}},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18605},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18684},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18734},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
console.log(' *-*-*-*-*-*-*- Sensor RC0',INTERFACEZ_RC0.nowval);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18825},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
utilsSkini.alertInfoScoreON('Sensor RC0 : ' + INTERFACEZ_RC0.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18929},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18929},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18929},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19007},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19007},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19007},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19060},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19078},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19117},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19139},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19139},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19139},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19206},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19206},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19206},'%tag':'run','autocomplete':true,'module':transposeSaxoModal,'%frame':__frame}));
})([]))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19527},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19527},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19527},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19578},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19596},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19635},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19635},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19635},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19695},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19737},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('-- Pattern :',patternSignal.nowval);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19945},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19945},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':19945},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([])))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20130},'%tag':'EMIT','signame':'stopTransposition'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20162},'%tag':'EMIT','signame':'stopMoveTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20185},'%tag':'pragma','apply':function () {
console.log('-- Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20228},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Opus 4',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20295},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20295},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20295},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':20326},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}));
})());
})()));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
