/**
 * Script Node.js pour générer un fichier JavaScript contenant des tableaux
 * de noms (index 0) pour chaque tank défini dans groupesDesSons, regroupés par numéro de tank (champ 5).
 *
 * Usage :
 *   node fromParamToTanks.js path/to/groupesDesSons.js output.js
 *
 * - groupesDesSons.js doit exporter un tableau nommé groupesDesSons (tableau d'arrays à 9 éléments).
 * - output.js sera généré avec un tableau par tank, chaque tableau contenant uniquement les noms (index 0).
 */

const fs = require('fs');
const path = require('path');

// Chargement dynamique d'un module JS exportant un tableau
function loadArrayFromFile(inputFile, exportName) {
  const absPath = path.isAbsolute(inputFile) ? inputFile : path.join(process.cwd(), inputFile);
  const moduleExports = require(absPath);
  if (Array.isArray(moduleExports)) {
    return moduleExports;
  }
  if (Array.isArray(moduleExports[exportName])) {
    return moduleExports[exportName];
  }
  throw new Error(`Le fichier ${inputFile} ne contient pas un tableau exporté sous le nom ${exportName}.`);
}

// Génération du code JS pour chaque tank (tableau de noms)
function generateArrayCode(nom, elements) {
  const names = elements.map(arr => JSON.stringify(arr[0]));
  let lines = [];
  for (let i = 0; i < names.length; i += 5) {
    // Pour chaque ligne, on prend 5 éléments, et on ajoute la virgule à chaque élément sauf le dernier du tableau global
    const lineElements = names.slice(i, i + 5).map((name, idx, arr) => {
      // Calculer l'index global de l'élément
      const globalIdx = i + idx;
      // Ajouter une virgule sauf si c'est le dernier élément du tableau
      return globalIdx < names.length - 1 ? name + ',' : name;
    });
    lines.push('  ' + lineElements.join(' '));
  }
  return `const ${nom} = [\n${lines.join('\n')}\n];\n`;
}

// Point d'entrée du script
function main() {
  const [,, groupesDesSonsFile, outputFile] = process.argv;
  if (!groupesDesSonsFile || !outputFile) {
    console.error('Usage: node fromParamToTanks.js groupesDesSons.js output.js');
    process.exit(1);
  }

  // Charger les données
  const groupesDesSons = loadArrayFromFile(groupesDesSonsFile, 'groupesDesSons');

  // Regrouper les tanks par numéro (champ 5)
  const tanksByNumber = {};
  groupesDesSons.forEach(item => {
    if (item[2] === 'tank') {
      const tankNumber = item[5];
      if (!tanksByNumber[tankNumber]) {
        tanksByNumber[tankNumber] = [];
      }
      tanksByNumber[tankNumber].push(item);
    }
  });

  // Générer le code pour chaque tank (tableau de noms)
  let output = '';
  Object.values(tanksByNumber).forEach(tankElements => {
    const tankName = tankElements[0][0];
    output += generateArrayCode(tankName, tankElements) + '\n';
  });

  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`Fichier généré: ${outputFile}`);
}

if (require.main === module) {
  main();
}