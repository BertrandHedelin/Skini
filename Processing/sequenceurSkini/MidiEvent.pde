MidiEvent midiEventNull = new MidiEvent(-1,-1,-1,-1,0,0,0,0);

class MidiEvent {
  int bus;
  int canal;
  int codeMidi;
  int velocite;
  int index; // Dans le séquenceur
  int duree;
  int id;
  int idClient;
  boolean debug = false;
  
  MidiEvent(int setId, int setBus, int setCanal, int SetCodeMidi, int setVelocite, int setIndex, int setDuree,int setIdClient) {
    bus = setBus;
    canal = setCanal;
    codeMidi = SetCodeMidi;
    velocite = setVelocite;
    index = setIndex;
    duree = setDuree;
    id = setId;
    idClient = setIdClient;
  }
 
  MidiEvent() {
    bus = 0;
    canal = 0;
    codeMidi = 0;
    velocite = 0;
    index = 0;
    duree = 0;
    id = -1; // Evenement vide
    idClient = 0;
  }
  
  MidiEvent(MidiEvent event, int setVelocite) {
    id = event.id;
    bus = event.bus;
    canal = event.canal;
    codeMidi = event.codeMidi;
    velocite = setVelocite;
    index = event.index;
    duree = event.duree;
    idClient = event.idClient;
  }
  
  boolean midiEventNotNull() {
    if (this.codeMidi == -1) return false;
    return true;
  }
  
  void printEvent () {
     println("--- print Event: ID: ", id, "BUS: ", bus, " Canal: ", canal, "CodeMidi: ", codeMidi, "Vel: ", velocite , "Index: ", index, "Durée; " , duree,"idClient:",idClient );
  }
  
  void copyEvent(MidiEvent eventOrigine) {
      this.bus = eventOrigine.bus;
      this.canal = eventOrigine.canal;
      this.codeMidi = eventOrigine.codeMidi;
      this.velocite = eventOrigine.velocite;
      this.index = eventOrigine.index;
      this.duree = eventOrigine.duree;
      this.id = eventOrigine.id;
      this.idClient = eventOrigine.idClient;
  }
  
}

class ListEvent {
  ArrayList<MidiEvent> cetteListEvent;
  
  ListEvent() {
    cetteListEvent = new ArrayList<MidiEvent>();
  }
  
  // Pb vu sur cette fonction !!
  MidiEvent get(int idx) {
    if (idx > cetteListEvent.size() - 1  ) {
      println("ERR: MidiEvent get(int idx): index en dehors de la table:", idx);
      return midiEventNull;
    }
      //println("---- MidiEvent get(int idx): ", cetteListEvent.size(), idx);
      return cetteListEvent.get(idx);
  }
  
  int size() {
    return cetteListEvent.size();
  }
    
  void add(MidiEvent midiEvent) {
    MidiEvent event = new MidiEvent(midiEvent.id ,midiEvent.bus, midiEvent.canal, midiEvent.codeMidi, midiEvent.velocite, midiEvent.index, midiEvent.duree, midiEvent.idClient);
    cetteListEvent.add(event);
  }
  
  void remove(int idx) {
          cetteListEvent.remove(idx);
          if (debug) println("--- supression de l'évenement idx:", idx) ;
  }
  
  // Pour virer un evenement en fonction de son id et pas seulement son index.
  void removeId(int eventId) {
    for (int i=0; i < cetteListEvent.size(); i++) {
      if ( cetteListEvent.get(i).id == eventId ) 
          if (debug) println("--- NOTE OFF VIRE: ", eventId);
          cetteListEvent.remove(i);
      }
    }
    
 MidiEvent  getEventById(int eventId) {
    MidiEvent eventById = new MidiEvent();
    
    for (int i=0; i < cetteListEvent.size(); i++) {
      if ( cetteListEvent.get(i).id == eventId ) {
          eventById.copyEvent(cetteListEvent.get(i));
          return eventById;
      }
     }
     return eventById;
   }   
      
 
 int getEventIndexById(int eventId) {
    for (int i=0; i < cetteListEvent.size(); i++) {
      if ( cetteListEvent.get(i).id == eventId ) {
          return cetteListEvent.get(i).index;
      }
     }
     return -1;
   }   
    
  boolean presentEvtById(MidiEvent evt) {   
    for (int i=0; i < cetteListEvent.size(); i++) {
      if ( cetteListEvent.get(i).id == evt.id && cetteListEvent.get(i) != evt) {
          //println("NOTE PRESENTE ID: ", eventId);
          return true;
      }
    }
    return false;
   }
   
  void printEventOnId( int eventId ) {
        for (int i=0; i < cetteListEvent.size(); i++) {
      if ( cetteListEvent.get(i).id == eventId ) {
          cetteListEvent.get(i).printEvent();
      }
    }
  }
}
