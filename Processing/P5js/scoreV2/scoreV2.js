"use hopscript"
"use strict"

var par = require('../../../serveur/logosParametres');
var partition;

service score() {
return <html><head>
     <script src=${require.resolve( "./p5.min.js" )}/>
     <script src="./parto2.js" lang="hopscript"/>
     <meta charset="UTF-8">
  </head>
  <body>
    <h1>ScoreV2</h1>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    ~{  // Il faut  appeler P5js après avoir créer le canvas car il l'utilise
        partition = require("./parto2.js", "hopscript" );
        //partition.setParameters(${par});
        window.onload = partition.start;
     }
  </body>
</html>
}
