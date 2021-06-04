loadAPI(12);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("Inria", "Skini_0", "0.1", "d03ee22a-7ef6-4303-9fde-f0fa31530ee0", "Bertrand Hedelin");
var connection = null;
var remoteIPAddress = "127.0.0.1";
var IPportIN = 12000;
var IPportOUT= 13000;

// On a besoin du midiIN relayer des infos MIDI vers Skini en OSC (Hop.js ne comprend qu'OSC)

host.defineMidiPorts(1, 1);

var prevPos = 0;

function init() {

 	println("Skini_0 initialized OK!");

 	// On utilise in canal Midi OUT pour rerouter les commande OSC de Skini vers Bitwig.
 	// On reçoit ces commandes de Skini en OSC mais avec des ordres MIDI.
 	// Ces ordres MIDI sont envoyés de Bitwig vers Bitwig via LoopMidi.
 	// Il faut donc mettre en place un autre controleur Bitwig en réception de LoopMidi.
 	// C'est à dire un clavier générique qui reçoit le port LoopMidi.
 	// Ce mécanisme (un peu compliqué) permet d'être compatible avec la mise en oeuvre standard de Skini
 	// avec Ableton et Processing qui utilise Midi pour activer les clips.

 	// Il faut relancer le contrôleur pour prendre en compte ces valeurs.
	var preferences = host.getPreferences ();
 	remoteIPAddress = preferences.getStringSetting("Ip address", "remote OSC", 16, "127.0.0.1").get();
 	IPportOUT = parseInt(preferences.getStringSetting("port OUT", "Remote OSC", 5, "13000").get());
 	IPportIN = parseInt(preferences.getStringSetting("port IN", "Listening OSC", 5, "12000").get());

  println("IP address :" + remoteIPAddress);

  var portOut = host.getMidiOutPort(0);
  var portIn = host.getMidiInPort(0);

 	// Exemple Transport -----------------------------------
  transport = host.createTransport();
  // Add an observer which prints the transport PLAY / STOP state to the controller script console   
  transport.isPlaying().addValueObserver( function(isPlaying) {println(isPlaying ? "PLAY" : "STOP");});

  cursorTrack = host.createCursorTrack(2, 0);
  // Add an observer which prints volume of the cursor track with 128 steps to the console
  cursorTrack.volume().value().addValueObserver(128, function(value){println("VOLUME: " + value);});
  // Add an observer which prints a formatted text representation of the cursor track volume with a maximum of 8 characters to the console
  cursorTrack.volume().displayedValue().addValueObserver(8, "", function(text){println("VOLUME : " + text);});

  // Un affichage du temps dans Bitwig, c'est une possibilité de trouver une synchronisattion
	//transport.playPosition ().addValueObserver( function(text){println("Position : " + text);});
	// Une autre façon du même type qui fonctionne.
	//SettableBeatTimeValue.BeatTimeValue.addRawValueObserver
	//transport.getPosition ().addValueObserver( function(text){println("Position : " + text);});

	// Génération de ticks de pulsation à partir de la bare de transport
	prevPos = 0;
	transport.getPosition ().addValueObserver(
		function(position){
			//println("Position : " + position);
			let positionCeil = Math.ceil(position);

			if (positionCeil !== Math.ceil(prevPos)){
				//println("--------------- Tick: " + positionCeil );
				prevPos = position;
				sendOSCTick(positionCeil);
			}
		});
 
    // Exemple Slot de Clip ---------------------------------
    // Pas utilisé avec le scénario compatible avec Processing + Ableton
	cursorClip = host.createArrangerCursorClip(2, 0);

	// Fonctionne, mais c'est bizarre de devoir passer par un trackbank
	// sans doute parcequ'on est dans une logique de contrôleur HW.
	// Crée un bank de tracks (une banque de pistes)
  var trackBank = host.createTrackBank(100 , 100, 100);
  // Sélectionne une piste dans la banque de piste
	var clipLauncher = trackBank.getItemAt(0).clipLauncherSlotBank(); // Saisi la piste 0 = première
	// Affiche une indicateur sur la piste (pour test)
	clipLauncher.setIndication(true); // Affiche un petit carré sur les clips.

	// Ne fonctionnent pas :
	//var cursorTrack2 = host.createCursorTrack("ID1", "track1", 1, 0);
	//var clipLauncher = cursorTrack.clipLauncherSlotBank().select(1);

	// Fonctionne:
/*	clipLauncher.addIsPlayingObserver(function(slot, value){
		println("slot: " + slot + " value: " + value);
		//clipLauncher.select(3);
		//clipLauncher.launch(1);
	});*/

   // OSC--------------------------------------------
  var oscModule = host.getOscModule ();

  // Sending
  connection = oscModule.connectToUdpServer (remoteIPAddress, IPportOUT, oscModule.createAddressSpace ());

  // Receiving
  var addressSpace = oscModule.createAddressSpace ();
  addressSpace.setShouldLogMessages (true);

  addressSpace.registerMethod ("/noteOn", ",ffff", "A test function", function (source, message)
  {
  	let busMidi = message.getFloat(0); // Not used in Bitwig
  	let channelMidi = message.getFloat(1);

  	let noteMidi = message.getFloat(2);
  	let velocityMidi = message.getFloat(3);

  	// Reroutage de l'OSC Skini vers du MIDI préciser dans le contrôleur.
    //println (" Received: " + message.getAddressPattern () + " " + message.getTypeTag () + " " + message.getInt(2) + " " + message.getInt(3));
    println("Send MIDI:" + (0x90 + channelMidi) + " " + noteMidi + " " + velocityMidi );
    portOut.sendMidi (0x90 + channelMidi, noteMidi , velocityMidi);

    // Test
    // Lance un clip dans la piste clipLauncher
    //clipLauncher.launch(1);
  });

  addressSpace.registerMethod ("/controlChange", ",ffff", "A test function", function (source, message)
  {
    let busMidi = message.getFloat(0); // Not used in Bitwig
    let channelMidi = message.getFloat(1);

    let CCMidi = message.getFloat(2);
    let valueCCMidi = message.getFloat(3);

    if(valueCCMidi > 127 ) valueCCMidi = 127;
    // Reroutage de l'OSC Skini vers du MIDI préciser dans le contrôleur.
    //println (" Received: " + message.getAddressPattern () + " " + message.getTypeTag () + " " + message.getInt(2) + " " + message.getInt(3));
    println("Send CC MIDI:" + (0xB0 + channelMidi) + " " + CCMidi + " " + valueCCMidi );
    portOut.sendMidi (0xB0 + channelMidi, CCMidi , valueCCMidi);
  });

  addressSpace.registerDefaultMethod (function (source, message)
  {
    println ("Received unknown: " + message.getAddressPattern ());
  });

  	// Listen on the port IPportIN
  oscModule.createUdpServer (IPportIN, addressSpace);

  println("------------- OSC initialized");

  // MIDI Callbacks --------------------------------------------------------------------------
	portIn.setMidiCallback (function(status, data1, data2){
		println("MIDI IN : " + status + ": " + data1 + ": " + data2);
		sendOSCMidiMessage(data1);
	});

	portIn.setSysexCallback (function(text){
		println("SYSEX MIDI IN : " + text);
		sendOSCMessage();
	});
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}

function sendOSCMessage ()
{
   // connection.startBundle ();
   connection.sendMessage ("/hello/world", "Good Morning!");
   // connection.endBundle ();
}

function sendOSCMidiMessage(data)
{
   // connection.startBundle ();
   connection.sendMessage ("/BitwigNoteOn", data);
   // connection.endBundle ();
}

function sendOSCTick (position)
{
   // connection.startBundle ();
   connection.sendMessage ("/BitwigTick", position);
   // connection.endBundle ();
}


