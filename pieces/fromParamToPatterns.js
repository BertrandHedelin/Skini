/**
 * Script Node.js pour générer un CSV à partir d'un tableau groupesDesSons.
 * Usage :
 *    node generate_csv_from_groupesDesSons.js input.js output.csv
 * 
 * Le fichier input.js doit exporter un tableau nommé groupesDesSons.
 */

const fs = require('fs');
const path = require('path');

// Helper pour charger dynamiquement un module JS (CommonJS)
function loadGroupesDesSons(inputFile) {
    const absPath = path.isAbsolute(inputFile) ? inputFile : path.join(process.cwd(), inputFile);
    // Supposons que le fichier exporte groupesDesSons via module.exports ou exports.groupesDesSons
    const moduleExports = require(absPath);
    if (Array.isArray(moduleExports)) {
        return moduleExports;
    }
    if (Array.isArray(moduleExports.groupesDesSons)) {
        return moduleExports.groupesDesSons;
    }
    throw new Error("Le fichier d'entrée ne contient pas un tableau groupesDesSons exporté.");
}

// Génère les lignes CSV à partir du tableau groupesDesSons
function generateCsvLines(groupesDesSons) {
    const lines = [];
    let note = 11;
    let fifo = 0;
    const tankFifoMap = new Map(); // Map numéro de tank (index 5) -> FIFO

    for (let i = 0; i < groupesDesSons.length; i++) {
        const group = groupesDesSons[i];
        const [
            nomGroupe, // 0
            indexGroupe, // 1
            typeLigne, // 2: "group" ou "tank"
            x, // 3
            y, // 4
            nbElem_ou_numTank, // 5
            couleur, // 6
            ordre, // 7
            scene // 8
        ] = group;

        if (typeLigne === "group") {
            for (let j = 1; j <= nbElem_ou_numTank; j++) {
                const texte = `${nomGroupe}${j}`;
                lines.push([
                    note++,                // note
                    10,                    // note stop
                    0,                     // flag
                    texte,                 // texte
                    texte,                 // sound file
                    fifo,                  // Fifo (fixe pour tout le groupe)
                    0,                     // slot
                    0,                     // type
                    0,                     // vertical type
                    indexGroupe,           // index de groupe
                    4,                     // durée
                    '', '', ''             // trois champs vides
                ]);
            }
            fifo++; // On incrémente Fifo seulement après avoir traité tout le groupe
        } else if (typeLigne === "tank") {
            // Pour les tanks, on attribue le même FIFO à tous ceux ayant le même numéro de tank (index 5)
            let tankNum = nbElem_ou_numTank;
            let tankFifo;
            if (tankFifoMap.has(tankNum)) {
                tankFifo = tankFifoMap.get(tankNum);
            } else {
                tankFifo = fifo;
                tankFifoMap.set(tankNum, tankFifo);
                fifo++; // On incrémente FIFO seulement pour un nouveau numéro de tank
            }
            const texte = nomGroupe;
            lines.push([
                note++,                // note
                10,                    // note stop
                0,                     // flag
                texte,                 // texte
                texte,                 // sound file
                tankFifo,              // Fifo (fixe pour ce numéro de tank)
                0,                     // slot
                0,                     // type
                0,                     // vertical type
                indexGroupe,           // index de groupe
                4,                     // durée
                '', '', ''             // trois champs vides
            ]);
        }
    }
    return lines;
}

// Génère le CSV complet (sans en-tête, comme dans votre exemple)
function toCsvString(lines) {
    return lines.map(row => row.join(',')).join('\n');
}

// MAIN
if (require.main === module) {
    if (process.argv.length < 4) {
        console.error("Usage: node generate_csv_from_groupesDesSons.js input.js output.csv");
        process.exit(1);
    }
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];

    try {
        const groupesDesSons = loadGroupesDesSons(inputFile);
        const lines = generateCsvLines(groupesDesSons);
        const csvString = toCsvString(lines);
        fs.writeFileSync(outputFile, csvString, 'utf8');
        console.log(`CSV généré avec succès dans ${outputFile}, mettez à jour les types et les durées.`);
    } catch (err) {
        console.error("Erreur:", err.message);
        process.exit(2);
    }
}

module.exports = {
    loadGroupesDesSons,
    generateCsvLines,
    toCsvString
};