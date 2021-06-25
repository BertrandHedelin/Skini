
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

// Pour commande direct de Skini en MIDI sans passer par une passerèle ====================

// Par défaut on communique en OSC avec la DAW ou la passerèle
var directMidi = false;
if(par.directMidiON !== undefined){
    if(par.directMidiON) directMidi = true;
}

if(directMidi){

    if(debug) console.log("OSCandMidi: commande MIDI depuis Skini");
    var midi = require('midi');
    var midiConfig = require("./midiConfig.json");

    var midiOutput = new midi.Output();
    var midiPortClipToDAW;

    function getMidiPortForClipToDAW(){
      for(var i=0; i < midiConfig.length; i++){
        if(midiConfig[i].spec  === "clipToDAW"){
          for (var j = 0; j < midiOutput.getPortCount(); ++j) {
            if( midiOutput.getPortName(j) === midiConfig[i].name){
              if(debug) console.log("getMidiPortForClipToDAW: Midi" + 
                midiConfig[i].type + ", usage:" + midiConfig[i].spec +
                ", bus: "+ midiConfig[i].name + ", " + midiConfig[i].comment );
              return j;
            }
          }
        }
      }
      console.log("ERR: getPortForClipToDAW: no Midi port for controlling the DAW");
      return -1;
    }

    function initMidiOUT(){
      midiPortClipToDAW   = getMidiPortForClipToDAW();
      midiOutput.openPort(midiPortClipToDAW);
      if(debug) console.log("ClipToDaw: ", midiPortClipToDAW, midiOutput.getPortName(midiPortClipToDAW));
    }
    exports.initMidiOUT = initMidiOUT;

    initMidiOUT();
}

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
    if(directMidi){
        midiOutput.sendMessage([144 + channel, note, velocity]);
    }else{
        var buf;
        if (debug) console.log("OSCandMidi : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
        buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });

        return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
            function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
    }
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
    if(directMidi){
        midiOutput.sendMessage([ 176 + channel, controlChange, controlValue]);
    }else{
        var buf;
        buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
        if (debug) console.log("sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
        return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound, 
            function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
    }
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
    if(directMidi){
        midiOutput.sendMessage([ 176 + channel, controlChange, controlValue]);
    }else{
        var buf;
        if (debug) console.log("OSCandMidiLocal: controleChange: sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
        buf = osc.toBuffer({ address: "/controlChange" , args: [ bus, channel, controlChange, controlValue ]  });
        udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound);
        return;
    }
};
exports.controlChange = controlChange;

function sendNoteOn( bus, channel, note, velocity ) {
    if (debug) console.log("OSCandMidi : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    if(directMidi){
        midiOutput.sendMessage([144 + channel, note, velocity]);
    }else{
        var buf;
        buf = osc.toBuffer({ address: "/noteOn" , args: [ bus, channel, note, velocity ]  });    
        return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
            function(err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
    }
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
