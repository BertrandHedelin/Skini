service hello() {
 return <html><head>
     <title>Hello Web - Processing.js Test</title>
     <script src=${require.resolve( "./processing.min.js" )}></script>

   ~{  // Client side context
          window.onload = function() {
          //var exemple = require('./example1.js');
          //var exemple = ${require.resolve("./example1.js")};
          // require(exemple);
          //console.log(exemple);
          }
     }
</head>
<body>
<script>
function sketchProc(processing) {
  // Override draw function, by default it will be called 60 times per second
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
  };
  
}

  var canvas = document.getElementById("canvas1");
  // attaching the sketchProc function to the canvas
  var p = new Processing(canvas, sketchProc);
</script>

     <h1>Processing.js TEST</h1>
     <p>This is my 2nd Processing.js web-based sketch:</p>
     <p><canvas id="canvas1" width="200" height="200"></canvas></p>
</body>
</html>
}

//<canvas data-processing-sources=${require.resolve( "./cylinder.pde")}></canvas>