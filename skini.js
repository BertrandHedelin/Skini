/************************************

	VERsION NODE JS de SKINI

  © Copyright 2017-2021, B. Petit-Hédelin

*************************************/

var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var path    = require("path");
var ipConfig = require('./serveur/ipConfig');

// Charge le fichier des sons initiaux qui sont dans DAW
var DAW = require('./serveur/controleDAW');
DAW.initDAWTable("controleDAWAgitV2.csv");

// Websocket dans le Serveur
var ws = require('./serveur/websocketServer');

var oscReceiveDAW = require("./serveur/midimix.js");
var machineServeur = 0;

oscReceiveDAW.midimix(machineServeur,ws);

// Timer pour les files d'attente, à faire autrement c'était un automate en hiphop
var timerFilesDattente90 = 666 * 8 ; // Pour un tempo de 90 sur une mesure 4/4 x 2 (synchro sur 2 bars dans DAW)
setInterval(function() {
    DAW.playAndShiftEventDAW();
    DAW.displayQueues();
}, timerFilesDattente90 );

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

app.get('/controleur', function(req, res) {
 res.sendFile(path.join(__dirname+'/client/controleur/controleur.html'));
});

var port = ipConfig.webserveurPort;
var addressServer = ipConfig.serverIPAddress;
app.listen(port, () => {
  console.log(`app listening at http://${addressServer}:${port}`);
});



