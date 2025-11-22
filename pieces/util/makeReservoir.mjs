import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'.\makeReservoir.hh.js','pos':201},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':243},'%tag':'sequence'},((g271) => {
return $$hiphop.AWAIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':249},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g271].now;
})());
}},$$hiphop.SIGACCESS({'signame':g271,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':287},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':330},'%tag':'pragma','apply':function () {
console.log('makeAwait',val);}}));
}));
};const makeReservoir = function (groupeClient,instrument,gcs,serveur) {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':466},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':485},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':495},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'.\makeReservoir.hh.js','pos':505},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':573},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR V1:',instrument[0],', groupeClient: ',groupeClient,serveur);serveur.broadcast(JSON.stringify({'type':'startTank','value':instrument[0]}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':915},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':978},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1040},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1127},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1178},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR V2:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':1267},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1297},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1358},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1418},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1504},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};export { makeAwait };export { makeReservoir };
//# sourceMappingURL=.\makeReservoir.mjs.map
