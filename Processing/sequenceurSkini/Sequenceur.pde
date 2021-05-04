void resetSequenceur() {
  println("RESET SEQUENCEUR");
  for (int i = finPlaySequenceur -1 ; i >= 0 ; i--) {
    for (int j=sequenceur[i].size()-1; j >= 0; j--) {
        sequenceur[i].remove(j);
    }
  }
}

boolean isActiv(int idClient) {
   for (int i=0; i < startActivated.size() ;i++) {
      if (startActivated.get(i) == idClient) return true;
   }
   return false;
}

boolean noteSejoue(MidiEvent midiEvent) {
  if (indexCourantSequenceur > midiEvent.index && indexCourantSequenceur < midiEvent.index + midiEvent.duree && isActiv(midiEvent.idClient)) {
    return true ;
  }
  return false;
}

//Pour un certain client, assigne un nouveau canal de  sortie
void changeChannel(int idClient,int newChannel, int newBus) {
  for (int i = 0; i < finPlaySequenceur ; i++) {
    for (int j =0; j < sequenceur[i].size(); j++) {
      if (sequenceur[i].get(j).idClient == idClient) {
        sequenceur[i].get(j).canal = newChannel;
        sequenceur[i].get(j).bus = newBus;
      }
    }
  }
}

//Envoie des noteOff pour toutes les notes du client.
//Utilisé pour ne pas avoir des notes qui restent allumées lors des modifs(ex: changement de canal, stop de pattern..).
void stopNotes(int idClient) {
  for (int i = 0; i < finPlaySequenceur ; i++) {
    for (int j =0; j < sequenceur[i].size(); j++) {
      if (sequenceur[i].get(j).idClient == idClient) {
        myBus[sequenceur[i].get(j).bus].sendMessage( new byte[] { (byte) (NOTE_OFF + sequenceur[i].get(j).canal), 
        (byte) sequenceur[i].get(j).codeMidi, (byte) sequenceur[i].get(j).velocite  } );
      }
    }
  }
}

// On efface les notes dans le séquenceur
void eraseNotes(int idClient) {
  for (int i = finPlaySequenceur -1 ; i >= 0 ; i--) {
    for (int j=sequenceur[i].size()-1; j >= 0; j--) {
      if (sequenceur[i].get(j).idClient == idClient) {
        sequenceur[i].remove(j);
      }
    }
  }
}

// L'inclinaison du téléphone (paramètre y).
// Ici l'accéléromètre avec gravité n'est pas idéal car il peut être faussé par les mouvements de la personne:
// si elle saute, accélération != inclinaison.
// avec une autre fonction pour réceptionner les données sur le smartphonne, 
// on pourrait avoir moins de message automatiquement.
void updateVelocite(int idClient, double y) {
  double yy = Math.abs(y);
  //velocitee toujours suppérieure a 0
  int newVelocite = (int) Math.abs((120.0 - (yy/10)*120.0)) + 1 ;
  //println("newVelocite",newVelocite);
  for (int i = 0; i < finPlaySequenceur ; i++) {
    for (int j =0; j<sequenceur[i].size(); j++) {
      if (sequenceur[i].get(j).idClient == idClient && sequenceur[i].get(j).velocite > 0) {
        //println("change velocity to:",newVelocite);
        sequenceur[i].get(j).velocite = newVelocite ;
      }
    }
  }
}

// Fonction appelée lors de la reception d'un message de suppression de la note par le client.  
// (on pourrait ne supprimer la note que si on en était le créateur. 
// Selon si on peux avoir plusieurs notes similaires en même temps..)
void removeEventInSequencer(int index,int note,int vel, int duree, int idClient){
  int indexOff = (index + duree ) % finPlaySequenceur ;
  for (int i= sequenceur[index].size() -1; i >= 0; i--) {
   if (sequenceur[index].get(i).codeMidi == note && sequenceur[index].get(i).velocite > 0 && sequenceur[index].get(i).idClient == idClient) {
     sequenceur[index].remove(i);
     if (debug) println("removed on",index,note);
   }
  }
  for (int i= sequenceur[indexOff].size()-1; i >= 0; i--) {
    if (sequenceur[indexOff].get(i).codeMidi == note && sequenceur[indexOff].get(i).velocite == 0 && sequenceur[indexOff].get(i).idClient == idClient) {
      //if (noteSejoue(sequenceur[index].get(i))) {
        // finieNote(index,note,duree); // INUTILE
        myBus[sequenceur[indexOff].get(i).bus].sendMessage( new byte[] { (byte) (NOTE_OFF + sequenceur[indexOff].get(i).canal), 
        (byte) sequenceur[indexOff].get(i).codeMidi, (byte) sequenceur[indexOff].get(i).velocite  } );
      //}
      sequenceur[indexOff].remove(i);
      if (debug) println("removed on",index,note);
    }
  }
}

//Renvoie vrai si le pattern client (clientId) est démarré
boolean isStarted(int clientId) {
  for (int i= startActivated.size() -1; i >= 0; i--) {
    if (startActivated.get(i) == clientId) {
      return true ;
    }
  }
  return false ;
}

void putEventInSequencer(MidiEvent midiEvent) {
  int indexNoteOFF;
  if (debug) println( "putEventInSequencer: indexCourantSequenceur: ", indexCourantSequenceur, 
    " ID: ", midiEvent.id, 
    " INDEX: ", midiEvent.index, // Utilisé pour calculer le NoteOFF avec la durée
    " BUS:", midiEvent.bus, 
    " CHANNEL:", midiEvent.canal, 
    " NOTE:", midiEvent.codeMidi, 
    " DUREE:", midiEvent.duree, 
    " VEL:", midiEvent.velocite);

  // On limite la récéption au noteON et on recrée le noteOFF
  if ( midiEvent.velocite != 0) {

    indexNoteOFF = (midiEvent.index + midiEvent.duree ) % finPlaySequenceur;
    if (indexNoteOFF < 0 ) indexNoteOFF += finPlaySequenceur;

    if (debug) println("putEventInSequencer NOTE OFF : indexCourantSequenceur: ", indexCourantSequenceur, ", index NOTE OFF: ", indexNoteOFF, ", midiEvent.duree: ", midiEvent.duree);
    MidiEvent noteOFF = new MidiEvent(midiEvent, 0);
    noteOFF.index = indexNoteOFF;

    // Surveillance du moment de réception
    if ( indexCourantSequenceur > midiEvent.index &&  indexCourantSequenceur < (midiEvent.index + midiEvent.duree )) {
      if (debug) println("-- putEventInSequencer: Note OFF positionné avec Index séquenceur entre deux evenements midi: ", indexCourantSequenceur);
    }

    sequenceur[midiEvent.index].add(midiEvent);
    if (debug) midiEvent.printEvent();

    sequenceur[noteOFF.index].add(noteOFF);
    if (debug) noteOFF.printEvent();
  }
}

void playEventInSequencer(int index) {
  // A une position du séquenceur (index) correspond une ArrayList qui contient des evenements MIDI
  // On peut donc y trouver des NOTE ON et des NOTE OFF.
  // Dans le cas des NOTE OFF on vérifie que la NOTE ON correspondant a été jouée pour le jouer.
  // Dans le cas des NOTE ON on les joue.

  if (debug) for ( int i = 0; i < sequenceur[index].size(); i++) { 
    println( "\n playEventInSequencer: Contenu de l'ArrayList AVANT la boucle dans playEventInSequencer: position=", i, " indexCourantSequenceur: ", indexCourantSequenceur, " ID: ", sequenceur[index].get(i).id, 
      " BUS:", sequenceur[index].get(i).bus, 
      " CHANNEL:", sequenceur[index].get(i).canal, 
      " NOTE:", sequenceur[index].get(i).codeMidi, 
      " VEL:", sequenceur[index].get(i).velocite, "\n");
  }
  
  //Une boucle pour les notes off, puis les notes on. 
  //Ainsi si l'on a deux mêmes notes consécutives, le noteOff de la première est joué avant le noteOn de la deuxieme et on n'"efface" pas la deuxieme note.
  
  for (int i= sequenceur[index].size() -1; i >= 0; i--) { //On joue d'abord les noteOff
    if (debug) print( "playEventInSequencer: indexCourantSequenceur: ", indexCourantSequenceur, " ID: ", sequenceur[index].get(i).id, 
        " BUS:", sequenceur[index].get(i).bus, 
        " CHANNEL:", sequenceur[index].get(i).canal, 
        " NOTE:", sequenceur[index].get(i).codeMidi, 
        " VEL:", sequenceur[index].get(i).velocite,
        " ID CLIENT:", sequenceur[index].get(i).idClient,"\n");
    if ( sequenceur[index].get(i).velocite == 0 ) {
      // On regarde si le client associé à la note est actif
      if ( isStarted(sequenceur[index].get(i).idClient )) {
      //if (tableClientActivation(index, sequenceur[index].get(i).codeMidi, sequenceur[index].get(i).idClient)){
        myBus[sequenceur[index].get(i).bus].sendMessage( new byte[] { (byte) (NOTE_OFF + sequenceur[index].get(i).canal), 
          (byte) sequenceur[index].get(i).codeMidi, (byte) sequenceur[index].get(i).velocite  } );
      }
    }
  }

  for (int i= sequenceur[index].size() -1; i >= 0; i--) { // Ensuite les noteOn

    if (debug) print( "playEventInSequencer: indexCourantSequenceur: ", indexCourantSequenceur, " ID: ", sequenceur[index].get(i).id, 
      " BUS:", sequenceur[index].get(i).bus, 
      " CHANNEL:", sequenceur[index].get(i).canal, 
      " NOTE:", sequenceur[index].get(i).codeMidi, 
      " VEL:", sequenceur[index].get(i).velocite, "\n");

    //if (debug) println("activée:",index,sequenceur[index].get(i).codeMidi,tableClientActivation(index,sequenceur[index].get(i).codeMidi, sequenceur[index].get(i).idClient));
    if (sequenceur[index].get(i).velocite > 0 ) {
      if ( isStarted(sequenceur[index].get(i).idClient )) {
      //if (tableClientActivation(index, sequenceur[index].get(i).codeMidi, sequenceur[index].get(i).idClient)){
        if (debug) println("- playEventInSequencer: NOTE ON ou NOTE OFF sans correspondant NOTE ON en piste, ID: ", sequenceur[index].get(i).id, "--- ON JOUE");
        myBus[sequenceur[index].get(i).bus].sendMessage( new byte[] { (byte) (NOTE_ON + sequenceur[index].get(i).canal), 
        (byte) sequenceur[index].get(i).codeMidi, (byte) sequenceur[index].get(i).velocite  } );
      }
    }
  }
}

void nextEventInSequencer() {
  playEventInSequencer(indexCourantSequenceur);
  indexCourantSequenceur++;
  indexCourantSequenceur %= finPlaySequenceur;
  
  if (compteurSynchro == 0 ) { // Pour déclenchement du player
    jsonMessage = "{\"type\": \"synchroProcessing\", \"time\" : " + millis() + "}";
    //println("SEND SYNCHRO", millis());
    try {
      ws.sendMessage(jsonMessage);
    } catch( Throwable e){
       println("catch:nextEventInSequencer");
       //e.printStackTrace();
    }
  }
  
  if (indexCourantSequenceur == 0 ) { // Pour recaler la tete de lecture du client à chaque tour de sequenceur
    jsonMessage = "{\"type\": \"debutPatern\", \"time\" : " + millis() + "}";
    try {
      ws.sendMessage(jsonMessage);
    } catch( Throwable e){
       println("catch:nextEventInSequencer");
       //e.printStackTrace();
    }
  }
  
  if ( compteurSeconde == 0) { // Pour synchro des horloges
    jsonMessage = "{\"type\": \"synchroSeconde\", \"time\" : " + millis() + "}";
    //println("SEND SYNCHROSeconde:", millis());
    try {
      ws.sendMessage(jsonMessage);
    } catch( Throwable e){
          println("catch:synchroSeconde");
          //e.printStackTrace();
    } 
  }
  
  compteurSynchro++;
  compteurSynchro %= compteurSynchroMax;

  compteurSeconde++;
  compteurSeconde = compteurSeconde % round(frameRate);
}
