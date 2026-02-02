/**
 * @fileOverview OSC and Midi control
 * <BR> See: http://www.indiana.edu/~emusic/cntrlnumb.html,
 * http://www.ccarh.org/courses/253/handout/controllers/
 * @copyright (C) 2022-2024 Bertrand Petit-Hédelin
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
  * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.4
 */
"use strict"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var osc = require('osc-min');
import * as dgram from "dgram";
var udp = dgram.createSocket("udp4");

// Pour permettre le broadcast depuis node.js
udp.bind(function () { udp.setBroadcast(true); });

// Appelé à la fois par setParameters et reloadParameters dans websocketServer.js
// donc attention à startOSCandMIDI() et les variables globales.
var par;
export function setParameters(parameters) {
  par = parameters;
  startOSCandMIDI();
}

var ipConfig = require('./ipConfig');

var outportForMIDI = ipConfig.OutPortOSCMIDItoDAW;
var outportProcessing = ipConfig.outportProcessing;
var remoteIPAddressSound = ipConfig.remoteIPAddressSound;
var remoteIPAddressImage = ipConfig.remoteIPAddressImage;
var outportLumiere = ipConfig.outportLumiere;
var remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere;

var _getMidiPortClipToDAW, _initMidiOUT, _getMidiPortForClipToDAW;

export{
  _initMidiOUT as initMidiOUT,
  _getMidiPortClipToDAW as getMidiPortClipToDAW
}

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

    var midiConfig = require("./midiConfig.json");
    if(midiConfig[0] === undefined ){
      console.log("WARN: Midi direct is ON, but no midi interfaces are declared in midiConfig.json");
      return -1;
    }

    var midi = require('midi');

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
              if (debug1) console.log("INFO: OSCandMIDI: getMidiPortForClipToDAW:"
                + " port number: " + j
                + ", Midi" + midiConfig[i].type + ", usage:" + midiConfig[i].spec
                + ", Bus: " + midiOutput.getPortName(j) + ", " + midiConfig[i].comment);
              return j;
            }
          }
        }
      }
      return -1;
    }
    _getMidiPortForClipToDAW = getMidiPortForClipToDAW;
  }

  /**
   * Initialise the Midi port according the configuration file
   */
  function initMidiOUT() {
    midiPortClipToDAW = _getMidiPortForClipToDAW();

    if (midiPortClipToDAW === -1) {
      console.log("------------------------------------------------------")
      console.log("ERR: initMidiOUT: no Midi port for controlling the DAW");
      for (var j = 0; j < midiOutput.getPortCount(); ++j) {
          console.log("INFO: initMidiOUT: Midi port available :" + midiOutput.getPortName(j));
      }
      console.log("------------------------------------------------------")
      return;
    }

    midiOutput.openPort(midiPortClipToDAW);
    if (debug) console.log("INFO: OSCandMidi.js: initMidiOUT: port:", midiPortClipToDAW,
      ", midiPortClipToDAW :", midiOutput.getPortName(midiPortClipToDAW));
  }
  _initMidiOUT = initMidiOUT;

  function getMidiPortClipToDAW() {
    return midiPortClipToDAW;
  }
  _getMidiPortClipToDAW = getMidiPortClipToDAW;
}

// VERS PROCESSING ==================================================
/**
 * Send an OSC message to processing
 * @param  {string} message
 * @param  {number} value
 */
export function sendProcessing(message, value) {
  var buf;

  if (debug1) console.log("OSCandMidi: sends osc to processing :" + message + " " + value + " to " + outportProcessing);
  buf = osc.toBuffer({ address: message, args: [value] });
  return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
};

/**
 *  Send an OSC message to processing with 2 values
 * @param  {string} message
 * @param  {number} val1
 * @param  {number} val2
 */
export function sendOSCProcessing(message, val1, val2) {
  var buf;

  if (debug) console.log("sending osc messages to processing :" + message + " " + val1 + " " + val2);
  buf = osc.toBuffer({ address: message, args: [val1, val2] });
  return udp.send(buf, 0, buf.length, outportProcessing, remoteIPAddressImage);
}

/**
 * Send a note on through OSC or MIDI
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} note
 * @param  {number} velocity
 */
export function sendNoteOn(bus, channel, note, velocity) {
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

/**
 * Send a note on through OSC or MIDI to activate a clip
 * @param  {number} note
 */
export function convertAndActivateClip(note){
  let buf;

  if (debug1) console.log("INFO: LogosOSCandMidiLocal : convertAndActivateClip: sending MIDI: " + note);
  let channel = Math.floor(note / 127) + 1;
  note = note % 127;
  if (channel > 15) {
      if (debug1) console.log("ERR: LogosOSCandMidiLocal : convertAndActivateClip: Nombre de canaux midi dépassé.");
          return -1;
  }

  if (directMidi) {
    midiOutput.sendMessage([144 + channel, note, 100]);
  } else {
  buf = osc.toBuffer({ address: "/noteOn" , args: [ par.busMidiAbleton, channel, note, 127 ]  });    
  return udp.send(buf, 0, buf.length, par.outportForMIDI, par.remoteIPAddressSound,
    function(err) { if (err !== null) console.log("ERR: logosOSCandMidi: convertAndActivateClip: Erreur udp send: ", err); });
  }
};

/**
 * Send a note off through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} note
 * @param  {number} velocity
 */
export function sendNoteOff(bus, channel, note, velocity) {
  var buf;

  buf = osc.toBuffer({ address: "/noteOff", args: [bus, channel, note, velocity] });
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};

/**
 * Send a program change through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} program
 */
export function sendProgramChange(bus, channel, program) {
  var buf;
  // Le -1 sur program, channel est pour être en phase avec le num de preset dans les synthé
  buf = osc.toBuffer({ address: "/programChange", args: [bus, channel - 1, program - 1] });
  if (debug) console.log("sending osc messages programChange :" + program + " to channel: " + channel + " On bus: " + bus);
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};

/**
 * Send a bank select through OSC
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} bank
 */
export function sendBankSelect(bus, channel, bank) {
  var buf;

  buf = osc.toBuffer({ address: "/bankSelect", args: [bus, channel - 1, bank - 1] });
  if (debug) console.log("sending osc messages bankSelect :" + bank + " to channel " + channel);
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });
};

/**
 * Send a CC through OSC or Midi
 * @param  {number} bus
 * @param  {number} channel
 * @param  {number} controlChange
 * @param  {number} controlValue
 */
export function sendControlChange(bus, channel, controlChange, controlValue) {
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

/**
 * Send all note off through OSC
 * @param  {number} bus
 * @param  {number} channel
 */
export function sendAllNoteOff(bus, channel) {
  var buf;

  buf = osc.toBuffer({ address: "/allNoteOff", args: [bus, channel] });
  if (debug) console.log("sending ALL OFF");
  return udp.send(buf, 0, buf.length, outportForMIDI, remoteIPAddressSound,
    function (err) { if (err !== null) console.log("OSCandMidi: Erreur udp send: ", err); });

};

/// VERS LA LUMIERE (QLC+)  ============================
/**
 * To send message to QLC+ for light control
 * @param  {string} message
 */
export function sendSceneLumiere(message) {
  var buf;
  var value = 123; // A priori inutile, mais QLC+ ne comprend pas les message OSC sans valeur

  if (debug) console.log("OSCandMidi: sends osc to QLC +  :" + message + " " + " to " + par.outportLumiere);
  buf = osc.toBuffer({ address: message, args: [value] });
  return udp.send(buf, 0, buf.length, outportLumiere, remoteIPAddressLumiere);
};

// VERS PLATEFORME DE JEU OU CONTOLEUR OSC ================================================
/**
 * To send OSC message to a Game platfrom or an external device
 * the OSC port is defined in the ipConfiguration by portOSCToGame
 * @param  {string} message
 * @param  {number} value
 */
export function sendOSCGame(message, value) { // Value = table des données 
  var buf;
  var commandeOSC = "/" + message;
  if (debug) console.log("LogosOSCandMidi: sends osc to Game or controler :" + commandeOSC + " : " + value + " : " + ipConfig.portOSCToGame + " : " + ipConfig.remoteIPAddressGame);
  
  //buf = osc.toBuffer({ address: commandeOSC, args: [value] });
  
  // OSC Pour ESP 32
  buf = osc.toBuffer({ address: commandeOSC, args: [{ type: 'integer', value: value }] });

  return udp.send(buf, 0, buf.length, ipConfig.portOSCToGame, ipConfig.remoteIPAddressGame);
};

/**
 * To play a buffer via OSC message in a Raspberry
 * @param {string} message
 * @param {number} buffer num
 * @param {number} Udp port
 * @param {string} IP address of the Raspberry
 * @param {number} level of the pattern
 */
export function playOSCRasp(message, bufferNum, port, IPaddress, level, duration) {
  var buf;
  var commandeOSC = "/" + message;
  var commandeLevel = "/level"; // Temporairement en dur en attendant d'avoir le bon patch PureData
  var defaultLevel = 70;

  if (!isNaN(level)) {
    defaultLevel = level;
  }

/*   // Pour le moment en deux commandes une de niveau et une de jouer le buffer
  if (debug1) console.log("OSCandMidi: play osc to Rapsberry :"
    + IPaddress + " : " + commandeLevel + " : " + level + " : " + level + ":" + duration);
  buf = osc.toBuffer({
    address: commandeLevel,
    args: [
      { type: 'integer', value: parseInt(level) },
      //{ type: 'integer', value: duration },
      //{ type: 'integer', value: 120 },
    ]
  });
  udp.send(buf, 0, buf.length, port, IPaddress); */

  if (debug1) console.log("OSCandMidi: play osc to Rapsberry :"
    + IPaddress + " : " + commandeOSC + " : " + bufferNum + " : " + level);
  buf = osc.toBuffer({
    address: commandeOSC,
    args: [
      { type: 'integer', value: parseInt(bufferNum) },
      { type: 'integer', value: level }
    ]
  });
  return udp.send(buf, 0, buf.length, port, IPaddress);
};

/**
 * To send a short OSC message with one parameter to a Raspberry
 * @param {string} message
 * @param {number} value
 * @param {number} Udp port
 * @param {string} IP address of the Raspberry
 */
export function sendOSCRasp(message, value1, port, IPaddress) {
  var buf;
  var commandeOSC = "/" + message;

  if (debug1) console.log("OSCandMidi: sends osc to Rapsberry :"
    + IPaddress + " : " + port + " : " + commandeOSC + " : " + value1);
  buf = osc.toBuffer({
    address: commandeOSC,
    args: [
      { type: 'integer', value: parseInt(value1) }
    ]
  });
  return udp.send(buf, 0, buf.length, port, IPaddress);
};