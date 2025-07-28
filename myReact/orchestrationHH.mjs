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
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':4329},'%tag':'fork'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4371},'%tag':'sequence'},((g4401) => $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4379},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4401].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4401,'pre':false,'val':false,'cnt':false})))(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4419},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4629},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':4646},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4656},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4666},'%tag':'abort','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4736},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5108},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5179},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5262},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5351},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5404},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':5492},'%tag':'break'})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5521},'%tag':'pragma','apply':function () {
console.log('--- FIN FORCEE DU RESERVOIR:',instrument[0]);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5598},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5657},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5717},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5803},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
const resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6584},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6598},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6621},'direction':'IN','name':n})),piano.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6662},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6699},'%tag':'dollar'},makeReservoir(255,piano)));
const saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
const resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7056},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7071},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7094},'direction':'IN','name':n})),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7134},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7170},'%tag':'dollar'},makeReservoir(255,saxo)));
const brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
const resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7570},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7585},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7608},'direction':'IN','name':n})),brass.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7649},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7686},'%tag':'dollar'},makeReservoir(255,brass)));
const flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
const resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8087},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8102},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8125},'direction':'IN','name':n})),flute.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8166},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8203},'%tag':'dollar'},makeReservoir(255,flute)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8358},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8373},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8396},'direction':'IN','name':n})),percu.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8437},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8474},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9317},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9337},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9409},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9477},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9491},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9498},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9522},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9573},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9587},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9601},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9601},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':9601},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9679},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9998},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10040},'%tag':'emit','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10165},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10206},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10234},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10311},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10331},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10403},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10471},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10471},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10471},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10509},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10516},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10540},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':10554},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10554},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10568},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10618},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10618},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10618},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10691},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10833},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 58;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10874},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10904},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10943},'%tag':'break'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':10969},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11413},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano: Pattern de fin en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11512},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':11622},'%tag':'every','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11669},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11701},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11736},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':11806},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11840},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11915},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11934},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12006},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12074},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12088},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12095},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12117},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12117},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12129},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12200},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12200},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12200},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12268},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12279},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12317},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12353},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12580},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12620},'%tag':'emit','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12651},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12688},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12755},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12795},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12869},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12889},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12961},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13029},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13043},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13050},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':13081},'%tag':'brass'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':13097},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13097},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13111},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':13194},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13210},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13210},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':13210},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13290},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13305},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13343},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13343},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':13343},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13424},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':13461},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13488},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13523},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13602},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13692},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13791},'%tag':'emit','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':13834},'%tag':'break'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':13859},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13886},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13916},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14018},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14037},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14109},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14177},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14191}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14203},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14509},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14542},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14732},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14765},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14954},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15018},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15033},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4 sans jeu');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15234},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15250},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15263},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15270},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15289}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':15301},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15316},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15362},'%tag':'emit','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15410}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15426},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15465},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15509},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15655},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15692},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15734},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15917},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15932},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16381},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16396},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16485},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16485},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16485},'direction':'INOUT','name':'stopSolo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16538},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16566},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':16596},'direction':'IN','name':n})),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16680},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16686},'%tag':'hop','apply':function () {
sensors=false;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':16708}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16720},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16724},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16747},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16751},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16777},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16801},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Skini HH',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17317},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':17393},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':17418},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':17435},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17464},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17531},'%tag':'par'},$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':17547},'%tag':'if','apply':function () {
return sensors;
}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':17811},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':17833},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17950},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18037},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18089},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18089},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18089},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':18170},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18287},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18374},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18425},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18478},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18478},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18478},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([])))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':19076},'%tag':'if','apply':function () {
return !sensors;
}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':19102},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19102},'%tag':'fork'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':19506},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19529},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19529},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19529},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19606},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19606},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19606},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':19683},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19740},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19740},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19740},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([])),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19817},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19817},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19817},'%tag':'run','autocomplete':true,'module':transposeSaxoModal,'%frame':__frame}));
})([]),$$hiphop.NOTHING({'%location':{'filename':'./pieces/opus4.hh.js','pos':20041},'%tag':'nothing'}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':20063},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':20063},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':20063},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':20124},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':20168},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':20291},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':20367},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}));
})());
})()));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
