import * as $$hiphop from '@hop/hiphop';var foo;var OSCNOTEON;var groupe0;var OSCNOTEOF;var xy;
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
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};let setTempo = function (value) {
tempoGlobal=value;if (midimix.getAbletonLinkStatus()) {
if (debug) console.log('ORCHESTRATION: set tempo Link:',value);
midimix.setTempoLink(value);return undefined;
}
if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) {
console.log('Set tempo blockly:',value,par.busMidiDAW,CCChannel,CCTempo,tempo,oscMidiLocal.getMidiPortClipToDAW());}
oscMidiLocal.sendControlChange(par.busMidiDAW,CCChannel,CCTempo,tempo);};var tempoValue=0;
var tempoRythme=0;
var tempoLimit=0;
var tempoIncrease=true;
var transposeValue=0;
var ratioTranspose=1.763;
var offsetTranspose=63.5;
let moveTempo = function (value,limit) {
if (tempoLimit >= limit) {
tempoLimit=0;tempoIncrease=!tempoIncrease;}
if (tempoIncrease) {
tempoGlobal+=value;} else {
tempoGlobal-=value;}
if (debug) console.log('moveTempo:',tempoGlobal);
setTempo(tempoGlobal);tempoLimit++;};var signals=[];
var halt;var start;var emptyQueueSignal;var patternSignal;var stopReservoir;var stopMoveTempo;
var tickCounter=0;
let setSignals = function (param) {
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2643},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2658},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2747},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2747},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2747},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2747},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2819},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2847},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2877},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2905},'direction':'INOUT','name':'foo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2921},'direction':'INOUT','name':'OSCNOTEON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2943},'direction':'INOUT','name':'OSCNOTEOF'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2965},'direction':'INOUT','name':'xy'}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2981}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2993},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3017},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3032},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3049},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3078},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3232},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3242},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3369},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3388},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3418},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3486},'%tag':'pragma','apply':function () {
oscMidiLocal.sendOSCGame('TOTO',10,ipConfig.portOSCToGame,ipConfig.remoteIPAddressGame);}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3637},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3637},'%tag':'SEQUENCE'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3653},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3671},'%tag':'EMIT','signame':'foo','apply':function () {
return 0;
}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3688},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('foo','now')}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3724},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3747},'%tag':'EMIT','signame':'foo','apply':function () {
return 11;
}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3765},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3783},'%tag':'pragma','apply':function () {
console.log('foo');}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3830},'%tag':'sequence'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3843},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const foo=this.foo;return foo.now && foo.nowval === 11;
})());
}},$$hiphop.SIGACCESS({'signame':'foo','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'foo','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3893},'%tag':'pragma','apply':function () {
console.log('foo 11');}})),$$hiphop.LOOPEACH({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3941},'%tag':'LOOPEACH','immediate':false,'apply':new $$hiphop.DelaySig('OSCNOTEON','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3956},'%tag':'pragma','apply':function () {
console.log('OSC NOTE ON');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4002},'%tag':'pragma','apply':function () {
oscMidiLocal.sendOSCGame('TOTO/TITI',10,ipConfig.portOSCToGame,ipConfig.remoteIPAddressGame);}})),$$hiphop.LOOPEACH({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4224},'%tag':'LOOPEACH','immediate':false,'apply':new $$hiphop.DelaySig('xy','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4239},'%tag':'pragma','apply':function () {
console.log('xy');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4276},'%tag':'pragma','apply':function () {
oscMidiLocal.sendOSCGame('TOTO/TITI',10,ipConfig.portOSCToGame,ipConfig.remoteIPAddressGame);}})))))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
