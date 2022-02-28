var JZZ = require('jzz');

var logger = JZZ.Widget({ _receive: function (msg) { console.log(msg.toString()); } });
JZZ.addMidiOut('OUTPORT-NODE', logger);

// now it can be used as a port:
var port = JZZ().openMidiOut('OUTPORT-NODE');
// ...

port.send([0x90, 61, 127]).wait(500).send([0x80, 61, 0]);

port.wait(500).send([0x90, 60, 127]) // note on
  .wait(500).send([0x80, 60, 0]);  // note off

port.and(function () { console.log('MIDI-In: ', this.name()); })
  .connect(function (msg) { console.log(msg.toString()); })
  .wait(30000).close();