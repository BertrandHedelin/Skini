/**************************************************

Editeur Skini en ligne avec Blockly

© Copyright 2017-2021, Bertrand Petit-Hédelin

****************************************************/

"use hiphop"
"use hopscript"

require.lang = "hopscript";
require("./scripts/surLeServeurSkini.js", "hiphop");

// Services dans d'autres fichiers, il faut aussi les déclarer ici
service printServeurFromBlockly();
service getFileBlockly();
service saveBlocksServer();
service generateHHcode();

//console.log( "For Blockly, gGo to \"http://localhost:%d/hop/block\"", hop.port );

service block() {
    return <html>
    <head>
    	<link rel="stylesheet" href=${require.resolve("./styles/index.css")}>
    	<script src="hiphop" lang="hopscript"/>
    	// Déclarations nécessaires pour faire les requires sur le client.
    	<script src="./scripts/hiphop_blocks.js" lang="hiphop"/>
    	<script src="./scripts/main2.js" lang="hiphop"/>
        <meta charset="UTF-8" name="viewport" />
  		<meta http-equiv="X-UA-Compatible" content="IE=edge">
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Blockly and Hop.js</title>
    </head>
    ~{
    	var mainProg;
        window.onload = function() {
        	// Require correspondant aux déclarations ci-dessus
        	require('./scripts/hiphop_blocks.js', "hiphop");
        	mainProg = require('./scripts/main2.js');
        	var printServeur = ${printServeurFromBlockly};
        	console.log("mainprog");
        	printServeur("-- Blockly for Skini started --").post();
        	mainProg.init();
        }
    }
	<body>
		<table>
			<thead>
				<tr>
					<td>
					  <header class="mdl-color--cyan-500">
					    <h1 class="mode-maker">Orchestration Skini</h1>
					    <div id="menubar">
					    	<!--
							<button class="small button" id="buttonGenerate" onclick=~{mainProg.save();} >Generate HipHop</button>
							-->
	   						<label for="loadFile" class="small button">Select Blockly File</label>
    						<input type="file" id="loadFile" onchange=~{mainProg.loadBlocks();} />

							<button class="small button" id="buttonSave" onclick=~{mainProg.saveBlocksAndGenerateHH();} >Save Blocks</button>
							<input class="inputText" type="text" id="saveFile" />
							<input class="inputText" type="text" id="consoleArea" />
				        </div>
					  </header>
					</td>
				</tr>
			</thead>
			<tbody>	
				<tr>
					<td id="blocklyArea"></td>
				</tr>
			</tbody>
		</table>

		<div id="blocklyDiv" style="position: absolute"></div>
	  	<script src=${block.resource("./blockly/blockly.min.js")}></script>
		<script src=${block.resource("./blockly/javascript_compressed.js")}></script>
	</body>
   	</html>
};
exports.block = block;

