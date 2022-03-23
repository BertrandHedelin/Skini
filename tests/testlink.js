const abletonlink = require('abletonlink');
const link = new abletonlink();

let localBeat = 0;
let instantBeat = 0;

link.startUpdate(100, (beat, phase, bpm) => {
  instantBeat = Math.round(beat);
  if( localBeat!== instantBeat){
    console.log("updated: ", Math.round(beat), Math.round(phase),  Math.round(bpm));
    localBeat =instantBeat;
  }
});

link.on('tempo', (tempo) => console.log("tempo", tempo));
link.on('numPeers', (numPeers) => console.log("numPeers", numPeers));
//link.on('playState', (playState) => console.log("playState", playState));

// callback is option.
//link.startUpdate(60); // correct!

// function do_something() {
//     const beat = link.beat;
//     const phase = link.phase;
//     const bpm = link.bpm;
// }