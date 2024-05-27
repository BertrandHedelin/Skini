import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let CCChannel=1;
let CCTempo=100;
let tempoMax=160;
let tempoMin=40;
let tempoGlobal=60;
let tempoValue=0;
let tempoRythme=0;
let tempoLimit=0;
let tempoIncrease=true;
let transposeValue=0;
let ratioTranspose=1763 / 1000;
let offsetTranspose=635 / 10;
let debug=false;
let debug1=true;
const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
console.log('inter:',interTextIN,interTextOUT,IZsignals);const sensorIZ=$$hiphop.MODULE({'id':'sensorIZ','%location':{'filename':'./pieces/capteursIZ.hh.js','pos':1973},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2001},'direction':'IN','name':'sensorIZ'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2001},'direction':'IN','name':'tick'}),$$hiphop.FRAME({'fun':function () {
let name=undefined;
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':1973},'%tag':'frame'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':1973},'%tag':'frame','apply':function (__frame) {
name=(0 < __frame.length?__frame[0]:undefined);}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2024}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2036},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.now;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':false,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2238},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 4000 && sensorIZ.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2298},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2308},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON(name + ': Zone 1',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2379},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue(name + '-1');}})),$$hiphop.IF({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2443},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2503},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2513},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON(name + ' : Zone 2',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2585},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue(name + '-2');}})),$$hiphop.IF({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2648},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2708},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2718},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON(name + ' : Zone 3',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2790},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue(name + '-3');}})),$$hiphop.IF({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2853},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2911},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2921},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON(name + ': Zone 4',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2992},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue(name + '-4');}})),$$hiphop.IF({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3055},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 499 && sensorIZ.nowval[1] > 0;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3111},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3121},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON(name + ': Zone 5',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3192},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue(name + '-5');}}))))))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3250},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
},'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':1973},'%tag':'module'}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3313},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3329},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3418},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3418},'direction':'IN','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3457},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3485},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3515},'direction':'IN','name':n})),$$hiphop.LOOP({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3542}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3554},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3577},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3601},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3653},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3723},'%tag':'emit','signame':'sensor1OUT','apply':function () {
return [true,0];
}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3752},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3777},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3777},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3794},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3823},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i++);}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3963},'%tag':'emit','signame':'sensor0OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':3997},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4041},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4114},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4114},'%tag':'hop','apply':function () {
__frame[0]='sensor0';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4114},'%tag':'run','sensorIZ':'INTERFACEZ_RC0','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4208},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4208},'%tag':'hop','apply':function () {
__frame[0]='sensor1';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4208},'%tag':'run','sensorIZ':'INTERFACEZ_RC1','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4302},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4302},'%tag':'hop','apply':function () {
__frame[0]='sensor2';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4302},'%tag':'run','sensorIZ':'INTERFACEZ_RC2','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4396},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4396},'%tag':'hop','apply':function () {
__frame[0]='sensor3';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4396},'%tag':'run','sensorIZ':'INTERFACEZ_RC3','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4490},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4490},'%tag':'hop','apply':function () {
__frame[0]='sensor4';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4490},'%tag':'run','sensorIZ':'INTERFACEZ_RC4','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4584},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4584},'%tag':'hop','apply':function () {
__frame[0]='sensor5';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4584},'%tag':'run','sensorIZ':'INTERFACEZ_RC5','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]))),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4676},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Skini HH',serveur);}})));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
