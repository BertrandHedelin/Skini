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
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/opus4.hh.js','pos':5180},'%tag':'break'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':5209},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':5268},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5328},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':5414},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};let piano=['Piano1Intro1','Piano1Intro2','Piano1Intro3','Piano1Intro4','Piano1Intro5','Piano1Intro6','Piano1Intro7','Piano1Milieu1','Piano1Milieu2','Piano1Milieu3','Piano1Milieu4','Piano1Milieu5','Piano1Milieu6','Piano1Milieu7','Piano1Fin1','Piano1Fin2','Piano1Fin3','Piano1Fin4','Piano1Fin5','Piano1Fin6','Piano1Fin7'];
var resevoirPiano1=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6239},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6253},'direction':'IN','name':'stopReservoir'}),piano.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6276},'direction':'IN','name':n})),piano.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6317},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6354},'%tag':'dollar'},makeReservoir(255,piano)));
let saxo=['SaxIntro1','SaxIntro2','SaxIntro3','SaxIntro4','SaxIntro5','SaxIntro6','SaxIntro7','SaxMilieu1','SaxMilieu2','SaxMilieu3','SaxMilieu4','SaxMilieu5','SaxMilieu6','SaxMilieu7','SaxFin1','SaxFin2','SaxFin3','SaxFin4','SaxFin5','SaxFin6','SaxFin7'];
var resevoirSaxo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6707},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6722},'direction':'IN','name':'stopReservoir'}),saxo.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6745},'direction':'IN','name':n})),saxo.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':6785},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':6821},'%tag':'dollar'},makeReservoir(255,saxo)));
let brass=['BrassIntro1','BrassIntro2','BrassIntro3','BrassIntro4','BrassIntro5','BrassIntro6','BrassIntro7','BrassMilieu1','BrassMilieu2','BrassMilieu3','BrassMilieu4','BrassMilieu5','BrassMilieu6','BrassMilieu7','BrassFin1','BrassFin2','BrassFin3','BrassFin4','BrassFin5','BrassFin6','BrassFin7'];
var resevoirBrass=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7217},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7232},'direction':'IN','name':'stopReservoir'}),brass.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7255},'direction':'IN','name':n})),brass.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7296},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7333},'%tag':'dollar'},makeReservoir(255,brass)));
let flute=['FluteIntro1','FluteIntro2','FluteIntro3','FluteIntro4','FluteIntro5','FluteIntro6','FluteIntro7','FluteMilieu1','FluteMilieu2','FluteMilieu3','FluteMilieu4','FluteMilieu5','FluteMilieu6','FluteMilieu7','FluteFin1','FluteFin2','FluteFin3','FluteFin4','FluteFin5','FluteFin6','FluteFin7'];
var resevoirFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7730},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7745},'direction':'IN','name':'stopReservoir'}),flute.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7768},'direction':'IN','name':n})),flute.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':7809},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7846},'%tag':'dollar'},makeReservoir(255,flute)));
let percu=['Percu1','Percu2','Percu3','Percu4','Percu5','Percu6','Percu7'];
var resevoirPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':7997},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8012},'direction':'IN','name':'stopReservoir'}),percu.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8035},'direction':'IN','name':n})),percu.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8076},'direction':'OUT','name':n})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8113},'%tag':'dollar'},makeReservoir(255,percu)));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const soloFlute=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':8967},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':8987},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9059},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9127},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9141},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9148},'name':'stopReservoirFlute'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9172},'%tag':'pragma','apply':function () {
console.log('-- DEBUT FLUTE SOLO --');}}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9225},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':9239},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9253},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9253},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':9253},'%tag':'run','autocomplete':true,'stopReservoirFlute':'stopReservoir','module':resevoirFlute,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9331},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9650},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 40;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':9692},'%tag':'emit','signame':'stopReservoirFlute'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':9730},'%tag':'break'})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':9758},'%tag':'pragma','apply':function () {
console.log('-- FIN FLUTE SOLO --');}})));
const soloPiano=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':9835},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9855},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9927},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9995},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':9995},'direction':'IN','name':'patternSignal'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10024},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':10031},'name':'stopReservoirPiano'}),$$hiphop.TRAP({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10055},'%tag':'solo'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':10069},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10069},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10083},'%tag':'pragma','apply':function () {
console.log('-- DEBUT PIANO --');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10133},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10133},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':10133},'%tag':'run','autocomplete':true,'stopReservoirPiano':'stopReservoir','module':resevoirPiano1,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':10206},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10348},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 59;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10389},'%tag':'emit','signame':'stopReservoirPiano'}),$$hiphop.EXIT({'solo':'solo','%location':{'filename':'./pieces/opus4.hh.js','pos':10425},'%tag':'break'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':10451},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Piano1Fin1' || patternSignal.nowval[1] === 'Piano1Fin2' || patternSignal.nowval[1] === 'Piano1Fin3' || patternSignal.nowval[1] === 'Piano1Fin4' || patternSignal.nowval[1] === 'Piano1Fin5' || patternSignal.nowval[1] === 'Piano1Fin6' || patternSignal.nowval[1] === 'Piano1Fin7');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':10895},'%tag':'pragma','apply':function () {
const patternSignal=this.patternSignal;{
console.log('--- SoloPiano1: Pattern activé:',patternSignal.nowval[1]);}}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':10987},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11025},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('Percu2');}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11093},'%tag':'pragma','apply':function () {
console.log('-- FIN PIANO --');}})));
const saxoEtViolons=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11168},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11187},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11259},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11327},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11341},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11348},'name':'stopReservoirSax'}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':11370},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11370},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11382},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Saxo tonal',true);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11453},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11453},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':11453},'%tag':'run','autocomplete':true,'stopReservoirSax':'stopReservoir','module':resevoirSaxo,'%frame':__frame}));
})([])),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11521},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11532},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11570},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11606},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11672},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11766},'%tag':'emit','signame':'stopReservoirSax'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':11797},'%tag':'emit','signame':'nappeViolonsOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11834},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Nappe',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':11901},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}})))));
const brassEtPercu=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':11976},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':11996},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12068},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12136},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12150},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':12157},'name':'stopReservoirBrassetPercu'}),$$hiphop.TRAP({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':12188},'%tag':'brass'},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12204},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12204},'%tag':'fork'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12218},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':12301},'%tag':'fork'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12317},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12317},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12317},'%tag':'run','autocomplete':true,'stopReservoirBrassetPercu':'stopReservoir','module':resevoirBrass,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12397},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12412},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 20;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12450},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12450},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':12450},'%tag':'run','autocomplete':true,'stopReservoirBrassetPercu':'stopReservoir','module':resevoirPercu,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12532},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':12569},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12596},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [true,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':12631},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',true);}})))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':12710},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12800},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 12 * 7;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12888},'%tag':'emit','signame':'stopReservoirBrassetPercu'}),$$hiphop.EXIT({'brass':'brass','%location':{'filename':'./pieces/opus4.hh.js','pos':12931},'%tag':'break'})))),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':12956},'%tag':'if','apply':function () {
return deuxiemeAlea > 0;
}},$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':12983},'%tag':'emit','signame':'MassiveOUT','apply':function () {
return [false,255];
}})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13013},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,'Massive',false);}})));
var transposeSaxoModal=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':13115},'%tag':'module'},utilsSkini.creationInterfacesOUT(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13134},'direction':'OUT','name':n})),utilsSkini.creationInterfacesIN(param.groupesDesSons).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13206},'direction':'IN','name':n})),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':13274},'direction':'IN','name':'tick'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':13288}},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13300},'%tag':'pragma','apply':function () {
transposition=0;transpose(CCTransposeSaxo,transposition,param);degre2mineursaxo(false,param);tonalite=(tonalite + 2) % 6;setTonalite(CCtonalite,tonalite,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13606},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13639},'%tag':'pragma','apply':function () {
transposition=-5;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':13829},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':13862},'%tag':'pragma','apply':function () {
transposition=2;degre2mineursaxo(true,param);transpose(CCTransposeSaxo,transposition,param);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14051},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
const resetAll=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14115},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14130},'%tag':'pragma','apply':function () {
console.log('--Reset Automate Opus4 sans jeu');DAW.cleanQueues();}}));
const bougeTempo=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':14331},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14347},'direction':'IN','name':'tick'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14360},'%tag':'signal'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':14367},'name':'inverseTempo'}),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14386}},$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':14398},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14413},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 10;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14459},'%tag':'emit','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':14507}},$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14523},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14562},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14606},'%tag':'pragma','apply':function () {
tempoGlobal+=2;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':14752},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const inverseTempo=this.inverseTempo;return inverseTempo.now;
})());
}},$$hiphop.SIGACCESS({'signame':'inverseTempo','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':14789},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 2;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':14831},'%tag':'pragma','apply':function () {
tempoGlobal-=2;setTempo(tempoGlobal,param);}}))))))));
const setAleas=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15016},'%tag':'module'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15031},'%tag':'pragma','apply':function () {
premierAlea=Math.floor(Math.random() * Math.floor(3));deuxiemeAlea=Math.floor(Math.random() * Math.floor(3));troisiemeAlea=Math.floor(Math.random() * Math.floor(3));if (debug1) console.log('-- Aleas:',premierAlea,deuxiemeAlea,troisiemeAlea);
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15480},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15495},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15584},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15584},'direction':'INOUT','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15627},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15655},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/opus4.hh.js','pos':15685},'direction':'IN','name':n})),$$hiphop.LOOP({'%location':{'filename':'./pieces/opus4.hh.js','pos':15712}},(function () {
let tickCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15724},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15728},'%tag':'hop','apply':function () {
tickCounter=0;}}),(function () {
let patternCounter=undefined;return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':15751},'%tag':'let'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15755},'%tag':'hop','apply':function () {
patternCounter=1;}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/opus4.hh.js','pos':15781},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':15805},'%tag':'pragma','apply':function () {
utilsSkini.removeSceneScore(1,serveur);utilsSkini.refreshSceneScore(serveur);utilsSkini.addSceneScore(1,serveur);utilsSkini.alertInfoScoreON('Skini HH',serveur);transposeAll(0,param);utilsSkini.setListeDesTypes(serveur);utilsSkini.setTypeList('1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11',serveur);utilsSkini.setpatternListLength(12,255,gcs);gcs.setTimerDivision(1);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/opus4.hh.js','pos':16275},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/opus4.hh.js','pos':16300},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':16317},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16346},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':16429},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':16660},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16748},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}})),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':16902},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':16990},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':17090},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17178},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/opus4.hh.js','pos':17278},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17364},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':17485},'%tag':'pragma','apply':function () {
setTempo(60,param);tempoGlobal=60;}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18104},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18104},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18104},'%tag':'run','autocomplete':true,'module':brassEtPercu,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/opus4.hh.js','pos':18221},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18221},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/opus4.hh.js','pos':18221},'%tag':'run','autocomplete':true,'module':bougeTempo,'%frame':__frame}));
})([]),$$hiphop.EVERY({'%location':{'filename':'./pieces/opus4.hh.js','pos':18274},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now;
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18314},'%tag':'pragma','apply':function () {
console.log('Pattern counter:',patternCounter++);}})))),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18407},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/opus4.hh.js','pos':18483},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}));
})());
})()));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
