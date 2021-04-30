
// ===========================
// OSC and Midi commandes en NODE JS
//   © Copyright 2017-2021, B. Petit-Hédelin
// Voir:
// http://www.indiana.edu/~emusic/cntrlnumb.html,
// http://www.ccarh.org/courses/253/handout/controllers/
//
// ===========================

var osc = require('osc-min');
var dgram = require("dgram");
var udp = dgram.createSocket("udp4");
var par = require('./skiniParametres');
var ipConfig = require('./ipConfig');
var fs = require('fs');

var outportForMIDI       = ipConfig.OutPortOSCMIDItoDAW;
var outportProcessing    = ipConfig.outportProcessing;
var remoteIPAddressSound = ipConfig.remoteIPAddressSound;
var remoteIPAddressDAW   = ipConfig.remoteIPAddressDAW;
var remoteIPAddressImage = ipConfig.remoteIPAddressImage;
var outportLumiere       = ipConfig.outportLumiere;
var remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere;


var debug = false;
var debug1 = true;

// VERS PROCESSING ==================================================

function sendProcessing(message, value) {
    var buf;

    if (debug) console.log("OSCandMidi: sends osc to processing :" + message + " " + value + " to " + outportProcessing);
    buf = osc.toBuffer({ address: message , args: [ value ]  });
    return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
};
exports.sendProcessing = sendProcessing;

function sendOSCProcessing(message, val1, val2) {
    var buf;
    
    if (debug) console.log("sending osc messages to processing :" + message + " " + val1 + " " + val2 );
    buf = osc.toBuffer({ address: message , args: [ val1, val2 ]  });
    return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
}
exports.sendOSCProcessing = sendOSCProcessing;

function sendNoteOnDAW( bus, channel, note, velocity ) {
    var buf;
    if (debug) console.log("OSCandMidi : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });

    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOnDAW = sendNoteOnDAW;

function sendNoteOff( bus, channel, note, velocity ) {
    var buf;
    
    buf = osc.toBuffer({ address: "/noteOff" , args: [ bus, channel, note, velocity ]  });    
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOff = sendNoteOff;

function sendProgramChange(bus, channel, program) {
    var buf;
    // Le -1 sur program, channel est pour être en phase avec le num de preset dans les synthé
    buf = osc.toBuffer({ address: "/programChange" , args: [ bus, channel -1 , program -1 ]  });
    if (debug) console.log("sending osc messages programChange :" + program + " to channel: " + channel + " On bus: " + bus );
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendProgramChange = sendProgramChange;

function sendBankSelect(bus, channel, bank) {
    var buf;

    buf = osc.toBuffer({ address: "/bankSelect" , args: [ bus, channel - 1, bank - 1 ]  });
    if (debug) console.log("sending osc messages bankSelect :" + bank + " to channel " + channel);
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendBankSelect = sendBankSelect;

function sendControlChange(bus, channel, controlChange, controlValue) {
    var buf;

    buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
    if (debug) console.log("sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound, 
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendControlChange = sendControlChange;

function sendAllNoteOff() {
    var buf;

    buf = osc.toBuffer({ address: "/allNoteOff" , args: [ 0, 0 ]  });
    if (debug) console.log("sending ALL OFF");
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });

};
exports.sendAllNoteOff = sendAllNoteOff;

function controlChange(bus, channel, controlChange, controlValue) {
    var buf;

    buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
    if (debug) console.log("OSCandMidiLocal: controleChange: sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
    udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound);
    return;
};
exports.controlChange = controlChange;

function sendNoteOn( bus, channel, note, velocity ) {
    var buf;
    if (debug) console.log("OSCandMidi : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });    
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOn = sendNoteOn;

function sendAllNoteOff(bus, channel) {
    var buf;

    buf = osc.toBuffer({ address: "/allNoteOff" , args: [ bus, channel ]  });
    if (debug) console.log("sending ALL OFF");
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });

};
exports.sendAllNoteOff = sendAllNoteOff;

/// VERS LA LUMIERE (QLC+)  ============================

function sendSceneLumiere(message) {
    var buf;
    var value = 123; // A priori inutile, mais QLC+ ne comprend pas les message OSC sans valeur

    if (debug) console.log("OSCandMidi: sends osc to QLC +  :" + message + " " + " to " + par.outportLumiere);
    buf = osc.toBuffer({ address: message , args: [ value ]  });
    return udp.send(buf, 0, buf.length, outportLumiere, remoteIPAddressLumiere);
};
exports.sendSceneLumiere = sendSceneLumiere;
