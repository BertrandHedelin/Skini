var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

var midiout = JZZ().openMidiOut(14);

// for (var i = 0; i < 20 ; i++) {
//   midiout = JZZ().openMidiOut(i);
//   console.log(i , ':',  midiout.info());
// }

var data = require('fs').readFileSync('./midi/chopin.mid', 'binary');
// data can be String, Buffer, ArrayBuffer, Uint8Array or Int8Array
var smf = new JZZ.MIDI.SMF(data);
var player = smf.player();
player.connect(midiout);
player.play();
//...
player.speed(1); // play twice slower