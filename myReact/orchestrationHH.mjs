import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';let midimix=undefined;
let oscMidiLocal=undefined;
let gcs=undefined;
let DAW=undefined;
let serveur=undefined;
let signals=undefined;
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
const Instruments=['sensor2','sensor3','sensor4'];
const setServ = function (ser,daw,groupeCS,oscMidi,mix) {
if (debug) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':971},'%tag':'fork'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1009},'%tag':'sequence'},((g1039) => $$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1016},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g1039].now;
})());
}},$$hiphop.SIGACCESS({'signame':g1039,'pre':false,'val':false,'cnt':false})))(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1056},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1100},'%tag':'pragma','apply':function () {
console.log('---------------------------- makeAwait',instruments,groupeClient);}}));
}));
};const makeReservoir = function (groupeClient,instrument,serv,gcs) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1275},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1302},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1312},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1322},'%tag':'abort','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1393},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1766},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1818},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1896},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1984},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2035},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2123},'%tag':'break'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2152},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2200},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2259},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2345},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};var reservoirSensor=$$hiphop.MODULE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2702},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2790},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2790},'direction':'IN','name':'stopReservoir'}),Instruments.map((i) => {
return `${i}IN`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2819},'direction':'IN','name':n})),Instruments.map((i) => {
return `${i}OUT`;
}).map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2866},'direction':'OUT','name':n})),$$hiphop.FRAME({'fun':function () {
let tick=undefined;let stopReservoir=undefined;
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2702},'%tag':'frame'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2702},'%tag':'frame','apply':function (__frame) {
tick=(0 < __frame.length?__frame[0]:undefined);stopReservoir=(1 < __frame.length?__frame[1]:undefined);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2910},'%tag':'dollar'},makeReservoir(1,Instruments,serveur,gcs)));
},'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2702},'%tag':'module'}));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
console.log('inter:',interTextIN,interTextOUT,IZsignals);const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3506},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3521},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3610},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3610},'direction':'INOUT','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3653},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3679},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3709},'direction':'IN','name':n})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3736},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3757},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3779},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3827},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3893},'%tag':'emit','signame':'sensor0OUT','apply':function () {
return [true,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3920},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('sensor0-1');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3968},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3968},'%tag':'fork'},$$hiphop.ABORT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3981},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4006},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4033},'%tag':'pragma','apply':function () {
gcs.setTickOnControler(i);}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4167},'%tag':'emit','signame':'sensor0OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4197},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4237},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4300},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4519},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4591},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4603},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4685},'%tag':'emit','signame':'sensor2IN'}))),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4771},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4843},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4855},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4967},'%tag':'emit','signame':'stopReservoir'})),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5007},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5091},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5181},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5251},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5263},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5345},'%tag':'emit','signame':'sensor4IN'})))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5382},'%tag':'par'},$$hiphop.PAUSE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5394},'%tag':'yield'}),(function (__frame) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5407},'%tag':'run'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5407},'%tag':'hop','apply':function () {
}}),$$hiphop.RUN({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5407},'%tag':'run','autocomplete':true,'module':reservoirSensor,'%frame':__frame}));
})([]))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
