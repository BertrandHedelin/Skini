import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let CCChannel=1;
let CCTempo=100;
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
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
var ESP32signals=['ESP32_motion','ESP32_shock','ESP32_touch','ESP32_light','ESP32_gyro','ESP32_sensor1','ESP32_accel','ESP32_capa'];
console.log('inter:',interTextIN,interTextOUT,IZsignals,ESP32signals);const sensorIZ=$$hiphop.MODULE({'id':'sensorIZ','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2164},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2192},'direction':'IN','name':'sensorIZ'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2192},'direction':'IN','name':'tick'}),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2219},'direction':'OUT','name':n})),$$hiphop.FRAME({'fun':function () {
let name=undefined;
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2164},'%tag':'frame'},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2164},'%tag':'frame','apply':function (__frame) {
name=(0 < __frame.length?__frame[0]:undefined);}}),$$hiphop.LOOP({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2292}},$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2305},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log(' *-*-*-*-*-*-*- Sensor RC',sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2386},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval == undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2431},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log('Capteur sans valeur : ',sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2514},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 6000 && sensorIZ.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2589},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2629},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2704},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2744},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2819},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2859},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2932},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [true,0];
}}),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2972},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval[1] < 499 && sensorIZ.nowval[1] > 0;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3043},'%tag':'emit','signame':'zone6OUT','apply':function () {
return [true,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3087},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
console.log('Capteur sans valeur : ',sensorIZ.nowval);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false})))))))),$$hiphop.IF({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3166},'%tag':'if','apply':function () {
return ((() => {
const sensorIZ=this.sensorIZ;return sensorIZ.nowval !== undefined;
})());
}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3210},'%tag':'pragma','apply':function () {
const sensorIZ=this.sensorIZ;{
utilsSkini.alertInfoScoreON(name + ':' + sensorIZ.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'sensorIZ','pre':false,'val':true,'cnt':false}))),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3303},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 4;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}))));
},'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':2164},'%tag':'module'}));
const stopAll=$$hiphop.MODULE({'id':'stopAll','%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3347},'%tag':'module'},interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3374},'direction':'OUT','name':n})),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3407},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3438},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3469},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3500},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3531},'%tag':'emit','signame':'zone6OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3562},'%tag':'emit','signame':'zone7OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3593},'%tag':'emit','signame':'zone8OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3624},'%tag':'emit','signame':'zone9OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3655},'%tag':'emit','signame':'zone10OUT','apply':function () {
return [false,0];
}}));
const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3708},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3724},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3813},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3813},'direction':'IN','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3853},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3881},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3911},'direction':'IN','name':n})),ESP32signals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3940},'direction':'IN','name':n})),$$hiphop.LOOP({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3968}},$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':3980},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4003},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4027},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4079},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.ABORT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4144},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const ESP32_shock=this.ESP32_shock;const halt=this.halt;return halt.now || ESP32_shock.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.SIGACCESS({'signame':'ESP32_shock','pre':false,'val':false,'cnt':false}),$$hiphop.FORK({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4188},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4205},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4234},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i++);}})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4319},'%tag':'par'},$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4340},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4372},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4429},'%tag':'fork'},$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4448},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4490},'%tag':'pragma','apply':function () {
console.log('Reçu RC0');}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4542},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [true,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4582},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [true,0];
}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4617},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4668},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC1=this.INTERFACEZ_RC1;return INTERFACEZ_RC1.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC1','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4710},'%tag':'pragma','apply':function () {
console.log('Reçu RC1');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4757},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4808},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC2=this.INTERFACEZ_RC2;return INTERFACEZ_RC2.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC2','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4850},'%tag':'pragma','apply':function () {
console.log('Reçu RC2');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4897},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4948},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC3=this.INTERFACEZ_RC3;return INTERFACEZ_RC3.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC3','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':4990},'%tag':'pragma','apply':function () {
console.log('Reçu RC3');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5037},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5088},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_touch=this.ESP32_touch;return ESP32_touch.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_touch','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5127},'%tag':'pragma','apply':function () {
console.log('Reçu ESP32 touch');}}),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5182},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5233},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_light=this.ESP32_light;return ESP32_light.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_light','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5272},'%tag':'pragma','apply':function () {
const ESP32_light=this.ESP32_light;{
console.log('Reçu ESP32 light',ESP32_light.nowval);}}},$$hiphop.SIGACCESS({'signame':'ESP32_light','pre':false,'val':true,'cnt':false})),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5348},'%tag':'yield'})),$$hiphop.EVERY({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5399},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const ESP32_capa=this.ESP32_capa;return ESP32_capa.now;
})());
}},$$hiphop.SIGACCESS({'signame':'ESP32_capa','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5437},'%tag':'pragma','apply':function () {
const ESP32_capa=this.ESP32_capa;{
console.log('Reçu ESP32 capa',ESP32_capa.nowval);}}},$$hiphop.SIGACCESS({'signame':'ESP32_capa','pre':false,'val':true,'cnt':false})),$$hiphop.PAUSE({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5511},'%tag':'yield'})),$$hiphop.NOTHING({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5698},'%tag':'nothing'}))))),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5724},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5764},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Stop Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5838},'%tag':'emit','signame':'zone1OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5871},'%tag':'emit','signame':'zone2OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5904},'%tag':'emit','signame':'zone3OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5937},'%tag':'emit','signame':'zone4OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':5970},'%tag':'emit','signame':'zone6OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6003},'%tag':'emit','signame':'zone7OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6036},'%tag':'emit','signame':'zone8OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6069},'%tag':'emit','signame':'zone9OUT','apply':function () {
return [false,0];
}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6102},'%tag':'emit','signame':'zone10OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/modIZetESP32HH.hh.js','pos':6176},'%tag':'pragma','apply':function () {
oscMidiLocal.sendNoteOn(param.busMidiDAW,3,46,100);}})));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
