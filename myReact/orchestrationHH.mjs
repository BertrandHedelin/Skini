import * as $$hiphop from '@hop/hiphop';var tick;var groupe0;
'use strict';import { createRequire } from 'module';const require=createRequire(import.meta.url);
const ipConfig=require('../serveur/ipConfig.json');
import * as hh from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';import * as tank from '../pieces/util/makeReservoir.mjs';var par;
var debug=false;
var debug1=true;
var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;
var CCChannel=1;
var CCTempo=100;
var tempoMax=160;
var tempoMin=40;
var tempoGlobal=60;
let setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};let setTempo = function (value,param) {
tempoGlobal=value;if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) {
console.log('Set tempo blockly:',value,param.busMidiDAW,CCChannel,CCTempo,tempo,oscMidiLocal.getMidiPortClipToDAW());}
oscMidiLocal.sendControlChange(param.busMidiDAW,CCChannel,CCTempo,tempo);};var tempoValue=0;
var tempoRythme=0;
var tempoLimit=0;
var tempoIncrease=true;
var transposeValue=0;
var ratioTranspose=1.763;
var offsetTranspose=63.5;
var signals=[];
var halt;var start;var emptyQueueSignal;var patternSignal;var stopReservoir;var stopMoveTempo;
var tickCounter=0;
let setSignals = function (param) {
par=param;let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2396},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2411},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2500},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2500},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2500},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2500},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2572},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2600},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2630},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2659}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2671},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2695},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2710},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2727},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2756},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2910},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2920},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2956},'%tag':'pragma','apply':function () {
setTempo(110,param);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2989},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3116},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3130},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Tuto pattern in group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3285},'%tag':'pragma','apply':function () {
console.log('Tuto pattern in group');}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3335},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3365},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreOFF'}));}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3483},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3513},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3581},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 1;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3619},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Fin'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3756},'%tag':'pragma','apply':function () {
console.log('Fin');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3788},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
