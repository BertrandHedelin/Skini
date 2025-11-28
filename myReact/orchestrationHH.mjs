import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';import { ReactiveMachine } from '@hop/hiphop';import * as utilsSkini from '../serveur/utilsSkini.mjs';var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;
var signals;
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
if (debug1) console.log('hh_ORCHESTRATION: setServ');
DAW=daw;serveur=ser;gcs=groupeCS;oscMidiLocal=oscMidi;midimix=mix;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':932},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':970},'%tag':'sequence'},((g1000) => {
return $$hiphop.AWAIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':977},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g1000].now;
})());
}},$$hiphop.SIGACCESS({'signame':g1000,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1017},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1061},'%tag':'pragma','apply':function () {
console.log('---------------------------- makeAwait',instruments,groupeClient);}}));
}));
};const makeReservoir = function (groupeClient,instrument,serv) {
return $$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1231},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1258},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1268},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1278},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1349},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0],', groupeClient: ',groupeClient);var msg={'type':'startTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1722},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1774},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1839},'%tag':'pragma','apply':function () {
console.log('----------------- gcs = ',typeof gcs);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':1912},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2000},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2051},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2139},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2168},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2216},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2275},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2361},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);var msg={'type':'killTank','value':instrument[0]};
serveur.broadcast(JSON.stringify(msg));}}))));
};const Instruments=['sensor0','sensor1','sensor2','sensor3','sensor4'];
const reservoirSensor=$$hiphop.MODULE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2785},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2854},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2854},'direction':'IN','name':'stopReservoir'}),Instruments.map((i) => {
return `${i}IN`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2883},'direction':'IN','name':n});
}),Instruments.map((i) => {
return `${i}OUT`;
}).map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2930},'direction':'OUT','name':n});
}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':2974},'%tag':'dollar'},makeReservoir(1,Instruments,serveur)));
const setSignals = function (param) {
var i=0;
let interTextOUT=utilsSkini.creationInterfacesOUT(param.groupesDesSons);
let interTextIN=utilsSkini.creationInterfacesIN(param.groupesDesSons);
const IZsignals=['INTERFACEZ_RC','INTERFACEZ_RC0','INTERFACEZ_RC1','INTERFACEZ_RC2','INTERFACEZ_RC3','INTERFACEZ_RC4','INTERFACEZ_RC5','INTERFACEZ_RC6','INTERFACEZ_RC7','INTERFACEZ_RC8','INTERFACEZ_RC9','INTERFACEZ_RC10','INTERFACEZ_RC11'];
console.log('\n******* Je suis dans helloSkiniIZPB 2\n');console.log('inter:',interTextIN,interTextOUT,IZsignals);const Program=$$hiphop.MODULE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3653},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'start'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'halt'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'tick'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'DAWON'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'patternSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'pulsation'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'midiSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3668},'direction':'IN','name':'emptyQueueSignal'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3757},'direction':'INOUT','name':'stopReservoir'}),$$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3757},'direction':'INOUT','name':'stopMoveTempo'}),IZsignals.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3801},'direction':'IN','name':n});
}),interTextOUT.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3827},'direction':'OUT','name':n});
}),interTextIN.map((n) => {
return $$hiphop.SIGNAL({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3857},'direction':'IN','name':n});
}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3884},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const start=this.start;return start.now;
})());
}},$$hiphop.SIGACCESS({'signame':'start','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3907},'%tag':'pragma','apply':function () {
utilsSkini.addSceneScore(1,serveur);}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':3955},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Skini HH',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4021},'%tag':'EMIT','signame':'sensor0OUT','apply':function () {
return [true,0];
}}),$$hiphop.AWAIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4048},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
},'countapply':function () {
return 5;
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4079},'%tag':'pragma','apply':function () {
DAW.putPatternInQueue('sensor0-1');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4126},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Début',serveur);}}),$$hiphop.FORK({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4184},'%tag':'FORK'},$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4184},'%tag':'SEQUENCE'},$$hiphop.ABORT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4197},'%tag':'ABORT','immediate':false,'apply':function () {
return ((() => {
const halt=this.halt;return halt.now;
})());
}},$$hiphop.SIGACCESS({'signame':'halt','pre':false,'val':false,'cnt':false}),$$hiphop.EVERY({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4222},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const tick=this.tick;return tick.now;
})());
}},$$hiphop.SIGACCESS({'signame':'tick','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4249},'%tag':'pragma','apply':function () {
console.log('tick from HH',i++);gcs.setTickOnControler(i);}}))),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4381},'%tag':'EMIT','signame':'sensor0OUT','apply':function () {
return [false,0];
}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4411},'%tag':'pragma','apply':function () {
console.log('Reçu Halt');}}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4451},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreOFF(serveur);}})),$$hiphop.EVERY({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4514},'%tag':'EVERY','immediate':false,'apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.now;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4550},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
console.log(' *-*-*-*-*-*-*- Sensor RC0',INTERFACEZ_RC0.nowval);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4633},'%tag':'pragma','apply':function () {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;{
utilsSkini.alertInfoScoreON('Sensor RC0 : ' + INTERFACEZ_RC0.nowval[1],serveur);}}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false})),$$hiphop.IF({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4738},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4810},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4822},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 1',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4904},'%tag':'EMIT','signame':'sensor2IN'}))),$$hiphop.IF({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':4990},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5062},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5074},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 2',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5156},'%tag':'EMIT','signame':'sensor3IN'}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5184},'%tag':'EMIT','signame':'stopReservoir'})),$$hiphop.IF({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5224},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5308},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 3',serveur);}}),$$hiphop.IF({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5398},'%tag':'if','apply':function () {
return ((() => {
const INTERFACEZ_RC0=this.INTERFACEZ_RC0;return INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500;
})());
}},$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'INTERFACEZ_RC0','pre':false,'val':true,'cnt':false}),$$hiphop.SEQUENCE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5468},'%tag':'sequence'},$$hiphop.ATOM({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5480},'%tag':'pragma','apply':function () {
utilsSkini.alertInfoScoreON('Sensor RC0 : Zone 4',serveur);}}),$$hiphop.EMIT({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5562},'%tag':'EMIT','signame':'sensor4IN'})))))),$$hiphop.PAUSE({'%location':{'filename':'./pieces/tests/helloSkiniIZPB.hh.js','pos':5611},'%tag':'yield'})));
const prg=new ReactiveMachine(Program,'orchestration');
return prg;
};export { setServ };export { setSignals };
//# sourceMappingURL=./myReact/orchestrationHH.mjs.map
