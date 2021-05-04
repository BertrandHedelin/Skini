"use hopscript"
require.lang = "hopscript";

service hello() {
  return <html><head>
        <script src="./test.js" lang="hiphop"/>
        <meta charset="UTF-8" name="viewport" content="width=device-width, height=device-height, shrink-to-fit=yes, intial-scale=1" />
             ~{  // Client side context
             	var test = require('./test.js', "hiphop");
             	test.titi();
             	 }
    </head>
    <body>
    	Test require
    </body>
   </html>
};