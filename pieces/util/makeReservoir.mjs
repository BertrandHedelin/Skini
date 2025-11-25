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
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':567},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':586},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':596},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'.\makeReservoir.hh.js','pos':606},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':674},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'startTank','value':instrument[0]}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':970},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1033},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1095},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1182},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1233},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR V2:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':1322},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1352},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1413},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1473},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1559},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};export { initMakeReservoir };export { makeAwait };export { makeReservoir };
//# sourceMappingURL=.\makeReservoir.mjs.map
