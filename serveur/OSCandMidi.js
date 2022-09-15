/**
 * @fileOverview OSC and Midi control
 * <BR> See: http://www.indiana.edu/~emusic/cntrlnumb.html,
 * http://www.ccarh.org/courses/253/handout/controllers/
 * @author Bertrand Hédelin © Copyright 2017-2022
 * @version 1.1
 */

var osc = require('osc-min');
var dgram = require("dgram");
var udp = dgram.createSocket("udp4");

// Pour permettre le broadcast depuis node.js
udp.bind(function() { udp.setBroadcast(true); });

// Appelé à la fois par setParameters et reloadParameters dans websocketServer.js
// donc attention à startOSCandMIDI() et les variables globales.
var par;
function setParameters(parameters) {
  par = parameters;
  startOSCandMIDI();
}
exports.setParameters = setParameters;

var ipConfig = require('./ipConfig');

var outportForMIDI = ipConfig.OutPortOSCMIDItoDAW;
var outportProcessing = ipConfig.outportProcessing;
var remoteIPAddressSound = ipConfig.remoteIPAddressSound;
var remoteIPAddressImage = ipConfig.remoteIPAddressImage;
var outportLumiere = ipConfig.outportLumiere;
var remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere;

var debug = false;
var debug1 = true;
var midiPortClipToDAW;
var directMidi = false;
var midiOutput;

// Pour commande direct de Skini en MIDI sans passer par une passerelle ====================
function startOSCandMIDI() {
  // Par défaut on communique en OSC avec la DAW ou la passerelle
  if (par.directMidiON !== undefined) {
    directMidi = par.directMidiON;
  }
  if (directMidi) {
    if (debug) console.log("OSCandMidi: commande MIDI depuis Skini");
    var midi = require('midi');
    var midiConfig = require("./midiConfig.json");

    // Il ne faut pas recréer midiOutput, mais ceci sera à revoir
    // si on veut changer de configuration Midi en cours de session
    if (midiOutput === undefined) {
      midiOutput = new midi.Output();
    }

    function getMidiPortForClipToDAW() {
      for (var i = 0; i < midiConfig.length; i++) {
        if (midiConfig[i].spec === "clipToDAW") {
          for (var j = 0; j < midiOutput.getPortCount(); ++j) {
            if (midiOutput.getPortName(j) === midiConfig[i].name) {
              if (debug) console.log("getMidiPortForClipToDAW: Midi" +
                midiConfig[i].type + ", usage:" + midiConfig[i].spec +
                ", bus: " + midiConfig[i].name + ", " + midiConfig[i].comment);
              return j;
            }
          }
        }
      }
      console.log("ERR: getPortForClipToDAW: no Midi port for controlling the DAW");
      return -1;
    }
  }

  /**
   * Initialise the Midi port according the configuration file
   */
  function initMidiOUT() {
    midiPortClipToDAW = getMidiPortForClipToDAW();
    midiOutput.openPort(midiPortClipToDAW);
    if (debug1) console.log("OSCandMidi.js: initMidiOUT: midiPortClipToDAW ", midiPortClipToDAW, midiOutput.getPortName(midiPortClipToDAW));
  }
  exports.initMidiOUT = initMidiOUT;

  function getMidiPortClipToDAW() {
    return midiPortClipToDAW;
  }
  exports.getMidiPortClipToDAW = getMidiPortClipToDAW;
}

// VERS PROCESSING ==================================================
/**
 * Send an OSC message to processing
 * @param  {string} message
 * @param  {number} value
 */
function sendProcessing(message, value) {
  var buf;

  if (debug) console.log("OSCandMidi: sends osc to processing :" + message + " " + value + " to " + outportProcessing);
  buf = osc.toBuffer({ address: message, args: [value] });
  return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
};
exports.sendProcessing = sendProcessing;
/**
 *  Send an OSC message to processing with 2 values
 * @param  {string} message
 * @param  {number} val1
 * @param  {number} val2
 */
function sendOSCProcessing(message, val1, val2) {
  var buf;

  if (debug) console.log("sending osc messages to processing :" + message + " " + val1 + " " + val2);
  buf = osc.toBuffer({ address: message, args: [val1, val2] });
  return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
}
exports.sendOSCProcessing = sendOSCProcessing;

/**
 * Send a note on through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} note
 * @param  {number} velocity
 */
function sendNoteOn(bus, channel, note, velocity) {
  if (directMidi) {
    midiOutput.sendMessage([144 + channel, note, velocity]);
  } else {
    var buf;
    if (debug) console.log("OSCandMidi : sending osc messages NoteOn " + note + "  Bus :" + bus + " to channel " + channel);
    buf = osc.toBuffer({ address: "/noteOn", args: [bus, channel, note, velocity] });

    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
      function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
  }
};
exports.sendNoteOn = sendNoteOn;

/**
 * Send a note off through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} note
 * @param  {number} velocity
 */
function sendNoteOff(bus, channel, note, velocity) {
  var buf;

  buf = osc.toBuffer({ address: "/noteOff", args: [bus, channel, note, velocity] });
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendNoteOff = sendNoteOff;
/**
 * Send a program change through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} program
 */
function sendProgramChange(bus, channel, program) {
  var buf;
  // Le -1 sur program, channel est pour être en phase avec le num de preset dans les synthé
  buf = osc.toBuffer({ address: "/programChange", args: [bus, channel - 1, program - 1] });
  if (debug) console.log("sending osc messages programChange :" + program + " to channel: " + channel + " On bus: " + bus);
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendProgramChange = sendProgramChange;

/**
 * Send a bank select through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} bank
 */
function sendBankSelect(bus, channel, bank) {
  var buf;

  buf = osc.toBuffer({ address: "/bankSelect", args: [bus, channel - 1, bank - 1] });
  if (debug) console.log("sending osc messages bankSelect :" + bank + " to channel " + channel);
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};
exports.sendBankSelect = sendBankSelect;

/**
 * Send a CC through OSC or Midi
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} controlChange
 * @param  {number} controlValue
 */
function sendControlChange(bus, channel, controlChange, controlValue) {
  if (directMidi) {
    if (debug) {
      console.log("sending CC Midi: channel:", channel,
        "controlChange :", controlChange,
        " Value: ", controlValue,
        " : ", midiPortClipToDAW);
    }
    midiOutput.sendMessage([176 + channel, controlChange, controlValue]);
  } else {
    var buf;
    buf = osc.toBuffer({ address: "/controlChange", args: [bus, channel, controlChange, controlValue] });
    if (debug1) console.log("sending osc messages bus:", bus, "controlChange :" + controlChange + " Value: " + controlValue);
    return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
      function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
  }
};
exports.sendControlChange = sendControlChange;

/**
 * Send all note off through OSC
 * @param  {number} bus
 * @param  {number} channel
 */
function sendAllNoteOff(bus, channel) {
  var buf;

  buf = osc.toBuffer({ address: "/allNoteOff", args: [bus, channel] });
  if (debug) console.log("sending ALL OFF");
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });

};
exports.sendAllNoteOff = sendAllNoteOff;

/// VERS LA LUMIERE (QLC+)  ============================
/**
 * To send message to QLC+ for light control
 * @param  {string} message
 */
function sendSceneLumiere(message) {
  var buf;
  var value = 123; // A priori inutile, mais QLC+ ne comprend pas les message OSC sans valeur

  if (debug) console.log("OSCandMidi: sends osc to QLC +  :" + message + " " + " to " + par.outportLumiere);
  buf = osc.toBuffer({ address: message, args: [value] });
  return udp.send(buf, 0, buf.length, outportLumiere, remoteIPAddressLumiere);
};
exports.sendSceneLumiere = sendSceneLumiere;

// VERS PLATEFORME DE JEU OU CONTOLEUR OSC ================================================
/**
 * To send OSC message to a Game platfrom or an external device
 * the OSC port is defined in the ipConfiguration by portOSCToGame
 * @param  {string} message
 * @param  {number} value
 */
function sendOSCGame(message, value) { // Value = table des données 
  var buf;
  var commandeOSC = "/" + message;
  if (debug) console.log("LogosOSCandMidi: sends osc to Game or controler :" + commandeOSC + " : " + value + " : " + ipConfig.portOSCToGame  + " : " + ipConfig.remoteIPAddressGame);
  buf = osc.toBuffer({ address: commandeOSC, args: [value] });
  return udp.send(buf, 0, buf.length, ipConfig.portOSCToGame, ipConfig.remoteIPAddressGame);
};
exports.sendOSCGame = sendOSCGame;

/**
 * To play a buffer via OSC message in a Raspberry
 * @param {string} message
 * @param {number} buffer num
 * @param {number} Udp port
 * @param {string} IP address of the Raspberry
 * @param {number} level of the pattern
 */
function playOSCRasp(message, bufferNum, port, IPaddress, level, duration) {
  var buf;
  var commandeOSC = "/" + message;
  var commandeLevel = "/level"; // Temporairement en dur en attendant d'avoir le bon patch PureData
  var defaultLevel = 70;

  if (!isNaN(level)) {
    defaultLevel = level;
  }

  // Pour le moment en deux commandes une de niveau et une de jouer le buffer
  if (debug1) console.log("OSCandMidi: play osc to Rapsberry :"
    + IPaddress + " : " + commandeLevel + " : " + level + " : " + level + ":" + duration);
  buf = osc.toBuffer({
    address: commandeLevel,
    args: [
      { type: 'integer', value: parseInt(level) },
      { type: 'integer', value: duration },
      { type: 'integer', value: 120 },
    ]
  });
  udp.send(buf, 0, buf.length, port, IPaddress);

  if (debug1) console.log("OSCandMidi: play osc to Rapsberry :"
    + IPaddress + " : " + commandeOSC + " : " + bufferNum + " : " + level);
  buf = osc.toBuffer({
    address: commandeOSC,
    args: [
      { type: 'integer', value: parseInt(bufferNum) },
      { type: 'integer', value: duration },
      { type: 'integer', value: 120 },
    ]
  });
  return udp.send(buf, 0, buf.length, port, IPaddress);
};
exports.playOSCRasp = playOSCRasp;

/**
 * To send OSC message to a Raspberry
 * @param {string} message
 * @param {number} value
 * @param {number} Udp port
 * @param {string} IP address of the Raspberry
 */
function sendOSCRasp(message, value1, port, IPaddress) {
  var buf;
  var commandeOSC = "/" + message;

  if (debug1) console.log("OSCandMidi: sends osc to Rapsberry :"
    + IPaddress + " : " + port + " : " + commandeOSC + " : " + value1);
  buf = osc.toBuffer({
    address: commandeOSC,
    args: [
      { type: 'integer', value: parseInt(value1) },
      { type: 'integer', value: 4 },
      { type: 'integer', value: 120 },
    ]
  });
  return udp.send(buf, 0, buf.length, port, IPaddress);
};
exports.sendOSCRasp = sendOSCRasp;