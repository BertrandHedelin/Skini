import * as $$hiphop from '@hop/hiphop';var TankUn;var foo;var TankDeux;var bar;var tank0;var tank1;var tank2;var tank3;var tank4;var tank5;var tank6;var groupe0;var tick;var groupe1;var piano8;
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
tempoGlobal=value;if (value > tempoMax || value < tempoMin) {
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
const TankUn=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2524},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2540},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2562},'direction':'IN','name':'tank0IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2580},'direction':'IN','name':'tank1IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2598},'direction':'IN','name':'tank2IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2616},'direction':'IN','name':'tank3IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2634},'direction':'OUT','name':'tank0OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2654},'direction':'OUT','name':'tank1OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2674},'direction':'OUT','name':'tank2OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2694},'direction':'OUT','name':'tank3OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2712},'%tag':'dollar'},tank.makeReservoir(255,['tank0','tank1','tank2','tank3'])));
const TankDeux=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2810},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2826},'direction':'IN','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2848},'direction':'IN','name':'tank4IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2866},'direction':'IN','name':'tank5IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2884},'direction':'IN','name':'tank6IN'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2902},'direction':'OUT','name':'tank4OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2922},'direction':'OUT','name':'tank5OUT'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2942},'direction':'OUT','name':'tank6OUT'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':2960},'%tag':'dollar'},tank.makeReservoir(255,['tank4','tank5','tank6'])));
const Program=$$hiphop.MODULE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3048},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3063},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3152},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3152},'direction':'INOUT','name':'stopMoveTempo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3152},'direction':'INOUT','name':'stopSolo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3152},'direction':'INOUT','name':'stopTransposition'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3224},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3252},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3282},'direction':'IN','name':n});
}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3310},'direction':'INOUT','name':'foo'}),$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3326},'direction':'INOUT','name':'bar'}),$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3343}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3355},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('start','now')}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3379},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('halt','now')},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3394},'%tag':'FORK'},$$hiphop.EVERY({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3411},'%tag':'EVERY','immediate':false,'apply':new $$hiphop.DelaySig('tick','now')},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3440},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(tickCounter++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3594},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3605},'%tag':'pragma','apply':function () {
gcs.setTimerDivision(1);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3640},'%tag':'pragma','apply':function () {
gcs.setpatternListLength([3,255]);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3698},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'addSceneScore','value':1}));}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3825},'%tag':'yield'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3839},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':3848},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*- Run tank'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4008},'%tag':'pragma','apply':function () {
console.log('-*-*- Run tank');}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4055},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4066},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4083},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4083},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4083},'%tag':'run','autocomplete':true,'module':TankUn,'%frame':__frame}));
})([])),$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4125},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4142},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4142},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4142},'%tag':'run','autocomplete':true,'module':TankDeux,'%frame':__frame}));
})([])),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4186},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 30;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4226},'%tag':'EMIT','signame':'stopReservoir'})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4261},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*- Random tanks during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4438},'%tag':'pragma','apply':function () {
console.log('-*-*- Random tanks during ticks');}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4500},'%tag':'yield'}),$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4514},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4521},'name':'stopM512492'}),$$hiphop.TRAP({'M512492':'M512492','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4540},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4558},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4574},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4574},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4574},'%tag':'run','autocomplete':true,'stopReservoir':'stopM512492','module':TankUn,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4637},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4652},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4694},'%tag':'EMIT','signame':'stopM512492'}),$$hiphop.EXIT({'M512492':'M512492','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4725},'%tag':'EXIT'})))),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4758},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4772},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Run tanks pattern in group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':4951},'%tag':'pragma','apply':function () {
console.log('-*-*-  Run tanks pattern in group');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5022},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5054},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5124},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5131},'name':'stopRG150054'}),$$hiphop.TRAP({'RG150054':'RG150054','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5153},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5178},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5199},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5199},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5199},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG150054','module':TankUn,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5286},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5286},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5286},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG150054','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5355},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5372},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 4;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5420},'%tag':'EMIT','signame':'stopRG150054'}),$$hiphop.EXIT({'RG150054':'RG150054','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5454},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5499},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5532},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5601},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5615},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Run tanks waiting for pattern in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5804},'%tag':'pragma','apply':function () {
console.log('-*-*-  Run tanks waiting for pattern in DAW');}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5880},'%tag':'sequence'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5898},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':5932},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6002},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}},$$hiphop.LOCAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6022},'%tag':'LOCAL'},$$hiphop.SIGNAL({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6029},'name':'stopRG211292'}),$$hiphop.TRAP({'RG211292':'RG211292','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6055},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6066},'%tag':'sequence'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6082},'%tag':'FORK'},(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6107},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6107},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6107},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG211292','module':TankUn,'%frame':__frame}));
})([]),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6202},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6202},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6202},'%tag':'run','autocomplete':true,'stopReservoir':'stopRG211292','module':TankDeux,'%frame':__frame}));
})([]),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6296},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano8');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false}))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6398},'%tag':'EMIT','signame':'stopRG211292'}),$$hiphop.EXIT({'RG211292':'RG211292','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6432},'%tag':'EXIT'}))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6466},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN TANK WAITING');}}))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6566},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6601},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6681},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6763},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'FIN TANK'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6917},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN TANK');}})))),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6970},'%tag':'yield'}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6984},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':6993},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group et unset group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7170},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group et unset group');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7239},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7271},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7339},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7378},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7411},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7480},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7494},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7669},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group during ticks');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7740},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7776},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7854},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7890},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':7959},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 5;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8003},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8040},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8119},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8156},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8226},'%tag':'yield'}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8240},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8254},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group during patterns in groups'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8442},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group during patterns in groups');}}),$$hiphop.TRAP({'RG513800':'RG513800','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8517},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8540},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8540},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8562},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8596},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8673},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8707},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8785},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8800},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'RG513800':'RG513800','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8847},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8866},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8881},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe1IN','now'),'countapply':function () {
return 2;
}}),$$hiphop.EXIT({'RG513800':'RG513800','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8928},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':8969},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9002},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9078},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9111},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9181},'%tag':'yield'}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9194},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9208},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set randomly group during ticks'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9392},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set randomly group during ticks');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9472},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9508},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9577},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9622},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9659},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9729},'%tag':'yield'}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9743},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9757},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9841},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':9852},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  wait for patterns in group'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10043},'%tag':'pragma','apply':function () {
console.log('-*-*-  wait for patterns in group');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10116},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10150},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10227},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10261},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10331},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 10;
}},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10349}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10370},'%tag':'await','immediate':false,'apply':new $$hiphop.DelaySig('groupe0IN','now'),'countapply':function () {
return 1;
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10416},'%tag':'pragma','apply':function () {
console.log('pattern signal in group0');}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10477},'%tag':'yield'})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10552},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10636},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10647},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  wait for patterns in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10836},'%tag':'pragma','apply':function () {
console.log('-*-*-  wait for patterns in DAW');}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10907},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':10941},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11018},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11052},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}}),$$hiphop.ABORT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11122},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('tick','now'),'countapply':function () {
return 20;
}},$$hiphop.LOOP({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11140}},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11161},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano11');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11256},'%tag':'pragma','apply':function () {
console.log('pattern string piano 11');}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11316},'%tag':'yield'})))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11391},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11475},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11486},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  Set group waiting for patterns in DAW'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11688},'%tag':'pragma','apply':function () {
console.log('-*-*-  Set group waiting for patterns in DAW');}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11765},'%tag':'yield'}),$$hiphop.TRAP({'RG23042':'RG23042','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11783},'%tag':'TRAP'},$$hiphop.FORK({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11807},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11807},'%tag':'SEQUENCE'},$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11831},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11867},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',true);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11946},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [true,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':11982},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',true);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12064},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12081},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano11');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG23042':'RG23042','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12179},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12199},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12216},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano9');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG23042':'RG23042','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12313},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12333},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12350},'%tag':'await','immediate':true,'apply':function () {
return ((() => {
const patternSignal=this.patternSignal;return patternSignal.now && (patternSignal.nowval[1] === 'piano8');
})());
}},$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'patternSignal','pre':false,'val':true,'cnt':false})),$$hiphop.EXIT({'RG23042':'RG23042','%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12447},'%tag':'EXIT'})))),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12493},'%tag':'EMIT','signame':'groupe0OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12528},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe0',false);}}),$$hiphop.EMIT({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12606},'%tag':'EMIT','signame':'groupe1OUT','apply':function () {
return [false,255];
}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12641},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(255,' groupe1',false);}}),$$hiphop.PAUSE({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12713},'%tag':'yield'}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12728},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  FIN GROUPE'}));}}))),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':12917},'%tag':'pragma','apply':function () {
serveur.broadcast(JSON.stringify({'type':'alertInfoScoreON','value':'-*-*-  FIN GROUPE'}));}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13066},'%tag':'pragma','apply':function () {
DAW.cleanQueues();gcs.cleanChoiceList(255);}}),$$hiphop.ATOM({'%location':{'filename':'./myReact/orchestrationHH.hh.js','pos':13142},'%tag':'pragma','apply':function () {
console.log('-*-*-  FIN GROUPE');}}))))));
if (debug) console.log('orchestrationHH.mjs: setSignals',param.groupesDesSons);
var machine=new hh.ReactiveMachine(Program,{'sweep':true,'tracePropagation':false,'traceReactDuration':false});
console.log('INFO: setSignals: Number of nets in Orchestration:',machine.nets.length);return machine;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
