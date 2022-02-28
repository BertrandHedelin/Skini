var JZZ = require('jzz');

var navigator = require('jzz');

function onSuccess() {
  console.log("Onsuccess");
  JZZ().or('Cannot start MIDI engine!')
    .openMidiOut().or('Cannot open MIDI Out port!')
    .wait(500).send([0x90, 60, 127]) // note on
    .wait(500).send([0x80, 60, 0]);  // note off
    
  JZZ().openMidiIn().or('Cannot open MIDI In port!')
    .and(function () { console.log('MIDI-In: ', this.name()); })
    .connect(function (msg) { console.log(msg.toString()); })
    .wait(10000).close();
}

function onFail() {
  console.log("OnFail");
}

navigator.requestMIDIAccess().then(onSuccess, onFail);

navigator.close(); // This will close MIDI inputs,
                   // otherwise Node.js will wait for MIDI input forever.
// In browsers the funcion is neither defined nor required.
