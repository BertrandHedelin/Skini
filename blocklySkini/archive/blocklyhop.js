"use hiphop"
"use hopscript"

require.lang = "hopscript";
require("./scripts/surLeServeur.js", "hiphop");


// Services dans d'autres fichiers, il faut aussi les déclarer ici
service printServeur();
//service executeHHServeur();

console.log( "Go to \"http://localhost:%d/hop/block\"", hop.port );

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
        	var printServeur = ${printServeur};
        	console.log("mainprog");
        	printServeur("declaration").post();
        	mainProg.init();
        }
    }
	<body>
		<table>
			<tbody>
				<tr>
					<td>
					  <header class="mdl-color--cyan-500">
					    <h1 class="mode-maker">HipHop Orchestration</h1>
					    <div id="menubar">
							<button class="small button" id="buttonGenerate" onclick=~{mainProg.save();} >Generate HipHop</button>

			          		<button class="small button" id="runButton" onclick=~{mainProg.runHH();} >Run HipHop</button>
							<input class="inputText" type="text" id="signalsHH" style="max-width:400px" />

    						<label for="loadFile" class="small button">Select File</label>
    						<input type="file" id="loadFile" onchange=~{mainProg.loadBlocks();} />

							<button class="small button" id="buttonSave" onclick=~{mainProg.saveBlocks();} >Save Blocks</button>
							<input class="inputText" type="text" id="saveFile" style="max-width:400px" />
				        </div>
					  </header>
					</td>
				</tr>
				<tr>
					<td id="blocklyArea">
					</td>
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

