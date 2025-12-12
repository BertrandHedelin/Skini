import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';let serveur=undefined;
let gcs=undefined;
const initMakeReservoir = function (_gcs,_serveur) {
gcs=_gcs;serveur=_serveur;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'.\makeReservoir.hh.js','pos':314},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':356},'%tag':'sequence'},((g384) => {
return $$hiphop.AWAIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':362},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g384].now;
})());
}},$$hiphop.SIGACCESS({'signame':g384,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':400},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':524},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':543},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':553},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'.\makeReservoir.hh.js','pos':563},'%tag':'ABORT','immediate':true,'apply':new $$hiphop.DelaySig('stopReservoir','now')},$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':603},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'startTank','value':instrument[0]}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':899},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':962},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1024},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1111},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1162},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':1248},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1313},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1374},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1434},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1520},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};export { initMakeReservoir };export { makeAwait };export { makeReservoir };
//# sourceMappingURL=.\makeReservoir.mjs.map
