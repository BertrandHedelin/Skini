"use hopscript"

service hello() {
return <html><head>
     <script src=${require.resolve( "./processing.min.js" )}></script>
  </head>
  <body><h1>Processing.js</h1>
    <h2>Simple processing.js JavaScript</h2>
    <p>Clock</p>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    <script src=${require.resolve( "./example1.js" )} ></script>
  </body>
</html>
}

//<script src="./example1.js" lang="hopscript"/>
//<script src=${require.resolve( "./example1.js" )} ></script>