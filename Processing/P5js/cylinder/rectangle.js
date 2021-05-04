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