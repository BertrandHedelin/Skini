
"use hopscript"
require.lang = "hopscript";

/******************************************

 Controle par le public sous forme de jeu

© Copyright 2017-2021, B. Petit-Heidelein

**********************************************/
const path = require("path");
var par = require('../../serveur/logosParametres');

service getSoundFileMemorySortable(path) {
  return hop.HTTPResponseFile( path, { contentType: "audio/mpeg" } );
}

service getImageFileMemorySortable(path) {
  return hop.HTTPResponseFile( require.resolve(path), { contentType: "image/png" } );
}

service memorySortable(pseudo) {
  return <!DOCTYPE html>
    <html>
    <head>
        <link href=${memorySortable.resource("./bootstrap/css/bootstrap.css")} rel="stylesheet">
        <link href=${memorySortable.resource("./bootstrap/css/styleMemory.css")} rel="stylesheet">
        <script src=${memorySortable.resource("./Sortable-master/Sortable.min.js")}></script>
        <link href=${memorySortable.resource("./sortable-theme-bootstrap.css")} rel="stylesheet">
        <script src="hiphop" lang="hopscript"/>
        <script src="./clientMemorySortable.js" lang="hiphop"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta charset="UTF-8" name="viewport" content="width=device-width, height=device-height, shrink-to-fit=yes, intial-scale=1" />
        <title>Skini</title>
    </head>

    ~{
        var cg;
        var getSoundFileMemory = ${getSoundFileMemorySortable}; // Pour associer la fonction à celle du serveur
        window.onload = function() {
          cg = require('./clientMemorySortable.js', "hiphop");
          cg.init(${hop.port}, ${par}, ${pseudo});
          if (${pseudo} !== undefined){
            $(function(){ cg.initialisation();});
          }
        }
      }

    <body>
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">Démo Skini</a>
            <a class="navbar-text" id="monGroupe" >groupe</a>
          </div>

          <!-- EXEMPLE DE MENU DANS UNE BARRE, PAS UTILE POUR LE MOMENT
          <ul class="nav navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">Info</a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">Skini est une plateforme de musique interactive où vous êtes l'acteur</a>
                  <a class="dropdown-item" href="#">Comment ça marche ?</a>
                </div>
            </li>
            <li class="nav-item"><a class="nav-link " href="#">Articles</a></li>
            <li class="nav-item"><a class="nav-link " href="#">Contact</a></li>
          </ul>
          -->

        </div>
      </nav>

      <div class="container">

        <!-- LE LOGIN -->
        <div class="row">
          <div class="col-xs-6">
              <input type="text" id="monPseudo" name="textePseudo" placeholder="Pseudo" >
              <button class="button buttonPseudo" id="leBoutonPseudo" onclick=~{cg.initialisation();}>OK</button>
           </div>
        </div>

        <!-- MESSAGE ALERT BOOTSTRAP -->
        <div class="alert alert-success alert-dismissible fade show" role="alert" id="messageAlert" style="display:none">
           <h5 class="alert-heading">Alert</h5>
        </div>

        <!-- LA CONNEXION -->
        <p style="color:white" id="pseudo"></p> 
        <div class="info-spectateur"> <span id="MessageDuServeur"> Bonjour, donnez votre pseudo</span></div>

        <!-- LES PATTERNS RECUS -->
        <div class="row">
          <div class="col-xs-6">
            <br class="breakAccueil" style="display:none">
            <em id="labelSons" color="white" style="display:none">Sons disponibles</em>
            <div class="wrapButtons" id="listButton" style="display:none" >
              <div id="listBoutonsSons" class="list-group col"></div>
            </div>
          </div>
        </div>

        <!-- LES PATTERNS CHOISIS -->
        <div class="row">
          <div class="col-xs-6">
            <div class="wrapButtonsChoice" id="listButtonChoice" style="display:none" >
              <div id="patternsChoice" class="list-group col"></div>
            </div>
          </div>
        </div>

        <!-- LA POUBELLE -->
        <div class="row">
          <div class="col-xs-6">
            <div id="poubelle" class="list-group col">
              <em id="labelPoubelle" color="white"  style="display:none">
                <img src=${getImageFileMemorySortable("./images/poubelle.png").toString()}/>
              </em>
            </div>
          </div>
        </div>

        <!-- LES BOUTONS DE COMMANDE -->
        <div class="row">
            <div class="col-xs-6">
              <div class= "boutonsCommande">
                <button  id="buttonEcouter" class="button buttonListen" style="display:none" onclick=~{cg.startListenClip();}>
                  <img src=${getImageFileMemorySortable("./images/start.png").toString()}/>
                </button>
                <button  id="buttonStop" class="button buttonStop" style="display:none" onclick=~{cg.stopListenClip(); }>
                  <img src=${getImageFileMemorySortable("./images/stop.png").toString()}/>
                </button>
                <button  id="buttonStart" class="button buttonSubmit" style="display:none" onclick=~{cg.sendPatternSequence();}>
                  <img src=${getImageFileMemorySortable("./images/submit.png").toString()}/>
                </button>
              </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-6">
            <div class="sonChoisi"> <span id="sonChoisi" style="display:none" ></span></div>
          </div>
        </div>

        <!-- LES PROGRESS BARS -->
        <div class="row">
          <div class="col-xs-6">
            <br class="breakAccueil" style="display:none">
            <div class="wrapper" id="lesProgressBars" style="display:none">
              <div class="progress-bar progress-bar-striped" id="progressbar1" role="progressbar"
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
              <div class="progress-bar progress-bar-striped" id="progressbar2" role="progressbar"
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
              <div class="progress-bar progress-bar-striped" id="progressbar3" role="progressbar"
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
              <div class="progress-bar progress-bar-striped" id="progressbar4" role="progressbar"
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
              <div class="progress-bar progress-bar-striped" id="progressbar5" role="progressbar"
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
            </div>

            <!-- DES MESSAGES BROADCAST ET DEMANDE DE PATTERN -->
            <div class="text-spectacle"> <span id="Broadcast"> </span></div>
            <div class="text-spectacle"> <span id="demandeDeSons"></span></div>
          </div>
        </div>

      </div>
      <script src=${memorySortable.resource("./bootstrap/js/jquery.js")}></script>
      <script src=${memorySortable.resource("./bootstrap/js/bootstrap.bundle.min.js")}></script>
    </body>
   </html>
};

memorySortable.addURL("/");
memorySortable.addURL("/skini"); // nécessaire dans dans hoprc.js
memorySortable.addURL("/memorySortable");

service memorySortablePing() {
   return true;
}
memorySortable.addURL("/memorySortablePing");
