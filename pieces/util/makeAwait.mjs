import * as $$hiphop from '@hop/hiphop'; 'use strict'; 'use hopscript'; const makeAwait = function (instruments, groupeClient) {
    return $$hiphop.FORK({ '%location': { 'filename': '.\makeAwait.hh.js', 'pos': 187 }, '%tag': 'FORK' }, instruments.map((val) => {
        return $$hiphop.SEQUENCE({ '%location': { 'filename': '.\makeAwait.hh.js', 'pos': 229 }, '%tag': 'sequence' }, ((g259) => {
            return $$hiphop.AWAIT({
                '%location': { 'filename': '.\makeAwait.hh.js', 'pos': 237 }, '%tag': 'await', 'immediate': false, 'apply': function () {
                    return ((() => {
                        return this[g259].now;
                    })());
                }
            }, $$hiphop.SIGACCESS({ 'signame': g259, 'pre': false, 'val': false, 'cnt': false }));
        })(`${val}IN`), $$hiphop.EMIT({
            '%location': { 'filename': '.\makeAwait.hh.js', 'pos': 276 }, '%tag': 'EMIT', 'signame': `${val}OUT`, 'apply': function () {
                return [false, groupeClient];
            }
        }), $$hiphop.ATOM({
            '%location': { 'filename': '.\makeAwait.hh.js', 'pos': 320 }, '%tag': 'pragma', 'apply': function () {
                console.log('makeAwait', val);
            }
        }));
    }));
};
//# sourceMappingURL=.\makeAwait.mjs.map
