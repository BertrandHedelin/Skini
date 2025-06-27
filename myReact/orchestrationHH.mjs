import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let CCChannel=1;
let CCTempo=305;
let tempoMax=160;
let tempoMin=40;
let tempoGlobal=60;
let tempoValue=0;
let tempoRythme=0;
let tempoLimit=0;
let tempoIncrease=true;
let transposeValue=0;
let ratioTranspose=1763 / 1000;
let offsetTranspose=635 / 10;
let debug=false;
let debug1=true;
const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
const ESP32signals=['ESP32_motion','ESP32_shock','ESP32_touch','ESP32_light','ESP32_gyro','ESP32_sensor1','ESP32_accel','ESP32_capa','ESP32_heartbeat'];
console.log('inter:',interTextIN,interTextOUT,IZsignals,ESP32signals);const sensorIZ=$$hiphop.MODULE({'id':'sensorIZ','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2535},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2563},'direction':'IN','name':'sensorIZ'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2563},'direction':'IN','name':'tick'}),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2640},'direction':'OUT','name':n})),$$hiphop.FRAME({'fun':function () {
let name=undefined;
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2535},'%tag':'frame'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2535},'%tag':'frame','apply':function (__frame) {
name=(0 < __frame.length?__frame[0]:undefined);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2670},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log(' *-*-*-*-*-*-*- Sensor ',name,sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2755},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval == undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2800},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log('Capteur sans valeur : ',sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2883},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 6000 && sensorIZ.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2958},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2998},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3073},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3113},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3188},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3228},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3301},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [true,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3345},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log('Capteur sans valeur : ',sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}))))))),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3423},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval !== undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3467},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
utilsSkini.alertInfoScoreON(name + ':' + sensorIZ.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3560},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 16;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3594},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3594},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3594},'%tag':'run','zone1OUT':'','zone2OUT':'','zone3OUT':'','zone4OUT':'','zone6OUT':'','zone7OUT':'','zone8OUT':'','zone9OUT':'','zone10OUT':'','module':stopAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3725},'%tag':'pragma','apply':function () {
DAW.cleanQueues();oscMidiLocal.sendNoteOn(param.busMidiDAW,3,47,100);}}));
},'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2535},'%tag':'module'}));
const stopAll=$$hiphop.MODULE({'id':'stopAll','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3990},'%tag':'module'},interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4017},'direction':'OUT','name':n})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4051},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4084},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4117},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4150},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4183},'%tag':'emit','signame':'zone6OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4216},'%tag':'emit','signame':'zone7OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4249},'%tag':'emit','signame':'zone8OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4282},'%tag':'emit','signame':'zone9OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4315},'%tag':'emit','signame':'zone10OUT','apply':function () {
return [false,0];
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4456},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4472},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4561},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4561},'direction':'IN','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4601},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4629},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4659},'direction':'IN','name':n})),ESP32signals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4688},'direction':'IN','name':n})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4789},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.LOOP({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4812}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4824},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4847},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4899},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Appuyer sur le bouton',serveur);console.log('Appuyer sur le bouton');}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5038},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const ESP32_touch=this.ESP32_touch;return ESP32_touch.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_touch','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5069},'%tag':'pragma','apply':function () {
utilsSkini.setTempo(80,param,oscMidiLocal,midimix,tempoMax,tempoMin,CCChannel,CCTempo);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5187},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const ESP32_shock=this.ESP32_shock;const halt=this.halt;return halt.now || ESP32_shock.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'ESP32_shock','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5287},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5304},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5333},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5418},'%tag':'par'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5466},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5523},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5632},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5674},'%tag':'pragma','apply':function () {
console.log('Reçu RC0');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5721},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5721},'%tag':'hop','apply':function () {
__frame[0]='RC0';}}),$$hiphop.RUN({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5721},'%tag':'run','zone1OUT':'','zone2OUT':'','zone3OUT':'','zone4OUT':'','sensorIZ':'INTERFACEZ_RC0','tick':'tick','module':sensorIZ,'%frame':__frame}));
})([undefined])),$$hiphop.TRAP({'Sensors123':'Sensors123','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5930},'%tag':'Sensors123'},$$hiphop.FORK({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5958},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5980},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC1=this.INTERFACEZ_RC1;return INTERFACEZ_RC1.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6026},'%tag':'pragma','apply':function () {
console.log('Reçu RC1');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6082},'%tag':'emit','signame':'zone8OUT','apply':function () {
return [true,0];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6121},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6171},'%tag':'emit','signame':'zone8OUT','apply':function () {
return [false,0];
}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6249},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC2=this.INTERFACEZ_RC2;return INTERFACEZ_RC2.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6295},'%tag':'pragma','apply':function () {
console.log('Reçu RC2');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6351},'%tag':'emit','signame':'zone9OUT','apply':function () {
return [true,0];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6390},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6440},'%tag':'emit','signame':'zone9OUT','apply':function () {
return [false,0];
}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6518},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC3=this.INTERFACEZ_RC3;return INTERFACEZ_RC3.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6564},'%tag':'pragma','apply':function () {
console.log('Reçu RC3');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6620},'%tag':'emit','signame':'zone10OUT','apply':function () {
return [true,0];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6660},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6710},'%tag':'emit','signame':'zone10OUT','apply':function () {
return [false,0];
}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6789},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC4=this.INTERFACEZ_RC4;return INTERFACEZ_RC4.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC4','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6835},'%tag':'pragma','apply':function () {
console.log('Reçu RC4');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6891},'%tag':'emit','signame':'zone7OUT','apply':function () {
return [true,0];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6930},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 8;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6980},'%tag':'emit','signame':'zone7OUT','apply':function () {
return [false,0];
}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7036},'%tag':'par'},$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7058},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const ESP32_capa=this.ESP32_capa;return ESP32_capa.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_capa','pre':false,'val':false,'cnt':false})),$$hiphop.EXIT({'Sensors123':'Sensors123','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7104},'%tag':'break'})))),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7178},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_touch=this.ESP32_touch;return ESP32_touch.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_touch','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7217},'%tag':'pragma','apply':function () {
console.log('Reçu ESP32 touch');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7277},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7318},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7359},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7400},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7436},'%tag':'pragma','apply':function () {
DAW.cleanQueue(1);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7477},'%tag':'pragma','apply':function () {
DAW.cleanQueue(2);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7518},'%tag':'pragma','apply':function () {
DAW.cleanQueue(3);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7559},'%tag':'pragma','apply':function () {
DAW.cleanQueue(4);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7600},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Arret zone 1,2,3 et 4',serveur);}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7685},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7756},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_light=this.ESP32_light;return ESP32_light.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_light','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7795},'%tag':'pragma','apply':function () {
const ESP32_light=this.ESP32_light;{
console.log('Reçu ESP32 light',ESP32_light.nowval);}}},$$hiphop.SIGACCESS({'signame':'ESP32_light','pre':false,'val':true,'cnt':false})),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7871},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7955},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_capa=this.ESP32_capa;return ESP32_capa.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_capa','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':7993},'%tag':'pragma','apply':function () {
const ESP32_capa=this.ESP32_capa;{
console.log('Reçu ESP32 capa',ESP32_capa.nowval);}}},$$hiphop.SIGACCESS({'signame':'ESP32_capa','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8067},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Pour la fin',serveur);}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8142},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8142},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8142},'%tag':'run','zone1OUT':'','zone2OUT':'','zone3OUT':'','zone4OUT':'','zone6OUT':'','zone7OUT':'','zone8OUT':'','zone9OUT':'','zone10OUT':'','module':stopAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8394},'%tag':'pragma','apply':function () {
DAW.cleanQueues();oscMidiLocal.sendNoteOn(param.busMidiDAW,1,101,100);}})))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8619},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8659},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8659},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8659},'%tag':'run','zone1OUT':'','zone2OUT':'','zone3OUT':'','zone4OUT':'','zone6OUT':'','zone7OUT':'','zone8OUT':'','zone9OUT':'','zone10OUT':'','module':stopAll,'%frame':__frame}));
})([]),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':8883},'%tag':'pragma','apply':function () {
DAW.cleanQueues();oscMidiLocal.sendNoteOn(param.busMidiDAW,3,46,100);}})));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
