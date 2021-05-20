/* 
Exemple d'utilisation de Hashtable
pour associer une fonction à  un groupe de sons
*/


class Hashtable {
  constructor() {
    this._storage = [];
    this._storageLimit = 8;
  }

  insert(key, value) {
    let hash = getHash(key, this._storageLimit);
    this._storage[hash] ? this._storage[hash] = this._storage[hash] : 
    this._storage[hash] = [];

    for (let i = 0; i < this._storage[hash].length; i++) {
      let tupple = this._storage[hash][i];
      if (tupple[0] === key) {
        return 'key already exists; keys must be unique';
      }
    }
    this._storage[hash].push([key, value]);
    return 'inserted';
  }

  retrieve(key) {
    let hash = getHash(key, this._storageLimit);
    if (!this._storage[hash]) return 'key does not exist';
    for (let i = 0; i < this._storage[hash].length; i++) {
      let tupple = this._storage[hash][i];
      if (tupple[0] === key) {
        return tupple;
      }
    }
  }

 remove(key) {
  let hash = getHash(key, this._storageLimit);
    if (!this._storage[hash]) return 'key does not exist';
    for (let i = 0; i < this._storage[hash].length; i++) {
      if (this._storage[hash][i][0] === key) {
        this._storage[hash][i].splice(i, 2);
        return key + ' removed';
      }
    }
  }
  
};

// helper function that generates hash
var getHash = function (str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash; //
    hash = Math.abs(hash);
  }
  return hash % max;
};

function toto(a) {
  console.log("toto:",a);
}

function titi(a) {
  console.log("titi:", a);
}

var table = new Hashtable();
table.insert("1", toto );
table.insert("2", "deux");
table.insert("3", "trois");
table.insert("4", titi );
console.log(table.retrieve("1"));
console.log(table.retrieve("4"));

// Comment exécuter une fonction en valeur d'un tableau
// On va chercher la fonction associée à 1 et on lui applique un paramètre, ici une valeur.
// C'est une façon d'associer un élément graphique à un groupe de sons ou à un réservoir.
table.retrieve("1")[1](20000);
table.retrieve("4")[1](454352);
