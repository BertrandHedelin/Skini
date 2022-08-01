"use strict"
/*========================================================

Utilisation de Node.Js avec la carte 16 entrées réseau OSC 
d'interface Z.

La config doit se faire via une adresse IP fixe en 10.0.0.X
en mettant les interrupteurs de config IP sur off et en se
connectant directement sur la carte.

La carte ne connait que des paramètrages en IP fixes.
C'est simple mais contraignant.

On se connecte sur la carte en 10.0.0.30/OSC1, 2 ou 3 en fonction de la config
que l'on veut changer sur la carte.
On éteint la carte et met les interrupteurs sur la config que l'on veut
voir p.3 de la doc 8-Ana_OSC.pdf

Attention le port 1000 est dédié à la réception MIDI par la carte.

=========================================================*/
var osc = require('osc-min');
var dgram = require("dgram");
var sock = dgram.createSocket('udp4');

var debug = false;
var debug1 = true;

// Traitement OSC =========================================

sock = dgram.createSocket("udp4", function(msg, rinfo) {
  var error, message;
  var buf;

  try {
    message = osc.fromBuffer(msg); // Message OSC recu
    // console.log(osc.fromBuffer(msg));
   if (debug) {
      //console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
      console.log("Z socket reçoit OSC: [", message.address + " : " + 
      message.args[0].value + " : " +
      message.args[1].value + " : " +
      message.args[2].value + "]");
    }
    switch(message.address) {
      case "/INTERFACEZ/RC":
        console.log("Z socket reçoit OSC: [", message.address + " : " + 
        message.args[0].value + " : " +
        message.args[1].value + " : " +
        message.args[2].value + "]");
        break;

      case "/OSCSYSEXC":
        break;

      case "/OSCNOTEON":
        console.log("Z socket reçoit OSC: [", message.address + " : " + 
        message.args[0].value + " : " +
        message.args[1].value + " : " +
        message.args[2].value + "]");

        // Un reroutage du MIDI IN converti en OSC vers MIDI OUT
        buf = osc.toBuffer(
          {
            address: "/OSCNOTEON", 
            args: [
              {type: 'integer', value: message.args[0].value},
              {type: 'integer', value: message.args[1].value},
              {type: 'integer', value: message.args[2].value}]
          }
        );
        // Le port 1000 est fixe.
        sock.send(buf, 0, buf.length, 1000, "192.168.1.250");
        break;

      default:
        console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + (message.args[0].value) , "]");
        break;
    }
    return; 
  }catch(error){
    console.log("midimix.js: ERR dans réception OSC :", message.args, error);
  return;
  }
 });

 sock.on('listening', function () {
    var address = sock.address();
    if(debug1) console.log('INFO: midimix.js: UDP Server listening on ' + address.address + ":" + address.port);
 });

 // 3005 pour data et 3006 pour MIDI en OSC2
 sock.bind(3005, "192.168.1.251");

 // Exemple d'émission vers MIDI =====================================

var count = 1.0;
var flag = false;
function sendHeartbeat() {
  var buf;
  count++;
  console.log("OSCetZjs:", count);

  if(flag){
    buf = osc.toBuffer(
      {
        address: "/OSCNOTEON", 
        args: [{type: 'integer', value: 0}, {type: 'integer', value: 70},{type: 'integer', value: 120}]
      }
    );
  }else{
    buf = osc.toBuffer(
      {
        address: "/OSCNOTEOF", 
        args: [{type: 'integer', value: 0}, {type: 'integer', value: 70},{type: 'integer', value: 120}]
      }
    );
  }

  flag = !flag;
  return sock.send(buf, 0, buf.length, 1000, "192.168.1.250");
}

setInterval(sendHeartbeat, 3000);
