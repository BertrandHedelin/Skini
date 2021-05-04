"use hopscript"
/*
 Pour que le require soit possible sur le client
 il faut déclarer le srcript de la façon suivante dans le header:
 <script src="./example1.js" lang="hiphop"/>
*/
service hello() {
return <html>
<head>
     <script src=${require.resolve( "./processing.min.js" )}/>
     <script src="./example2.js" lang="hopscript"/>
  </head>
  <body><h1>Processing.js</h1>
    <h2>Simple processing.js 2 JavaScript</h2>
    <p>Clock</p>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    ~{  // Il faut  appeler example1 après avoir créer le canvas car il l'utilise
        //require("./rectangle.js", "hopscript" );
    		require("./example2.js", "hopscript" );
	   }
  </body>
</html>
}
