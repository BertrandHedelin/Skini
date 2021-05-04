
const path = require("path");

service hello() {
 return <html><head>
  <script src="processing.min.js"/>
   </head>
  <body><h1>Processing.js TEST</h1>
  <p>This is my first Processing.js web-based:</p>
   <canvas data-processing-sources="./hello.pde"></canvas>
   </body>
 </html>;
}