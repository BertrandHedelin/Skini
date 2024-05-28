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
const setTempo = function (value,par) {
if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) console.log('Set tempo:',value);
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCTempo,tempo);};const transpose = function (CCinstrument,value,par) {
var CCTransposeValue;
CCTransposeValue=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCinstrument,CCTransposeValue);};const transposeAll = function (value,par) {
for (var i=61;i <= 74;i++) {
transpose(i,value,par);}
};const degre2mineursaxo = function (value,par) {
if (value) {
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,100);} else {
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCdegre2Mineursaxo,0);}
if (debug) console.log('-- CCdegre2Mineur:',value);
};const setTonalite = function (CCtonalite,value,par) {
var CCTon;
CCTon=Math.round(1763 / 1000 * value + 635 / 10);oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCtonalite,CCTon);if (debug) console.log('-- setTonalite:',CCtonalite,'->',value,'demi-tons');
};const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':4017},'%tag':'fork'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4059},'%tag':'sequence'},((g4089) => $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4067},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4089].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4089,'pre':false,'val':false,'cnt':false})))(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4107},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4317},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':4334},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4344},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4354},'%tag':'abort','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4424},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4796},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4867},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4950},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5039},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5092},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':5180},'%tag':'break'})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5209},'%tag':'pragma','apply':function () {
console.log('--- FIN FORCEE DU RESERVOIR:',instrument[0]);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5286},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5345},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5405},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5491},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};let piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
var resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6316},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6330},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6353},'direction':'IN','name':n})),piano.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6394},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6431},'%tag':'dollar'},makeReservoir(255,piano)));
let saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
var resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6784},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6799},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6822},'direction':'IN','name':n})),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6862},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6898},'%tag':'dollar'},makeReservoir(255,saxo)));
let brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
var resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7294},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7309},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7332},'direction':'IN','name':n})),brass.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7373},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7410},'%tag':'dollar'},makeReservoir(255,brass)));
let flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
var resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7807},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7822},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7845},'direction':'IN','name':n})),flute.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7886},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7923},'%tag':'dollar'},makeReservoir(255,flute)));
let percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
var resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8074},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8089},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8112},'direction':'IN','name':n})),percu.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8153},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8190},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9044},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9064},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9136},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9204},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9218},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9225},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9249},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9302},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9316},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9330},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9330},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':9330},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9408},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9727},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9769},'%tag':'emit','signame':'stopReservoirFlute'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9807},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9835},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9912},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9932},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10004},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10072},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10072},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10072},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10110},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10117},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10141},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':10155},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10155},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10169},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10219},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10219},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10219},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10292},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10434},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 55;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10475},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10511},'%tag':'break'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':10537},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10981},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano1: Pattern en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11074},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':11184},'%tag':'every','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11231},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11263},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':11333},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11367},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11442},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11461},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11533},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11601},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11615},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11622},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':11644},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11644},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11656},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11727},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11727},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':11727},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11795},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11806},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11844},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11880},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11946},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12040},'%tag':'emit','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12071},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12108},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12175},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12250},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12270},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12342},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12410},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12424},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12431},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':12462},'%tag':'brass'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12478},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12478},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12492},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12575},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12591},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12591},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12591},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12671},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12686},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12724},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12724},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12724},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12805},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':12842},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12869},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12904},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12983},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13073},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13172},'%tag':'emit','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':13215},'%tag':'break'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':13240},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13267},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13297},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13399},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13418},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13490},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13558},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':13572}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13584},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13890},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13923},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14113},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14146},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14335},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14399},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14414},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4 sans jeu');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14615},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14631},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14644},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14651},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14670}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':14682},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14697},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14743},'%tag':'emit','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14791}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14807},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14846},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14890},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15036},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':15073},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15115},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15300},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15315},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15764},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15779},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15868},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15868},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15868},'direction':'INOUT','name':'stopSolo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15921},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15949},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15979},'direction':'IN','name':n})),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16063},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16067},'%tag':'hop','apply':function () {
sensors=true;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':16088}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16100},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16104},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16127},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16131},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16157},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16181},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Skini HH',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16697},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16773},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':16798},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':16815},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16844},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':16911},'%tag':'par'},$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':16927},'%tag':'if','apply':function () {
return sensors;
}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':17191},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':17213},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17330},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17417},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17469},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17469},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':17469},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':17550},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17667},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17754},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17805},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':17858},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17858},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':17858},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([])))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':18456},'%tag':'if','apply':function () {
return !sensors;
}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':18482},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18666},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18666},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18666},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19066},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19066},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19066},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':19284},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19284},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':19284},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':19345},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19389},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19512},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':19588},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}));
})());
})()));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
