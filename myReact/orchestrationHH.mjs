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
return $$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':3971},'%tag':'fork'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4013},'%tag':'sequence'},((g4043) => $$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4021},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g4043].now;
})());
}},$$hiphop.SIGACCESS({'signame':g4043,'pre':false,'val':false,'cnt':false})))(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4061},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4271},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':4288},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4298},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4308},'%tag':'abort','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4378},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4750},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':4821},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':4904},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':4993},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5046},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':5134},'%tag':'break'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5163},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5222},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5282},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5368},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};let piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
var resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6193},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6207},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6230},'direction':'IN','name':n})),piano.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6271},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6308},'%tag':'dollar'},makeReservoir(255,piano)));
let saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
var resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6661},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6676},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6699},'direction':'IN','name':n})),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6739},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6775},'%tag':'dollar'},makeReservoir(255,saxo)));
let brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
var resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7171},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7186},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7209},'direction':'IN','name':n})),brass.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7250},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7287},'%tag':'dollar'},makeReservoir(255,brass)));
let flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
var resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7684},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7699},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7722},'direction':'IN','name':n})),flute.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7763},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7800},'%tag':'dollar'},makeReservoir(255,flute)));
let percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
var resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7951},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7966},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7989},'direction':'IN','name':n})),percu.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8030},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8067},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8921},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8941},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9013},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9081},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9095},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9102},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9126},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9179},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9193},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9207},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9207},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':9207},'%tag':'run','autocomplete':true,'stopReservoirFlute':'stopReservoir','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9285},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9604},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9646},'%tag':'emit','signame':'stopReservoirFlute'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9684},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9712},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9789},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9809},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9881},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9949},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9949},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9978},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9985},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10009},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':10023},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10023},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10037},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10087},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10087},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10087},'%tag':'run','autocomplete':true,'stopReservoirPiano':'stopReservoir','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10160},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10302},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 59;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10343},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10379},'%tag':'break'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':10405},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10849},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano1: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10941},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10979},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('Percu2');}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11047},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11122},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11141},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11213},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11281},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11295},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11302},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':11324},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11324},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11336},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11407},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11407},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':11407},'%tag':'run','autocomplete':true,'stopReservoirSax':'stopReservoir','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11475},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11486},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11524},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11560},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11626},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11720},'%tag':'emit','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11751},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11788},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11855},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11930},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11950},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12022},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12090},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12104},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12111},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':12142},'%tag':'brass'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12158},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12158},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12172},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12255},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12271},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12271},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12271},'%tag':'run','autocomplete':true,'stopReservoirBrassetPercu':'stopReservoir','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12351},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12366},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12404},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12404},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12404},'%tag':'run','autocomplete':true,'stopReservoirBrassetPercu':'stopReservoir','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12486},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':12523},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12550},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12585},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12664},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12754},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12842},'%tag':'emit','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':12885},'%tag':'break'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':12910},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12937},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12967},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13069},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13088},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13160},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13228},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':13242}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13254},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13560},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13593},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13783},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13816},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14005},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14069},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14084},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4 sans jeu');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14285},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14301},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14314},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14321},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14340}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':14352},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14367},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14413},'%tag':'emit','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14461}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14477},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14516},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14560},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14706},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14743},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14785},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14970},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14985},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15438},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15453},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15542},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15542},'direction':'INOUT','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15585},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15613},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15643},'direction':'IN','name':n})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15670}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15682},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15686},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15709},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15713},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15739},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15763},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Skini HH',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16233},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':16258},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':16275},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16304},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':16387},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':16618},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16706},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':16860},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16948},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':17048},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17136},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':17236},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17322},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17443},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18062},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18062},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18062},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18179},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18179},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18179},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':18232},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18272},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18365},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18441},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}));
})());
})()));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
