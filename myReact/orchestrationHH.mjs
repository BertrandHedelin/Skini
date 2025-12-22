import * as $$hiphop from '@hop/hiphop';var TankUn;var foo;var TankDeux;var bar;var tank0;var tank1;var tank2;var tank3;var tank4;var tank5;var tank6;var tick;var groupe0;var groupe0IN;var piano8;var piano9;
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
const TankUn=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2534},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2550},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2572},'direction':'IN','name':'tank0IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2590},'direction':'IN','name':'tank1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2608},'direction':'IN','name':'tank2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2626},'direction':'IN','name':'tank3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2644},'direction':'OUT','name':'tank0OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2664},'direction':'OUT','name':'tank1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2684},'direction':'OUT','name':'tank2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2704},'direction':'OUT','name':'tank3OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2722},'%tag':'dollar'},tank.makeReservoir(255,['tank0','tank1','tank2','tank3'])));
const TankDeux=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2820},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2836},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2858},'direction':'IN','name':'tank4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2876},'direction':'IN','name':'tank5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2894},'direction':'IN','name':'tank6IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2912},'direction':'OUT','name':'tank4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2932},'direction':'OUT','name':'tank5OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2952},'direction':'OUT','name':'tank6OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2970},'%tag':'dollar'},tank.makeReservoir(255,['tank4','tank5','tank6'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3058},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3073},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3162},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3162},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3162},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3162},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3234},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3262},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3292},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3320},'direction':'INOUT','name':'foo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3336},'direction':'INOUT','name':'bar'}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3353}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3365},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3389},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3404},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3421},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3450},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3604},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3614},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3650},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3777},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3789},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Tuto tank'}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3932},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3948},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3980},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4050},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4057},'name':'stopRG183455'}),$$hiphop.TRAP({'RG183455':'RG183455','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4079},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4090},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4102},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4123},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4123},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4123},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG183455','module':TankUn,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4210},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4210},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4210},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG183455','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4296},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano8');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4393},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano9');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4487},'%tag':'EMIT','signame':'stopRG183455'}),$$hiphop.EXIT({'RG183455':'RG183455','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4517},'%tag':'EXIT'}))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4548},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4581},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4650},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4739},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'FIN'}));}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
