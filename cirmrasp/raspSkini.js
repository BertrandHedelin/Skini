/*****************************************************************
rasp.js

Controle des Raspberry

© Copyright 2021, B. Petit-Hedelin

V0.2.2

******************************************************************/
'use strict'

var ipConfig = require('../../serveur/ipConfig');
const WebSocket = require('ws');
const { networkInterfaces } = require('os');
var os = require("os");
var fs = require("fs");
const { exec, spawn, execSync } = require('child_process');
var osc = require('osc-min');
var dgram = require("dgram");
const abletonlink = require('abletonlink');

var debug = false;
var debug1 = true;
var myIPaddress;
var reconnectionTime;
let soundDirectory = "../../sounds/";

if (ipConfig.websocketServeurPort !== undefined) {
    var port = ipConfig.websocketServeurPort;
} else {
    var port = 9090;
}

var ws;

function getMyIPaddress() {
    var myAddress;

    // Identification de l'IP address locale sur raspberry
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    //Pour Raspberry il faudra
    //myAddress = results.wlan0[0];
    //console.log(results.wlan0);

    var myAddress = "192.168.1.43";
    console.log("myAddress:", myAddress);

    return myAddress;
}

function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

function reboot(callback) {
    exec('sudo reboot', function (error, stdout, stderr) { callback(stdout); });
}

function shutdown(callback) {
    exec('sudo shutdown now', function (error, stdout, stderr) { callback(stdout); });
}

function initWSSocket(port) {

    // On ferme la socket pour eviter d'en avoir un paquet quand le serveur s'arrête et repart
    // cf onclose qui relance initWSSocket()
    if (ws !== undefined) ws.close();

    ws = new WebSocket("ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort);

    ws.onopen = function (event) {
        myIPaddress = getMyIPaddress();

        console.log("rasp.js Websocket : ", "ws://" + ipConfig.serverIPAddress + ":" + port + "/");
        var msg = {
            type: "raspberryOpen",
            raspIP: myIPaddress, //ipConfig.myRaspBerryAddress,
            text: "texte"
        }
        ws.send(JSON.stringify(msg));

        if (reconnectionTime !== undefined) {
            clearInterval(reconnectionTime);
        }
    };

    var uncompteur = 0;
    //Traitement de la Réception sur le client
    ws.onmessage = function (event) {
        var msgRecu = JSON.parse(event.data);
        //console.log( "Client: received [%s]", event.data );
        switch (msgRecu.type) {

            case "isRaspAlive":
                if (debug1) console.log("reçu : isRaspAlive: ", uncompteur);
                uncompteur++;

                var msg = {
                    type: "raspberryAlive",
                    raspIP: myIPaddress, //ipConfig.myRaspBerryAddress, // à changer par myIPaddress sur Raspberry
                    info: " Memory: " + Math.round(os.totalmem() / 1048576) + "Mb, free Mem: " + Math.round(os.freemem() / 1048576) + "Mb"
                }
                ws.send(JSON.stringify(msg));
                break;

            case "message":
                console.log("Reçu message:", msgRecu.info);
                break;

            case "rebootRaspberry":
                if (debug1) console.log("reçu : rebootRaspberry");
                reboot(function (output) {
                    console.log(output);
                });
                break;

            case "sendSoundFile":
                var content = atob(msgRecu.soundFile);
                console.log("sendSoundFile : Path :", msgRecu.path);
                fs.writeFile(msgRecu.path, content, "binary", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved :", msgRecu.path);
                    }
                });
                break;

            case "shutdownRaspberry":
                if (debug1) console.log("reçu : shutdownRaspberry");
                shutdown(function (output) {
                    console.log(output);
                });
                break;

            default: if (debug1) console.log("Rasp reçoit un message inconnu", msgRecu);
                break;
        }
    };

    ws.onerror = function (event) {
        //console.log("rasp.js : received ERROR on WS");
    }

    // Tentative d'accès au serveur
    ws.onclose = function (event) {
        clearInterval(reconnectionTime);

        reconnectionTime = setInterval(function () {
            //console.log("Tentative de reconnexion au serveur WS");
            //initWSSocket(port);
        }, 3000);

    }
}

// Traitement OSC =========================================
let soundToPlay = 0;

function initOSC() {
    var sock = dgram.createSocket("udp4", function (msg, rinfo) {
        var message;

        try {
            message = osc.fromBuffer(msg); // Message OSC recu
            // console.log(osc.fromBuffer(msg));
            if (debug1) {
                //console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
                console.log("socket reçoit OSC: [", message.address + " : " +
                    message.args[0].value + " : " +
                    message.args[1].value + " : " +
                    message.args[2].value + "]");
            }
            switch (message.address) {
                case "/test":
                    soundToPlay = message.args[0].value;
                    break;

                case "/level":
                    if (debug1) console.log("amixer set Master " + message.args[0].value + "%");
                    execSync("amixer set Master " + message.args[0].value + "%");
                    break;

                default:
                    console.log("socket reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
                    break;
            }
            return;
        } catch (error) {
            console.log("ERR dans réception OSC :", message.args, error);
            return;
        }
    });

    sock.on('listening', function () {
        var address = sock.address();
        if (debug1) console.log('INFO: OSCcirmRasp.js: UDP Server listening on ' + address.address + ":" + address.port);
    });

    sock.bind(ipConfig.OSCPort, myIPaddress);
}

// Synchro Ableton Link
let link = new abletonlink();
let instantPhase = 0;
let firstInstantPhase = true;

link.startUpdate(10, (beat, phase, bpm) => {
    instantPhase = Math.round(phase * 10);
    if (debug) console.log("Synchro Link:", Math.round(beat), instantPhase, Math.round(bpm));

    if (instantPhase === 10) {
        if (debug1) console.log("Synchro Link:", Math.round(beat), instantPhase, Math.round(bpm));

        if (firstInstantPhase) {
            if (debug) console.log("Synchro Link:", Math.round(beat), phase, Math.round(bpm));
            firstInstantPhase = false; // bascule pour éviter les répetitions
            if (debug) console.log("Synchro Link:", Math.round(beat), phase, Math.round(bpm));
            if (soundToPlay !== 0) {
                if (debug1) console.log("Son :", soundDirectory + "son" + soundToPlay);
                exec("aplay " + soundDirectory + "son" + soundToPlay + ".wav", (error, stdout, stderr)=>{
                    if(error){
                        console.error('error: ${error.message}');
                        return;
                    }
                });
                soundToPlay = 0;
            }
        }
    } else {
        firstInstantPhase = true;
    }
});

console.log("--- Client cirmrasp ---");
initWSSocket(port);
initOSC();
