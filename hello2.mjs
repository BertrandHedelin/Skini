import * as $$hiphop from '@hop/hiphop';import * as hh from '@hop/hiphop';const foo=$$hiphop.MODULE({'id':'foo','%location':{'filename':'./tests/hello2.hh.js','pos':43},'%tag':'module'},$$hiphop.SIGNAL({'%location':{'filename':'./tests/hello2.hh.js','pos':61},'direction':'IN','name':'t'}),$$hiphop.LOOP({'%location':{'filename':'./tests/hello2.hh.js','pos':71}},$$hiphop.IF({'%location':{'filename':'./tests/hello2.hh.js','pos':84},'%tag':'if','apply':function () {
return ((() => {
const t=this.t;return t.nowval[1] < 4000 && t.nowval[1] > 3000;
})());
}},$$hiphop.SIGACCESS({'signame':'t','pre':false,'val':true,'cnt':false}),$$hiphop.SIGACCESS({'signame':'t','pre':false,'val':true,'cnt':false}),$$hiphop.ATOM({'%location':{'filename':'./tests/hello2.hh.js','pos':141},'%tag':'pragma','apply':function () {
console.log('got: ',mach.age());}})),$$hiphop.PAUSE({'%location':{'filename':'./tests/hello2.hh.js','pos':199},'%tag':'yield'})));
const mach=new hh.ReactiveMachine(foo);
mach.react({'t':[0,1000]});mach.react({'t':[0,2000]});mach.react({'t':[0,3500]});export { mach };
//# sourceMappingURL=hello2.mjs.map
