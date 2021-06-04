// Réception des messages OSC et les traitements qui vont avec =================================================

void oscEvent(OscMessage theOscMessage) {

  // On a toujours besoin de ces messages : bus midi et channel midi
  int indexBus =  (int) theOscMessage.get(0).floatValue();
  byte channel =  (byte) theOscMessage.get(1).floatValue();
  
  if (debug) {
    println("OSC -> MIDI command Bus No : ", indexBus, "Channel :", channel);
    print(" received an osc message. with address pattern "+theOscMessage.addrPattern());
    println(" typetag: "+theOscMessage.typetag());
  }
  if (theOscMessage.checkAddrPattern("/controlChange")==true) {
    float controlChange = theOscMessage.get(2).floatValue();
    float controlValue =  theOscMessage.get(3).floatValue();

    if (debug) println(" controlChange bus: ", indexBus, " CC: ", controlChange, " Value :", controlValue);
    myBus[indexBus].sendMessage( new byte[] { (byte) (CONTROL_CHANGE + channel), (byte)controlChange, (byte)controlValue  } );
    return;
  }
  if (theOscMessage.checkAddrPattern("/noteOn")==true) {
    float Value = theOscMessage.get(2).floatValue();
    float vel =  theOscMessage.get(3).floatValue();

    if (debug) println(" NoteOn: ", Value, " ", vel);
    myBus[indexBus].sendMessage( new byte[] { (byte) (NOTE_ON + channel), (byte)Value, (byte)vel  } );
    return;
  } else if (theOscMessage.checkAddrPattern("/noteOff")==true) {
    float Value = theOscMessage.get(2).floatValue();
    float vel =  theOscMessage.get(3).floatValue();

    if (debug) println(" NoteOff: ", Value, " ", vel);
    myBus[indexBus].sendMessage( new byte[] { (byte) (NOTE_OFF + channel), (byte)Value, (byte)vel  } );
    return;
  } else if (theOscMessage.checkAddrPattern("/oscPosX1toFM8")==true) {
    float Value = theOscMessage.get(2).floatValue(); 
    if (Value < 0 ) Value = 0;
    if (debug) println(" X1 values: ", Value);
    myBus[indexBus].sendMessage( new byte[] { (byte) (CONTROL_CHANGE + channel), MORPH_FM8_X, (byte)Value  } );
    return;
  } else if (theOscMessage.checkAddrPattern("/oscPosY1toFM8")==true) {
    float Value = theOscMessage.get(2).floatValue(); 
    if (Value < 0 ) Value = 0;
    if (debug) println(" Y1 values: ", Value);
    myBus[indexBus].sendMessage( new byte[] { (byte) (CONTROL_CHANGE + channel), MORPH_FM8_Y, (byte)Value  } );
    return;
  } else if (theOscMessage.checkAddrPattern("/programChange")==true) {
    float Value = theOscMessage.get(2).floatValue();

    if (debug) println(" values: ", Value);
    // Envoi une commande midi program change avec la valeur reçue en OSC (nodejs envoie des float)
    myBus[indexBus].sendMessage( new byte[] { (byte) (PROGRAM_CHANGE + channel), (byte)Value, (byte)0  } );
    return;
  } else if (theOscMessage.checkAddrPattern("/bankSelect")==true) {
    float Value = theOscMessage.get(2).floatValue();

    if (debug) println(" values: ", Value);
    // Pas fiable avec GuitarRig
    myBus[indexBus].sendMessage( new byte[] { (byte) (CHANNEL_MODE_MESSAGE + channel), (byte) BANK_SELECT, (byte) Value } );
    return;
  } else if (theOscMessage.checkAddrPattern("/allNoteOff")==true) {
    //float Value = theOscMessage.get(2).floatValue();
    if (debug) println(" All notes off");
    myBus[indexBus].sendMessage( new byte[] { (byte) (CHANNEL_MODE_MESSAGE + channel), (byte) ALL_NOTES_OFF, (byte)0 } );    
    return;
  } else {
    if (debug) println(" Commande OSC inconnue");
  }

  /* check if the typetag is the right one. */
  /*
    if(theOscMessage.checkTypetag("ifs")) {
  /* parse theOscMessage and extract the values from the osc message arguments.
   int firstValue = theOscMessage.get(0).intValue();  
   float secondValue = theOscMessage.get(1).floatValue();
   String thirdValue = theOscMessage.get(2).stringValue();
   print("### received an osc message /test with typetag ifs.");
   println(" values: "+firstValue+", "+secondValue+", "+thirdValue);
   */
}

// Reception MIDI et émission OSC ==================================================================

void noteOn(int channel, int pitch, int velocity, long timestamp, String bus_name) {
  String message = "NoteOn";
  String timeStampInt;
  String busClipFromDaw = configMIDI.getJSONObject(busClipFromDawIndex).getString("name");

  if (debug2) {
    println();
    println("Note On:");
    println("--------");
    println("Channel:"+channel);
    println("Pitch:"+pitch);
    println("Velocity:"+velocity);
    println("Timestamp:"+timestamp);
    println("Recieved on Bus:"+bus_name);
  }
  
  if(bus_name.equals(busClipFromDaw)){
     message = "/StartClip" + message;
  }else{ // Codage en dur pour ce switch donc pour test uniquement
    switch ( bus_name ) {
      case "AkaiMidiMix":   
        message = "/Akai" + message;
        break;
      case  "nanoKEY2":
        message = "/nanoKEY2" + message;
        break;
      case  "MPK25":
        message = "/MPK25" + message;
        break;
      case  "Session1":
        message = "/Session1" + message;
        break;
      case  "loopMIDI Port 12":
        message = "/StartClip" + message;
        break;
      case  "loopMIDI Port 13":
        message = "/video" + message;
        break;   
      default :
        println("Canal Midi en input inconnu sur noteOn, canal: " + channel);
        return;
    }
  }
  if (debug2) println(" Message :", message );

  OscMessage myMessage = new OscMessage(message);
  myMessage.add(pitch); /* add an int to the osc message */
  myMessage.add(channel);
  // Attention sur float et long pour time stamp.
  // OSC connait les float mais pas les long ???
  // ça pose des pb dès qu'on essaye de passer les timestamps en float ou long.
  // du coup je les passe en String.
  timeStampInt = str(timestamp);
  myMessage.add(timeStampInt);
  /* send the message */
  oscP5Emit.send(myMessage, myRemoteLocation); 
  if (debug2) println("Message OSC emis", myMessage, " ", myRemoteLocation);
}

void noteOff(int channel, int pitch, int velocity, long timestamp, String bus_name) {
  String message = "NoteOff";

  if (debug2) {
    println();
    println("Note Off:");
    println("--------");
    println("Channel:"+channel);
    println("Pitch:"+pitch);
    println("Velocity:"+velocity);
    println("Timestamp:"+timestamp);
    println("Recieved on Bus:"+bus_name);
  }

  switch ( bus_name ) {
  case "AkaiMidiMix":   
    message = "/Akai" + message;
    break;
  case  "nanoKEY2":
    message = "/nanoKEY2" + message;
    break;
  case  "MPK25":
    message = "/MPK25" + message;
    break;
  case  "Session1":
    message = "/Session1" + message;
    break;
  case  "loopMIDI Port 12":
    // Pas besoin du noteOFF.
    // Protocole d'émission des début et fin de clip
    // assez compliqué et encore plus quand on branche PUSH
    // Les commandes passent par le canal de télécommande.
    // Au démarrage : D'abord un noteON suivi immédiatement d'un noteOFF
    // Puis émission d'un noteON
    // A l'arrêt : émission de 2 noteOFF
    // On utilise pas les noteOFF pour le moment.
    //message = "/StopClip" + message;
    return;
  default :   
    println("Canal Midi en input inconnu sur noteOff: canal: " + channel);
    return;
  }

  if (debug) println(" Message :", message );
  OscMessage myMessage = new OscMessage(message);
  myMessage.add(pitch); /* add an int to the osc message */
  /* send the message */
  oscP5Emit.send(myMessage, myRemoteLocation); 
  if (debug) println("Message OSC emis", myMessage, " ", myRemoteLocation);
}

void controllerChange(int channel, int number, int value, long timestamp, String bus_name) {
  String message = "ControlerChange";

  if (debug) {  
    println();
    println("Controller Change:");
    println("--------");
    println("Channel:"+channel);
    println("Number:"+number);
    println("Value:"+value);
    println("Timestamp:"+timestamp);
    println("Recieved on Bus:"+bus_name);
  }

  switch ( bus_name ) {
  case "AkaiMidiMix":   
    message = "/Akai" + message;
    break;
  case  "nanoKEY2":
    message = "/nanoKEY2" + message;
    break;
  case  "loopMIDI Port 12":
    message = "/Clip" + message;
    break;  
  default :   
    println("Canal Midi en input inconnu pour CC sur canal: " + channel);
    return;
  }

  if (debug) println(" Message :", message );
  OscMessage myMessage = new OscMessage(message);
  myMessage.add(number);
  myMessage.add(value); /* add an int to the osc message */
  /* send the message */
  oscP5Emit.send(myMessage, myRemoteLocation); 
  if (debug) println("Message OSC emis", myMessage, " ", myRemoteLocation);
}

int compteurPourVoir = 0;
boolean midiSyncStarted = false;
boolean midiClockTempsZero = true;
int dureeDuTickMidi = 0;
int[] dureeDesTicksMidi = new int [24];
int compteurDesTicks = 0;
int instantTickMidi = 0;
int tempoEnvoirDureeTick = 0;

void midiMessage(MidiMessage message) { // You can also use midiMessage(MidiMessage message, long timestamp, String bus_name)
  int sommeDesDurees = 0;
  int timerDisconnection = 0;

  if (debug) {
    println("Message Midi reçu: status", message.getStatus());
    for (int i = 1;i < message.getMessage().length;i++) {
      println("Param "+(i+1)+": "+(int)(message.getMessage()[i] & 0xFF));
    }
  }
  
  // Receive a MidiMessage
  // MidiMessage is an abstract class, the actual passed object will be either javax.sound.midi.MetaMessage, javax.sound.midi.ShortMessage, javax.sound.midi.SysexMessage.
  // Check it out here http://java.sun.com/j2se/1.5.0/docs/api/javax/sound/midi/package-summary.html
  compteurPourVoir++;
  
  /* RECEPTION DE LA SYNCHRO MIDI
   On a 24 pulses par noire émis par l'horloge Midi.
   Ceci correspond à une divisionMesure = noireR
   248 = midisync clock ou 0xF8
  */
  if ( message.getStatus() == 248 && midiSyncStarted && useSequencer) {
    
    // Ce test n'est pas forcément utile, mais il pourrait y avoir le cas où l'on ne veuille pas se synchroniser sur un signal de Midi Clock actif.
    if (midiSyncActif) {
      dureeDesTicksMidi[compteurDesTicks] = millis() - instantTickMidi;
      compteurDesTicks = (compteurDesTicks+1) % dureeDesTicksMidi.length;
      
      // Calcul de la moyenne
      for ( int i = 0; i < dureeDesTicksMidi.length; i++) {
          sommeDesDurees += dureeDesTicksMidi[i];
      }
      dureeDuTickMidi = sommeDesDurees/(dureeDesTicksMidi.length); 
      instantTickMidi = millis();     
      if (debug) println("duree du tick:", dureeDuTickMidi);
      
      if ( tempoEnvoirDureeTick > 23 ) {
        tempoEnvoirDureeTick = 0;
        jsonMessage = "{\"type\": \"dureeDuTickHorlogeMidi\", \"duree\" : " + dureeDuTickMidi + "}";
        /*
        if (midiClockTempsZero) { // Signifie le démarrage à Hop
          jsonMessage = "{\"type\": \"dureeDuTickHorlogeMidi\", \"duree\" : " + dureeDuTickMidi + "\"tempsZero\" : " + 1 + "}";
          midiClockTempsZero = false;
        } else {
          jsonMessage = "{\"type\": \"dureeDuTickHorlogeMidi\", \"duree\" : " + dureeDuTickMidi + "\"tempsZero\" : " + 0 + "}";
        }
        */
       try {
          ws.sendMessage(jsonMessage);  // Vers les séquenceurs
        } catch( Throwable e){
              println("catch:midiMessage:sequenceur:dureeDuTickHorlogeMidi");
              //e.printStackTrace();
        }
        try {
          wsc.sendMessage(jsonMessage); // Vers hop
        } catch(Throwable e){
          println("catch:midiMessage:hop:dureeDuTickHorlogeMidi: Perte de connexion");
          //reconnexionWebsocket(); // Voir l'onglet principal, ne fonctionne pas (encore)
          //e.printStackTrace(); 
        }
      }
      if (debug) println("tempoEnvoirDureeTick:", tempoEnvoirDureeTick);
      tempoEnvoirDureeTick++;
      // On a bien une correspondance directe entre les pulses MIDI et la définition des durées en tick dans Skini
      // Une noire Skini = 24 ticks.
      // On peut donc dérouler le sequenceur en fonction des pulses.
      nextEventInSequencer();
    }
  }
  
  if ( message.getStatus() == 250 || message.getStatus() == 251) { // START
      midiSyncStarted = true;
      indexCourantSequenceur = 0;
      instantTickMidi = millis();
      
      jsonMessage = "{\"type\": \"startByMidiClock\"}";
      try {
         ws.sendMessage(jsonMessage);
         wsc.sendMessage(jsonMessage); // Vers hop
      } catch( Throwable e){
              println("catch:midiMessage start");
              //e.printStackTrace();
      }     
   } else if ( message.getStatus() == 252 ) { // STOP
      midiSyncStarted = false;
      //midiClockTempsZero = true;
      jsonMessage = "{\"type\": \"stopByMidiClock\"}";
      try {
         ws.sendMessage(jsonMessage);
      } catch( Throwable e){
              println("catch:midiMessage stop");
              //e.printStackTrace();
      }
  }
  
  if ( message.getStatus() != 248 && debug ) {
    println();
    println("-- MidiMessage compteur de message (pas 248) =", compteurPourVoir);
    println("Status Byte/MIDI Command:"+message.getStatus());
    for (int i = 1;i < message.getMessage().length;i++) {
      println("Param "+(i+1)+": "+(int)(message.getMessage()[i] & 0xFF));
    }
  }
}
