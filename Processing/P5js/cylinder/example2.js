"use hopscript"
"use strict"

class Rectangle {
  constructor(x,y,height,width, color, processing){
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.color = color;
      this.processing = processing;

      console.log(this.x, this.y, this.width, this.height,this.radius);
  }

  display() {
    this.processing.fill(this.color[0], this.color[1], this.color[2]);
    this.processing.rect(this.x, this.y, this.width, this.height,this.radius);
  }
}

// Assignation d'une proprité à une classe
Rectangle.prototype.radius = 10;

class Tank extends Rectangle {
  constructor(signalList, x, y, processing){
     var width = 100;
     var height = 80;
      super(x, y, width, height,[203,120,132],processing); // super à placer avant les références à this
      this.signalList = signalList;
      this.x = x;
      this.y = y;
      this.processing = processing;
  }

  // Appelable dans la classe, mais pas par une instance
  // fonction générique (local) à une classe et pas accessible en dehors.
  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }
}

// Simple way to attach js code to the canvas is by using a function
function sketchProc(processing) {
    var rectangle1;
    var tank1;

  // Override draw function, by default it will be called 60 times per second
  processing.setup = function() {
    rectangle1 = new Rectangle(20, 30, 30, 40, [203,60,132], processing);
    var signals = ['S1','S2','S3'];
    tank1 = new Tank(signals, 50, 60, processing );
    processing.size(500,600);
  }

  processing.draw = function() {
    // determine center and max clock arm length
    var centerX = processing.width / 2, centerY = processing.height / 2;
    var maxArmLength = Math.min(centerX, centerY);

    function drawArm(position, lengthScale, weight) {      
      processing.strokeWeight(weight);
      processing.line(centerX, centerY, 
        centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
        centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
    }

    // erase background
    processing.background(224);

    var now = new Date();

    // Moving hours arm by small increments
    var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
    drawArm(hoursPosition, 0.5, 5);

    // Moving minutes arm by small increments
    var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
    drawArm(minutesPosition, 0.80, 3);

    // Moving hour arm by second increments
    var secondsPosition = now.getSeconds() / 60;
    drawArm(secondsPosition, 0.90, 1);

   rectangle1.display();
   tank1.display(); // C'est le display de Rectangle
 };
}

// Main
var canvas = document.getElementById("canvas1");
// attaching the sketchProc function to the canvas
var p = new Processing(canvas, sketchProc);

