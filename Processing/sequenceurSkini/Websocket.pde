/*************************************************************
 
 WEBSOCKETS
 
 *************************************************************/

// Réception en tant que client de HOP
void webSocketEvent(String msg) {

  JSONObject json = parseJSONObject(msg);
  if(debug) println("WS", msg);
  
  if (json == null) {
    println("ERR: JSONObject could not be parsed");
  } else {
    String type = json.getString("type"); 

    switch ( type ) {
      
    case "setConfigSequenceur":
      useSequencer = false; // Mise en pause à cause de draw
    
      if (json.isNull("divisionMesure") == false ) { 
        divisionMesure = json.getInt("divisionMesure");
      }
      if (json.isNull("nbeDeMesures") == false ) { 
        nbeDeMesures = json.getInt("nbeDeMesures");
      }
      if (json.isNull("tempo") == false ) { 
        tempo = json.getInt("tempo");
      }
      if (json.isNull("dureeDuTick") == false ) { 
        dureeDuTick = json.getInt("dureeDuTick");
      }
      if (json.isNull("tempsMesure") == false ) { 
        tempsMesure = json.getInt("tempsMesure");
      }
      
      // Redéfinitiopn de tous les paramètres du séquenceur
      sequenceurSize = nbeDeMesures * tempsMesure * divisionMesure;
      finPlaySequenceur = sequenceurSize;
      indexCourantSequenceur = 0;  
      dureeDuTick =  int((60.0 / tempo ) / divisionMesure * 1000) ; // Exprimé ici en millisecondes
      refreshRate = (1000 / (dureeDuTick)); // Utilisé quand pour Processing sans Ableton
      compteurSynchroMax = nbeDeMesures * tempsMesure * divisionMesure;
      compteurSynchro = 0;
      compteurSeconde = 0;
      
      // Nécéssaire pour la mise à jour du frame rate en fonction de durée tick quand il n'y a pas de midi clock
      frameRate(refreshRate);
      
      println("----------------------------------------------");
      println("CONFIG SEQUENCEUR RECU DU SERVEUR HOP V:19/10/2018");
      println("divisionMesure:", divisionMesure, "tempsMesure:", tempsMesure , "nbeDeMesures:", nbeDeMesures, "tempo:", tempo, " dureeDuTick:", dureeDuTick);
      println("----------------------------------------------");
      
      useSequencer = true; // Ok pour autoriser draw
      break;

    case "pong" :
      datePong = millis();
      latence = datePong - datePing;
      //if (debug) println("Latence avec serveur HOP: ", latence);
      break;

    default:
      if(debug1) println("Message serveur de type inconnu");
      break;
    }
  }
}

// Réception en tant que serveur des clients séquenceurs
void webSocketServerEvent(String msg) {
  int beta = 1;
  int alpha = 1;
  int gamma = 1;
  
  float x = 1;
  float y = 1;
  float z = 1;
  
  int idClient = 0;
  byte idxBus = 0;
  byte channel = 1;
  byte noteMidi = 64;
  byte vel = 120;
  int index  = 0;
  int duree = 0;
  String pseudo = "";

  JSONObject json = parseJSONObject(msg);

  if (json == null) {
    println("ERR: JSONObject could not be parsed");
  } else {
    String type = json.getString("type"); 

    switch ( type ) {
    case "startSpectateur":
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("pseudo") == false ) { 
        pseudo = json.getString("pseudo");
      }
      names.add(new Paire(pseudo,idClient));
      //println("startSpectateur", names);
      println("Nouveau client connecté: ", idClient,pseudo);
      
      // On dit au client si le séquenceur est en marche.
      // C'est le cas s'il n'y a pas de synchro Midi et si avec la synchro midi on a lancé le séquenceur
      if ( (!midiSyncActif) || ( (midiSyncActif && midiSyncStarted)) ){
              jsonMessage = "{\"type\": \"sequenceurServerRunning\"}";
        try {
          ws.sendMessage(jsonMessage);
        } catch( Throwable e){
            println("catch:startSpectateur");
            //e.printStackTrace();
        }
      }
      break;

    case "ping" :
      datePingRecu = millis(); // T'2
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (debug) println("received ping from",idClient);
      jsonMessage = "{\"type\": \"pong\", \"tempsPrime2\" : " + datePingRecu + ", \"id\" : " + idClient +"}";
      //println("SEND PONG");
      try {
        ws.sendMessage(jsonMessage);
      } catch( Throwable e){
         println("catch:ping");
         //e.printStackTrace();
      }
      break;

    case "midiNoteOn":
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("bus") == false ) { 
        idxBus = (byte) json.getInt("bus");
      }
      if (json.isNull("canal") == false ) { 
        channel = (byte) json.getInt("canal");
      }
      if (json.isNull("codeMidi") == false ) { 
        noteMidi = (byte) json.getInt("codeMidi");
      }
      if (json.isNull("velocite") == false ) { 
        vel = (byte) json.getInt("velocite");
      }
      if (json.isNull("index") == false ) { 
        index = json.getInt("index");
      }        
      if (json.isNull("duree") == false ) { 
        duree = (byte) json.getInt("duree");
      } 

      if ( vel == 0 ) break; // On ne s'occupe pas des noteOFF

      // Pour un traitement des données via le séquenceur
      if (debug) println("Recu WEBSOCKET -- INDEX SEQ: ", indexCourantSequenceur, " ID: ", idEvent, " BUS:", idxBus, " CHANNEL:", channel, " NOTE:", noteMidi, " VEL:", vel, "id", idClient, "index:", index, "duree: ", duree, "\n");      
      MidiEvent eventSequenceur = new MidiEvent(idEvent, idxBus, channel, noteMidi, vel, index % finPlaySequenceur, duree % finPlaySequenceur,idClient );
      idEvent++;
      putEventInSequencer(eventSequenceur); 
      break;
      
     case "midiNoteOFF":
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("bus") == false ) { 
        idxBus = (byte) json.getInt("bus");
      }
      if (json.isNull("canal") == false ) { 
        channel = (byte) json.getInt("canal");
      }
      if (json.isNull("codeMidi") == false ) { 
        noteMidi = (byte) json.getInt("codeMidi");
      }
      if (json.isNull("velocite") == false ) { 
        vel = (byte) json.getInt("velocite");
      }
      if (json.isNull("index") == false ) { 
        index = json.getInt("index");
      }        
      if (json.isNull("duree") == false ) { 
        duree = (byte) json.getInt("duree");
      } 
      if (debug) println("in note off",index,duree);      
      removeEventInSequencer(index,noteMidi,vel,duree,idClient);
      break;

    case "pong" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      datePong = millis();
      latence = datePong - datePing;
      break;
      
    case "changeChannel" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("bus") == false ) { 
        idxBus = (byte) json.getInt("bus");
      }
      if (json.isNull("canal") == false ) { 
        channel = (byte) json.getInt("canal");
      }
      if (debug) println("changement de canal/bus midi:",idClient, channel, idxBus);
            
      stopNotes(idClient);
      changeChannel(idClient,channel, idxBus);
      break;
      
    case "startPattern" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (debug) println("startPattern:idClient:",idClient);
      startActivated.add(idClient);
      break;
      
    case "stopPatern" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (debug) println("stopping the patern of client:",idClient);
      for ( int i = startActivated.size() -1 ; i >=0; i--) {
        if (startActivated.get(i) == idClient) startActivated.remove(i);
      }
      stopNotes(idClient);
      break;
      
    case "erasePatern" :
      if (json.isNull("idClient") == false ) {
        idClient = json.getInt("idClient");
      }
      if (debug) println("erasing patern of:",idClient);
      stopNotes(idClient);
      eraseNotes(idClient);
      if (debug) println("finished erasing");
      break;

    case "newOrientation" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("beta") == false ) { 
        beta = json.getInt("beta");
      }
      if (json.isNull("alpha") == false ) { 
        alpha = json.getInt("alpha");
      }
      if (json.isNull("gamma") == false ) { 
        gamma = json.getInt("gamma");
      }
      if (debug) println("receiving new orientation",alpha,beta,gamma);
      break;
      
    case "newMotion" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("x") == false ) { 
        x = json.getFloat("x");
      }
      if (json.isNull("y") == false ) { 
        y = json.getFloat("y");
      }
       if (json.isNull("z") == false ) { 
        z = json.getFloat("z");
      }
      if (json.isNull("beta") == false ) { 
        beta = json.getInt("beta");
      }
      if (json.isNull("alpha") == false ) { 
        alpha = json.getInt("alpha");
      }
      if (json.isNull("gamma") == false ) { 
        gamma = json.getInt("gamma");
      }
      updateVelocite(idClient,y);
      if (debug) {
        println("receiving new Motion:",x,y,z);
        println("with orientation:",alpha,beta,gamma);
      }
      break;
      
    case "info" :
      if (json.isNull("idClient") == false ) { 
        idClient = json.getInt("idClient");
      }
      if (json.isNull("beta") == false ) { 
        beta = json.getInt("beta");
      }
      println("receiving info:",beta);
      break;

    default:
      println("ERR: Message serveur de type inconnu", msg);
      break;
    }
  }
}
