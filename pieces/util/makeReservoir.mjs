import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';let serveur=undefined;
let gcs=undefined;
const initMakeReservoir = function (_gcs,_serveur) {
gcs=_gcs;serveur=_serveur;};const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'.\makeReservoir.hh.js','pos':311},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':353},'%tag':'sequence'},((g381) => {
return $$hiphop.AWAIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':359},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g381].now;
})());
}},$$hiphop.SIGACCESS({'signame':g381,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':397},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}));
}));
};const makeReservoir = function (groupeClient,instrument) {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':521},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':540},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':550},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'.\makeReservoir.hh.js','pos':560},'%tag':'ABORT','immediate':false,'apply':new $$hiphop.DelaySig('stopReservoir','now')},$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':599},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'startTank','value':instrument[0]}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':895},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':958},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1020},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1107},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1158},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':1244},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1299},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1360},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1420},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1506},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};export { initMakeReservoir };export { makeAwait };export { makeReservoir };
//# sourceMappingURL=.\makeReservoir.mjs.map
