'use strict'; 
'use hopscript'; 

import * as $$hiphop from '@hop/hiphop'; 

export function toto(val){
    console.log("\n\nToto", val, "\n\n");
}

export function makeAwait(instruments, groupeClient) {
    return $$hiphop.FORK({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 194 }, '%tag': 'FORK' }, instruments.map((val) => {
        return $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 236 }, '%tag': 'sequence' }, ((g266) => {
            return $$hiphop.AWAIT({
                '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 244 }, '%tag': 'await', 'immediate': false, 'apply': function () {
                    return ((() => {
                        return this[g266].now;
                    })());
                }
            }, $$hiphop.SIGACCESS({ 'signame': g266, 'pre': false, 'val': false, 'cnt': false }));
        })(`${val}IN`), $$hiphop.EMIT({
            '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 283 }, '%tag': 'EMIT', 'signame': `${val}OUT`, 'apply': function () {
                return [false, groupeClient];
            }
        }), $$hiphop.ATOM({
            '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 327 }, '%tag': 'pragma', 'apply': function () {
                console.log('makeAwait', val);
            }
        }));
    }));
}; 

export function makeReservoir(groupeClient, instrument, gcs, serveur) {
    return $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 456 }, '%tag': 'dollar' }, $$hiphop.TRAP({ 'laTrappe': 'laTrappe', '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 475 }, '%tag': 'TRAP' }, $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 485 }, '%tag': 'sequence' }, $$hiphop.ABORT({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 495 }, '%tag': 'ABORT', 'immediate': true, 'apply': function () {
            return ((() => {
                const stopReservoir = this.stopReservoir; return stopReservoir.now;
            })());
        }
    }, $$hiphop.SIGACCESS({ 'signame': 'stopReservoir', 'pre': false, 'val': false, 'cnt': false }), $$hiphop.ATOM({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 565 }, '%tag': 'pragma', 'apply': function () {
            console.log('--- MAKE RESERVOIR:', instrument[0], ', groupeClient: ', groupeClient); var msg = { 'type': 'startTank', 'value': instrument[0] };
            serveur.broadcast(JSON.stringify(msg));
        }
    }), $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 981 }, '%tag': 'dollar' }, instrument.map((val) => {
        return $$hiphop.EMIT({
            '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1052 }, '%tag': 'EMIT', 'signame': `${val}OUT`, 'apply': function () {
                return [true, groupeClient];
            }
        });
    })), $$hiphop.ATOM({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1118 }, '%tag': 'pragma', 'apply': function () {
            gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], true);
        }
    }), $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1207 }, '%tag': 'dollar' }, makeAwait(instrument, groupeClient)), $$hiphop.ATOM({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1260 }, '%tag': 'pragma', 'apply': function () {
            console.log('--- FIN NATURELLE RESERVOIR:', instrument[0]);
        }
    }), $$hiphop.EXIT({ 'laTrappe': 'laTrappe', '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1348 }, '%tag': 'EXIT' })), $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1377 }, '%tag': 'dollar' }, instrument.map((val) => {
        return $$hiphop.EMIT({
            '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1444 }, '%tag': 'EMIT', 'signame': `${val}OUT`, 'apply': function () {
                return [false, groupeClient];
            }
        });
    })), $$hiphop.ATOM({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1504 }, '%tag': 'pragma', 'apply': function () {
            gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], false);
        }
    }), $$hiphop.ATOM({
        '%location': { 'filename': '.\makeReservoir.hh.js', 'pos': 1590 }, '%tag': 'pragma', 'apply': function () {
            console.log('--- ABORT RESERVOIR:', instrument[0]); var msg = { 'type': 'killTank', 'value': instrument[0] };
            serveur.broadcast(JSON.stringify(msg));
        }
    }))));
};
//# sourceMappingURL=.\makeReservoir.mjs.map
