import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let signals=undefined;
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
console.log('inter:',interTextIN,interTextOUT);const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1057},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1072},'direction':'IN','name':'A'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1072},'direction':'IN','name':'B'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1072},'direction':'IN','name':'R'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1088},'direction':'OUT','name':'O'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1088},'direction':'OUT','name':'P'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1102},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1191},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1191},'direction':'IN','name':'stopMoveTempo'}),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1231},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1261},'direction':'IN','name':n})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1288},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1310},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1358},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1424},'%tag':'emit','signame':'group1OUT','apply':function () {
return [true,0];
}}),$$hiphop.FORK({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1451},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1451},'%tag':'fork'},$$hiphop.ABORT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1464},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1489},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1516},'%tag':'pragma','apply':function () {
console.log('tick from HH',i++);gcs.setTickOnControler(i);}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1648},'%tag':'emit','signame':'group1OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1677},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}})),$$hiphop.LOOPEACH({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1729},'%tag':'do/every','immediate':false,'apply':function () {
return ((() => {
const R=this.R;return R.now;
})());
}},$$hiphop.SIGACCESS({'signame':'R','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1741},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1741},'%tag':'fork'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1758},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const A=this.A;return A.now;
})());
}},$$hiphop.SIGACCESS({'signame':'A','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1787},'%tag':'emit','signame':'P'})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1818},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const B=this.B;return B.now;
})());
}},$$hiphop.SIGACCESS({'signame':'B','pre':false,'val':false,'cnt':false}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1854},'%tag':'emit','signame':'O'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkini.hh.js','pos':1866},'%tag':'pragma','apply':function () {
console.log('aaaa');}}))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
