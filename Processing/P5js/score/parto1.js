/**************************************
  SKINI

  © Copyright 2019, B. Petit-Heidelein

***************************************/
"use hopscript"
"use strict"

var debug = false;
var debug1 = true;
var demandeDeSons = "";
var par;
//var abletonON;
var refProcessing;
var noScore = false;
var displayNonActiveGroups = true;

// Pour un affichage dynamique des scènes graphique.
// Si dans le fichier de description aucune scène n'est donnée
// les éléments créés seront dans une scène 0.
var ongoingGraphicScene = [0]; 
var alertInfoMessage;

// Couleurs inactives en RGB
const Rinactive = 10;
const Ginactive = 10;
const Binactive = 10;

const courbure = 40;
// Paramètres graphiques
// Taille du canvas
var screenX = 1600;
var screenY = 1200;

var increaseTank = 13;

var patternGroups; // Groupes des patterns reçu du serveur hop

// On conçoit la partition dans un carré Xbase, Ybase
// Bases de calcul des largeur et hauteur, li'dée et de permettre un modification de la taille de
// l'écran sans toucher à la description de la partition.
// height * screenY / Ybase, width * screenX / Xbase
var Xbase = 1000;
var Ybase = 1000;

var textSize = 20 * screenY / Ybase;

/*
  On utilise logosParameters pour décrire la partition.
  Pour éviter des manipulations sur les accès dans le tableau groupeDesSons,
  j'utilise le fait que les groupes se succèdent pour les indexer..
  Du coup le champ 1 qui donne un numéro de groupe est inutile.
  Par prudence je le laisse ne sachant plus trop comment il est utilisé ailleurs.
*/

// La version processing.min.js ne sais pas gérer les couleur en hexa.
function hex_to_RGB(hex) {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return [ parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

/********************
 Graphical Objects
*********************/
class Rectangle {
  constructor(x,y, width, height, color, text,  processing){
      if (debug) console.log("constructor rectangle:", x,y, width, height, color, text);
      this.x = x * screenX / Xbase;
      this.y = y * screenY / Ybase;
      this.height = height * screenY / Ybase;
      this.width = width * screenX / Xbase;
      this.colorRect = color.slice();
      this.text = text;
      this.message1 = "";
      this.message2 = "";
      this.processing = processing;
      this.countSounds = "";
      if (debug) console.log("Rectangle : constructor: setColor:", color, this.colorRect);
  }

  setSize(width, height){
    this.height = height * screenY / Ybase;
    this.width = width * screenX / Xbase;
  }

  setColor(couleur){
  	this.colorRect = couleur.slice(); // Pour recopier et pas assigner
    if (debug) console.log("Rectangle: setColor:", couleur, this.colorRect);
  }

  setCoundSounds(counter){
      this.countSounds = counter;
  }

  setMessage(message1, message2){
    this.message1 = message1;
    this.message2 = message2;
  }

  display() {
  	// Façon peu économique de définir les tailles des chaines de caractère pour dimensioner le rectangle
  	this.processing.textSize(this.height*1.5/3);
    this.processing.text(this.message1.slice(0,10), this.x + 5, this.y + (this.height * 1.5/3), this.processing.textWidth(this.message1.slice(0,10)));
  	var localWidth1 = this.processing.textWidth(this.message1.slice(0,17));

  	this.processing.textSize(this.height*1/3);
    this.processing.text(this.message2.slice(0,17), this.x + 5, this.y + (this.height) -5, this.processing.textWidth(this.message2.slice(0,17)));
  	var localWidth2 = this.processing.textWidth(this.message2.slice(0,17));

  	this.width = Math.max(this.width, localWidth1 + 10,  localWidth2 + 10);
    this.processing.fill(this.colorRect[0], this.colorRect[1], this.colorRect[2]);
    this.processing.rect(this.x, this.y, this.width, this.height,this.radius);

  	// Affichage des textes
    this.processing.fill(0); // En noir
    this.processing.textSize(textSize);
    this.processing.text(this.text, this.x, this.y -3 ); //, this.width, this.height);

    this.processing.fill(255); // En blanc
    this.processing.textSize(this.height*1.5/3);
    this.processing.text(this.message1.slice(0,10), this.x + 5, this.y + (this.height * 1.5/3), this.processing.textWidth(this.message1.slice(0,10)));
    this.processing.textSize(this.height*1/3);
    this.processing.text(this.message2.slice(0,17), this.x + 5, this.y + (this.height) -5, this.processing.textWidth(this.message2.slice(0,17)));
    //this.processing.text(this.message2.slice(0,20), this.x + 5, this.y + (this.height * 4/5));
    //this.processing.text(this.countSounds, this.x + this.width/2 - 50, this.y + (this.height*3/4));
  }
}

// Assignation d'une proprité à une classe
Rectangle.prototype.radius = 10;

class Ellipse {
  constructor(x,y, width, height, color, text,  processing){
      if (debug) console.log("constructor ellipse:", x,y, width, height, color, text);
      this.x = x * screenX / Xbase;
      this.y = y * screenY / Ybase;
      this.height = height * screenY/Ybase;
      this.width = width * screenX/Xbase;
      this.colorEllipse = color.slice();
      this.text = text;
      this.message1 = "";
      this.message2 = "";
      this.processing = processing;
  }

  setSize(width, height){
    this.height = height * screenY/Ybase;
    this.width = width * screenX/Xbase;
  }

  setColor(color){
  	this.colorEllipse = color.slice();
    if (debug) console.log("Rectangle: setColor:", color, this.colorEllipse);
  }

  setMessage(message1, message2){
    this.message1 = message1;
    this.message2 = message2;
  }

  display() {
    this.processing.fill(this.colorEllipse[0], this.colorEllipse[1], this.colorEllipse[2]);
    // L'ellipse est centrée de façon à être dans un rectangle.
    // L'idée est de garder le même modèle de coordonnée pour Rectangle et Ellipse.
    this.processing.ellipse(this.x+this.width/2 , this.y+this.height/2, this.width, this.height);
    this.processing.fill(0);

    this.processing.textSize(textSize);
    this.processing.text(this.text, this.x, this.y); //, this.width, this.height);

    this.processing.fill(255); // En blanc
    this.processing.textSize(this.height*1.5/3);
    this.processing.text(this.message1.slice(0,10), this.x + 5, this.y + (this.height * 1.5/3), this.processing.textWidth(this.message1.slice(0,10)));
    this.processing.textSize(this.height*1/3);
    this.processing.text(this.message2.slice(0,18), this.x + 5, this.y + (this.height) -5, this.processing.textWidth(this.message2.slice(0,18)));
  }
}

/*************************
 Orchestral Objects

 *************************/

class Tank extends Rectangle {
  constructor(indexTank, tankNumber, x, y, color, text, previous, graphicScene, processing){
     var width = 0;
     var height = 0;

     // Pour initialiser le rectangle
      super(x, y, width, height, [Rinactive,Ginactive,Binactive],text, processing); // Attention: "super" à placer avant les références à this
      this.indexTank = indexTank;

      this.width = 0;
      this.height = 0;
      this.colorTank = color.slice();
      this.tankNumber = tankNumber;
      this.signalCount = 1; // au départ
      this.signalCountMax = 1;
      this.graphicScene = graphicScene;
      this.processing = processing;
      this.active = false;
      this.couleurInactiveTank = [Rinactive,Ginactive,Binactive];
      this.previousGroups = previous;
      this.name = text;
  }

  decrement() {
    this.signalCount--;
    if (this.signalCount < 0) this.signalCount = 0; // Protection
    if (debug1) console.log("decrement Group:", this.signalCount, ":", this.width, this.height);
    if (this.signalCount === 0 ) {
  		this.active = false;
  	}
    this.width =  this.signalCount * increaseTank;
    this.height = this.signalCount * increaseTank;
    super.setSize(this.width, this.height);
    if (this.active){
    	/* Il faut faire autre chose que changer la couleur
	    this.colorTank[0] = Math.floor(Math.random() * 255);
	    this.colorTank[1] = Math.floor(Math.random() * 255);
	    this.colorTank[2] = Math.floor(Math.random() * 255);
	    */
	    super.setColor(this.colorTank);
	}else{
		super.setColor([Rinactive,Ginactive,Binactive]);
	}
    return this.signalCount;
  }

 isTank(){
    return true;
  }
 
  getX(){
  	return this.x;
  }

  getY(){
  	return this.y;
  }

  getWidth(){
  	return this.width;
  }

  getHeight(){
  	return this.height;
  }

  getPrevious() {
    return this.previousGroups;
  }

  getName(){
    return this.name;
  }

  getTankNumber(){
    return this.tankNumber;
  }

  getIndex(){
  	return this.indexTank;
  }

  getGraphicScene(){
    return this.graphicScene;
  }

  activate() {
  	super.setColor(this.colorTank);
    this.active = true;
  }

  reactivate() {
    super.setColor(this.colorTank);
    this.active = true;
    this.signalCount = this.signalCountMax;
  }

  deactivate() {
    this.active = false;
    super.setColor([Rinactive,Ginactive,Binactive]);
  }
  
  isActive(){
    return this.active;
  }

  incrementSignalCount(sizeIncrease){
    this.signalCount++;
    this.signalCountMax = this.signalCount;
    this.width = this.signalCount * sizeIncrease;
    this.height = this.signalCount * sizeIncrease;
    super.setSize(this.width, this.height);
    if (debug) console.log("Increment tank:", this.signalCount);
    return this.signalCount;
  }

  display(){
  	// Assignation d'une proprité à une classe
	  Rectangle.prototype.radius = 0;
	  this.processing.strokeWeight(3);
    super.display();
  }
  // Appelable dans la classe, mais pas par une instance
  // fonction générique (local) à une classe et pas accessible en dehors.
/*  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }*/
}

class Group extends Rectangle {
  constructor(indexGroup, signalCount, x, y, couleur, text, previous, graphicScene, processing){
	  var width = signalCount * 6;
	  var height = signalCount * 4;

	 // Pour initialiser le rectangle
	  super(x, y, width, height, [Rinactive,Ginactive,Binactive], text, processing); // Attention: "super" à placer avant les références à this
	  this.indexGroup = indexGroup;
	  this.signalCount = signalCount;
	  this.width = width * screenX/Xbase;
	  this.height = height * screenY/Ybase;
	  this.colorGroup = couleur;
      this.graphicScene = graphicScene;
	  this.processing = processing;
	  this.active = false;
	  this.couleurInactiveGroup = [Rinactive,Ginactive,Binactive];
	  this.name = text;
	  // colorInactive; attention au passage des objets (objet, arrays, ) par lien (ou référence)
	  // Si on met couleurInactive dans le "='', on lie  couleurInactiveGroup à l'objet couleurInactive
	  // du coup quand on appelle desactivate() on passe un lien vers le tableau couleurInactive dans le parent rectangle
	  // avec l'instruction super.setColor(this.couleurInactiveGroup);  . 
	  // Le this.colorRect de rectangle est alors en fait le tableau couleurInactive.
	  // Toute modification sur this.colorRect va en fait modifier couleurInactive.
	  // Pour casser ce lien il faut réassigner couleurInactiveGroup (assignement vs mutate)
	  this.previousGroups = previous;
	  this.counterOfSounds = 0;
  }

  increment() {
    this.signalCount++;
    if (debug) console.log("increment Group:", this.signalCount);

    this.counterOfSounds++;
    super.setCoundSounds(this.counterOfSounds);
    /* Faire autre chose !!
    this.colorRect[0] = Math.floor(Math.random() * 127 + 100);
    this.colorRect[1] = Math.floor(Math.random() * 127 + 100);
    this.colorRect[2] = Math.floor(Math.random() * 127 + 100);
    */
    return this.signalCount;
  }

  setMessage(message1, message2){
    super.setMessage(message1, message2);
  }

 isTank(){
    return false;
  }

  getX(){
  	return this.x;
  }

  getY(){
  	return this.y;
  }

  getWidth(){
  	return this.width;
  }

  getHeight(){
  	return this.height;
  }

  getPrevious() {
    return this.previousGroups;
  }

  getName(){
    return this.name;
  }
  
  getIndex() {
  	return this.indexGroup;
  }

  activate() {
    super.setColor(this.colorGroup);
    this.active = true;
  }

  deactivate() {
  	if (debug) console.log("deactivate rectangle:", this.name);
  	super.setColor([Rinactive,Ginactive,Binactive]);
  	this.counterOfSounds = 0;
    this.active = false;
  }
  
  isActive(){
    return this.active;
  }

  getGraphicScene(){
    return this.graphicScene;
  }

  display(){
  	// Assignation d'une proprité à une classe
	  Rectangle.prototype.radius = 20;
    super.display();
  }
}

/********************************************************
Affichage des FIFOs

*********************************************************/
class infoAudience {
	constructor(processing) {
    this.processing = processing;
    this.text = 'Texte au départ -------------------------------------------------------------';
    this.x = 10;
    this.y = 850;
    this.height = 100 * screenY / Ybase;
    this.width = 1000 * screenX / Xbase;
    this.displaySpeed = 5;
    this.displayCounter = 0;
    this.textToDisplay = '';
    this.scrollChar = 0;
    this.scrollCounter = 0;
    this.frameSpeed = 0;
    this.frameCounter = 0;
	}

	setText(text){
		this.text = this.text + " | " + text;
	}

  // Scrolling pas résolu, en cours.
	display(){
    this.displaySpeed = 500 / (this.text.length + 1); 
    this.displayCounter++;
    this.frameCounter++;

    if (this.displayCounter > this.displaySpeed) {
      this.text = this.text.slice(1, 2000);
      this.scrollChar = this.processing.textWidth(this.text.slice(0,1));
      this.displayCounter = 0;
      // Calcul de la vitesse en nombre de frame entre deux affichages
      // de la chaine de caractère décalée d'un caractère.
      this.frameSpeed = this.frameCounter;
      this.frameCounter = 0;
      // Re-calcul du décalage à faire en nombre de frame.
      this.scrollChar = this.frameSpeed / this.scrollChar;
      if (debug1) console.log("displayInfoAudience:", this.frameSpeed, this.scrollChar, this.displaySpeed );
    }
    this.processing.fill(255);
    this.processing.rect(this.x, this.y, this.width, this.height);
    this.processing.fill(0);
    this.processing.textSize(50);
    this.textToDisplay = this.text.slice(0, 80);

    if ( this.scrollCounter <= 0 ){
      this.scrollCounter = this.scrollChar; // this.displaySpeed ;
      this.processing.text(this.textToDisplay, this.x + 10 - this.scrollCounter, this.y + (this.height*3/4));
    }
    this.scrollCounter --;
	}
}

class infoQueues {
  constructor(processing) {
    this.processing = processing;
    this.xStart = 10;
    this.yStart = 710 * screenY / Ybase;
    this.height = ((1000 * screenY / Ybase) - this.yStart) * screenY / Ybase;
    this.width = 1000 * screenX / Xbase;
    this.cellWidth = 300 * screenX / Xbase ;
    this.cellHeight = 30 * screenY / Ybase;
    this.textToDisplay = '';
  }

  display(){
  	var texte1EnPixel = 0;
  	var texte2EnPixel = 0;
  	var largeurTexte = 0;
  	var legende = "En file d'attente";
  	var couleur = hex_to_RGB('#83614C');

  	// Rectangle d'encadrement
	//this.processing.fill(0);
	this.processing.fill(couleur[0], couleur[1], couleur[2]);

	this.processing.rect(0, this.yStart, this.width, this.height);

	this.processing.fill(255);
	this.processing.fill(255);
	// Titre du rectangle
    this.processing.textSize(30);
  	this.processing.text(legende, this.width -  (this.processing.textWidth(legende) + 3), this.yStart +30);

    for (var i = 0; i < queuesMessages.length ; i++ ) { // chaque Instrument
      texte1EnPixel = 0;
      texte2EnPixel = 0;
      largeurTexte = 0;
      for (var j=0; j < queuesMessages[i][2].length; j++){ // chaque Array des pseudos et noms
        // Concaténation pseudo et nom
        this.texte1ToDisplay = ' ' + queuesMessages[i][2][j][1];
        this.texte2ToDisplay = ' (' + queuesMessages[i][2][j][0]+ ')';

        this.processing.textSize(20);
        texte1EnPixel = this.processing.textWidth(this.texte1ToDisplay);
        //this.processing.text(this.textToDisplay, (this.width - this.cellWidth - j * this.cellWidth), (this.yStart + queuesMessages[i][0] * this.cellHeight));
        this.processing.text(this.texte1ToDisplay, (largeurTexte), (this.yStart + queuesMessages[i][0] * this.cellHeight));
        largeurTexte += texte1EnPixel;

        this.processing.textSize(15);
        texte2EnPixel = this.processing.textWidth(this.texte2ToDisplay) + 10;
        this.processing.text(this.texte2ToDisplay, (largeurTexte), (this.yStart + queuesMessages[i][0] * this.cellHeight));
        largeurTexte += texte2EnPixel;

        //this.processing.text(this.textToDisplay, (this.width - texteEnPixel - largeurTexte), (this.yStart + queuesMessages[i][0] * this.cellHeight));

        this.processing.line(0, this.yStart + queuesMessages[i][0] * this.cellHeight + 10, this.width, this.yStart + queuesMessages[i][0] * this.cellHeight + 10);
      }
    }
  }
}


/*********************************************************
Affichage Alert et info
**********************************************************/
class alertInfo {
  constructor(processing, text) {
    this.processing = processing;
    this.xStart = 100;
    this.yStart = 250;
    this.height = 250 * screenY / Ybase;
    this.width = 250 * screenX / Xbase;
    this.textToDisplay = text;
  }

  setText(text){
    this.textToDisplay = text;
  }

  display(){
    this.processing.textSize(90);
    var texteEnPixel = this.processing.textWidth(this.textToDisplay) + 10;
    // Rectangle d'encadrement
    this.processing.fill(0);
    this.processing.rect(this.xStart, this.yStart, texteEnPixel, this.height);
    // Texte
    this.processing.fill(255);
    //this.processing.textAlign(CENTER, CENTER);
    this.processing.text(this.textToDisplay, this.xStart + 5, this.yStart + this.height/2 );
   //this.processing.textAlign(RIGHT, BOTTOM);
  }
}

/*********************************************************
Gestion des scènes graphiques

**********************************************************/

function isInOngoingGraphicScene(scene){
  for (var i=0; i < ongoingGraphicScene.length; i++){
    if ( ongoingGraphicScene[i] === scene) return true;
  }
  return false;
}

function addSceneScore(scene){
  // Déjà là
  for (var i=0; i < ongoingGraphicScene.length; i++){
    if ( ongoingGraphicScene[i] === scene){
      return true;
    }
  }
  // Un espace libre ?
  for (var i=0; i < ongoingGraphicScene.length; i++){
    if ( ongoingGraphicScene[i] === -1) {
      ongoingGraphicScene[i] = scene;
      return true;
    }
  }
  ongoingGraphicScene.push(scene);
  return true;
}

function removeSceneScore(scene){
  if( ongoingGraphicScene[ongoingGraphicScene.length - 1] === scene){
    ongoingGraphicScene.pop();
    return true;
  }else{
    for (var i=0; i < ongoingGraphicScene.length; i++){
      if ( ongoingGraphicScene[i] === scene){
        ongoingGraphicScene[i] = -1;
        return true;
      }
    }
  }
}

/**************************
 Processing  sketch
***************************/
var groups; 
var tanks;
var displayAudience;
var displayQueues;
var queuesMessages = [];

// Simple way to attach js code to the canvas is by using a function
function sketchProc(processing) {
	var xPrev;
	var widthPrev;
	var yPrev;
	var heightPrev;
	var xStart;
	var yStart;
	var xEnd;
	var yEnd;
  var prevTankNumber = -1;

  refProcessing = processing; // Pour appeler setup depuis le listener

  function createTank(index, indexGroup){
  var scene = 0;

  if (patternGroups[index][8] !== undefined ){
     scene = patternGroups[index][8];
  }
  if (debug) console.log("createTank:", patternGroups[index][0]);
   groups[indexGroup] = new Tank(
    patternGroups[index][1], // index du tank
    patternGroups[index][5], // numéro du tank
    patternGroups[index][3], // x
    patternGroups[index][4], // y
    hex_to_RGB(patternGroups[index][6]), // color
    patternGroups[index][0], // name
    patternGroups[index][7], // Antécédents
    scene, // Scène graphique
    processing);
  }

   processing.setup = function() {
      // Création et remplissage du tableau des "groups" et des "tanks"
      groups  = new Array(patternGroups.length);
       
      var groupsCounter = 0; // index dans l'array groups des objets graphiques
      var sceneGroupe = 0;

      for (var i=0; i < patternGroups.length; i++) {
         if (patternGroups[i][2] == undefined) {
           alert("ERR: No score defined, choose a score in the controler.");
           noScore = true;
           return;
         }else{
            noScore = false;
            if (patternGroups[i][2] == "group") {
               if (debug1) console.log("This one is group", patternGroups[i], groupsCounter);
               if (patternGroups[i][8] !== undefined ){
                  sceneGroupe = patternGroups[i][8];
               }else{
                  sceneGroupe = 0;
               }
              
               groups[groupsCounter] = new Group( 
               patternGroups[i][1], // index du  groupe
               patternGroups[i][5], // nbe d'éléments
               patternGroups[i][3], // x
               patternGroups[i][4], // y
               hex_to_RGB(patternGroups[i][6]), //color
               patternGroups[i][0], //name
               patternGroups[i][7], // Antécédents
               sceneGroupe, // Scène graphique
               processing);
               groupsCounter++;
            }else if(patternGroups[i][2] == "tank"){
              if (debug) console.log("This one is the tank:", patternGroups[i][0]);
              if ( i > 0){
               // C'est ici que l'on gére les tanks de façon séquentielle
               // On regarde si le prédécesseur est dans le même tank.
               // Cela pose une contrainte sur le fichier de configuration graphique.
               // Il faut que des groupes dans un même tank se suivent.
                 if (groups[groupsCounter-1].isTank()){
         	        if (debug) console.log("Previous is the tank:", groups[groupsCounter-1].getName());
         	        if(groups[groupsCounter-1].getTankNumber() == patternGroups[i][5]) {
         		        if (debug) console.log("We are in the same tank number:", groups[groupsCounter-1].getTankNumber() );
         		        groups[groupsCounter-1].incrementSignalCount(increaseTank);

         		      }else{
         		        if (debug) console.log("We are not in the same tank:", groups[groupsCounter-1].getTankNumber());
                   // !! i dans createTank ??
         		        createTank(i, groupsCounter);
         		        groupsCounter++;
         		      }
         	      }else{
         		      if (debug) console.log("Previous is not a tank, create the tank");
         		      createTank(i, groupsCounter);
         		      groupsCounter++;
         	      }
               }else{
         	      if (debug) console.log("we are the first of tanks and groups ")
         	      createTank(i, groupsCounter);
         		    groupsCounter++;
               }
            }else{
             // Ni group, ni tank, donc on n'affichera pas dans score
             if (debug) console.log("Not a group or a tank ");
            }
         }
      }
      console.log("Groups:", groups);
      processing.size(screenX,screenY);
     	processing.stroke(126);
     	processing.strokeWeight(3); 

     	displayAudience = new infoAudience(processing);
      displayQueues = new infoQueues(processing);
   }

   // Façon d'utiliser la souris
   /*processing.mouseMoved = function () {
       	console.log("mouse moved:", processing.mouseX, processing.mouseY);
       	processing.ellipse(processing.mouseX, processing.mouseY, 50,50);
       	 if(processing.mouseIsPressed) {
   	    	console.log("mouse pressed:", processing.mouseX, processing.mouseY);
   	    	processing.ellipse(processing.mouseX, processing.mouseY, 100,100);
   	    }
    }
   */
  processing.draw = function() {
    // erase background
    processing.background(224);
    if (noScore) return;

 	  //displayAudience.display();
    displayQueues.display();

    // Display groups et tanks
    for (var i=0; i < groups.length; i++) {
       // Quand il ya des tanks, le nombre de groupes sera < au tableau  patternGroups
       if (groups[i] == undefined) {
    	  break;
    	}
    	if (groups[i].isActive() || displayNonActiveGroups){ // On n'affiche que les groupes actifs
    	  // On épaissit les bords en fonction du nombre d'activation
        if (!groups[i].isTank()) processing.strokeWeight(groups[i].counterOfSounds);
        if( isInOngoingGraphicScene(groups[i].getGraphicScene())){
          groups[i].display();
        }
        processing.strokeWeight(3);
      }

   	  // Affichage des liens
      // Repérage des antécédents (prev)
   		var IndexPrev = groups[i].getPrevious();
 	    if (IndexPrev.length > 0 ){
 	      for (var j=0; j < IndexPrev.length; j++ ) {
 	    	// On ne relie que des groupes actifs
    	    if(groups[ IndexPrev[j] ].isActive() && groups[i].isActive() || displayNonActiveGroups){

    		    // On ne relie que si la scène graphique est != 0
      			if(isInOngoingGraphicScene(groups[ IndexPrev[j] ].getGraphicScene()) &&
      			 	isInOngoingGraphicScene(groups[i].getGraphicScene())) {
      		  	// coordonnées en (xPrev + widthPrev, Yprev + heightPrev/2)
        			xPrev = groups[ IndexPrev[j] ].getX();
        			widthPrev = groups[ IndexPrev[j] ].getWidth();
        			xStart = xPrev + widthPrev;
      				yPrev = groups[ IndexPrev[j] ].getY();
      				heightPrev = groups[ IndexPrev[j] ].getHeight();
      				yStart = yPrev + heightPrev/2;

      				xEnd = groups[i].getX();
      				yEnd = groups[i].getY() + groups[i].getHeight()/2;
        			processing.noFill();
        			// Triangle en fin de courbe
        			processing.triangle( xEnd-10, yEnd-5, xEnd-10, yEnd+5, xEnd, yEnd);
        			xEnd -= 10;
        			processing.bezier(xStart,yStart, xStart+courbure, yStart, xEnd-courbure,yEnd,  xEnd,yEnd);
      	    }
    	    }
        }
      }
    }
    // Message qui prend le dessus sur le score
    if (alertInfoMessage !== undefined){
       alertInfoMessage.display();
    }
  }
}

/****************************
 Main
****************************/
var canvas;
// Il faut initialiser le canvas une seule fois
// donc la première fois que l'on charge un fichier de config.
function start() {
  if(canvas === undefined){ 
    canvas = document.getElementById("canvas1");
    // attaching the sketchProc function to the canvas
    var p = new Processing(canvas, sketchProc);
  }
}
exports.start = start;

/*********************************************************************************
 Communication listeners

**********************************************************************************/

// Fonctions uniquement utilisées par les listeners *************************************

function isTank(nomDeGroupe){
  var isTank = false;
  for(var i=0; i < patternGroups.length; i++){
      if( patternGroups[i][0] == nomDeGroupe) {
      	if ( patternGroups[i][2] == "tank"){
        	  isTank = true ;
        	}
         break;
      }
   }
 	if (debug) console.log("isTank ?:", isTank);
	return isTank;
}

function isTankFromNumOfGroup(numOfGroup){
  var isTank = false;
  for(var i=0; i < patternGroups.length; i++){
      if( patternGroups[i][1] == numOfGroup) {
   		if ( patternGroups[i][2] == "tank"){
       		 isTank = true ;
       	}
        break;
     }
   }
	return isTank;
}

function  getGroupNumber(nomDeGroupe){
	var groupeDeSons;
	if (debug) console.log("Groupe pour groupname:", nomDeGroupe);
	for(var i=0; i < groups.length; i++){
      if(groups[i].getName() == nomDeGroupe) {
         groupeDeSons = i ;
         break;
      }
   }
   return groupeDeSons;
}

function  getNumberInGroupsFromNumberInConf(numOfGroup){
	var groupeDeSons;
	if (debug) console.log("getNumberInGroupsFromNumberInConf:", numOfGroup);
	for(var i=0; i < groups.length; i++){
      if (debug) console.log("getNumberInGroupsFromNumberInConf:groups[i]:", groups[i] );
      if(groups[i].getIndex() == numOfGroup) {
         groupeDeSons = i ;
         break;
      }
   }
   return groupeDeSons;
}

function  getTankNumberFromGroupName(nomDeGroupe) {
	var tankNumber;
   for(var i=0; i < patternGroups.length; i++){
    	if( patternGroups[i][0] == nomDeGroupe) {
	     	tankNumber =  patternGroups[i][5];
         if (debug) console.log("Tank number pour groupname:", nomDeGroupe, patternGroups[i], tankNumber );
         break;
	   }
	}
	return tankNumber;
}

function  getTankNumberFromNumberInConf(numInConf) {
	var tankNumber;
   for(var i=0; i < patternGroups.length; i++){
    	if( patternGroups[i][1] == numInConf) {
	     	tankNumber =  patternGroups[i][5];
         if (debug) console.log("getTankNumberFromNumberInConf:", patternGroups[i], tankNumber );
         break;
	   }
	}
	return tankNumber;
}

function getGroupOfSoundsFromTankNumber(tankNumber){
	var groupeDeSons = -1;
	for(var i=0; i < groups.length; i++){
		if (groups[i].isTank() ){
         if(groups[i].getTankNumber() == tankNumber) {
   	     	if (debug) console.log("getGroupOfSoundsFromTankNumber:", groupeDeSons, tankNumber );
   	      groupeDeSons = i ;
   	     	break;
         }
		}
	}
	return groupeDeSons;
}

/* Les listeners ****************************************************************************

/* Info sur les sons qui sont demandés, ce n'est pas très utile pour le suivi de la partition */
server.addEventListener('demandeDeSonParPseudo', function( event ) {
  if (debug) console.log("Reçu Texte Broadcast demande de son par pseudo:", event.value );
}); 

/* Action sur sur les sons qui sont joués */
server.addEventListener('infoPlayAbleton', function( event ) {
  var groupeDeSons;
  if (debug) console.log("Reçu Texte Broadcast infoPlayAbleton:", event.value );

  displayAudience.setText(event.value[5] + " - " + event.value[7]);
  // Event.value = bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal
  // Celle-là elle ne s'invente pas, récupération du nom du groupe dans le signal
  var groupName = Object.keys(event.value[8])[0].slice(0, -2);
  var tankNumber;

  if ( patternGroups !== undefined) {
		if (!isTank(groupName)) {
    	// S'il s'agit d'un "group" recherche du groupe de son pour le signal donné
      // dans le tableau des groups et tanks consécutifs
      var groupRunning = groups[getGroupNumber(groupName)];
      if (groupRunning.isActive()){
        groupRunning.setMessage(event.value[5], event.value[7]);
     	  groupRunning.increment();
      }
	  } else {
   	// S'il s'agit d'un "tank"
   	  var tankNumber = getTankNumberFromGroupName(groupName);
   	  var desSons = getGroupOfSoundsFromTankNumber(tankNumber);
   	  if (desSons < 0 ) console.log("ERR: addEventListener: infoPlayAbleton: getGroupOfSoundsFromTankNumber ");
   	  groups[desSons].setMessage(event.value[5], event.value[7]);
	    groups[desSons].decrement();
    }
	}
});

server.addEventListener('etatDeLaFileAttente', function( event ) {
  queuesMessages = [];
  for (var i = 0; i < event.value.length ; i++ ) {
    // event.value[i][2] = array d'array [[pseudo, nom du pattern], [...], ...]
    queuesMessages[i] = event.value[i];
    console.log("etatDeLaFileAttente:", i, "--", event.value[i][2]);
  }
});

/* Réception des groupes de patterns */
server.addEventListener('setPatternGroups', function( event ) {
  if ( event.value !== undefined ) {
    patternGroups = event.value ;
    noScore = false;
    start();
    if (refProcessing !== undefined){
      refProcessing.setup();
    }
  }
});

 /* Ajout d'une scène graphique */
server.addEventListener('addSceneScore', function( event ) {
  if (debug1) console.log("Reçu addScenceScore:", event.value );
  addSceneScore(event.value);
  //if ( refProcessing != undefined){
  //  refProcessing.setup();
  //}
});


 /* Enlève une scène graphique */
server.addEventListener('removeSceneScore', function( event ) {
  if (debug1) console.log("Reçu removeSceneScore:", event.value );
  removeSceneScore(event.value);
  //if ( refProcessing != undefined){
  //  refProcessing.setup();
  //}
});

 /* Remise à l'état d'origine des éléments */
server.addEventListener('refreshSceneScore', function( event ) {
  if (debug1) console.log("Reçu refreshSceneScore:", event.value );
  if ( refProcessing !== undefined && patternGroups !== undefined ){
    refProcessing.setup();
  }
});

//  Pour désactiver un réservoir quand il est aborté dans la pièce.
server.addEventListener('killTank', function( event ) {
	var tankNumber = getTankNumberFromGroupName( event.value );
  var desSons = getGroupOfSoundsFromTankNumber(tankNumber);
  if (debug1) console.log("KILL TANK:", event.value, tankNumber, desSons );
  groups[desSons].deactivate();
});

//  Pour désactiver un réservoir quand il est aborté dans la pièce.
server.addEventListener('startTank', function( event ) {
  var tankNumber = getTankNumberFromGroupName( event.value );
  var desSons = getGroupOfSoundsFromTankNumber(tankNumber);
  if (debug1) console.log("START TANK:", event.value, tankNumber, desSons );
  groups[desSons].reactivate();
});

//  Pour activer un affichage d'info
server.addEventListener('alertInfoScoreON', function( event ) {
  alertInfoMessage = new alertInfo(refProcessing, event.value);
});

//  Pour désactiver un affichage d'info
server.addEventListener('alertInfoScoreOFF', function( event ) {
  alertInfoMessage = undefined;
});

/* Info sur changement de la matrice des possibles */
/* Ici on sait seulement si un groupe est activé ou désactivé.
Il n'y a pas de notion de réservoir dans le protocole.
Un réservoir est un ensemble de groupes ayant chacun un seul son.
Il n'y a donc pas de notion d'activation ou désactivation de réservoir. 

Dans le cas d'un réservoir ce listener donne une information que
l'on a déjà reçue dans infoPlayAbleton car pour un réservoir un son joué implique
une modification de la matrice des possibles.
*/
server.addEventListener('setInMatriceDesPossibles', function( event ) {
	var groupsNumber;
	 if (debug) console.log("Reçu setInMatriceDesPossibles:", event.value ); 
	 //  [0] = groupe de clients, [1] = index du groupe de son dans le tableau du fichier de conf, [2] = true ot false
	 if ( isTankFromNumOfGroup(event.value[1])){
		 var tankNumber = getTankNumberFromNumberInConf(event.value[1]);
		 groupsNumber = getGroupOfSoundsFromTankNumber(tankNumber);
		 if (groupsNumber < 0 ) console.log("ERR: addEventListener: setInMatriceDesPossibles: getGroupOfSoundsFromTankNumber ");
	 }else{
	 	 groupsNumber =  getNumberInGroupsFromNumberInConf(event.value[1]);
	 }
	 if (event.value[2]) { // On or Off
	    groups[groupsNumber].activate();
	 }else{
     if( groups[groupsNumber] !== undefined){
  	   if (!groups[groupsNumber].isTank()){
  	   	groups[groupsNumber].deactivate();
  	   }
     }
	 }
});