import * as $$hiphop from '@hop/hiphop';var Clean1_2_3_4;var sensor0;var Clean5_6_7_8;var sensor2;var Clean9_10_11_12;var Clean13_14_15_16;var tick;var zone1;var zone2;var zone3;var zone4;var zone7;var zone8;var zone9;var zone10;
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
const Clean1_2_3_4=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2531},'%tag':'module'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2552},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2563},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2617},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2671},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2725},'%tag':'pragma','apply':function () {
DAW.cleanQueue(4);}})));
const Clean5_6_7_8=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2821},'%tag':'module'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2842},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2853},'%tag':'pragma','apply':function () {
DAW.cleanQueue(5);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2907},'%tag':'pragma','apply':function () {
DAW.cleanQueue(6);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2961},'%tag':'pragma','apply':function () {
DAW.cleanQueue(7);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3015},'%tag':'pragma','apply':function () {
DAW.cleanQueue(8);}})));
const Clean9_10_11_12=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3114},'%tag':'module'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3135},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3146},'%tag':'pragma','apply':function () {
DAW.cleanQueue(9);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3200},'%tag':'pragma','apply':function () {
DAW.cleanQueue(10);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3255},'%tag':'pragma','apply':function () {
DAW.cleanQueue(11);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3310},'%tag':'pragma','apply':function () {
DAW.cleanQueue(12);}})));
const Clean13_14_15_16=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3411},'%tag':'module'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3432},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3443},'%tag':'pragma','apply':function () {
DAW.cleanQueue(13);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3498},'%tag':'pragma','apply':function () {
DAW.cleanQueue(14);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3553},'%tag':'pragma','apply':function () {
DAW.cleanQueue(15);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3608},'%tag':'pragma','apply':function () {
DAW.cleanQueue(16);}})));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3699},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3714},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3803},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3803},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3803},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3803},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3875},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3903},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3933},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3961},'direction':'INOUT','name':'sensor0'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3981},'direction':'INOUT','name':'sensor2'}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4002}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4014},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4038},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4053},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4070},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4099},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4253},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4265},'%tag':'pragma','apply':function () {
console.log('moduleIZ');}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4304},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4313},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([5,255]);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4459},'%tag':'pragma','apply':function () {
oscMidiLocal.sendNoteOn(param.busMidiDAW,5,2,100);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4566},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4604},'%tag':'pragma','apply':function () {
setTempo(80,param);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4638},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4777},'%tag':'yield'})),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4798}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4895},'%tag':'pragma','apply':function () {
oscMidiLocal.sendNoteOn(param.busMidiDAW,5,2,100);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5004},'%tag':'sequence'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5017},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC4=this.INTERFACEZ_RC4;return INTERFACEZ_RC4.now && (INTERFACEZ_RC4.nowval[0] === 4 && INTERFACEZ_RC4.nowval[1] > 500 && INTERFACEZ_RC4.nowval[1] < 5000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC4','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC4','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC4','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC4','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5214},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Il y a quelque chose !'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5392},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('Intro');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5441},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Intoduction'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5608},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreOFF'}));}})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5748},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'1ere séquence'}));}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5905},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC11=this.INTERFACEZ_RC11;return INTERFACEZ_RC11.now && (INTERFACEZ_RC11.nowval[0] === 11 && INTERFACEZ_RC11.nowval[1] > 500 && INTERFACEZ_RC11.nowval[1] < 5000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5922},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 60;
}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5940},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5997},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && (INTERFACEZ_RC0.nowval[0] === 0 && INTERFACEZ_RC0.nowval[1] > 1000 && INTERFACEZ_RC0.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6201},'%tag':'pragma','apply':function () {
console.log('Sensor0');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6247},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor0'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6446},'%tag':'FORK'},$$hiphop.NOTHING({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6468},'%tag':'NOTHING'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6485},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6519},'%tag':'EMIT','signame':'zone7OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6563},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone7',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6640},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6694},'%tag':'EMIT','signame':'zone7OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6739},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone7',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6817},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6856},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6856},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6856},'%tag':'run','autocomplete':true,'module':Clean1_2_3_4,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6943},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC1=this.INTERFACEZ_RC1;return INTERFACEZ_RC1.now && (INTERFACEZ_RC1.nowval[0] === 1 && INTERFACEZ_RC1.nowval[1] > 1000 && INTERFACEZ_RC1.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7147},'%tag':'pragma','apply':function () {
console.log('Sensor1');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7193},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor1'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7392},'%tag':'FORK'},$$hiphop.NOTHING({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7414},'%tag':'NOTHING'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7431},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7465},'%tag':'EMIT','signame':'zone8OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7509},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone8',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7586},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7640},'%tag':'EMIT','signame':'zone8OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7685},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone8',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7763},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7802},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7802},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7802},'%tag':'run','autocomplete':true,'module':Clean5_6_7_8,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7889},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC2=this.INTERFACEZ_RC2;return INTERFACEZ_RC2.now && (INTERFACEZ_RC2.nowval[0] === 2 && INTERFACEZ_RC2.nowval[1] > 1000 && INTERFACEZ_RC2.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8093},'%tag':'pragma','apply':function () {
console.log('Sensor2');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8139},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor2'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8338},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8338},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8373},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8417},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8494},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8548},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8593},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8671},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8710},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8744},'%tag':'EMIT','signame':'zone9OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8788},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone9',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8865},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8919},'%tag':'EMIT','signame':'zone9OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8964},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone9',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9042},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9081},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9081},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9081},'%tag':'run','autocomplete':true,'module':Clean9_10_11_12,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9171},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC3=this.INTERFACEZ_RC3;return INTERFACEZ_RC3.now && (INTERFACEZ_RC3.nowval[0] === 3 && INTERFACEZ_RC3.nowval[1] > 1000 && INTERFACEZ_RC3.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9375},'%tag':'pragma','apply':function () {
console.log('Sensor3');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9421},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor3'}));}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9644},'%tag':'par'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9663},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9663},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9696},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9738},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9813},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9865},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9908},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9984},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10019},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10051},'%tag':'EMIT','signame':'zone10OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10094},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone10',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10170},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10222},'%tag':'EMIT','signame':'zone10OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10266},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone10',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10343},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10378},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10378},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10378},'%tag':'run','autocomplete':true,'module':Clean13_14_15_16,'%frame':__frame}));
})([])))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10477},'%tag':'EMIT','signame':'zone7OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10510},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone7',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10586},'%tag':'EMIT','signame':'zone8OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10619},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone8',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10695},'%tag':'EMIT','signame':'zone9OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10728},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone9',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10804},'%tag':'EMIT','signame':'zone10OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10838},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone10',false);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10908},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'2eme séquence'}));}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11077},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 60;
}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11095},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11152},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now && (INTERFACEZ_RC0.nowval[0] === 0 && INTERFACEZ_RC0.nowval[1] > 1000 && INTERFACEZ_RC0.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11356},'%tag':'pragma','apply':function () {
console.log('Sensor0');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11402},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor0'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11601},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11601},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11636},'%tag':'EMIT','signame':'zone1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11680},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone1',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11757},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11811},'%tag':'EMIT','signame':'zone1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11856},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11934},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11973},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11973},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11973},'%tag':'run','autocomplete':true,'module':Clean1_2_3_4,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12060},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC1=this.INTERFACEZ_RC1;return INTERFACEZ_RC1.now && (INTERFACEZ_RC1.nowval[0] === 1 && INTERFACEZ_RC1.nowval[1] > 1000 && INTERFACEZ_RC1.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12264},'%tag':'pragma','apply':function () {
console.log('Sensor1');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12310},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor1'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12509},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12509},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12544},'%tag':'EMIT','signame':'zone2OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12588},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone2',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12665},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12719},'%tag':'EMIT','signame':'zone2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12764},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone2',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12842},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12881},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12881},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12881},'%tag':'run','autocomplete':true,'module':Clean5_6_7_8,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12968},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC2=this.INTERFACEZ_RC2;return INTERFACEZ_RC2.now && (INTERFACEZ_RC2.nowval[0] === 2 && INTERFACEZ_RC2.nowval[1] > 1000 && INTERFACEZ_RC2.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13172},'%tag':'pragma','apply':function () {
console.log('Sensor2');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13218},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor2'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13417},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13417},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13452},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13496},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13573},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13627},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13672},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13750},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13789},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13789},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13789},'%tag':'run','autocomplete':true,'module':Clean9_10_11_12,'%frame':__frame}));
})([])),$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13879},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC3=this.INTERFACEZ_RC3;return INTERFACEZ_RC3.now && (INTERFACEZ_RC3.nowval[0] === 3 && INTERFACEZ_RC3.nowval[1] > 1000 && INTERFACEZ_RC3.nowval[1] < 4000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14083},'%tag':'pragma','apply':function () {
console.log('Sensor3');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14129},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Sensor3'}));}}),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14328},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14328},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14363},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14407},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14484},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14538},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14583},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14661},'%tag':'yield'}))),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14700},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14700},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14700},'%tag':'run','autocomplete':true,'module':Clean13_14_15_16,'%frame':__frame}));
})([])))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14814},'%tag':'EMIT','signame':'zone1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14847},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone1',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14923},'%tag':'EMIT','signame':'zone2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14956},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone2',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15032},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15065},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15141},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15174},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',false);}})),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15427},'%tag':'yield'}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15448},'%tag':'EMIT','signame':'zone1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15479},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone1',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15553},'%tag':'EMIT','signame':'zone2OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15584},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone2',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15658},'%tag':'EMIT','signame':'zone3OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15689},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone3',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15763},'%tag':'EMIT','signame':'zone4OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15794},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone4',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15868},'%tag':'EMIT','signame':'zone7OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15899},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone7',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':15973},'%tag':'EMIT','signame':'zone8OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16004},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone8',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16078},'%tag':'EMIT','signame':'zone9OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16109},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone9',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16183},'%tag':'EMIT','signame':'zone10OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16215},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' zone10',false);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16283},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16365},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Morceau de fin'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16523},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('Fin');}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16568},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC11=this.INTERFACEZ_RC11;return INTERFACEZ_RC11.now && (INTERFACEZ_RC11.nowval[0] === 11 && INTERFACEZ_RC11.nowval[1] > 100 && INTERFACEZ_RC11.nowval[1] < 5000);
})());
},'countapply':function () {
return 1;
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC11','pre':false,'val':true,'cnt':false}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16585},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 88;
}})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':16886},'%tag':'pragma','apply':function () {
oscMidiLocal.sendNoteOn(param.busMidiDAW,5,2,100);}})))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
