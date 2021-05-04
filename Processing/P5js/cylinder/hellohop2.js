"use hopscript"
/*
 Pour que le require soit possible sur le client
 il faut dÃ©clarer le srcript de la faÃ§on suivante dans le header:
 <script src="./example1.js" lang="hiphop"/>
*/
service hello() {
return <html>
  <head>
     <script src=${require.resolve( "./processing.min.js" )}/>
     <script src="./example1.js" lang="hiphop"/>
  </head>
  <body><h1>Processing.js</h1>
    <h2>Simple processing.js JavaScript</h2>
    <p>Clock</p>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    ~{  // Il faut  appeler example1 aprÃ¨s avoir crÃ©er le canvas car il l'utilise
    		require("./example1.js", "hiphop" );
	   }
  </body>
</html>
}
