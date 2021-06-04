/********************************************************** //<>//
 Passerelle entre Skini NODE.JS et une DAW
 Ce programme intégre l'interface OSC -> Midi
 et un sequenceur distribué connecté au serveur skini.
 *************************************************************/
// Pour signifier si le séquenceur gère la durée du tick ou si il se syncrhonise sur une horloge externe
// émise pas Ableton Live par exemple.
boolean midiSyncActif = true;

boolean debug = false;
boolean debug1 = false;
boolean debug2 = true;

JSONObject configJson;
JSONArray configMIDI;

String serveurNode;
String RemoteNetAddress;
int emitOSCport; // = 13000;
int inOSCport; // = 12000;

/************************************************************
 
 WEBSOCKET AVEC LE SERVEUR NODE.JS
 
 *************************************************************/
import processing.core.*;
import websockets.*;
import javax.sound.midi.*;
import java.util.Vector.*;
import java.util.ArrayList;
//import java.net.*;

WebsocketServer ws;  // Serveur Processing pour le séquenceur
WebsocketClient wsc; // Accès Client à NODE.JS

int latence = 0;
int datePing = 0;
int datePong = 0;
int datePingRecu = 0;
int tempsInitial = 0;

String jsonMessage;

int tempoConnexionMax = 5000;
int tempoConnexion = millis();

/************************************************************
 
 Sequenceur général
 
 *************************************************************/
// Déclarations pour être en phase avec Le client, mais on n'a pas besoin de tout ça
// Le séquenceur général devrait fonctionner avec dureeDuTick uniquement.
int tripleCrocheTR = 2;
int tripleCrocheR = 3;
int doubleCrocheTR = 4;
int doubleCrocheR = 6;
int crocheTR = 8;
int crocheR = 12;
int noireTR = 16;
int noireR = 24;
int blancheTR = 32;
int blancheR = 48;
int rondeTR = 64;
int rondeR = 96;

// Une initialisation en protection
// mais c'est le serveur Hop qui donne ces infos
int tempsMesure = 4;             // Partie haute de la mesure, nombre de temps dans la mesure
int divisionMesure = noireR;     // Partie basse de la mesure
int nbeDeMesures = 4;            // On prend du large à l'initialisation, pb si on est en dessous de ce que demande le serveur (à voir)
int tempo = 60;

int dureeDuTick =  int((60.0 / tempo ) / divisionMesure * 1000) ; // Exprimé ici en millisecondes
int refreshRate = (1000 / (dureeDuTick)); // Utilisé quand pour Processing sans Ableton

// Le tableau qui stocke les événements MIDI sous forme de listes, une pour chaque index.
// La taille est figée ici, car la taille effective du séquenceur est succéptible de changer, même si ce 
// n'est pas le cas dans cette version.
ListEvent sequenceur[] = new ListEvent[600]; // On prend de la marge en case de redimensionnement.

// Cette valeur est initialisée, mais c'est le serveur hop qui donne cette information.
int sequenceurSize = nbeDeMesures * tempsMesure * divisionMesure;

int finPlaySequenceur = sequenceurSize;
int indexCourantSequenceur = 0;
int compteurSynchroMax = nbeDeMesures * tempsMesure * divisionMesure;
int compteurSynchro = 0;
int idEvent = 0; // Permet de faire l'association entre NoteOn et NoteOFF
int compteurSeconde = 0;

boolean firstPass = true;
boolean useSequencer = false; // Pour arreter le séquenceur lors de modifications

// Tableau qui garde la liste des clients Actifs
// Il est mis à jour par les demandes client startPatern et stopPatern
ArrayList<Integer> startActivated = new ArrayList();
ArrayList<Paire> names = new ArrayList();

/***********************************
 
 OSC ET MIDI
 
 *************************************/
import themidibus.*; //Import the library
MidiBus myBus[]; // The MidiBuses
MidiBus myBusIn[];

import oscP5.*;
import netP5.*;

// COMMANDES MIDI GENERIQUES
// Ces commandes sont sur le canal midi 1,
// ajouter le numéro du canal à ces valeurs pour les commandes sur les autres canaux
// Pour mémo voir http://computermusicresource.com/MIDI.Commands.html

final byte NOTE_ON =           (byte) 144; 
final byte NOTE_OFF =          (byte) 128;
final byte CONTROL_CHANGE  =   (byte) 176;
final byte PROGRAM_CHANGE =    (byte) 192;
final byte PITCH_BEND =        (byte) 224;
final byte MODULATION =        (byte) 1;
final byte VOLUME =            (byte) 7;
final byte PAN =               (byte) 10;
final byte SUSTAIN =           (byte) 64;
final byte REVERB =            (byte) 91;
final byte CHORUS =            (byte) 93;
final byte ALL_CC_OFF =        (byte) 121;
final byte CHANNEL_MODE_MESSAGE = (byte) 176;
final byte ALL_NOTES_OFF =     (byte) 123;
final byte BANK_SELECT =       (byte) 32;

// MESSAGE MIDI SPECIFIQUES
final byte MORPH_FM8_X =       (byte) 54;
final byte MORPH_FM8_Y =       (byte) 55;

// Pour les gestion des bus MIDI
int nbeDeBus = 0;
int nbeDeBusIn = 0;
int busClipFromDawIndex = 0;
int portMidiInput = 1;  
// final int  portMidiInputMidiMix = 3;

OscP5 oscP5Emit, oscP5Receive;
NetAddress myRemoteLocation;
ParticleSystem ps;
PFont f;

void setup() {
  size(300,300);
  //fullScreen(2);
  frameRate(refreshRate); 
  // printArray(PFont.list());
  f = createFont("Norasi", 25);
  textFont(f);
  textAlign(CENTER, CENTER);
  ps = new ParticleSystem(new PVector(width/2, 50));
  println("REFRESH RATE =", refreshRate);

  // Config Files ****************************************
  configJson = loadJSONObject("../../serveur/ipConfig.json");
  String adresseDAW = configJson.getString("remoteIPAddressSound");
  String adresseServeur = configJson.getString("serverIPAddress");
  RemoteNetAddress = adresseServeur;
  
  configMIDI = loadJSONArray("../../serveur/midiConfig.json");
  
  // C'est l'inverse de Node
  emitOSCport = configJson.getInt("InPortOSCMIDIfromDAW"); 
  inOSCport = configJson.getInt("OutPortOSCMIDItoDAW");
 
  //int serveurPort = configJson.getInt("webserveurPort");
  
  int websocketServeurPort = configJson.getInt("websocketServeurPort");
  serveurNode =  "ws://" + adresseServeur + ":" + websocketServeurPort;
  
  int distribSequencerPort = configJson.getInt("distribSequencerPort");
  
  //println(configJson);
  println("---------------------------------------------------------------");
  println("serveur WS Node:" + serveurNode + ": adresse DAW: "+ adresseDAW);
  println("---------------------------------------------------------------");
   
  // WEBSOCKET ***********************************
  // Pour créer le websocket serveur du séquenceur
  ws= new WebsocketServer(this, distribSequencerPort, "/processing"); // HOP ou Node.js
  // Pour se connecter sur le serveur hop
  wsc = new WebsocketClient(this, serveurNode);

  // Sequenceur
  if(debug) println("\nTaille du séquenceur:", sequenceurSize, "Durée du tick: ", dureeDuTick);

  // Initialisation du séquenceur
  for ( int i = 0; i < sequenceurSize; i++) {
    sequenceur[i] = new ListEvent();
  }

  // OSC *************************************
  oscP5Receive = new OscP5(this, inOSCport);    /* On écoute sur ce port */
  oscP5Emit =    new OscP5(this, emitOSCport);  /* pour l'émission des OSC */
  myRemoteLocation = new NetAddress(RemoteNetAddress, emitOSCport); /* pour l'émission des OSC */

  // BUS MIDI *****************************************
  // Donne la liste des interfaces midi à mettre dans la création de myBus
  MidiBus.list(); 
 
  nbeDeBus = 0;
  nbeDeBusIn = 0;
  // Pour dimensionner les tableaux
  for (int i = 0; i < configMIDI.size(); i++) {
    JSONObject midiParam = configMIDI.getJSONObject(i);
    String type = midiParam.getString("type");
     if (type.equals("OUT")){
       nbeDeBus++;
     }else if(type.equals("IN")){
       nbeDeBusIn++;
     }
  }
  println("MIDI Parameters -------------");
  println("OUT:" + nbeDeBus + ", IN:" + nbeDeBusIn);
  
  myBus = new MidiBus[nbeDeBus];
  myBusIn = new MidiBus[nbeDeBusIn];
   
  // Création des bus OUT et IN en tenant compte des "spec" des bus.
  int countBusIN = 0;
  int countBusOUT = 0;

  for (int i = 0; i < configMIDI.size(); i++) {
    JSONObject midiParam = configMIDI.getJSONObject(i);
    String type = midiParam.getString("type");
    String name = midiParam.getString("name");
    String spec = midiParam.getString("spec");
        
    if (type.equals("OUT")){
      myBus[countBusOUT] = new MidiBus(this, portMidiInput, name);
      println("Bus["+ countBusOUT +"] " + type + " : " + name);
      countBusOUT++;
     }else if(type.equals("IN")){
      myBusIn[countBusIN] = new MidiBus(this, name, -1, name);
      if(spec.equals("syncFromDAW")){
        busClipFromDawIndex = countBusIN;
      }
      println("Bus["+ countBusIN +"] " + type + " : " + name);
      countBusIN++;
     }
  }

  //String os = System.getProperty("os.name");
  //println(os,"Linux");

  //// Config et Ports Midi sur la machine en cours. --------------------
  //if ( os.equals("Mac OS X") ) {
  //  // Config sur MAC CIRM conforme à REAPER
  //  myBus[0] = new MidiBus(this, portMidiInput, "Bus IAC 6");  // portMidiFM8
  //  myBus[1] = new MidiBus(this, portMidiInput, "Bus IAC 7");  //portMidiAbsynth
  //  myBus[2] = new MidiBus(this, portMidiInput, "Bus IAC 8");  //portMidiPrism
  //  myBus[3] = new MidiBus(this, portMidiInput, "Bus IAC 9");  //portMidiGuitarRig
  //  myBus[4] = new MidiBus(this, portMidiInput, "Bus IAC 11"); //portReaper
  //  myBus[5] = new MidiBus(this, portMidiInput, "Bus IAC 10"); //portMidiMassive
  //  myBus[6] = new MidiBus(this, portMidiInput, "Bus IAC 12"); //portMidiAbleton 
  //  myBus[7] = new MidiBus(this, portMidiInput, "Bus IAC 13"); //portMidi Effet (GuitarRig 1) Voix
  //  myBus[8] = new MidiBus(this, portMidiInput, "Bus IAC 14"); //portMidi Effet (GuitarRig 2) Voix 
  //  myBus[9] = new MidiBus(this, portMidiInput, "Bus IAC 15"); //portMidi Effet (GuitarRig 3) Voix
  //  myBus[10] = new MidiBus(this, portMidiInput, "Bus IAC 16"); //portMidi Effet(GuitarRig 4) Voix
  //  myBus[11] = new MidiBus(this, portMidiInput, "Bus IAC 17"); //portMidi Quadri1
  //} else if ( os.equals("Linux") ){
  //  myBusIn[0] = new MidiBus(this, "VirMIDI [hw:1,0,0]", 1, "VirMIDI [hw:1,0,0]");
  //  myBus[0] = new MidiBus(this, "VirMIDI [hw:1,0,1]", 1, "VirMIDI [hw:1,0,1]");
  //} else {
  //  // Config sur les PC Windows
  //  myBus[0] = new MidiBus(this, portMidiInput, "loopMIDI Port");   // Golem, portMidiFM8
  //  myBus[1] = new MidiBus(this, portMidiInput, "loopMIDI Port 1"); // Golem, portMidiAbsynth
  //  myBus[2] = new MidiBus(this, portMidiInput, "loopMIDI Port 2"); // Golem,portMidiPrism
  //  myBus[3] = new MidiBus(this, portMidiInput, "loopMIDI Port 3"); // Golem,portMidiGuitarRig
  //  myBus[4] = new MidiBus(this, portMidiInput, "loopMIDI Port 4"); // Golem,portReaper
  //  myBus[5] = new MidiBus(this, portMidiInput, "loopMIDI Port 5"); // Golem,portMidiMassive
  //  myBus[6] = new MidiBus(this, portMidiInput, "loopMIDI Port 6"); //portMidiAbleton, pour les messages de contrôle => lancement des clips
  //  myBus[7] = new MidiBus(this, portMidiInput, "loopMIDI Port 7"); // Golem,portMidi Effet (GuitarRig 1) Voix
  //  myBus[8] = new MidiBus(this, portMidiInput, "loopMIDI Port 8"); // Golem,portMidi Effet (GuitarRig 2) Voix
  //  myBus[9] = new MidiBus(this, portMidiInput, "loopMIDI Port 9"); // Golem,portMidi Effet (GuitarRig 3) Voix
  //  myBus[10] = new MidiBus(this, portMidiInput, "loopMIDI Port 10"); // Golem,portMidi Effet (GuitarRig 4) Voix
  //  myBus[11] = new MidiBus(this, portMidiInput, "loopMIDI Port 11"); // Golem,portMidi Quadri1
    
  //  myBusIn[0] = new MidiBus(this, "loopMIDI Port 9", -1, "Ableton"); // Pour recevoir le signal de syncho d'Ableton
  //  myBusIn[1] = new MidiBus(this, "nanoKEY2", -1, "nanoKEY2");
  //  myBusIn[2] = new MidiBus(this, "loopMIDI Port 12", -1, "loopMIDI Port 12" ); //portMidi info Ableton activation de clip
  //  myBusIn[3] = new MidiBus(this, "loopMIDI Port 13", -1, "loopMIDI Port 13");  // message MIDI pour synchro Video par exemple
  //  //myBusIn[4] = new MidiBus(this, "MIDI Mix", -1, "AkaiMidiMix");
  //}

  //myBusIn[0] = new MidiBus(this, "MIDI Mix", -1, "AkaiMidiMix");
  //myBusIn[2] = new MidiBus(this, "Port 1", -1, "Absynth");
  //myBusIn[2] = new MidiBus(this, "Port 1", -1, "MPK25");
  //myBusIn[3] = new MidiBus(this, "Session1", -1, "Session1");
}
int bord = 0;

void draw() {
  fill(30);
  stroke(0);
  rect(0,0,width, height);
  
  if (useSequencer) drawNotes();
  
  // Si on ne souhaite pas se syncrhoniser sur une Midi Clock, ou s'il n'y en a pas c'est processing qui gère la vitesse de lecture.
  if (!midiSyncActif && useSequencer) {
    nextEventInSequencer();
  }
}

void drawNotes() {
  float positionX;
  float positionY;
  float largeur;
  float hauteur;
  float largeurMesure;
  
  for (int i = 0; i < finPlaySequenceur ; i++) {
    for (int j =0; j < sequenceur[i].size(); j++) {
      
      if (sequenceur[i].get(j).velocite > 0 && sequenceur[i].get(j).midiEventNotNull() ) {
        stroke(255,255,255,50);
        // Couleur un peu au hasard, à revoir
        fill( (sequenceur[i].get(j).idClient*5) % 125 + 125, 7 * sequenceur[i].get(j).idClient % 255, 10*sequenceur[i].get(j).idClient % 255);
        
        // Les notes
        positionX = sequenceur[i].get(j).index * width/sequenceurSize + bord;
        positionY = (height/88) * (120 - sequenceur[i].get(j).codeMidi); // En fonction du code midi, on affiche entre 29 (Gb0) et 120 (B7)
        largeur = width/sequenceurSize * sequenceur[i].get(j).duree;
        hauteur =height/100;
        rect(positionX, positionY, largeur, hauteur, 5);
        
        if (noteSejoue(sequenceur[i].get(j))) {
          ps.addParticle(indexCourantSequenceur * width/sequenceurSize, int (positionY) );
        }
      }
    }
  }
  
  // Affichage des noms
  for (int i = 0; i < startActivated.size() ; i++){
    for (int j = 0; j < names.size() ; j++){
      if (names.get(j).idClient() == startActivated.get(i)) {
        fill((startActivated.get(i)*5) % 255, 7*startActivated.get(i) % 255, 10*startActivated.get(i) % 255);
        text(names.get(j).pseudo(), 50, 10 + i*30);
      }
    }
  }
  ps.run();
  
  // Barre de mesure
  for (int i = 0; i < nbeDeMesures; i++) {
      stroke(#AFA6A6);
      fill(#AFA6A6);
      rect( i * width/nbeDeMesures, 0, 4, height);
  }
   
  // Marque des Temps 
    largeurMesure = width/nbeDeMesures;
    for (int i = 0; i < nbeDeMesures; i++) {
       for (int j = 0 ; j < tempsMesure; j++) {
        stroke(#D38080);
        line( (i * largeurMesure) + j * (largeurMesure/tempsMesure) , 0, (i * largeurMesure) + j * (largeurMesure/tempsMesure) , height);
      }
    }
   
  //défilement de la tête de  lecture
  stroke(127,221,76);
  line(indexCourantSequenceur* width/sequenceurSize, 0, indexCourantSequenceur * width/sequenceurSize, height);
}


void keyPressed() { // Emission OSC Pour test 
  switch(key) {
  case 'r':
    resetSequenceur();
    break;
    
   case 's':
    println("Tentative de nouvelle reconnexion websocket");
    // Pour se connecter sur le serveur hop
    try{
       wsc = new WebsocketClient(this, serveurNode);
    }catch(Exception err){
       println("OSCMidi:catch:Tentative de reconnexion échouée");
    }
    break;
    
  default: 
    OscMessage myMessage = new OscMessage("/test");
    myMessage.add(random(55)); // add an int to the osc message
    // send the message
    oscP5Emit.send(myMessage, myRemoteLocation); 
    println("Message OSC emis", myMessage, " ", myRemoteLocation);
  }
}

// Ne fonctionne pas car il faut que Skini soit bien lancé pour pouvoir
// se reconnecter. Java part en erreur sinon, et je ne sais pas éviter cette erreur
// 5/6/2020
/*
void reconnexionWebsocket(){
  int temps = tempoConnexion = millis();
  while(true){
    if (temps > tempoConnexion + tempoConnexionMax){
      println("Delai d'attente de reconnexion dépassé");
      try{
         wsc = new WebsocketClient(this, serveurHop);
         return;
      }catch(Exception err){
         println("OSCMidi:catch:Tentative de reconnexion échouée");
      }
    }else{
      println("reconnexionWebsocket", temps - tempoConnexion);
      temps = millis();
    }
  }
}
*/
