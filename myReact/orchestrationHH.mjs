import * as $$hiphop from '@hop/hiphop';'use strict';import { createRequire } from 'module';const require=createRequire(import.meta.url);
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
tempoGlobal=value;if (value > tempoMax || value < tempoMin) {
console.log('ERR: Tempo set out of range:',value,'Should be between:',tempoMin,'and',tempoMax);return undefined;
}
var tempo=Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
if (debug1) {
console.log('Set tempo:',value,param.busMidiDAW,CCChannel,CCTempo,tempo,oscMidiLocal.getMidiPortClipToDAW());}
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
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const TankUn=$$hiphop.MODULE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2119},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2135},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2157},'direction':'IN','name':'tank0IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2175},'direction':'IN','name':'tank1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2193},'direction':'IN','name':'tank2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2211},'direction':'IN','name':'tank3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2229},'direction':'OUT','name':'tank0OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2249},'direction':'OUT','name':'tank1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2269},'direction':'OUT','name':'tank2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2289},'direction':'OUT','name':'tank3OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2306},'%tag':'dollar'},tank.makeReservoir(255,['tank0','tank1','tank2','tank3'])));
const TankDeux=$$hiphop.MODULE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2402},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2418},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2440},'direction':'IN','name':'tank4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2458},'direction':'IN','name':'tank5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2476},'direction':'IN','name':'tank6IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2494},'direction':'OUT','name':'tank4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2514},'direction':'OUT','name':'tank5OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2534},'direction':'OUT','name':'tank6OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2551},'%tag':'dollar'},tank.makeReservoir(255,['tank4','tank5','tank6'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2638},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2653},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2742},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2742},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2742},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2742},'direction':'INOUT','name':'stopTransposition'}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2815},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2845},'direction':'IN','name':n});
}),$$hiphop.LOOP({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2872}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2884},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2908},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2923},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2940},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':2969},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3123},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3138},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3179},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([3,255]);setTempo(90,param);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3287},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3446},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*- Run tank'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3623},'%tag':'pragma','apply':function () {
console.log('-*-*- Run tank');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3671},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3690},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3690},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3690},'%tag':'run','autocomplete':true,'module':TankUn,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3735},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3754},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3754},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3754},'%tag':'run','autocomplete':true,'module':TankDeux,'%frame':__frame}));
})([])),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3801},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3842},'%tag':'EMIT','signame':'stopReservoir'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':3869},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*- Random tanks during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4063},'%tag':'pragma','apply':function () {
console.log('-*-*- Random tanks during ticks');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4128},'%tag':'yield'}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4145},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4152},'name':'stopM72719'}),$$hiphop.TRAP({'M72719':'M72719','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4174},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4197},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4217},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4217},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4217},'%tag':'run','autocomplete':true,'stopReservoir':'stopM72719','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4284},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4303},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4349},'%tag':'EMIT','signame':'stopM72719'}),$$hiphop.EXIT({'M72719':'M72719','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4383},'%tag':'EXIT'})))),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4427},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4444},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Run tanks pattern in group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4644},'%tag':'pragma','apply':function () {
console.log('-*-*-  Run tanks pattern in group');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4716},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4750},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.LOCAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4822},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4829},'name':'stopRG255720'}),$$hiphop.TRAP({'RG255720':'RG255720','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4853},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4878},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4898},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4898},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4898},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG255720','module':TankUn,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4984},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4984},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':4984},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG255720','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5053},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5072},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5122},'%tag':'EMIT','signame':'stopRG255720'}),$$hiphop.EXIT({'RG255720':'RG255720','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5158},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5208},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5243},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5315},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5332},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Run tanks waiting for pattern in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5538},'%tag':'pragma','apply':function () {
console.log('-*-*-  Run tanks waiting for pattern in DAW');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5620},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5654},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5725},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}},$$hiphop.LOCAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5744},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5751},'name':'stopRG793200'}),$$hiphop.TRAP({'RG793200':'RG793200','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5777},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5788},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5804},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5826},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5826},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5826},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG793200','module':TankUn,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5916},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5916},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':5916},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG793200','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6008},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano8');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6112},'%tag':'EMIT','signame':'stopRG793200'}),$$hiphop.EXIT({'RG793200':'RG793200','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6148},'%tag':'EXIT'}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6184},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN TANK WAITING');}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6284},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6319},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6391},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6488},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'FIN TANK'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6659},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN TANK');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6708},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6725},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group et unset group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6919},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group et unset group');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':6989},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7023},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7094},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7134},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7169},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7241},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7258},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7450},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group during ticks');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7518},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7552},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7628},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7662},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7733},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7775},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7810},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7887},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7922},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':7994},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8011},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group during patterns in groups'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8216},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group during patterns in groups');}}),$$hiphop.TRAP({'RG798518':'RG798518','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8292},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8317},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8317},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8342},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8380},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8460},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8498},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8572},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8591},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'RG798518':'RG798518','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8642},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8665},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8684},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'RG798518':'RG798518','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8735},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8786},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8821},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8898},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':8933},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9005},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9022},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set randomly group during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9223},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set randomly group during ticks');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9300},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9334},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9405},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9447},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9482},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9554},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9571},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9668},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  wait for patterns in group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9860},'%tag':'pragma','apply':function () {
console.log('-*-*-  wait for patterns in group');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9932},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':9966},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10042},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10076},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10147},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.LOOP({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10166}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10186},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 1;
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10231},'%tag':'pragma','apply':function () {
console.log('pattern signal in group0');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10293},'%tag':'yield'}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10362},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10460},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  wait for patterns in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10654},'%tag':'pragma','apply':function () {
console.log('-*-*-  wait for patterns in DAW');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10724},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10758},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10834},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10868},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10939},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}},$$hiphop.LOOP({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10958}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':10978},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano11');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11072},'%tag':'pragma','apply':function () {
console.log('pattern string piano 11');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11133},'%tag':'yield'}))),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11203},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11301},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group waiting for patterns in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11508},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group waiting for patterns in DAW');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11586},'%tag':'yield'}),$$hiphop.TRAP({'RG840039':'RG840039','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11603},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11628},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11628},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11653},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11691},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11771},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11809},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11883},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':11904},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano11');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG840039':'RG840039','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12006},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12029},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12048},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano9');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG840039':'RG840039','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12147},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12170},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12189},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano8');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG840039':'RG840039','%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12288},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12339},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12374},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12451},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12486},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12558},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12575},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  FIN GROUPE'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12759},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  FIN GROUPE'}));}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':12939},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tutos/tutoTestAll.hh.js','pos':13036},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN GROUPE');}}))))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
