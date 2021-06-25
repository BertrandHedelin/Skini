'use strict'

var midi = require('midi');
var midiConfig = require("../serveur/midiConfig.json");

var debug1 = true;
var debug = false;

// MIDI OUT (pour OSCmidi) ================================================================
var midiOutput = new midi.Output();
var midiPortClipToDAW;

function getMidiPortForClipToDAW(){
  for(var i=0; i < midiConfig.length; i++){
    if(midiConfig[i].spec  === "clipToDAW"){
      for (var j = 0; j < midiOutput.getPortCount(); ++j) {
        if( midiOutput.getPortName(j) === midiConfig[i].name){
          if(debug1) console.log("getMidiPortForClipToDAW: Midi" + 
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
  console.log("ClipToDaw: ", midiPortClipToDAW, midiOutput.getPortName(midiPortClipToDAW));
}
exports.initMidiOUT = initMidiOUT;

// MIDI IN (pour midimix.js) ==================================================================
var previousNote = 0;
var previousNotes = [0, 0, 0];
var previousChannel = 0;
var previousTimeStamp = 0;

var note;
var canal;
var timeStamp;
var noteSkini;

var midiInput = new midi.Input();
var midiSync = new midi.Input();

// Les controleurs
var controlers = [];
var controlerIndex;
var midiPortSync;
var midiPortClipFromDAW;
var tempoTickDuration = 0;

function getMidiPortControlers(){
  for(var i=0; i < midiConfig.length; i++){
    if(midiConfig[i].spec  === "controler"){
      var input = new midi.Input();
      var controler = {
        "input": input,
        "name" : midiConfig[i].name
      }
      controlers.push(controler);

      if(debug) console.log("getMidiPortControlers: Midi" + 
            midiConfig[i].type + ", usage:" + midiConfig[i].spec +
            ", bus: "+ midiConfig[i].name + ", " + midiConfig[i].comment, controlers );
    }
  }
}

function getControlerIndex(portName){
  for (var j = 0; j < midiInput.getPortCount(); ++j) {
    if( midiInput.getPortName(j) === portName){
      if(debug) console.log("getControlerIndex: Midi", j);
      return j;
    }
  }
  return -1;
}

function createControlerMessageOn(){
  for(var i=0; i < controlers.length; i++){
    controlerIndex = getControlerIndex(controlers[i].name);
    if(controlerIndex === -1){
      console.log("WARN: controler :", controlers[i].name, " does not exist");
      continue;
    }
    controlers[i].input.openPort(controlerIndex);
    controlers[i].input.ignoreTypes(false, false, false);
    if(debug) console.log("createControlerMessageOn: ", 
      controlers[i].input.getPortName(controlerIndex));

    controlers[i].input.on('message', function(deltaTime, message) {
      if(debug1) console.log('Input recieved : ' + message + ' d:' + deltaTime);
    
      // Ici les actions sur commande MIDI
      // On ne distingue pas les controleurs.

    });
    controlerIndex++;
  }
}

function insertInPreviousNotes(laNote){
  for (var i=1; i < previousNotes.length ; i++){
    previousNotes[i-1] = previousNotes[i];
  }
  previousNotes[previousNotes.length-1] = laNote;
  if(debug) console.log("midimix: insInPreviousNote: ", previousNotes);
};

function isInPreviousNotes(laNote){
  for (var i=0; i < previousNotes.length ; i++){
    if (previousNotes[i] === laNote) return true;
  }
  return false;
};

function getMidiPortForClipFromDAW(){
  for(var i=0; i < midiConfig.length; i++){
    if(midiConfig[i].spec  === "clipFromDAW"){
      for (var j = 0; j < midiOutput.getPortCount(); ++j) {
        if( midiInput.getPortName(j) === midiConfig[i].name){
          if(debug1) console.log("getPortForClipFromDAW: Midi" +
           midiConfig[i].type + ", usage:" + midiConfig[i].spec +
           ", bus: "+ midiConfig[i].name + ", " + midiConfig[i].comment );
          return j;
        }
      }
    }
  }
  console.log("ERR: getPortForClipFromDAW: no Midi port for receiving from DAW");
  return -1;
}

function getMidiPortForSyncFromDAW(){
  for(var i=0; i < midiConfig.length; i++){
    if(midiConfig[i].spec  === "syncFromDAW"){
      for (var j = 0; j < midiOutput.getPortCount(); ++j) {
        if( midiSync.getPortName(j) === midiConfig[i].name){
          if(debug1) console.log("getMidiPortForSyncFromDAW: Midi" + 
            midiConfig[i].type + ", usage:" + midiConfig[i].spec + 
            ", bus: "+ midiConfig[i].name + ", " + midiConfig[i].comment );
          return j;
        }
      }
    }
  }
  console.log("ERR: getMidiPortForSyncFromDAW: no Midi port for receiving sync from DAW");
  return -1;
}

function initMidiIN(){
  midiPortSync = getMidiPortForSyncFromDAW();
  midiPortClipFromDAW = getMidiPortForClipFromDAW();

  getMidiPortControlers();
  createControlerMessageOn();

  midiInput.openPort(midiPortClipFromDAW);
  console.log("ClipToDaw: ", midiPortClipFromDAW, midiInput.getPortName(midiPortClipFromDAW));

  midiSync.openPort(midiPortSync);
  midiSync.ignoreTypes(false, false, false);
  console.log("midiSync: ", midiPortSync, midiSync.getPortName(midiPortSync));

  // Traitement des commande Midi reçues d'Ableton Live
  // pour les patterns lancés.
  midiInput.on('message', function(deltaTime, message) {
    if(debug) console.log('Input recieved :' + message + ' d:' + deltaTime);

    // On ne traite que les noteON, de 1001 0000 (144) à 1001 1111 (159)
    if(message[0] >= 144 && message[0] <= 159){
      note = message[1];
      canal = message[0] - 144;
      timeStamp = deltaTime; 
      // Ableton envoie les commandes MIDI en comptant depuis le canal 1 (et pas 0 comme d'autres contrôleurs)
      // Il faut donc faire attention à la gestion des canaux MIDI en fonction du contrôleur.
      noteSkini = note + (canal -1) * 127;

      // Ableton répéte 1 fois le message NoteON une première fois (deux envois) avec un léger décalage temporel.
      // Si le pattern tourne, et qu'il est activé, Ableton envoie 4 commandes MIDI noteON avec le même timestamp.
      // En divisant le timestamp par 1 000 000, on est proche de la seconde. Le timestamp est proche de la micro-seconde.
      if (isInPreviousNotes(noteSkini) && previousTimeStamp === Math.round(timeStamp/1000000)){ // à peu près une seconde
          if (debug) console.log("midimix.js: REPETITION : ", noteSkini, timeStamp, previousTimeStamp);
          //return;
      }else{
        previousTimeStamp = Math.round(timeStamp/1000000); 

        if(debug) console.log("midimix.js: noteSkini: ", noteSkini, note, canal);
        if(debug) console.log("isInPreviousNotes:", isInPreviousNotes(noteSkini));
        
        // Avec PUSH branché, Ableton Live envoie des notes négatives...
        // dont je ne connais pas la signification
        if(noteSkini > 0 ) {
          insertInPreviousNotes(noteSkini);
          if(debug1) console.log("Note de pattern reçue d'Ableton:", noteSkini);
          //websocketServer.sendSignalFromDAW(noteSkini);
        }
      }
    }
  });

  // Traitement des messages de synchro Midi (24 messages pour une noire)
  midiSync.on('message', function(deltaTime, message) {
    tempoTickDuration++;
    if(message[0] === 248){
      if(tempoTickDuration > 23){
        //console.log('Sync recieved :' + message + ' d:' + deltaTime);
        // Signal Tick à emmettre ici
        console.log("Tick", message[0]);
        tempoTickDuration = 0;
      }
    }
  });
}
exports.initMidiIN = initMidiIN;

//******************  POUR LES TESTS ****************************
/*setTimeout(function() {

  midiInput.on('message', function(deltaTime, message) {
    console.log('Input recieved m:' + message + ' d:' + deltaTime);
  });

 var id = setInterval(function() {
    console.log('Sending message');
    midiOutput.sendMessage([144, 23, 81]);
  }, 1000);

  setTimeout(function() {
    clearInterval(id);

    setTimeout(function() {
      midiInput.closePort();
      midiOutput.closePort();
    }, 100);
  }, 10000);
}, 500);*/

initMidiIN();
initMidiOUT();

var id = setInterval(function() {
  console.log('Sending message');
  midiOutput.sendMessage([144, 23, 81]);
}, 1000);

setTimeout(function() {
  clearInterval(id);
  midiInput.closePort();
  midiOutput.closePort();
  console.log("\n******************** fermeture des ports MIDI")
}, 20000);
