(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict"
var par; // = require('../../serveur/skiniParametres');
var ipConfig = require("../../serveur/ipConfig.json");

var index = Math.floor((Math.random() * 10000) + 1 ); // Pour identifier le client
var pseudo = "Anonyme";
var ws;

var msg = { // On met des valeurs pas defaut
  type: "configuration",
  text: "ECRAN_NOIR" ,
  pseudo: "Anonyme",
  value: 0
}

function saisiClip() {
	var DAWNote = document.getElementById("numClip").value;
	var DAWChannel = Math.floor(DAWNote / 127) + 1;
	DAWNote = DAWNote % 127;
	if (DAWChannel > 15) {
	  console.log("Web Socket Server.js : pushNoteOnDAW: Nombre de canaux midi dépassé.");
	return;
	}

	var msg = {
	  type:"configDAWMidiNote",
	  bus: par.busMidiDAW,
	  channel: DAWChannel,
	  note: DAWNote
	}
	ws.send(JSON.stringify(msg));
}
window.saisiClip = saisiClip;

function saisiCC() {
  var controlChange = parseFloat(document.getElementById("numCC").value);
  var controlChangeValue = parseFloat(document.getElementById("valueCC").value);
  var DAWChannel = 1;
  if (controlChange != undefined && controlChangeValue != undefined) {
	var msg = {
	  type:"configDAWCC",
	  bus: par.busMidiDAW,
	  channel: DAWChannel,
	  CC: controlChange,
	  CCValue: controlChangeValue
	}
	ws.send(JSON.stringify(msg));
  }else{
  	alert("CC or CC value undefined:", controlChange, controlChangeValue );
  }
}
window.saisiCC = saisiCC;

function initWSSocket(host) {

	ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);
	console.log( "ws://" + host + ":" + ipConfig.websocketServeurPort );

	ws.onopen = function( event ) {
		var msg = {
		  type:"startSpectateur",
		  text:"configurateur",
		  id: index
		}
		console.log("ID sent to server:", msg.id);
		ws.send(JSON.stringify(msg));
	};

	//Traitement de la Réception sur le client
	ws.onmessage = function( event ) {
	  var msgRecu = JSON.parse(event.data);
		switch(msgRecu.type) {

	     case "message":  
			console.log(msgRecu);
			document.getElementById("MessageDuServeur").innerHTML = msgRecu.value;
			break;

			case "skiniParametres":
				console.log("skiniParametres:", msgRecu.value);
				par =  msgRecu.value;
				break;

	     default: console.log("Client reçoit un message inconnu");
	    }
	};

	ws.onclose = function( event ) {
	    console.log( "Client: websocket closed for :", index );
	}

	window.onbeforeunload = function () {
		msg.type = "closeSpectateur";
	    msg.text = "DISCONNECT_SPECTATEUR";
	    ws.send(JSON.stringify(msg));
		ws.close();
	}
}
window.initWSSocket = initWSSocket;
},{"../../serveur/ipConfig.json":2}],2:[function(require,module,exports){
module.exports={
	"remoteIPAddressImage": "192.168.82.96",
	"remoteIPAddressSound": "192.168.1.75",
	"remoteIPAddressLumiere": "192.168.82.96",
	"remoteIPAddressGame": "192.168.82.96",
	"serverIPAddress": "192.168.1.75",
	"webserveurPort": 8080,
	"websocketServeurPort": 8383,
	"InPortOSCMIDIfromDAW": 13000,
	"OutPortOSCMIDItoDAW": 12000,
	"distribSequencerPort": 8888,
	"outportProcessing": 10000,
	"outportLumiere": 7700,
	"inportLumiere": 9000
}

},{}]},{},[1]);
