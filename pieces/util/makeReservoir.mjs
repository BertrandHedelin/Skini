import * as $$hiphop from '@hop/hiphop';'use strict';'use hopscript';const makeAwait = function (instruments,groupeClient) {
return $$hiphop.FORK({'%location':{'filename':'.\makeReservoir.hh.js','pos':194},'%tag':'FORK'},instruments.map((val) => {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':236},'%tag':'sequence'},((g264) => {
return $$hiphop.AWAIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':242},'%tag':'await','immediate':false,'apply':function () {
return ((() => {
return this[g264].now;
})());
}},$$hiphop.SIGACCESS({'signame':g264,'pre':false,'val':false,'cnt':false}));
})(`${val}IN`),$$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':280},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':323},'%tag':'pragma','apply':function () {
console.log('makeAwait',val);}}));
}));
};const makeReservoir = function (groupeClient,instrument,gcs,serveur) {
return $$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':452},'%tag':'dollar'},$$hiphop.TRAP({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':471},'%tag':'TRAP'},$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':481},'%tag':'sequence'},$$hiphop.ABORT({'%location':{'filename':'.\makeReservoir.hh.js','pos':491},'%tag':'ABORT','immediate':true,'apply':function () {
return ((() => {
const stopReservoir=this.stopReservoir;return stopReservoir.now;
})());
}},$$hiphop.SIGACCESS({'signame':'stopReservoir','pre':false,'val':false,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':559},'%tag':'pragma','apply':function () {
console.log('--- MAKE RESERVOIR V2:',instrument[0],', groupeClient: ',groupeClient,serveur);serveur.broadcast(JSON.stringify({'type':'startTank','value':instrument[0]}));}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':901},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':964},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [true,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1026},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],true);}}),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1113},'%tag':'dollar'},makeAwait(instrument,groupeClient)),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1164},'%tag':'pragma','apply':function () {
console.log('--- FIN NATURELLE RESERVOIR V2:',instrument[0]);}}),$$hiphop.EXIT({'laTrappe':'laTrappe','%location':{'filename':'.\makeReservoir.hh.js','pos':1253},'%tag':'EXIT'})),$$hiphop.SEQUENCE({'%location':{'filename':'.\makeReservoir.hh.js','pos':1283},'%tag':'dollar'},instrument.map((val) => {
return $$hiphop.EMIT({'%location':{'filename':'.\makeReservoir.hh.js','pos':1344},'%tag':'EMIT','signame':`${val}OUT`,'apply':function () {
return [false,groupeClient];
}});
})),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1404},'%tag':'pragma','apply':function () {
gcs.informSelecteurOnMenuChange(groupeClient,instrument[0],false);}}),$$hiphop.ATOM({'%location':{'filename':'.\makeReservoir.hh.js','pos':1490},'%tag':'pragma','apply':function () {
console.log('--- ABORT RESERVOIR:',instrument[0]);serveur.broadcast(JSON.stringify({'type':'killTank','value':instrument[0]}));}}))));
};
//# sourceMappingURL=.\makeReservoir.mjs.map
