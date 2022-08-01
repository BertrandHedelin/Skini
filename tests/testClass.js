'use strict'

// Il y a une maladresse à utiliser le 
// même nom pour react comme méthode et comme fonction.


class MaClasse {
  constructor(nom){
    this.nom = nom;
    this.status = true;
  }

  react(signal, value = 1){
    console.log(this.nom, signal, value);
    return this.action(react);
  }

  action(func){
    console.log("action");
    return func(this);
  }

}

function react(mach) {
  console.log("fonction react", mach);
}

let laClasse = new MaClasse("toto");
laClasse.react('start');
