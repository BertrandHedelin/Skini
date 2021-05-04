"use hopscript"

service hello() {
return <html><head>
     <script src=${require.resolve( "./p5.min.js" )}></script>
  </head>
  <body><h1>Processing.js</h1>
    <h2>Simple processing.js JavaScript</h2>
    <p>Clock</p>
    <p><canvas id="canvas1" width="200" height="200"></canvas></p>
    <script src=${require.resolve( "./example4.js" )} ></script>
  </body>
</html>
}
