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
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1275},'%tag':'dollar'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1291},'%tag':'sequence'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1302},'%tag':'laTrappe'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1312},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1429},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1802},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1854},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':1932},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2020},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2071},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2159},'%tag':'break'}))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2188},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2236},'%tag':'emit','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2295},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':2381},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}})));
};const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
var IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
console.log('inter:',interTextIN,interTextOUT,IZsignals);const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3269},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3285},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3374},'direction':'IN','name':'stopResevoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3374},'direction':'IN','name':'stopMoveTempo'}),IZsignals.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3413},'direction':'IN','name':n})),interTextOUT.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3439},'direction':'OUT','name':n})),interTextIN.map((n) => $$hiphop.SIGNAL({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3469},'direction':'IN','name':n})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3496},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.AWAIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3517},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3539},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3587},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3653},'%tag':'emit','signame':'sensor0OUT','apply':function () {
return [true,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3680},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('sensor0-1');}}),$$hiphop.FORK({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3728},'%tag':'fork'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3728},'%tag':'fork'},$$hiphop.ABORT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3741},'%tag':'abort','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3766},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3793},'%tag':'pragma','apply':function () {
console.log('tick from HH',i++);gcs.setTickOnControler(i);}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3925},'%tag':'emit','signame':'sensor0OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3955},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':3995},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4058},'%tag':'every','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4277},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4349},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4361},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4443},'%tag':'emit','signame':'sensor2IN'}))),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4529},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4613},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4703},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4787},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4877},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':4959},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}))))),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5050},'%tag':'par'},$$hiphop.PAUSE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5062},'%tag':'yield'}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/helloSkiniIZPB.hh.js','pos':5075},'%tag':'dollar'},makeReservoir(1,Instruments,serveur,gcs)))));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
