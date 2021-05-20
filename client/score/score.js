/**************************************
  SKINI

  © Copyright 2019, B. Petit-Heidelein

***************************************/
"use hopscript"
"use strict"
/*
 Pour que le require soit possible sur le client
 il faut déclarer le srcript de la façon suivante dans le header:
 <script src="./example1.js" lang="hiphop"/>
*/
var par = require('../../../serveur/logosParametres');
var partition;

service score() {
return <html><head>
     <script src=${require.resolve( "./processing.min.js" )}/>
     <script src="./parto1.js" lang="hopscript"/>
     <meta charset="UTF-8">
  </head>
  <body>
    <h1>Score</h1>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    ~{  // Il faut  appeler P5js après avoir créer le canvas car il l'utilise
    		partition = require("./parto1.js", "hopscript" );
	   }
  </body>
</html>
}

score.addURL("/score");

