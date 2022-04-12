var MidiPlayer = require('midi-player-js');
 
// Initialize player and register event handler
var Player = new MidiPlayer.Player(function(event) {
    console.log(event);
});
 
// Load a MIDI file
Player.loadFile('./chopin.mid');
Player.play();