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
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};const piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
const resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5263},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5277},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5300},'direction':'IN','name':n});
}),piano.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5341},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5379},'%tag':'dollar'},tank.makeReservoir(255,piano)));
const saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
const resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5740},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5754},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5777},'direction':'IN','name':n});
}),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5817},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':5853},'%tag':'dollar'},tank.makeReservoir(255,saxo)));
const brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
const resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6258},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6272},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6295},'direction':'IN','name':n});
}),brass.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6336},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6373},'%tag':'dollar'},tank.makeReservoir(255,brass)));
const flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
const resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6779},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6793},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6816},'direction':'IN','name':n});
}),flute.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6857},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':6894},'%tag':'dollar'},tank.makeReservoir(255,flute)));
const percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
const resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7056},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7070},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7093},'direction':'IN','name':n});
}),percu.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7134},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':7171},'%tag':'dollar'},tank.makeReservoir(255,percu)));
const setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8020},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8040},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8112},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8180},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8194},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8201},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8225},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':8276},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8290},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8304},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8304},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8304},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirFlute','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8380},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8689},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 57;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8731},'%tag':'EMIT','signame':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8856},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':8896},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8920},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':8997},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9017},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9089},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9157},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9157},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9157},'direction':'IN','name':'stopSolo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9196},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9203},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':9227},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9241},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9241},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9255},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9305},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9305},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9305},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirPiano','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9382},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9524},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 58;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9564},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9594},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':9634},'%tag':'EXIT'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':9660},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10112},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano: Pattern de fin en FIFO:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10210},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10266},'%tag':'EVERY','immediate':true,'apply':function () {
return ((() => {
const stopSolo=this.stopSolo;return stopSolo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopSolo','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10312},'%tag':'EMIT','signame':'stopReservoirPiano'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10344},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10380},'%tag':'pragma','apply':function () {
console.log('--- SoloPiano: Tuer par stopSolo');}}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4V2.hh.js','pos':10452},'%tag':'EXIT'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10486},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10562},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10581},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10653},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10721},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10735},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10742},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10764},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10764},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10776},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10848},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10848},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10848},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirSax','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10919},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10930},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':10967},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11003},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11231},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11270},'%tag':'EMIT','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11301},'%tag':'EMIT','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11338},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11406},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11447},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11522},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11542},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11614},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11682},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11696},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11703},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':11734},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11749},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11749},'%tag':'SEQUENCE'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11763},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11846},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11862},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11862},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11862},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11947},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11962},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11999},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11999},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':11999},'%tag':'run','autocomplete':true,'stopReservoir':'stopReservoirBrassetPercu','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12085},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12121},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12148},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12183},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12263},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12353},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12451},'%tag':'EMIT','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4V2.hh.js','pos':12494},'%tag':'EXIT'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12519},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12546},'%tag':'EMIT','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12576},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12679},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12698},'direction':'OUT','name':n});
}),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12770},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12838},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12838},'direction':'IN','name':'stopTransposition'}),$$hiphop.WEAKABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12871},'%tag':'WEAKABORT','immediate':false,'apply':function () {
return ((() => {
const stopTransposition=this.stopTransposition;return stopTransposition.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopTransposition','pre':false,'val':false,'cnt':false}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12912}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':12926},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13239},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13273},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13473},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13507},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13706},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13820},'%tag':'pragma','apply':function () {
console.log('-- Stop transpositions');}}));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13897},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':13912},'%tag':'pragma','apply':function () {
console.log('-- Reset Automate Opus4');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14103},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14119},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14119},'direction':'IN','name':'stopMoveTempo'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14147},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14154},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14172},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14218},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopMoveTempo=this.stopMoveTempo;return stopMoveTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopMoveTempo','pre':false,'val':false,'cnt':false}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14260}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14274},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14291},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14338},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14390}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14408},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14449},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14494},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14644},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14683},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14726},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14904},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14976},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':14991},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15440},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15455},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15544},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15544},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15544},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15544},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15616},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15644},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15674},'direction':'IN','name':n});
}),(function () {
let sensors=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15758},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15764},'%tag':'hop','apply':function () {
sensors=false;}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15786}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15799},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15803},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15826},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15830},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15856},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15879},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':15933},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([1,255]);utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Opus 4',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);console.log('-- OPUS4V2 --');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16525},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16600},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16625},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16641},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16670},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16841},'%tag':'FORK'},$$hiphop.IF({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16859},'%tag':'if','apply':function () {
return sensors;
}},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16888},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && INTERFACEZ_RC0.nowval[1] < 4000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':16967},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17017},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
console.log(' *-*-*-*-*-*-*- Sensor RC0',INTERFACEZ_RC0.nowval);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17108},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
utilsSkini.alertInfoScoreON('Sensor RC0 : ' + INTERFACEZ_RC0.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17212},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17212},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17212},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17290},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17290},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17290},'%tag':'run','autocomplete':true,'module':soloPiano,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17343},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17361},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17400},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17422},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17422},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17422},'%tag':'run','autocomplete':true,'module':saxoEtViolons,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17489},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17489},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17489},'%tag':'run','autocomplete':true,'module':transposeSaxoModal,'%frame':__frame}));
})([]))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17810},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17810},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17810},'%tag':'run','autocomplete':true,'module':soloFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17861},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17879},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17918},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17918},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17918},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':17978},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18020},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('-- Pattern :',patternSignal.nowval);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18228},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18228},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18228},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([])))),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18413},'%tag':'EMIT','signame':'stopTransposition'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18445},'%tag':'EMIT','signame':'stopMoveTempo'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18468},'%tag':'pragma','apply':function () {
console.log('-- Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18511},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Opus 4',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18578},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18578},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18578},'%tag':'run','module':resetAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4V2.hh.js','pos':18609},'%tag':'pragma','apply':function () {
gcs.resetMatrice();}}));
})());
})()));
})());
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
