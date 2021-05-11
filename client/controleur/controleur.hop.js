
/************************

Controle de la matrice des possibles
entre groupe de sons et groupe de clients
7/3/2018

© Copyright 2017-2021, B. Petit-Heidelein

**************************/
"use hopscript"
"use strict"

const path =  require("path");
var par =     require('../../serveur/logosParametres');

service controleur() {
  return <html><head css=${controleur.resource("./stylecontroleur.css")}>
      <meta charset="UTF-8" name="viewport" />
      <script src="hiphop" lang="hopscript"/>
      <script src='./clientcontroleur.js' lang='hopscript'/>
      <script src='../../serveur/logosParametres' lang='hopscript'/>
      <script defer>
        var clientControleur = require('./clientcontroleur.js');
        window.onload = function() {
            clientControleur.init(${hop.port}, ${par});
        };
      </script>
    </head>
    
    <body>
      <div class="wrapper"> 
      <div id="listBoutonsLiens" class="listBoutonsPad" style="display:none"></div>
      </div>
      <div class="boutonsCommande">
      <button  id="buttonAll" class="button"    onclick=~{clientControleur.setAllPad(); }>ALL</button>
      <button  id="buttonReset" class="button"  onclick=~{clientControleur.resetAllPad();}>RESET</button>
      <button  id="buttonReset" class="button"  onclick=~{clientControleur.cleanQueues();}>CLEAN</button>

      <button  id="buttonLoadAbleton1" class="button" onclick=~{clientControleur.loadAbleton(1);}>ORCH1</button>
      <button  id="buttonLoadAbleton2" class="button" onclick=~{clientControleur.loadAbleton(2);}>ORCH2</button>
      <button  id="buttonLoadAbleton3" class="button" onclick=~{clientControleur.loadAbleton(3);}>ORCH3</button>

      <!--
      <button  id="buttonStartAbleton" class="button buttonStartAbleton"  onclick=~{clientControleur.startAbleton();}>START</button>
      <button  id="buttonStopAbleton" class="button buttonStopAbleton" style="display:none" onclick=~{clientControleur.stopAbleton();}>STOP</button>
       -->
      <button  id="buttonStopAutomate" class="button buttonStopAutomate" style="display:none" onclick=~{clientControleur.stopAutomate();}>AUT OFF</button>
      <button  id="buttonStartAutomate" class="button buttonStartAutomate"  onclick=~{clientControleur.startAutomate();}>AUT ON</button>
      <button  id="buttonResetSequenceur" class="button button1"  onclick=~{clientControleur.resetSequenceur();}>RAZ SEQ</button>
      <button  id="buttonSaveSession" class="buttonLarge"  onclick=~{clientControleur.saveSession();}>SAVE SESSION</button>
      <button  id="buttonLoadSession" class="buttonLarge"  onclick=~{clientControleur.loadSession();}>LOAD SESSION</button>
      <button  id="buttonLoadSession" class="button"  onclick=~{clientControleur.checkSession();}>CHECK</button>
      </div>
      
      <div class="info-spectateur">
      <em class="info-spectateur">Groupes:</em>
      <span id="tailleDesGroupes"></span>
      </div>
      
      <div class="info-spectateur">
      <em class="info-spectateur">Scrutateurs:</em>
      <span id="propositionScrutateur"></span>
      </div>

      <div class="info-spectateur">
      <em class="info-spectateur">FIFO:</em>
      <span id="FileAttente"></span>
      </div>
      <div class="info-spectateur"><span id="MessageDuServeur"></span></div>

    </body>

   </html>
};

controleur.addURL("/controleur");                                  

service controleurPing() {
  return true;
}
controleurPing.addURL("/controleurPing");