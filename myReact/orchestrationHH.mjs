import * as $$hiphop from '@hop/hiphop';var tick;var groupe4;var groupe0;var groupe1;var groupe2;var groupe3;
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
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2432},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2447},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2536},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2536},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2536},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2536},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2608},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2636},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2666},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2695}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2707},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2731},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2746},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2763},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2792},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2946},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2956},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2992},'%tag':'pragma','apply':function () {
setTempo(110,param);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3025},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3152},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3166},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Tuto group 3'}));}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3310},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3340},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreOFF'}));}}),$$hiphop.TRAP({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3453},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3474},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3474},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3494},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3526},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3601},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3633},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3708},'%tag':'EMIT','signame':'groupe2OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3740},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe2',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3815},'%tag':'EMIT','signame':'groupe3OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3847},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe3',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3922},'%tag':'EMIT','signame':'groupe4OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3954},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe4',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4028},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4041},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EXIT({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4086},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4103},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4116},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe1IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EXIT({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4161},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4178},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4191},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe2IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EXIT({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4236},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4253},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4266},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe3IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EXIT({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4311},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4328},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4341},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe4IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EXIT({'RG649225':'RG649225','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4386},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4421},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4452},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4526},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4557},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4631},'%tag':'EMIT','signame':'groupe2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4662},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe2',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4736},'%tag':'EMIT','signame':'groupe3OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4767},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe3',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4841},'%tag':'EMIT','signame':'groupe4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4872},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe4',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4940},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4953},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Fin  1er set group'}));}}),$$hiphop.TRAP({'RG764716':'RG764716','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5164},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5185},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5185},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5205},'%tag':'EMIT','signame':'groupe4OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5237},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe4',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5311},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5324},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'Loop3');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG764716':'RG764716','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5416},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5451},'%tag':'EMIT','signame':'groupe4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5482},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe4',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5550},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5563},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Fin Tuto group 3'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5711},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
