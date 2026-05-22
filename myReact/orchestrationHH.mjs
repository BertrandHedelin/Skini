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
if (debug1) console.log('ORCHESTRATION: set tempo Link:',value);
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
const PianoC=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2986},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3002},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3024},'direction':'IN','name':'PianoC1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3044},'direction':'IN','name':'PianoC2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3064},'direction':'IN','name':'PianoC3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3084},'direction':'IN','name':'PianoC4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3104},'direction':'IN','name':'PianoC5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3124},'direction':'OUT','name':'PianoC1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3146},'direction':'OUT','name':'PianoC2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3168},'direction':'OUT','name':'PianoC3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3190},'direction':'OUT','name':'PianoC4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3212},'direction':'OUT','name':'PianoC5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3232},'%tag':'dollar'},tank.makeReservoir(255,['PianoC1','PianoC2','PianoC3','PianoC4','PianoC5'])));
const PianoEb=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3347},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3363},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3385},'direction':'IN','name':'PianoEb1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3406},'direction':'IN','name':'PianoEb2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3427},'direction':'IN','name':'PianoEb3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3448},'direction':'IN','name':'PianoEb4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3469},'direction':'IN','name':'PianoEb5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3490},'direction':'OUT','name':'PianoEb1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3513},'direction':'OUT','name':'PianoEb2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3536},'direction':'OUT','name':'PianoEb3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3559},'direction':'OUT','name':'PianoEb4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3582},'direction':'OUT','name':'PianoEb5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3603},'%tag':'dollar'},tank.makeReservoir(255,['PianoEb1','PianoEb2','PianoEb3','PianoEb4','PianoEb5'])));
const PianoGb=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3723},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3739},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3761},'direction':'IN','name':'PianoGb1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3782},'direction':'IN','name':'PianoGb2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3803},'direction':'IN','name':'PianoGb3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3824},'direction':'IN','name':'PianoGb4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3845},'direction':'IN','name':'PianoGb5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3866},'direction':'OUT','name':'PianoGb1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3889},'direction':'OUT','name':'PianoGb2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3912},'direction':'OUT','name':'PianoGb3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3935},'direction':'OUT','name':'PianoGb4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3958},'direction':'OUT','name':'PianoGb5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3979},'%tag':'dollar'},tank.makeReservoir(255,['PianoGb1','PianoGb2','PianoGb3','PianoGb4','PianoGb5'])));
const PianoA=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4098},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4114},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4136},'direction':'IN','name':'PianoA1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4156},'direction':'IN','name':'PianoA2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4176},'direction':'IN','name':'PianoA3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4196},'direction':'IN','name':'PianoA4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4216},'direction':'IN','name':'PianoA5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4236},'direction':'OUT','name':'PianoA1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4258},'direction':'OUT','name':'PianoA2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4280},'direction':'OUT','name':'PianoA3OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4302},'direction':'OUT','name':'PianoA4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4324},'direction':'OUT','name':'PianoA5OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4344},'%tag':'dollar'},tank.makeReservoir(255,['PianoA1','PianoA2','PianoA3','PianoA4','PianoA5'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4458},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4473},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4562},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4562},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4562},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4562},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4634},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4662},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4692},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4721}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4733},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4757},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4772},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4789},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4818},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4972},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4982},'%tag':'await','immediate':true,'apply':new $$hiphop.DelaySig('tick','now')}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5014},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5049},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([3,255]);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5107},'%tag':'pragma','apply':function () {
setTempo(50,param);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5139},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5266},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5278},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Etude Harmonie 4'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5426},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('PianoC1');}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5473},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5547},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5577},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreOFF'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5690},'%tag':'pragma','apply':function () {
console.log('Etude Harmonie 4');}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5737},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5746},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5746},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5773},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5810},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5889},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5926},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5996},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6043},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6081},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6161},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6199},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6270},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6293},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6319},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6357},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6437},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6475},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6546},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6593},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6632},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6713},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6752},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6824},'%tag':'yield'})),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6862},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6882},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6889},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6915},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6969},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6991}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7013},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7038},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7091},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7167}},$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7193},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7224},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7277},'%tag':'pragma','apply':function () {
tempoGlobal+=1;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7500},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7530},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 1;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7581},'%tag':'pragma','apply':function () {
tempoGlobal-=1;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7899},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7993},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}})),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8082},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8082},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8107},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8142},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8219},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8254},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8331},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8365},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8441},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8476},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8553},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8589},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8667},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8703},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8781},'%tag':'EMIT','signame':'AltoEbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8816},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoEb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8893},'%tag':'EMIT','signame':'CelloEbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8929},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloEb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9007},'%tag':'EMIT','signame':'Viol1GbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9043},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Gb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9121},'%tag':'EMIT','signame':'Viol2GbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9157},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Gb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9235},'%tag':'EMIT','signame':'AltoGbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9270},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoGb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9347},'%tag':'EMIT','signame':'CelloGbOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9383},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloGb',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9461},'%tag':'EMIT','signame':'Viol1AOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9496},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1A',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9573},'%tag':'EMIT','signame':'Viol2AOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9608},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2A',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9685},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9719},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9795},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9830},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9898},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9943},'%tag':'EMIT','signame':'Viol1COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9979},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10057},'%tag':'EMIT','signame':'Viol2COUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10093},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2C',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10171},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10206},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10283},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10319},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10397},'%tag':'EMIT','signame':'Viol1EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10434},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10513},'%tag':'EMIT','signame':'Viol2EbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10550},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Eb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10629},'%tag':'EMIT','signame':'AltoEbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10665},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoEb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10743},'%tag':'EMIT','signame':'CelloEbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10780},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloEb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10859},'%tag':'EMIT','signame':'Viol1GbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10896},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1Gb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10975},'%tag':'EMIT','signame':'Viol2GbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11012},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2Gb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11091},'%tag':'EMIT','signame':'AltoGbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11127},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoGb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11205},'%tag':'EMIT','signame':'CelloGbOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11242},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloGb',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11321},'%tag':'EMIT','signame':'Viol1AOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11357},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol1A',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11435},'%tag':'EMIT','signame':'Viol2AOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11471},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' Viol2A',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11549},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11584},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11661},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11697},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11766},'%tag':'yield'})),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11798},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11813},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11813},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11813},'%tag':'run','autocomplete':true,'module':PianoEb,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11870},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11885},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11885},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11885},'%tag':'run','autocomplete':true,'module':PianoGb,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11942},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11957},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11957},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11957},'%tag':'run','autocomplete':true,'module':PianoA,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12013},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12028},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12028},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12028},'%tag':'run','autocomplete':true,'module':PianoC,'%frame':__frame}));
})([])),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12084},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}},$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12102},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12109},'name':'inverseTempo'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12133},'%tag':'pragma','apply':function () {
console.log('-- Start move tempo');}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12185},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopMoveTempo','now')},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12205}},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12225},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12248},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 3;
}},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12299},'%tag':'EMIT','signame':'inverseTempo'})),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12369}},$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12393},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12422},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12473},'%tag':'pragma','apply':function () {
tempoGlobal+=1;setTempo(tempoGlobal,param);}}))),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12684},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('inverseTempo','now')},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12712},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 4;
}},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12761},'%tag':'pragma','apply':function () {
tempoGlobal-=1;setTempo(tempoGlobal,param);}}))))))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13059},'%tag':'pragma','apply':function () {
console.log('-- Stop move tempo');}})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13147},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13223},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13232},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13232},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13259},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13295},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13373},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13410},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13480},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13527},'%tag':'EMIT','signame':'AltoAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13564},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoA',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13643},'%tag':'EMIT','signame':'CelloAOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13681},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloA',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13752},'%tag':'yield'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13775},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13801},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13837},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13915},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13952},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14022},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14069},'%tag':'EMIT','signame':'AltoCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14106},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' AltoC',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14185},'%tag':'EMIT','signame':'CelloCOUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14223},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' CelloC',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14294},'%tag':'yield'}))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14317},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':14406},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'Fin Etude Harmonie 4'}));}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
