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
name=(0 < __frame.length?__frame[0]:undefined);}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2024}},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2036},'%tag':'pragma','apply':function () {
console.log('SensorIZ',name);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2081},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.now;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':2111},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log('Sensor',name,':',sensorIZ.nowval[1]);if (sensorIZ.nowval[1] < 4000 && sensorIZ.nowval[1] > 3000) {
utilsSkini.alertInfoScoreON(name + ': Zone 1',serveur);DAW.putPatternInQueue(name + '-1');} else if (sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000) {
utilsSkini.alertInfoScoreON(name + ' : Zone 2',serveur);DAW.putPatternInQueue(name + '-2');} else if (sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000) {
utilsSkini.alertInfoScoreON(name + ' : Zone 3',serveur);DAW.putPatternInQueue(name + '-3');} else if (sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500) {
utilsSkini.alertInfoScoreON(name + ': Zone 4',serveur);DAW.putPatternInQueue(name + '-4');} else if (sensorIZ.nowval[1] < 499 && sensorIZ.nowval[1] > 0) {
utilsSkini.alertInfoScoreON(name + ': Zone 5',serveur);DAW.putPatternInQueue(name + '-5');}




}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}))));
},'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':1973},'%tag':'module'}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4482},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4498},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4587},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4587},'direction':'IN','name':'stopMoveTempo'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4626},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4654},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4684},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4711}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4724},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4747},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4771},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4823},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4887},'%tag':'pragma','apply':function () {
console.log('Skini HH');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4932},'%tag':'EMIT','signame':'sensor1OUT','apply':function () {
return [true,0];
}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4962},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4987},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':4987},'%tag':'SEQUENCE'},$$hiphop.EVERY({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5004},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5033},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i++);}})),$$hiphop.EMIT({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5173},'%tag':'EMIT','signame':'sensor0OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5207},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5251},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5324},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5324},'%tag':'hop','apply':function () {
__frame[0]='sensor0';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5324},'%tag':'run','sensorIZ':'INTERFACEZ_RC0','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5418},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5418},'%tag':'hop','apply':function () {
__frame[0]='sensor1';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5418},'%tag':'run','sensorIZ':'INTERFACEZ_RC1','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5512},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5512},'%tag':'hop','apply':function () {
__frame[0]='sensor2';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5512},'%tag':'run','sensorIZ':'INTERFACEZ_RC2','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5606},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5606},'%tag':'hop','apply':function () {
__frame[0]='sensor3';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5606},'%tag':'run','sensorIZ':'INTERFACEZ_RC3','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5700},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5700},'%tag':'hop','apply':function () {
__frame[0]='sensor4';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5700},'%tag':'run','sensorIZ':'INTERFACEZ_RC4','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5794},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5794},'%tag':'hop','apply':function () {
__frame[0]='sensor5';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5794},'%tag':'run','sensorIZ':'INTERFACEZ_RC5','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined]))),$$hiphop.ATOM({'%location':{'filename':'./pieces/capteursIZ.hh.js','pos':5886},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Skini HH',serveur);}})));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
