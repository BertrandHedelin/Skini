import * as $$hiphop from '@hop/hiphop';var TankUn;var foo;var TankDeux;var bar;var tank0;var tank1;var tank2;var tank3;var tank4;var tank5;var tank6;var tick;
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
const TankUn=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2498},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2514},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2536},'direction':'IN','name':'tank0IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2554},'direction':'IN','name':'tank1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2572},'direction':'IN','name':'tank2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2590},'direction':'IN','name':'tank3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2608},'direction':'OUT','name':'tank0OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2628},'direction':'OUT','name':'tank1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2648},'direction':'OUT','name':'tank2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2668},'direction':'OUT','name':'tank3OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2686},'%tag':'dollar'},tank.makeReservoir(255,['tank0','tank1','tank2','tank3'])));
const TankDeux=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2784},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2800},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2822},'direction':'IN','name':'tank4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2840},'direction':'IN','name':'tank5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2858},'direction':'IN','name':'tank6IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2876},'direction':'OUT','name':'tank4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2896},'direction':'OUT','name':'tank5OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2916},'direction':'OUT','name':'tank6OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2934},'%tag':'dollar'},tank.makeReservoir(255,['tank4','tank5','tank6'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3022},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3037},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3126},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3126},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3126},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3126},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3198},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3226},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3256},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3284},'direction':'INOUT','name':'foo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3300},'direction':'INOUT','name':'bar'}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3317}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3329},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3353},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3368},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3385},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3414},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3568},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3578},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3614},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3741},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3753},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Tuto tank'}));}}),$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3894},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3901},'name':'stopM899577'}),$$hiphop.TRAP({'M899577':'M899577','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3918},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3934},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3948},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3948},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3948},'%tag':'run','autocomplete':true,'stopReservoir':'stopM899577','module':TankUn,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4009},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4022},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4062},'%tag':'EMIT','signame':'stopM899577'}),$$hiphop.EXIT({'M899577':'M899577','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4091},'%tag':'EXIT'})))),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4118},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4130},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'FIN'}));}})))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
