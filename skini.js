/************************************

	VESRION NODE JS du dev en HOP/HIPHOP

*************************************/

var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var path    = require("path");

//var info1 = require("./serveur/info1"); // pour test au cas où p de websocket
//info1.info();

// Charge le fichier des sons initiaux qui sont dans Ableton
var ableton = require('./serveur/controleAbleton');
ableton.initAbletonTable("controleAbletonAgitV2.csv");

// Websocket dans le Serveur
var ws = require('./serveur/websocketServer');

// Timer pour les files d'attente, à faire autrement c'était un automate en hiphop
var timerFilesDattente90 = 666 * 8 ; // Pour un tempo de 90 sur une mesure 4/4 x 2 (synchro sur 2 bars dans Ableton)
setInterval(function() {
    ableton.playAndShiftEventAbleton();
    ableton.displayQueues();
}, timerFilesDattente90 );

/*var timerFilesDattente120 = 500 * 8 ; // Pour un tempo de 120 sur une mesure 4/4 x 2
setInterval(function() {
   //machineServeur.inputAndReact("tick", 120);
}, timerFilesDattente120 );
*/

var app = express();
app.use(express.static('./'));

app.get('/sequenceur', function(req, res) {
 res.sendFile(path.join(__dirname+'/client/sequencer.html'));
});

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname+'/client/golem.html'));
});

app.get('/block', function(req, res) {
 res.sendFile(path.join(__dirname+'/blocklySkini/blocklySkini.html'));
});

app.listen(80);



