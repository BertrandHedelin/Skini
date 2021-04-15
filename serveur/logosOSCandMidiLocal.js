
// ===========================
// OSC and Midi commandes for LOGOS en NODE JS
//
// Voir:
// http://www.indiana.edu/~emusic/cntrlnumb.html,
// http://www.ccarh.org/courses/253/handout/controllers/
//
// ===========================

var osc = require('osc-min');
var dgram = require("dgram");
var udp = dgram.createSocket("udp4");
var par = require('./logosParametres');
var fs = require('fs');

var outportForMIDI       = par.outportForMIDI;
var outportProcessing    = par.outportProcessing;
var remoteIPAddressSound = par.remoteIPAddressSound;
var remoteIPAddressAbleton = par.remoteIPAddressAbleton;
var remoteIPAddressImage = par.remoteIPAddressImage;

var debug = false;

// VERS PROCESSING ==================================================

function sendProcessing (message, value) {
    var buf;

    if (debug) console.log("LogosOSCandMidi: sends osc to processing :" + message + " " + value + " to " + outportProcessing);
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

function sendNoteOnAbleton ( bus, channel, note, velocity ) {
    var buf;
    if (debug) console.log("LogosOSCandMIDI : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });    
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressAbleton,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOnAbleton = sendNoteOnAbleton;

function sendNoteOff ( bus, channel, note, velocity ) {
    var buf;
    
    buf = osc.toBuffer({ address: "/noteOff" , args: [ bus, channel, note, velocity ]  });    
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOff = sendNoteOff;

function sendProgramChange (bus, channel, program) {
    var buf;
    // Le -1 sur program, channel est pour être en phase avec le num de preset dans les synthé
    buf = osc.toBuffer({ address: "/programChange" , args: [ bus, channel -1 , program -1 ]  });
    if (debug) console.log("sending osc messages programChange :" + program + " to channel: " + channel + " On bus: " + bus );
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendProgramChange = sendProgramChange;

function sendBankSelect (bus, channel, bank) {
    var buf;

    buf = osc.toBuffer({ address: "/bankSelect" , args: [ bus, channel - 1, bank - 1 ]  });
    if (debug) console.log("sending osc messages bankSelect :" + bank + " to channel " + channel);
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendBankSelect = sendBankSelect;

function sendControlChange (bus, channel, controlChange, controlValue) {
    var buf;

    buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
    if (debug) console.log("sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound, 
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendControlChange = sendControlChange;

function sendAllNoteOff () {
    var buf;

    buf = osc.toBuffer({ address: "/allNoteOff" , args: [ 0, 0 ]  });
    if (debug) console.log("sending ALL OFF");
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });

};
exports.sendAllNoteOff = sendAllNoteOff;

function controlChange (bus, channel, controlChange, controlValue) {
    var buf;

    buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
    if (debug) console.log("LogosOSCandMidiLocal: controleChange: sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
    udp.send(buf, 0, buf.length, par.outportForMIDI, par.remoteIPAddressSound);
    return;
};
exports.controlChange = controlChange;

function sendNoteOn ( bus, channel, note, velocity ) {
    var buf;
    if (debug) console.log("LogosOSCandMIDI : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });    
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOn = sendNoteOn;

function sendAllNoteOff (bus, channel) {
    var buf;

    buf = osc.toBuffer({ address: "/allNoteOff" , args: [ bus, channel ]  });
    if (debug) console.log("sending ALL OFF");
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
        function(err) { if (err !== null) console.log("logosOSCandMidi: Erreur udp send: ", err); });

};
exports.sendAllNoteOff = sendAllNoteOff;

/// VERS LA LUMIERE (QLC+)  ============================

function sendSceneLumiere (message) {
    var buf;
    var value = 123; // A priori inutile, mais QLC+ ne comprend pas les message OSC sans valeur

    if (debug) console.log("LogosOSCandMidi: sends osc to QLC +  :" + message + " " + " to " + par.outportLumiere);
    buf = osc.toBuffer({ address: message , args: [ value ]  });
    return udp.send(buf, 0, buf.length, par.outportLumiere, par.remoteIPAddressLumiere);
};
exports.sendSceneLumiere = sendSceneLumiere;
