import * as $$hiphop from '@hop/hiphop';var PianoC;var tick;var PianoEb;var PianoC1;var PianoC2;var PianoC3;var PianoC4;var PianoC5;var PianoGb;var PianoEb1;var PianoEb2;var PianoEb3;var PianoEb4;var PianoEb5;var PianoA;var PianoGb1;var PianoGb2;var PianoGb3;var PianoGb4;var PianoGb5;var PianoA1;var PianoA2;var PianoA3;var PianoA4;var PianoA5;var Viol1C;var Viol2C;var AltoC;var CelloC;var Viol1Eb;var Viol2Eb;var AltoEb;var CelloEb;var Viol1Gb;var Viol2Gb;var AltoGb;var CelloGb;var Viol1A;var Viol2A;var AltoA;var CelloA;
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
let CCChannel=1;
let CCTempo=100;
let tempoMax=160;
let tempoMin=40;
let tempoGlobal=60;
let setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;tank.initMakeReservoir(gcs,serveur);};let setTempo = function (value,param) {
tempoGlobal=value;if (midimix.getAbletonLinkStatus()) {
if (debug) console.log('ORCHESTRATION: set tempo Link:',value);
midimix.setTempoLink(value);return undefined;
}
if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug) {
console.log('Set tempo blockly:',value,param.busMidiDAW,CCChannel,CCTempo,tempo,oscMidiLocal.getMidiPortClipToDAW());}
oscMidiLocal.sendControlChange(param.busMidiDAW,CCChannel,CCTempo,tempo);};let tempoValue=0;
let tempoRythme=0;
let tempoLimit=0;
let tempoIncrease=true;
let transposeValue=0;
let ratioTranspose=1.763;
let offsetTranspose=63.5;
let signals=[];
let halt=undefined;let start=undefined;let emptyQueueSignal=undefined;let patternSignal=undefined;let stopReservoir=undefined;let stopMoveTempo=undefined;
let tickCounter=0;
let setSignals = function (param) {
par=param;let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const PianoC=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2994},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3010},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3032},'direction':'IN','name':'PianoC1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3052},'direction':'IN','name':'PianoC2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3072},'direction':'IN','name':'PianoC3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3092},'direction':'IN','name':'PianoC4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3112},'direction':'IN','name':'PianoC5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3132},'direction':'OUT','name':'PianoC1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3154},'direction':'OUT','name':'PianoC2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3176},'direction':'OUT','name':'PianoC3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3198},'direction':'OUT','name':'PianoC4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3220},'direction':'OUT','name':'PianoC5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3240},'%tag':'dollar'},tank.makeReservoir(255,['PianoC1','PianoC2','PianoC3','PianoC4','PianoC5'])));
const PianoEb=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3355},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3371},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3393},'direction':'IN','name':'PianoEb1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3414},'direction':'IN','name':'PianoEb2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3435},'direction':'IN','name':'PianoEb3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3456},'direction':'IN','name':'PianoEb4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3477},'direction':'IN','name':'PianoEb5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3498},'direction':'OUT','name':'PianoEb1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3521},'direction':'OUT','name':'PianoEb2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3544},'direction':'OUT','name':'PianoEb3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3567},'direction':'OUT','name':'PianoEb4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3590},'direction':'OUT','name':'PianoEb5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3611},'%tag':'dollar'},tank.makeReservoir(255,['PianoEb1','PianoEb2','PianoEb3','PianoEb4','PianoEb5'])));
const PianoGb=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3731},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3747},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3769},'direction':'IN','name':'PianoGb1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3790},'direction':'IN','name':'PianoGb2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3811},'direction':'IN','name':'PianoGb3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3832},'direction':'IN','name':'PianoGb4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3853},'direction':'IN','name':'PianoGb5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3874},'direction':'OUT','name':'PianoGb1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3897},'direction':'OUT','name':'PianoGb2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3920},'direction':'OUT','name':'PianoGb3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3943},'direction':'OUT','name':'PianoGb4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3966},'direction':'OUT','name':'PianoGb5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3987},'%tag':'dollar'},tank.makeReservoir(255,['PianoGb1','PianoGb2','PianoGb3','PianoGb4','PianoGb5'])));
const PianoA=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4106},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4122},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4144},'direction':'IN','name':'PianoA1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4164},'direction':'IN','name':'PianoA2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4184},'direction':'IN','name':'PianoA3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4204},'direction':'IN','name':'PianoA4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4224},'direction':'IN','name':'PianoA5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4244},'direction':'OUT','name':'PianoA1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4266},'direction':'OUT','name':'PianoA2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4288},'direction':'OUT','name':'PianoA3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4310},'direction':'OUT','name':'PianoA4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4332},'direction':'OUT','name':'PianoA5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4352},'%tag':'dollar'},tank.makeReservoir(255,['PianoA1','PianoA2','PianoA3','PianoA4','PianoA5'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4466},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4481},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4570},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4570},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4570},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4570},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4642},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4670},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4700},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4729}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4741},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4765},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4780},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4797},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4826},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4980},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4990},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5022},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5057},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([3,255]);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5115},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5147},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5274},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5286},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Etude Harmonie 4'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5434},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('PianoC1');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5481},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5555},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5585},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreOFF'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5698},'%tag':'pragma','apply':function () {
console.log('Etude Harmonie 4');}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5745},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5754},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5754},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5781},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5818},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5897},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5934},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6004},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6051},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6089},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6169},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6207},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6278},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6301},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6327},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6365},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6445},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6483},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6554},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6601},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6640},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6721},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6760},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6832},'%tag':'yield'})),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6870},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6890},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6897},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6923},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6977},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6999}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7021},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7046},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7099},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7175}},$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7201},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7232},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7285},'%tag':'pragma','apply':function () {
tempoGlobal+=1;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7508},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7538},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7589},'%tag':'pragma','apply':function () {
tempoGlobal-=1;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7907},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8001},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}})),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8090},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8090},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8115},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8150},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8227},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8262},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8339},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8373},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8449},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8484},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8561},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8597},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8675},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8711},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8789},'%tag':'EMIT','signame':'AltoEbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8824},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoEb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8901},'%tag':'EMIT','signame':'CelloEbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8937},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloEb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9015},'%tag':'EMIT','signame':'Viol1GbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9051},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Gb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9129},'%tag':'EMIT','signame':'Viol2GbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9165},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Gb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9243},'%tag':'EMIT','signame':'AltoGbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9278},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoGb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9355},'%tag':'EMIT','signame':'CelloGbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9391},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloGb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9469},'%tag':'EMIT','signame':'Viol1AOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9504},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1A',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9581},'%tag':'EMIT','signame':'Viol2AOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9616},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2A',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9693},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9727},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9803},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9838},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9906},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9951},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9987},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10065},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10101},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10179},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10214},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10291},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10327},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10405},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10442},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10521},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10558},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10637},'%tag':'EMIT','signame':'AltoEbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10673},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoEb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10751},'%tag':'EMIT','signame':'CelloEbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10788},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloEb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10867},'%tag':'EMIT','signame':'Viol1GbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10904},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Gb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10983},'%tag':'EMIT','signame':'Viol2GbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11020},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Gb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11099},'%tag':'EMIT','signame':'AltoGbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11135},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoGb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11213},'%tag':'EMIT','signame':'CelloGbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11250},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloGb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11329},'%tag':'EMIT','signame':'Viol1AOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11365},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1A',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11443},'%tag':'EMIT','signame':'Viol2AOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11479},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2A',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11557},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11592},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11669},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11705},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11774},'%tag':'yield'})),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11806},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11821},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11821},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11821},'%tag':'run','autocomplete':true,'module':PianoEb,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11878},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11893},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11893},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11893},'%tag':'run','autocomplete':true,'module':PianoGb,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11950},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11965},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11965},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11965},'%tag':'run','autocomplete':true,'module':PianoA,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12021},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12036},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12036},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12036},'%tag':'run','autocomplete':true,'module':PianoC,'%frame':__frame}));
})([])),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12092},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}},$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12110},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12117},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12141},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12193},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12213}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12233},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12256},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12307},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12377}},$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12401},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12430},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12481},'%tag':'pragma','apply':function () {
tempoGlobal+=1;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12692},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12720},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12769},'%tag':'pragma','apply':function () {
tempoGlobal-=1;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13067},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13155},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13231},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13240},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13240},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13267},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13303},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13381},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13418},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13488},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13535},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13572},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13651},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13689},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13760},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13783},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13809},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13845},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13923},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13960},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14030},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14077},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14114},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14193},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14231},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14302},'%tag':'yield'}))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14325},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14414},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Fin Etude Harmonie 4'}));}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
