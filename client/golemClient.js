/********************************

	VERSION NODE JS : 28 Fev 2018

*********************************/

var $=require('jquery');
$('#test').text('browserify working');

var port;
var ws;
var treeButtons;
var currentButtons;
var positionBouton = [];
var arbre;

var par = require('../serveur/logosParametres');

var id = Math.floor((Math.random() * 1000000) + 1 ); // Pour identifier le client
var listenMachine;
var buttonMachine;
var src = -1;
var abletonON = 1;
var demandeDeSons = ' '; 
var pseudo;
var debug = true;
var listClips; // Devient une array avec toutes les infos sur les clips selectionnes
var indexChoisi =-1;
var nombreSonsPossible = 3;

var bleu 	= "#008CBA";
var rouge 	= '#CF1919';
var vert 	= "#4CAF50";
var marron 	= '#666633';
var violet 	= '#797bbf';
var orange 	= '#b3712d';

var msg = { // On met des valeurs pas defaut
			type: "configuration",
			text: "ECRAN_NOIR" ,
			pseudo: "Anonyme",
			value: 0,
};

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

function vibration(duree) {
	if (navigator.vibrate == undefined ) return;
	if ('vibrate' in navigator) {
		navigator.vibrate(duree);
	}
}

var audioInit = new Audio("../sounds/FM8-6.mp3");

function initialisation() {
	audioInit.play();

	// Pour la gestion de la reconnexion si le serveur est tombé et relancé.
	// Si on n'a pas de pseudo en local on suit la procédure de demande d'un pseudo
	// Si on a déjà un pseudo on ne demande rien .
	// La gestion du status du client est dangereuse car c'est document.getElementById("monPseudo").value;
	// qui donne l'état. Ce sera à revoir.

	console.log("PSEUDO clientGolem.js:", pseudo);
	if (pseudo === undefined) { // Cas de la première fois que l'on appelle le service golem(pseudo)
		var x = document.getElementById("monPseudo").value;
		if ( x === "" || x === "Votre prénom" ) { // Cas du OK sans saisie
			document.getElementById("MessageDuServeur").textContent = "Vous n'avez pas donné votre prénom !! ";
			return;
		} else {
			pseudo = x;
		}
	}
    msg.pseudo = pseudo;

	// Attention: si on envoie un message ici sur la websocket immédiatament après la reconnexion.
	// Il se peut que la socket ne soit pas encore prête. Il y a des choses à faire avec readyState.

    // On a passé l'étape du pseudo, on peut enlever la partie HTML du pseudo inutile à présent
    document.getElementById( "monPseudo" ).style.display = "none";
    document.getElementById( "leBoutonPseudo" ).style.display = "none";

	var el = document.getElementById( "buttonType1" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; }
	el = document.getElementById( "buttonType2" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; }
	el = document.getElementById( "buttonType3" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; } 

	el = document.getElementById( "labelSons" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; } 

	el = document.getElementById( "sonChoisi" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; } 

	el = document.getElementById( "buttonEcouter" );
	if (abletonON) { 
			el.style.display = "inline"; 
			//audioInit.play();
			vibration([2000,30,2000]);
	} else { 
			//listenMachine.inputAndReact("stop"); 
			el.style.display = "none";
	} 
	el = document.getElementById( "buttonStart" );
	if (abletonON) { el.style.display = "inline"; } else { el.style.display = "none"; } 
	
	if (abletonON) document.getElementById("MessageDuServeur").textContent = "";
	else document.getElementById("MessageDuServeur").textContent = pseudo;

	var elements = document.getElementsByClassName("breakAccueil");
	for ( var i=0; i< elements.length; i++) {
		if (abletonON) { 
			elements[i].style.display = "inline"; 
		} else { elements[i].style.display = "none"; } 
	}

	// Attention block et pas inline pour les div
	el = document.getElementById( "listButton" );
	if (abletonON) { el.style.display = "block"; } else { el.style.display = "none"; } 

	actionSurAbletonON(); // N'est pas là dans la version hop, se déclenche sur abletonON

}
window.initialisation = initialisation;

function afficheAttente (duree, nomDuSon) {

	var element;

	element = document.getElementById("textProgressbar1");
	if (element.textContent == '' ) {
		element.textContent = nomDuSon;
		element.style.display = "inline";

		var el = document.getElementById("progressbar1");
		el.style.display = "inline";
		el.value = duree;
		decreaseProgressBar(el);
		return;
	} 

	element = document.getElementById("textProgressbar2");
	if (element.textContent == '' ) {
		element.textContent = nomDuSon;
		element.style.display = "inline";

		var el = document.getElementById("progressbar2");
		el.style.display = "inline";
		el.value = duree;
		decreaseProgressBar(el);		
		return;
	} 

	element = document.getElementById("textProgressbar3");
	if (element.textContent == '' ) {
		element.textContent = nomDuSon;
		element.style.display = "inline";

		var el = document.getElementById("progressbar3");
		el.style.display = "inline";
		el.value = duree;
		decreaseProgressBar(el);		
		return;
	} 
	console.log("clientGolem.js: afficheAttente: PLUS DE PROGRESS BAR DISPO");
}

function decreaseProgressBar(progressBar) {
	var compte = progressBar.value;
	while ( compte > 0 ) {
			compte--;
			//console.log("Progress value:", compte);
			setTimeout( function() { progressBar.value = progressBar.value -1 }, compte *1000 );
	}
}

// Utiliser à partir du broadcast mais aussi du message WS.
// WS est utilisé en cas de reconnexion.
function actionSurAbletonON() {

/*	if ( abletonON == false ) {
		initialisation();
		return;
	}*/
	// Plusieurs configurations de menu possibles
	if 		(abletonON == 1) arbre = arbre1;
	else if (abletonON == 2) arbre = arbre2;
	else 	 arbre = arbre1; // Protection, inutile normalement
	giveMenu(true);
	//console.log("WS Recu : abletonON:", abletonON);
	//initialisation(); //Pour le cas où le client recharge sa page en cours d'interaction

	// Pour initaliser la liste complete des sons disponibles
	var niv = [0,0,0];
	selectListClips(niv);
}

function initWSSocket(port) {
	//ws = new WebSocket( "ws://" + par.serverIPAddress + ":" + port + "/hop/serv", [ "bar", "foo" ] );
	ws = new WebSocket("ws://" + par.serverIPAddress + ":8383"); // NODE JS

	//console.log("clientgolem.js WS: ", "ws://" + par.serverIPAddress + ":" + port + "/hop/serv" );
	ws.onopen = function( event ) {
		msg.type = "startSpectateur";
		msg.text = "client";
		msg.id = id;
		ws.send(JSON.stringify(msg));
	};

	//Traitement de la Réception sur le client
	ws.onmessage = function( event ) {
		var msgRecu = JSON.parse(event.data);
		//console.log( "Client: received [%s]", event.data );
		switch(msgRecu.type) {
			case "message":  
						if (debug) console.log(msgRecu.text);
						var element = document.getElementById("MessageDuServeur");
						element.innerHTML = msgRecu.text;
						break;

			case "dureeAttente":
						afficheAttente(msgRecu.text, msgRecu.son);
						break;

			case "abletonON": 
						//Permet de savoir si Ableton est actif quand on recharge un client, le serveur envoie l'info à la connexion 
						// C'est le même scénario que quand on reçoit un broadcast de "abletonStatus".
						abletonON = msgRecu.value;
						actionSurAbletonON();
						break;

			case "listClips":
						//setOptionsInSelect(msgRecu.listClips); // Avec Select
						setBoutonSons(msgRecu.listClips);		// Avec boutons
						listClips = msgRecu.listClips;
						console.log("WS Recu : listClips:", listClips);						
						break;

			case "demandeDeSonParPseudo": // Reçu par broadcast
				if (debug) console.log("demandeDeSonParPseudo", msgRecu);
				if ( msgRecu.text === ' ') {
					document.getElementById("demandeDeSons").innerHTML =  " ";
					demandeDeSons = " ";
				} else {
					demandeDeSons = msgRecu.text + " <br> " + demandeDeSons;
					// On tronque aussi la chaine de caractère        
					document.getElementById("demandeDeSons").innerHTML = demandeDeSons.slice(0, 100);
				}
				break;

			case "infoPlayAbleton": // Reçu par broadcast
				if (debug) console.log("infoPlayAbleton", msgRecu);
				ajusteProgressBar(msgRecu.id, msgRecu.nom);
				break;

			default: console.log("Le Client reçoit un message inconnu", msgRecu );
		}
	};

	ws.onerror = function (event) {
		console.log( "clientgolem.js : received error on WS", ws.socket, " ", event );
	}

	// Mécanisme de reconnexion automatique si le serveur est tombé en hop
	// Le service golemPing permet de vérifier le présence du serveur
 	ws.onclose = function( event ) {
/*	   (function loop() {
      	      golemPing()
	    	 .post()
	    	 .then(function(){ // Si serveur présent
	    	    	document.location=golem(pseudo); 
		 		}, 
		 		function(){ // Si serveur absent
				    console.log( "reconnecting..." );
				    setTimeout( loop, 2000 );
				} );
	   })();*/
   }
}
window.initWSSocket = initWSSocket;

function sendPseudo( texte ) { // Le pseudo est aussi envoyé au moment de la lecture, mais Websocket n'en fait rien pour le moment.
	msg.type = "abletonPseudo";
	msg.pseudo= texte;
	ws.send(JSON.stringify(msg));
}

function ajusteProgressBar(idRecu, nomRecu) {

		if (debug) console.log("Reçu Texte Broadcast infoPlayAbleton:", event.value );
		if ( idRecu === id ){
			document.getElementById("MessageDuServeur").textContent = " "; // Nettoyage
			vibration(2000);
		   	document.body.className = "inplay";
	   		setTimeout( function() { document.body.className = "black-again" }, 1000 );	

			document.getElementById("buttonStart").style.backgroundColor = vert; 
		    ++nombreSonsPossible;

		    // On efface la progress bar du son joué en utilisant l'affichage (on commence par 1, FIFO)
		    element = document.getElementById("textProgressbar1");
		    if (element.textContent == nomRecu) {
				element.textContent = '';
				element.style.display = "none";
				document.getElementById("progressbar1").style.display = "none";
				return;
			} 

		    element = document.getElementById("textProgressbar2");
		    if (element.textContent == nomRecu) {
				element.textContent = '';
				element.style.display = "none";
				document.getElementById("progressbar2").style.display = "none";
				return;
			} 

			element = document.getElementById("textProgressbar3");
		    if (element.textContent == nomRecu) {
				element.textContent = '';
				element.style.display = "none";
				document.getElementById("progressbar3").style.display = "none";
				return;
			} 
			console.log("clientGolem.js: afficheAttente: infoPlayAbleton : PAS DE PROGRESS BAR ", event.value);
		}
}

// Gestion de la fermeture du browser
window.onbeforeunload = function () {
	msg.type = "closeSpectateur";
	msg.text = "DISCONNECT_SPECTATEUR";
	msg.pseudo = pseudo;
	ws.send(JSON.stringify(msg));
	ws.close();
}

//========== Controle des CLIPS =================================
function selectListClips(niveaux) { // golemV2
	msg.type = "abletonSelectListClips";
	msg.niveaux = niveaux;
	ws.send(JSON.stringify(msg));
}

function selectClip(element) {
    var idx=element.selectedIndex;
    var val=element.options[idx].value;
    var content=element.options[idx].innerHTML;
    document.getElementById("sonChoisi").innerHTML = content;
    indexChoisi = idx;
    if (debug) console.log("clientgolem.js: selectClip: index", idx, ": Clip: " , listClips[idx]);

	var nomComplet = "../sounds/" + listClips[idx][4] + ".mp3";
	console.log("Soundfile recu :", nomComplet);
	src = new Audio(nomComplet); 

}
exports.selectClip = selectClip;

// Demande au serveur de lancer le clip
function startClip() {

	if (indexChoisi == -1) return -1; // Protection sur un choix sans selection au départ

	if (nombreSonsPossible < 1 ) {
		document.getElementById("MessageDuServeur").textContent = "Vous avez dejà demandé 3 sons.";
		return -1;
	}
	--nombreSonsPossible;
	msg.type = "abletonStartClip";
	msg.clipChoisi = listClips[indexChoisi];
	msg.pseudo = pseudo;
	ws.send(JSON.stringify(msg));

	document.getElementById("buttonStart").style.backgroundColor = violet;  // '#797bbf'
	vibration(200);		
}
window.startClip = startClip;

// Ecoute en local
function startListenClip() {
	document.getElementById( "buttonEcouter").style.display = "none";
	document.getElementById( "buttonStop").style.display = "inline";
	src.play();
}
window.startListenClip = startListenClip;

// Arret de l'écoute en local
function stopListenClip() {
	document.getElementById( "buttonEcouter").style.display = "inline";
	document.getElementById( "buttonStop").style.display = "none";
	src.pause();
}
window.stopListenClip = stopListenClip;

// Pour flasher le smartphone ====================================
function bg() {
   document.body.className = "inplay";
   setTimeout( function() { document.body.className = "black-again" }, 10 );
}
exports.bg = bg

//========= Automate Buttons de sélection des sons ===============
var niveau = 0;
var position = [-1,-1,-1]; // C'est la mémoire des positions cliquées dans les différents niveaux, l'index de cette array est le niveau
						   // Ceci sert à naviguer dans l'arborescence des menus et à choisir les clips via une conversion simple.
function clickButton(val) {

	console.log("Avant le click", position, niveau);

	if (val != 4 ) { // Pas de retour
		if ( niveau < par.nombreDeNiveaux ) { // < 3 => On se limite à passer au niveau 3,  < 2 => se limte au niveau 2 (voir giveMenu en concordance)
			position[niveau] = val - 1;// Les boutons vont de 1 à 3, alors que position[] va de 0 à 2
			niveau++;
			// Affichage du retour
			el = document.getElementById( "buttonRetour" );
			el.style.display = "inline";
		}
	}
	else {
		if ( niveau > 0) { // Pas en haut en entrant
			position[niveau - 1] = -1; // Pour oublier le niveau en cours.
			niveau--;
		}
		if ( niveau == 0 ){ // On est en haut
			position[niveau] = -1; 
			if (debug) console.log("clientGolem.js: retour au niveau precedent en haut de l'arborescence:");
			// Pour faire disparaitre le bouton retour quand on est en haut de l'arbre
			el = document.getElementById( "buttonRetour" );
			el.style.display = "none";
		}
	}
	console.log("Apres le click", position, niveau);

	giveMenu(false);
	convertPosInNiv();
	return;
}
window.clickButton =clickButton;

// Pour le fonctionnement par bouton plutôt que select, PB en cours sur scroll
// Les clips sont des lignes de la table des commandes [4] -> nom du fichier, [3] -> nom du son
function selectClipBouton(id) {

    document.getElementById("sonChoisi").innerHTML = listClips[id][3];
    indexChoisi = id;

	var nomComplet = "../sounds/" + listClips[id][4] + ".mp3";
	console.log("Soundfile recu :", nomComplet);
	src = new Audio(nomComplet);
}
window.selectClipBouton = selectClipBouton;

function setBoutonSons(listClips) {
	var place = document.getElementById("listBoutonsSons");
	var styleBouton;

	while (place.firstChild) {
		place.removeChild(place.firstChild);
	}

	for(i=0;i< listClips.length ;i++){
	  var bouton = document.createElement("button");
	  bouton.id = i;
	  // Les clips sont des lignes de la table des commandes [3] -> nom du son
	  bouton.innerHTML = listClips[i][3];

	  styleBouton = "boutonsSons ";

	  // !! Attention ça fonctionne avec deux niveaux, ce sera différent avec 3
	  // A completer donc. listClips[i][6], 7 et 8 correspondent aux valeurs par niveaux dans le fichier de config
	  if 	  (position[2] > -1)  { styleBouton += "boutonsSons" ;}
	  else if (position[1] > -1)  { styleBouton += "boutonsSons" + listClips[i][7];}
	  else if (position[0] > -1)  {	styleBouton += "boutonsSons" + listClips[i][7];}
	  else 						  { styleBouton += "boutonsSons" + listClips[i][6];}

	  bouton.setAttribute("class", styleBouton);
	  bouton.addEventListener("click", function(event) { window.selectClipBouton(this.id); });
	  place.appendChild(bouton);
	}
}

var arbre1 = [
	[ // N0
	"percu", "voix", "ambiance"
	],
	[ // N1
		["berlin", "acoustique", "house" ], 
		["gentil", "mechant", "hebreu"],
		["planant","agressif","mystere"]
	],
	[ // N2
		[["afrique", "inde", "asie"],["house","minimale","techno"],["classique", "jazz", "rock"]],
		[["corde","cuivre","bois"],["chant","parler","bruitvoix"],["synthe","piano","orgue"]],
		[["aérien","aquatique","terrien"],["rocher","distors","explosif"],["brume","nuit","suspens"]]
	]
]

var arbre2 = [
	[ // N0
	"ensemble", "solos", "ambiance"
	],
	[ // N1
		["inde", "afrique", "Bronx" ], 
		["inde", "techno", "djembe"],
		["leger","lourd","acoustique"]
	],
	[ // N2
		[["afrique", "inde", "asie"],["house","minimale","techno"],["classique", "jazz", "rock"]],
		[["corde","cuivre","bois"],["chant","parler","bruitvoix"],["synthe","piano","orgue"]],
		[["aérien","aquatique","terrien"],["rocher","distors","explosif"],["brume","nuit","suspens"]]
	]
]


function convertPosInNiv() { // Pour établir le lien entre les menus et le mécanisme de selection des clips.
	var niv = [0,0,0];
	niv[0] = position[0]+1; // Niveau 1 dans la liste des clips
	niv[1] = position[1]+1; // Niveau 2
	niv[2] = position[2]+1; // Niveau 3

	selectListClips(niv);
}

// Fabrication des textes des boutons en fonction de la table position
function giveMenu(init) {
	var menu;
	var label = ' ';

	if (position[0] != -1) label =  arbre[0][position[0]];
	if (position[1] != -1) label =  label + "/"+ arbre[1][position[0]][position[1]];
	if (position[2] != -1) label =  labet + "/"+ arbre[2][position[0]][position[1]][position[2]];
	document.getElementById("labelSons").textContent = label;

	if(init) {
		menu = arbre[0]; // N0
		document.getElementById("buttonType1").textContent = menu[0];
		document.getElementById("buttonType2").textContent = menu[1];
		document.getElementById("buttonType3").textContent = menu[2];

		return;
	}

	else if (par.nombreDeNiveaux == 3) {
		if (position[2] >= 0) { // On est au bout de l'arbre, donc on n'affiche plus rien
			document.getElementById("buttonType1").style.display = "none"; 
			document.getElementById("buttonType2").style.display = "none";
			document.getElementById("buttonType3").style.display = "none";
			return undefined;
		}
		else if (position[1] >= 0 ) { menu = arbre[2][position[0]][position[1]];} // N2
		else if (position[0] >= 0 ) { menu = arbre[1][position[0]];} // N1
		else 						  menu = arbre[0]; // N0
	}
	else if (par.nombreDeNiveaux == 2) {
		if (position[1] >= 0) { // On est au bout de l'arbre, donc on n'affiche plus rien
			document.getElementById("buttonType1").style.display = "none"; 
			document.getElementById("buttonType2").style.display = "none";
			document.getElementById("buttonType3").style.display = "none";
			return undefined;
		}
		else if (position[0] >= 0) { menu = arbre[1][position[0]];} // N1
		else 						  menu = arbre[0]; // N0
	}
	else if (par.nombreDeNiveaux == 1) {
		if (position[0] >= 0) { // On est au bout de l'arbre, donc on n'affiche plus rien
			document.getElementById("buttonType1").style.display = "none"; 
			document.getElementById("buttonType2").style.display = "none";
			document.getElementById("buttonType3").style.display = "none";
			return undefined;
		}
		else if (position[0] >= 0) { menu = arbre[1][position[0]];} // N1
		else 						  menu = arbre[0]; // N0
	}
	else {
		menu = arbre[0]; // N0
	}

	if(menu != undefined) {
		document.getElementById("buttonType1").style.display = "inline"; 
		document.getElementById("buttonType2").style.display = "inline";
		document.getElementById("buttonType3").style.display = "inline";

		document.getElementById("buttonType1").textContent = menu[0];
		document.getElementById("buttonType2").textContent = menu[1];
		document.getElementById("buttonType3").textContent = menu[2];

	}
	return menu;
}


