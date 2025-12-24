
var english = true;
var debug1 = true;
var debug = false;

/**************************************

Décembre 2025

Sur Node.js

Dans ce fichier HipHop.js est décrit commme
une extension de JavaScript. Il ne s'agit donc
pas d'un générateur indépendant de JavaScript.

© Copyright 2019-2025, B. Petit-Heidelein

****************************************/

/**************************

 FONCTIONS

***************************/
function entierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInList(val, liste) {
  for (var i = 0; i < liste.length; i++) {
    if (liste[i] === val) return true;
  }
  return false;
}

/******************************************************************************

 Créer une liste d'au maximum index éléments à partir d'une liste de départ

*******************************************************************************/
function createRandomListe(index, liste) {
  // Protection sur une erreur de saisie du nombre de réservoirs
  if (index > liste.length) {
    index = liste.length;
  }
  // Pour un entier entre 1 et index, ceci nous donne la taille de la liste à traiter
  var premierAlea = entierAleatoire(1, index);
  var deuxiemeAlea;
  var listeResultat = [];
  console.log("premierAlea:", premierAlea, ": index", index);

  for (var i = 0; i < premierAlea; i++) {
    deuxiemeAlea = Math.floor(Math.random() * Math.floor(liste.length));
    if (listeResultat.length === 0) {
      listeResultat.push(liste[deuxiemeAlea]);
    } else {
      while (true) {
        if (isInList(liste[deuxiemeAlea], listeResultat)) {
          deuxiemeAlea = Math.floor(Math.random() * Math.floor(liste.length));
          continue;
        } else {
          listeResultat.push(liste[deuxiemeAlea]);
          break;
        }
      }
    }
    console.log("Orchestration: createRandomListe:", listeResultat);
  }
  return listeResultat;
}

/**************************

 Les blocks

***************************/

Blockly.defineBlocksWithJsonArray([
  {
    "type": "wait_for_signal_in_group",
    "message0": "wait for %1 pattern(s) in group %2",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['wait_for_signal_in_group'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES');
  var code = `
    await count(`+ times + `, ` + value + `IN.now);
  `
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "await",
    "message0": "wait with condition for signal %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "AWAIT0",
        "check": "Boolean"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "helpUrl": ""
  }
]);

Blockly.JavaScript['await'] = function (block) {
  var n = 0;
  var code = '', conditionCode;
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
      block);
  }
  //do {
  conditionCode = Blockly.JavaScript.valueToCode(block, 'AWAIT' + n,
    Blockly.JavaScript.ORDER_NONE) || 'false';

  // Pas terrible mais c'est la syntaxe HH, count met des paranthèses
  // donc il n'en faut pas ici si count est dans la ligne
  if (conditionCode.includes("count") || conditionCode.includes("immediate")) {
    code += 'await ' + conditionCode + ';';
  } else {
    code += 'await (' + conditionCode + ');';
  }
  return code + '\n';
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "await_pattern",
    "message0": "wait for pattern (string) %1",
    "args0": [
      {
        "type": "input_value",
        "name": "message",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await_pattern",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['await_pattern'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
    await immediate (patternSignal.now && (patternSignal.nowval[1] === ` + value + `));
  `
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_await_signal_value",
    "message0": "wait for %1 signal %2 with value %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "Signal_Value",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await_pattern",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_await_signal_value'] = function (block) {
  let times = block.getFieldValue('TIMES');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let valueOfTheSignal = block.getFieldValue('Signal_Value');

  var code = `
    await (` + value + `.now  && ` + value + `.nowval === ` + valueOfTheSignal + `);
    `
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_if_signal",
    "message0": "if signal %1 %2",
    "args0": [
       {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "if_pattern",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_if_signal'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
 
  var code = `
  if (` + value + `.now) {
    `+ statements_body + `
  }
  `
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_if_signal_value",
    "message0": "if signal %1 with value %2 %3",
    "args0": [
       {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "Signal_Value",
        "value": 0
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "if_pattern",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_if_signal_value'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let valueOfTheSignal = block.getFieldValue('Signal_Value');

  var code = `
    if(` + value + `.now  && ` + value + `.nowval === ` + valueOfTheSignal + `) {
      `+ statements_body + `
    }
    `
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "random_body",
    "message0": "Choose randomly a block among blocks %1 block 1 %2 block 2 %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "sequence1"
      },
      {
        "type": "input_statement",
        "name": "sequence2"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "fork",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['random_body'] = function (block) {
  let statements_name1 = Blockly.JavaScript.statementToCode(block, 'sequence1');
  let statements_name2 = Blockly.JavaScript.statementToCode(block, 'sequence2');

  if (statements_name1 === '' || statements_name2 === '') return '';

  let code = `
  let aleaRandomBlock281289 = Math.floor(Math.random() * 2);
  host{console.log("--- random_body:", aleaRandomBlock281289 )}
  if ( aleaRandomBlock281289 === 0 ){
    ` + statements_name1+ `
  }else if( aleaRandomBlock281289 === 1 ){
    ` + statements_name2 + `
  }`;
  return code;
};

// Tank HH node ===========================================================
Blockly.defineBlocksWithJsonArray([
  {
    "type": "tank",
    "message0": "tank on group %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "groupeClient",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "input_statement",
        "name": "SIGNAL",
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

function makeReservoir(name, instrument, groupe) {
  name = name.replace(/ /g, "");
  codeTotal = `
  const `+name+` = hiphop module () {
  in stopReservoir;
  `
  for (var i = 0; i < instrument.length; i++) {
    codeTotal += `in `+ instrument[i] + `IN;
    `
  }
  ``
  for (var i = 0; i < instrument.length; i++) {
    codeTotal += `out ` + instrument[i] + `OUT;
    `
  }
    // Sérialiser correctement la liste des instruments en littéral de tableau JS
  const __instArrayLiteral = '[' + instrument.map(i => '"' + i + '"').join(',') + ']';
  codeTotal += `
	\${ tank.makeReservoir(`+groupe+`, `+__instArrayLiteral+`) };
}
`;
  return codeTotal;
}

Blockly.JavaScript['tank'] = function (block) {
  let number_groupeClient = block.getFieldValue('groupeClient');

  // Conversion de la liste de statements reçu de Blockly en une liste de patterns
  let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');
  let value = statements_name.replace(/;\n/g, "").split('=');
  value[1] = value[1].replace(/ /g, "");
  value[1] = value[1].replace(/\]/g, "");
  value[1] = value[1].replace(/\[/g, "");
  value[1] = value[1].split(',');
  return makeReservoir(value[0], value[1], number_groupeClient);
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "run_tank",
    "message0": "run tank(s) %1",
    "args0": [
      {
        "type": "input_value",
        "name": "TANKS",
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['run_tank'] = function (block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code =  `
  fork {
    run \${ `+ listTanks[0] + `} () {*};
  }
  `;
  for (let i = 1; i < listTanks.length; i++) {
    let theTank = listTanks[i].replace(/ /g, "");
    code +=
    ` par{
      run \${ `+ theTank + `} () {*};
    }
    `;
  }
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "random_tank",
    "message0": "run randomly max %1 tank(s) in %2 during %3 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "number_of_tanks",
        "value": 2,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TANKS",
      },
      {
        "type": "field_number",
        "name": "number_of_ticks",
        "value": 1,
        "check": "Number"
      },

    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

// Revu HH Node, 
Blockly.JavaScript['random_tank'] = function (block) {
  let number_of_tanks = block.getFieldValue('number_of_tanks');
  let times = block.getFieldValue('number_of_ticks');
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');

  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractère
  let listeStrings = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  var listTanks = createRandomListe(number_of_tanks, listeStrings);
  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "M" + varRandom;
  // A part l'appel a createRandomList ci-dessus c'est presque la même chose qu'open_tank

  var code = `
  signal stop`+ varRandom + `;
  `+ varRandom + ` : {
  fork{ `;
    for (let i = 0; i < listTanks.length; i++) {
    let theTank = listTanks[i].replace(/ /g, "");
    code += `
      run \${ `+ theTank + `} () {*, stop` + varRandom + ` as stopReservoir};
      `;
  }
  code +=  `
    }par{
      await count(`+ times + `, tick.now);
      emit stop` + varRandom + `();
      break ` + varRandom + `;
    }
  }
  yield;
`
return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "random_group",
    "message0": "set randomly max %1 group(s) in %2 for users %3 during %4 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "number_of_groups",
        "value": 2,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "GROUPS",
      },
      {
        "type": "field_number",
        "name": "user_group",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "number_of_ticks",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['random_group'] = function (block) {
  let number_of_groups = block.getFieldValue('number_of_groups');
  let user_group = block.getFieldValue('user_group');
  let times = block.getFieldValue('number_of_ticks');
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');

  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractère
  let listeStrings = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  // Ici crée une liste à la compilation, en live il faut générer du code à la volée.
  // C'est en principe possible.
  var listGroups = createRandomListe(number_of_groups, listeStrings);
  var code = ``
    for (let i = 0; i < listGroups.length; i++) {
      let theGroup = listGroups[i].replace(/ /g, "");
      code += `
        emit ` + theGroup + `OUT([true,` + user_group + `]);
        host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true) }`
    }
    code += ` 
    await count(`+ times + `, tick.now);
    `
    for (var i = 0; i < listGroups.length; i++) {
      let theGroup = listGroups[i].replace(/ /g, "");
      code += `
        emit ` + theGroup + `OUT([false,` + user_group + `]);
        host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false) }`
      }
    code += `
    yield;
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_group_during_ticks",
    "message0": "set group(s) %1 for users %2 during %3 ticks",
    "args0": [
      {
        "type": "input_value",
        "name": "GROUPS",
      },
      {
        "type": "field_number",
        "name": "user_group",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "number_of_ticks",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_group_during_ticks'] = function (block) {
  let user_group = block.getFieldValue('user_group');
  let times = block.getFieldValue('number_of_ticks');
  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractères
  let listGroups = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = ``
    for (let i = 0; i < listGroups.length; i++) {
      let theGroup = listGroups[i].replace(/ /g, "");
      code += `
        emit ` + theGroup + `OUT([true,` + user_group + `]);
        host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true) }`
    }
    code += ` 
    await count(`+ times + `, tick.now);
    `
    for (var i = 0; i < listGroups.length; i++) {
      let theGroup = listGroups[i].replace(/ /g, "");
      code += `
        emit ` + theGroup + `OUT([false,` + user_group + `]);
        host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false) }`
      }
    code += `
    yield;
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_groups_during_patterns",
    "message0": "set group(s) %1 for users %2 during %3 patterns in group(s) %4",
    "args0": [
      {
        "type": "input_value",
        "name": "GROUPS",
      },
      {
        "type": "field_number",
        "name": "user_group",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "number_of_patterns",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "IN_GROUPS",
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_groups_during_patterns'] = function (block) {
  let user_group = block.getFieldValue('user_group');
  let number_of_patterns = block.getFieldValue('number_of_patterns');
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let groups = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = groups.replace(/;\n/g, "");
  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractères
  let listGroups = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let in_groups = Blockly.JavaScript.valueToCode(block, 'IN_GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_groups.replace(/;\n/g, "");
  let in_listGroups = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "RG" + varRandom;

  var code = `
    `+ varRandom + ` : {
      fork{
      `
  for (let i = 0; i < listGroups.length; i++) {
    let theGroup = listGroups[i].replace(/ /g, "");
    code += ` 
      emit `+ theGroup + `OUT([true,` + user_group + `]);
      host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true) }
		`
  }
  code += `}
     `
  for (let i = 0; i < listGroups.length; i++) {
    let theGroup = listGroups[i].replace(/ /g, "");
    code += `par{
      await count(`+ number_of_patterns + `, `+ theGroup + `IN.now);
      break `+ varRandom + `;
    }`
  }
  code += `
  }`; // fin trap
  for (let i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
      code += ` 
    emit `+ theGroup + `OUT([false,` + user_group + `]);
    host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false) }
    `;
  }
  code += `yield;`;
  return code;
};

//revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_groups_waiting_for_patterns",
    "message0": "set group(s) %1 for users %2 waiting for patterns %3",
    "args0": [
      {
        "type": "input_value",
        "name": "GROUPS",
      },
      {
        "type": "field_number",
        "name": "user_group",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "IN_PATTERNS_LIST",
      },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "module",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_groups_waiting_for_patterns'] = function (block) {
  let user_group = block.getFieldValue('user_group');
  let groups = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = groups.replace(/;\n/g, "");
  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractères
  let listGroups = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let in_patterns_list = Blockly.JavaScript.valueToCode(block, 'IN_PATTERNS_LIST', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_patterns_list.replace(/;\n/g, "");
  in_patterns_list = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "RG" + varRandom;

var code = `
    `+ varRandom + ` : {
      fork{
      `
  for (let i = 0; i < listGroups.length; i++) {
    let theGroup = listGroups[i].replace(/ /g, "");
    code += ` 
      emit `+ theGroup + `OUT([true,` + user_group + `]);
      host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true) }
		`
  }
  code += `}
     `
  for (let i = 0; i < in_patterns_list.length; i++) {
    let theGroup = listGroups[i].replace(/ /g, "");
    code += `par{
      await immediate (patternSignal.now && (patternSignal.nowval[1] === ` + in_patterns_list[i] + `));
      break `+ varRandom + `;
    }`
  }
  code += `
  }`; // fin trap
  for (let i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
      code += ` 
    emit `+ theGroup + `OUT([false,` + user_group + `]);
    host{gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false) }
    `;
  }
  code += `yield;`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "reset_orchestration",
    "message0": "reset orchestration",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['reset_orchestration'] = function (block) {
  var code = `
  host{gcs.resetMatrice();}
  `
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "cleanqueues",
    "message0": "clean all instruments",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['cleanqueues'] = function (block) {

  var code = `
  host{
    DAW.cleanQueues();
    gcs.cleanChoiceList(255);
  }
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "stopTanks",
    "message0": "stop all tanks",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['stopTanks'] = function (block) {
  var code = `
  emit stopReservoir();
  `;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "cleanOneQueue",
    "message0": "clean instrument %1",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  }
]);
Blockly.JavaScript['cleanOneQueue'] = function (block) {
  var number = block.getFieldValue('number');
  var code = `
  host{
    DAW.cleanQueue(` + number + `);
  }
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "pauseQueues",
    "message0": "pause all instruments",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['pauseQueues'] = function (block) {
  var code = `
  host{
    DAW.pauseQueues();
  }
`
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "pauseOneQueue",
    "message0": "pause instrument %1",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['pauseOneQueue'] = function (block) {
  var number = block.getFieldValue('number');

  var code = `
    host{DAW.pauseQueue(` + number + `);}
  `
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "resumeQueues",
    "message0": "resume all instruments",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['resumeQueues'] = function (block) {
  var code = `
  host{DAW.resumeQueues();}
  `
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "resumeOneQueue",
    "message0": "resume instrument %1",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  }
]);
Blockly.JavaScript['resumeOneQueue'] = function (block) {
  var number = block.getFieldValue('number');
  var code = `
    host{DAW.resumeQueue(` + number + `);}
  `
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "waitForEmptyQueue",
    "message0": "wait until instrument %1 is empty",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  }
]);
Blockly.JavaScript['waitForEmptyQueue'] = function (block) {
  var number = block.getFieldValue('number');
  var code = `
    await (emptyQueueSignal.now && emptyQueueSignal.nowval == `+ number + `);
  `
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "putPatternInQueue",
    "message0": "put pattern %1 in instrument",
    "args0": [
      {
        "type": "input_value",
        "name": "message",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "putPatternInQueue",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['putPatternInQueue'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
  host { DAW.putPatternInQueue(` + value + `);}
  `
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_group",
    "message0": "set group(s) %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "groupe",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "GROUPS",
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "Emit",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_group'] = function (block) {
  let groupeClient = block.getFieldValue('groupe');
  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = "";
  for (var i = 0; i < listGroupes.length; i++) {
    let theGroup = listGroupes[i].replace(/ /g, "");
    code += `
    emit ` + listGroupes[i] + `OUT([true,` + groupeClient + `]);
    host{gcs.informSelecteurOnMenuChange(` + groupeClient + `," ` + theGroup + `", true) }
  `
  }
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "unset_group",
    "message0": "unset group(s) %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "groupe",
        "value": 255,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "GROUPS"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['unset_group'] = function (block) {
  let groupeClient = block.getFieldValue('groupe');
  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = "";
  for (var i = 0; i < listGroupes.length; i++) {
    let theGroup = listGroupes[i].replace(/ /g, "");
    code += `
    emit ` + listGroupes[i] + `OUT([false,` + groupeClient + `]);
    host{gcs.informSelecteurOnMenuChange(` + groupeClient + `," ` + theGroup + `", false) }
  `
  }
  return code;
};

// Revu node HH
Blockly.defineBlocksWithJsonArray([
  {
    "type": "every",
    "message0": "every %1 signal %2 do %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "seq",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['every'] = function (block) {
  let times = block.getFieldValue('TIMES');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
  every count( ` + times + `, ` + value + `.now) {
  `+ statements_body + `
  }
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "suspend",
    "message0": "suspend %1",
    "args0": [
      {
        "type": "input_value",
        "name": "SUSPEND0",
        "check": "Boolean"
      }
    ],
    "message1": "do %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['suspend'] = function (block) {
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
      block);
  }
  conditionCode = Blockly.JavaScript.valueToCode(block, 'SUSPEND' + n,
    Blockly.JavaScript.ORDER_NONE) || 'false';
  branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
  if (Blockly.JavaScript.STATEMENT_SUFFIX) {
    branchCode = Blockly.JavaScript.prefixLines(
      Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
        block), Blockly.JavaScript.INDENT) + branchCode;
  }
  // Pas terrible mais c'est la syntaxe HH, count met des paranthèses
  // donc il n'en faut pas ici si count est dans la ligne
  if (conditionCode.includes("count") || conditionCode.includes("immediate")) {
    code += 'suspend ' + conditionCode + ' {\n' + branchCode + '}\n';
  } else {
    code += 'suspend (' + conditionCode + ') {\n' + branchCode + '}\n';
  }
  return code + '\n';
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "removeSceneScore",
    "message0": "remove scene %1 in score",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

// Revu HH node
Blockly.JavaScript['removeSceneScore'] = function (block) {
  var number = block.getFieldValue('number');
  var code = `
  host{serveur.broadcast(JSON.stringify({
          type: 'removeSceneScore',
          value:` + number + `
  }));}
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "addSceneScore",
    "message0": "add scene score %1",
    "args0": [
      {
        "type": "field_number",
        "name": "number",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['addSceneScore'] = function (block) {
  var number = block.getFieldValue('number');
  var code = `
  host{ 
    serveur.broadcast(JSON.stringify({
          type: 'addSceneScore',
          value:` + number + `
        }));
  }
  yield;
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "refreshSceneScore",
    "message0": "refresh scene score",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['refreshSceneScore'] = function (block) {
  var code = `
  host{ 
    serveur.broadcast(JSON.stringify({
          type: 'refreshSceneScore',
    }));
  }
  yield;
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "alertInfoScoreON",
    "message0": "display message in score %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "message",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "alertInfoScoreON",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['alertInfoScoreON'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
  host{ 
    serveur.broadcast(JSON.stringify({
          type: 'alertInfoScoreON',
          value:` + value + `
        }));
  }
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "alertInfoScoreOFF",
    "message0": "remove message in score",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['alertInfoScoreOFF'] = function (block) {
  var code = `
  host{ 
    serveur.broadcast(JSON.stringify({
          type: 'alertInfoScoreOFF'
        }));
  }
`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "logic_operationHH",
    "message0": "logic signals %1 %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "String"
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["%{BKY_LOGIC_OPERATION_AND}", "AND"],
          ["%{BKY_LOGIC_OPERATION_OR}", "OR"]
        ]
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "String"
      }
    ],
    "inputsInline": true,
    "output": null,
    //"style": "logic_blocks",
    "colour": 15,
    "helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}",
    "extensions": ["logic_op_tooltip"]
  }
]);

Blockly.JavaScript['logic_operationHH'] = function (block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.JavaScript.ORDER_NONE :
    Blockly.JavaScript.ORDER_NONE;
  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order);
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = "(" + argument0 + ' ' + operator + ' ' + argument1 + ")";
  return [code, order];
};

/*********************

Production de JS

**********************/
// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_tempo",
    "message0": "tempo %1",
    "args0": [
      {
        "type": "field_number",
        "name": "tempo",
        "value": 60,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_tempo'] = function (block) {
  var number_tempo = block.getFieldValue('tempo');
  var code = `
  host{setTempo(` + number_tempo + `, param);}
`
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_timer_division",
    "message0": "set %1 pulse(s) for a tick",
    "args0": [
      {
        "type": "field_number",
        "name": "timer",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_timer_division'] = function (block) {
  var number_timer = block.getFieldValue('timer');

  var code = `
  host{gcs.setTimerDivision(` + number_timer + `);}
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "tempo_parameters",
    "message0": "tempo ch. %1 CC %2 Max %3 Min %4 ",
    "args0": [
      {
        "type": "field_number",
        "name": "channelTempo",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "CCTempo",
        "value": 100,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "MaxTempo",
        "value": 160,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "MinTempo",
        "value": 40,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['tempo_parameters'] = function (block) {
  var number_channel = block.getFieldValue('channelTempo');
  var number_CC = block.getFieldValue('CCTempo');
  var number_Max = block.getFieldValue('MaxTempo');
  var number_Min = block.getFieldValue('MinTempo');
  var code = `
  host{
    CCChannel= ` + number_channel + `;
    CCTempo  = ` + number_CC + `;
    tempoMax = ` + number_Max + `;
    tempoMin = ` + number_Min + `;
  }
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_osc_midi",
    "message0": "send midi via osc message %1 ch. %2 note %3 val. %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "message",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "channelMidi",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "NoteMidi",
        "value": 0,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "valueMidi",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_osc_midi'] = function (block) {
  var message = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  let message_value = message.replace(/\'/g, "");
  var number_channel = block.getFieldValue('channelMidi');
  var number_note = block.getFieldValue('NoteMidi');
  var number_value = block.getFieldValue('valueMidi');

  var code = `
  host {
   oscMidiLocal.sendOSCGame(
    "`+ message_value + `",
    {type: 'integer', value: `+ number_channel + `},
    {type: 'integer', value: `+ number_note + `},
    {type: 'integer', value: `+ number_value + `});
  }
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_midi_cc",
    "message0": "sendCC ch. %1 CC %2 val. %3 ",
    "args0": [
      {
        "type": "field_number",
        "name": "channelMidi",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "CCMidi",
        "value": 0,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "valueMidi",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_midi_cc'] = function (block) {
  //var number_bus = block.getFieldValue('busMidi');
  let number_channel = block.getFieldValue('channelMidi');
  let number_CC = block.getFieldValue('CCMidi');
  let number_value = block.getFieldValue('valueMidi');

  var code = `
  host{
    oscMidiLocal.sendControlChange(param.busMidiDAW,
    `+ number_channel + `,
    `+ number_CC + `,
    `+ number_value + `);
  }
  `;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_midi_command",
    "message0": "sendMidi ch. %1 note %2 vel. %3 ",
    "args0": [
      {
        "type": "field_number",
        "name": "channelMidi",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "CommandMidi",
        "value": 0,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "valueMidi",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_midi_command'] = function (block) {
  //var number_bus = block.getFieldValue('busMidi');
  let number_channel = block.getFieldValue('channelMidi');
  let number_Command = block.getFieldValue('CommandMidi');
  let number_value = block.getFieldValue('valueMidi');

  let code = `
  host{
    oscMidiLocal.sendNoteOn(param.busMidiDAW,
    `+ number_channel + `,
    `+ number_Command + `,
    `+ number_value + `);
  }
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_OSC_rasp_command",
    "message0": "sendOSC RASP %1 message %2 val. %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "IpAddress",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "OSCmessage",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "OSCValue1",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_OSC_rasp_command'] = function (block) {
  let IpAddress = Blockly.JavaScript.valueToCode(block, 'IpAddress', Blockly.JavaScript.ORDER_ATOMIC);
  let OSCmessage = Blockly.JavaScript.valueToCode(block, 'OSCmessage', Blockly.JavaScript.ORDER_ATOMIC);
  let OSCValue1 = block.getFieldValue('OSCValue1');

  let code = `
  host{
    oscMidiLocal.sendOSCRasp(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      ipConfig.raspOSCPort,
      `+ IpAddress + `);
  }
  `;
  return code;
};

//Compatibilité ascendante
Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_OSC_command",
    "message0": "sendOSC RASP %1 message %2 val. %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "IpAddress",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "OSCmessage",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "OSCValue1",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_OSC_command'] = function (block) {
  var IpAddress = Blockly.JavaScript.valueToCode(block, 'IpAddress', Blockly.JavaScript.ORDER_ATOMIC);
  var OSCmessage = Blockly.JavaScript.valueToCode(block, 'OSCmessage', Blockly.JavaScript.ORDER_ATOMIC);
  var OSCValue1 = block.getFieldValue('OSCValue1');

  var code = `
  host{
    oscMidiLocal.sendOSCRasp(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      par.raspOSCPort,
      `+ IpAddress + `);
  }
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_OSC_game_command",
    "message0": "sendOSC Game message %1 val. %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "OSCmessage",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "OSCValue1",
        "value": 0,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['send_OSC_game_command'] = function (block) {
  var OSCmessage = Blockly.JavaScript.valueToCode(block, 'OSCmessage', Blockly.JavaScript.ORDER_ATOMIC);
  var OSCValue1 = block.getFieldValue('OSCValue1');

  var code = `
    host {
      oscMidiLocal.sendOSCGame(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      ipConfig.portOSCToGame,
      ipConfig.remoteIPAddressGame);
  }
  `;
  return code;
};

// Spécifique à Ableton, revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "transpose_parameters",
    "message0": "transpose ratio %1 offset %2",
    "args0": [
      {
        "type": "field_number",
        "name": "ratio",
        "value": 1.763,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "offset",
        "value": 63.5,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['transpose_parameters'] = function (block) {
  var number_ratio = block.getFieldValue('ratio');
  var number_offset = block.getFieldValue('offset');
  var code = `
  host{
    ratioTranspose = ` + number_ratio + `;
    offsetTranspose = ` + number_offset + `;
    if(debug) console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
  }
`;
  return code;
};

// Spécifique à l'outil chromatique d'Ableton, revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "transpose",
    "message0": "transpose ch. %1 CC Transpose Instr. %2 val. %3",
    "args0": [
      {
        "type": "field_number",
        "name": "channelMidi",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "CCInstr",
        "value": 16,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "valeur",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['transpose'] = function (block) {
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCInstr');
  var number_valeur = block.getFieldValue('valeur');

  var code = `
  host{
    transposeValue = ` + number_valeur + `; // !! Ne devrait pas être une variable commune si on veut incrémenter.
    //console.log("hiphop block transpose: transposeValue:", transposeValue ,` + number_channel + `,` + number_CC + `);
    oscMidiLocal.sendControlChange(param.busMidiDAW,` + number_channel + `,` + number_CC + `, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
  }
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "reset_transpose",
    "message0": "reset transposition ch. %1 CC Transpose Instr. %2",
    "args0": [
      {
        "type": "field_number",
        "name": "channelMidi",
        "value": 0,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "CCInstr",
        "value": 16,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['reset_transpose'] = function (block) {
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCInstr');

  var code = `
  host{
    transposeValue = 0;
    oscMidiLocal.sendControlChange(param.busMidiDAW,` + number_channel + `,` + number_CC + `,64);
  }
`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "patternListLength",
    "message0": "set pattern list length to %1 for group %2",
    "args0": [
      {
        "type": "field_number",
        "name": "valeur",
        "value": 3,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "groupe",
        "value": 255,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['patternListLength'] = function (block) {
  var number_valeur = block.getFieldValue('valeur');
  var number_groupe = block.getFieldValue('groupe');
  var code = `
  host{
    gcs.setpatternListLength([` + number_valeur + `,` + number_groupe + `]);
  }
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "setTypeList",
    "message0": "set type list for simulator %1",
    "args0": [
      {
        "type": "input_value",
        "name": "message",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "setTypeList",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['setTypeList'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
  host{
    serveur.broadcast(JSON.stringify({
          type: 'listeDesTypes',
          text:` + value + `
        }));
  }
  `
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "activateTypeList",
    "message0": "activate Type list in simulator",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['activateTypeList'] = function (block) {
  var code = `
    host{
      serveur.broadcast(JSON.stringify({
        type: 'setListeDesTypes',
      }));
    }
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "deactivateTypeList",
    "message0": "deactivate Type list in simulator",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "break",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['deactivateTypeList'] = function (block) {
  var code = `
    host{
      serveur.broadcast(JSON.stringify({
        type: 'unsetListeDesTypes',
      }));
    }
`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "cleanChoiceList",
    "message0": "clean choice list for group %1",
    "args0": [
      {
        "type": "field_number",
        "name": "groupe",
        "value": 255,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['cleanChoiceList'] = function (block) {
  var number_groupe = block.getFieldValue('groupe');
  var code = `host{gcs.cleanChoiceList(` + number_groupe + `);}`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "bestScore",
    "lastDummyAlign0": "CENTRE",
    "message0": "display best score during %1 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "ticks",
        "value": 2,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['bestScore'] = function (block) {
  var number_ticks = block.getFieldValue('ticks');
  var code = `
  host{
	    serveur.broadcast(JSON.stringify({
	      type: 'alertInfoScoreON',
	      value: " N°1 " + gcs.getWinnerPseudo(0) + " : " + gcs.getWinnerScore(0) + " "
	    }));
  }
  await count( ` + number_ticks + `, tick.now);
  host{
      serveur.broadcast(JSON.stringify({
        type: 'alertInfoScoreOFF'}))
  }
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "totalGameScore",
    "lastDummyAlign0": "CENTRE",
    "message0": "display total game score during %1 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "ticks",
        "value": 2,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

// Revu HH node
Blockly.JavaScript['totalGameScore'] = function (block) {
  var number_ticks = block.getFieldValue('ticks');

  if (english) {
    var code = `
    host{
	    serveur.broadcast(JSON.stringify({
	      type: 'alertInfoScoreON',
	      value: " Total score for all " + gcs.getTotalGameScore() + " "
	    }));
    }
	`
  } else {
    var code = `
    host{
      serveur.broadcast(JSON.stringify({
        type: 'alertInfoScoreON',
        value: " Total des points " + gcs.getTotalGameScore() + " "
      }));
    }
	`
  }
  code += `  await count( ` + number_ticks + `, tick.now); 
    host{
      serveur.broadcast(JSON.stringify({
        type: 'alertInfoScoreOFF'}))
    }
  `;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "displayScore",
    "lastDummyAlign0": "CENTRE",
    "message0": "display score of rank %1 during %2 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "rank",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "ticks",
        "value": 2,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['displayScore'] = function (block) {
  var value_rank = block.getFieldValue('rank');
  var number_ticks = block.getFieldValue('ticks');

  value_rank--;
  var code = '';

  if (value_rank < 0) {
    value_rank = 0;
    code += `
    host{
      console.log("WARN: hiphop_blocks.js: displayScore : rank from 1, not 0");
    }`;
  }
  code += ` 
  host{
  	let pseudoLoc = gcs.getWinnerPseudo(` + value_rank + `);
		if ( pseudoLoc !== ''){`;
  if (english) {
    code += `
	    let msg = {
  	    type: 'alertInfoScoreON',
			    value:  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " with " + gcs.getWinnerScore(` + value_rank + `) + " "
	     }
	    serveur.broadcast(JSON.stringify(msg));
			`
  } else {
    code += `
      let msg = {
        type: 'alertInfoScoreON',
          value:  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " avec " + gcs.getWinnerScore(` + value_rank + `) + " "
      }
      serveur.broadcast(JSON.stringify(msg))
		`
  }
    code += `
		}else{
			console.log("WARN: hiphop_blocks.js: displayScore : no score for the rank ` + value_rank + `");
		}
	}`;
  code += `
  await count( `+ number_ticks + `, tick.now);
 	`;
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "displayScoreGroup",
    "lastDummyAlign0": "CENTRE",
    "message0": "display group score of rank %1 during %2 ticks",
    "args0": [
      {
        "type": "field_number",
        "name": "rank",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "ticks",
        "value": 2,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['displayScoreGroup'] = function (block) {
  var value_rank = block.getFieldValue('rank');
  var number_ticks = block.getFieldValue('ticks');

  value_rank--;
  var code = '';

  if (value_rank < 0) {
    value_rank = 0;
    code += ` 
    host{
      console.log("WARN: hiphop_blocks.js: displayScore : rank from 1, not 0");
    }`;
  }
  code += ` 
    host{`;
  if (english) {
    code += `
			let msg = {
				type: 'alertInfoScoreON',
				value:   " Skini group N° " + ` + (value_rank + 1) + ` + " with " + gcs.getGroupScore(` + value_rank + `) + " "
			}
			serveur.broadcast(JSON.stringify(msg));
			`
  } else {
    code += `
			let msg = {
				type: 'alertInfoScoreON',
				value:  " Groupe Skini N° " + ` + (value_rank + 1) + ` + " avec " + gcs.getGroupScore(` + value_rank + `) + " "
			}
			serveur.broadcast(JSON.stringify(msg));
			`
  }
  code += `
		}`;
  code += `
    await count( `+ number_ticks + `, tick.now);
 	`;
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_score_policy",
    "message0": "set scoring policy %1 ",
    "args0": [
      {
        "type": "field_number",
        "name": "policy",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_score_policy'] = function (block) {
  let number_policy = block.getFieldValue('policy');
  let code = `host{ gcs.setComputeScorePolicy(` + number_policy + `);}`
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "set_score_class",
    "message0": "set scoring class %1 ",
    "args0": [
      {
        "type": "field_number",
        "name": "class",
        "value": 1,
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['set_score_class'] = function (block) {
  let number_class = block.getFieldValue('class');
  let code = `host{ gcs.setComputeScoreClass(` + number_class + `);}`
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "open_tank",
    "message0": "run tank(s) %1 during %2 ticks",
    "args0": [
      {
        "type": "input_value",
        "name": "TANKS",
      },
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['open_tank'] = function (block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  let times = block.getFieldValue('TIMES');
  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "M" + varRandom;

  var code = `
  `+varRandom+` : {
  fork{ ` 
    for (var i = 0; i < listTanks.length; i++) {
    let theTank = listTanks[i].replace(/ /g, "");
    code += `
      run \${ `+ theTank + `} () {*};
    `
    }
  code += `
    }par{
      await count(`+times+`, tick.now);
      emit stopReservoir();
      break `+varRandom+`;
    }
  }
  `;
  return code;
};

// Revu HH Node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "run_tank_during_patterns_in_groups",
    "message0": "run tank(s) %1 during %2 patterns in group(s) %3",
    "args0": [
      {
        "type": "input_value",
        "name": "TANKS",
      },
      {
        "type": "field_number",
        "name": "number_of_patterns",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "IN_GROUPS",
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['run_tank_during_patterns_in_groups'] = function (block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let number_of_patterns = block.getFieldValue('number_of_patterns');

  let in_groups = Blockly.JavaScript.valueToCode(block, 'IN_GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_groups.replace(/;\n/g, "");
  let in_listGroups = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "RG" + varRandom;

  let code = `
    signal stop`+ varRandom + `;
    `+ varRandom + ` : {
        fork{
          `
    let theTank = listTanks[0].replace(/ /g, "");
    code +=`
          run \${ `+ theTank + `} () {*, stop` + varRandom + ` as stopReservoir};
        `
  for (let i = 1; i < listTanks.length; i++) {
    let theTank = listTanks[i].replace(/ /g, "");
    code +=
      `
        }par{
          run \${ `+ theTank + `} () {*, stop` + varRandom + ` as stopReservoir};
        }`
  }
  for (let i = 0; i < in_listGroups.length; i++) {
    let theGroup = in_listGroups[i].replace(/ /g, "");
    code += `par{
        await count(`+ number_of_patterns + `, `+ theGroup + `IN.now);
        emit stop` + varRandom + `();
        break `+ varRandom + `;
      }
    }`
  }
  return code;
};

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "run_tank_waiting_for_patterns",
    "message0": "run tank(s) %1 waiting pattern(s) played by DAW  %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TANKS"
      },
      {
        "type": "input_value",
        "name": "IN_PATTERNS_LIST",
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['run_tank_waiting_for_patterns'] = function (block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let in_patterns_list = Blockly.JavaScript.valueToCode(block, 'IN_PATTERNS_LIST', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_patterns_list.replace(/;\n/g, "");
  in_patterns_list = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let varRandom = Math.floor((Math.random() * 1000000) + 1);
  varRandom = "RG" + varRandom;

  let code = `
    signal stop`+ varRandom + `;
    `+ varRandom + ` : {
      fork{
          `
    let theTank = listTanks[0].replace(/ /g, "");
    code +=`
          run \${ `+ theTank + `} () {*, stop` + varRandom + ` as stopReservoir};
        `
  for (let i = 1; i < listTanks.length; i++) {
    let theTank = listTanks[i].replace(/ /g, "");
    code +=
      `
        }par{
          run \${ `+ theTank + `} () {*, stop` + varRandom + ` as stopReservoir};
        }`
  }
    for (let i = 0; i < in_patterns_list.length; i++) {
    code += `par{
        await (patternSignal.now && (patternSignal.nowval[1] === \"` + in_patterns_list[i] + `\"));
      }`
    }
  code +=`
    emit stop` + varRandom + `();
    break `+ varRandom + `;
  }`
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "move_tempo",
    "message0": "bounce tempo with a step of %1 in ambitus %4 every %2 signal %3 ",
    "args0": [
      {
        "type": "field_number",
        "name": "VALUE",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "EVERY",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "LIMIT",
        "value": 1,
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

// Revu HH node
Blockly.JavaScript['move_tempo'] = function (block) {
  let value = block.getFieldValue('VALUE');
  let every = block.getFieldValue('EVERY');
  let signal_value = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let signal = signal_value.replace(/\'/g, "");
  let limit = block.getFieldValue('LIMIT');

  let code = `
    signal inverseTempo;
    host {console.log("-- Start move tempo")}
    abort {
      loop{
        fork {
          every count( ` + limit + `, ` + signal + `.now) {
            emit inverseTempo();
          }
        }par{
          loop{
            abort{
                every count(`+ every + `, ` + signal + `.now) {
                  host{
                  tempoGlobal += `+ value + `;
                  setTempo(tempoGlobal, param);
                }
              }
            } when (inverseTempo.now);
            abort {
              every count(`+ every + `, ` + signal + `.now) {
                host{
                  tempoGlobal -= `+ value + `;
                  setTempo(tempoGlobal, param);
                }
              }
            } when (inverseTempo.now);
          }
        }
      }
    } when immediate(stopMoveTempo.now);
    host {console.log("-- Stop move tempo")}
  `;
  return code;
};

/*  countInverseBougeTempo = ` + limit + `;
    bougeTempoRythme = ` + every +`;
    bougeTempoValue = `+ value + `;*/

// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "abort_move_tempo",
    "lastDummyAlign0": "CENTRE",
    "message0": "stop move tempo",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['abort_move_tempo'] = function (block) {
  var code = `
    emit stopMoveTempo();
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_ORCHESTRATION",
    "message0": "Orch %1 mod %2 sig %3 body %4 ",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "MODULES"
      },
      {
        "type": "input_statement",
        "name": "SIGNALS"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    //"previousStatement": null,
    //"nextStatement": null,
    "colour": 240,
    "tooltip": "",
    "helpUrl": ""
  }
]);

// NodeSkini
Blockly.JavaScript['hh_ORCHESTRATION'] = function (block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_modules = Blockly.JavaScript.statementToCode(block, 'MODULES');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  var code = `
"use strict";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ipConfig = require('../serveur/ipConfig.json');

import * as hh from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";
import * as tank from "../pieces/util/makeReservoir.mjs";

var par;
var debug = false;
var debug1 = true;
var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;

// Avec des valeurs initiales
let CCChannel = 1;
let CCTempo = 100;
let tempoMax = 160;
let tempoMin = 40;
let tempoGlobal = 60;

export function setServ(ser, daw, groupeCS, oscMidi, mix){
  if(debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
  tank.initMakeReservoir(gcs, serveur);
}

function setTempo(value, param){
  tempoGlobal = value;

  // if(midimix.getAbletonLinkStatus()) {
  //   if(debug) console.log("ORCHESTRATION: set tempo Link:", value);
  //   midimix.setTempoLink(value);
  //   return;
  // }

  if ( value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  var tempo = Math.round(127/(tempoMax - tempoMin) * (value - tempoMin));
  if (debug) {
    console.log("Set tempo blockly:", value, param.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW() );
  }
  oscMidiLocal.sendControlChange(param.busMidiDAW, CCChannel, CCTempo, tempo);
}

let tempoValue = 0;
let tempoRythme = 0;
let tempoLimit = 0;
let tempoIncrease = true;
let transposeValue = 0;
let ratioTranspose = 1.763;
let offsetTranspose = 63.5;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
let signals = [];
let halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
let tickCounter = 0;

export function setSignals(param) {
  par = param;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];

  ` + statements_modules + `

  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... \${ IZsignals };
    out ... \${ interTextOUT };
    in ... \${ interTextIN };

  ` + statements_signals + `

    loop{
      await(start.now);
      abort{
        fork {
          every(tick.now){
            host{
              //console.log("tick from HH", tickCounter++);
              gcs.setTickOnControler(tickCounter++);
            }
          }
        }par{
    ` + statements_body + `
        }
      } when (halt.now);
    }
  }
  if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
  var machine = new hh.ReactiveMachine( Program, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_module",
    "message0": "mod %1 sig %2 body %3",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "SIGNALS"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 240,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_module'] = function (block) {

  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  let name = value_name.replace(/\'/g, "");

  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  var code = `
  const ` + name + ` = hiphop module() {
  ` + statements_signals + `
  ` + statements_body + `
  }
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_run",
    "message0": "run %1 with sig %2",
    "args0": [
      {
        "type": "input_value",
        "name": "MODULE",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "SIGNALS",
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 240,
    "tooltip": "hh_run",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_run'] = function (block) {
  var value_module = Blockly.JavaScript.valueToCode(block, 'MODULE', Blockly.JavaScript.ORDER_ATOMIC);
  let modulehh = value_module.replace(/\'/g, "");

  let signals_name = Blockly.JavaScript.valueToCode(block, 'SIGNALS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = signals_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = `
  run \${ `+ modulehh + `} () {*};
`;
 return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_declare_signal",
    "message0": "signal %1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "TYPE",
        "options": [
          [
            "inout",
            "inout",
          ],
          [
            "in",
            "in"
          ],
          [
            "out",
            "out"
          ]
        ]
      },
      {
        "type": "input_value",
        "name": "signal",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "signal",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_declare_signal'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  var dropdown_type = block.getFieldValue('TYPE');

  var code = `
  ` + dropdown_type + ` ` + value + `;
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_emit_value",
    "message0": "emit signal %1 with value %2",
    "args0": [
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "Signal_Value",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "Emit",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_emit_value'] = function (block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
    emit ` + value + `(`+ number_signal_value + `);
    `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_sustain_value",
    "message0": "sustain signal %1 with value %2",
    "args0": [
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "Signal_Value",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "Emit",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_sustain_value'] = function (block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
  sustain `+ value +`(`+ number_signal_value +`);
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_emit_value_var",
    "message0": "emit signal %1 with value in var %2",
    "args0": [
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "VARIABLE",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "Emit",
    "helpUrl": "",
    "inputsInline": true
  }
]);

Blockly.JavaScript['hh_emit_value_var'] = function (block) {
  var signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = signal.replace(/\'|\(|\)/g, "");
  var signal_value = Blockly.JavaScript.valueToCode(block, 'VARIABLE', Blockly.JavaScript.ORDER_NONE);
  signal_value = signal_value.replace(/'/g, "");

  var code = `
    emit `+ value + `( \"`+ signal_value + `\");
    `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_wait_for_immediate",
    "message0": "wait for %1",
    "args0": [
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_wait_for_immediate'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_NONE);
  let value = value_signal.replace(/\'/g, "");

  var code = `
  await immediate (`+ value +`.now);
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_wait_for",
    "message0": "wait for %1 signal %2",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_wait_for'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES');

  var code = `
  await count(`+ times +`,`+ value +`.now);
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_wait_for_var",
    "message0": "wait for (var) %1 in signal %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VARIABLE",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": "",
    "inputsInline": true
  }
]);

Blockly.JavaScript['hh_wait_for_var'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  var signal_value = Blockly.JavaScript.valueToCode(block, 'VARIABLE', Blockly.JavaScript.ORDER_NONE);
  signal_value = signal_value.replace(/'/g, "");

  var code = `
  host { console.log(` + value + `.nowval)}
  await immediate (` + value + `.now && ` + value + `.nowval === \"` + signal_value + `\");
  `;
  return code;
};

//NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_print_serveur",
    "message0": "print %1",
    "args0": [
      {
        "type": "input_value",
        "name": "TEXT",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "print_serveur",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_print_serveur'] = function (block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
    host {console.log(` + value_text + `);}
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_pause",
    "message0": "pause",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_pause'] = function (block) {
  var code = `
  yield;
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_sequence",
    "message0": "seq %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "seq",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_sequence'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
    {  
  `+ statements_body + `
    }
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_fork",
    "message0": "fork %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "seq",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_fork'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  //if (statements_body === '') return '';
  var code = `
  fork {
    `+ statements_body + `
  }
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_par",
    "message0": "par %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "seq",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_par'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
  par {
    `+ statements_body + `
  }
  `;
  return code;
};


// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_loop",
    "message0": "loop %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "seq",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_loop'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
  loop{
  `+ statements_body + `
  }
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_loopeach",
    "message0": "loopeach %1 signal %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_loopeach'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES');

  var code = `
  do{
    `+ statements_body + `
  } every count(` + times + `, ` + value + `.now);
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_every",
    "message0": "every %1 signal %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_every'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES');

  var code = `
  every count(` + times + `, ` + value + `.now) {
    `+ statements_body + `
  }
  `;
  return code;
}

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_suspend",
    "message0": "suspend %1 signal %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_suspend'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES');

  var code = `
  suspend{
    `+ statements_body + `
  } when count(` + times + `, ` + value + `.now);
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_abort",
    "message0": "abort %1 signal %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "SIGNAL",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_abort'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  let times = block.getFieldValue('TIMES');

  var code = `
  abort{
    `+ statements_body + `
  } when count(`+ times +`, `+ value +`.now);
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_trap",
    "message0": "trap %1 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TRAP",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_trap'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var value_trap = Blockly.JavaScript.valueToCode(block, 'TRAP', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_trap.replace(/\'/g, "");

  var code = `
  `+ value + ` : {
    `+ statements_body + `
  }
 `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_break",
    "message0": "break %1",
    "args0": [
      {
        "type": "input_value",
        "name": "TRAP",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_break'] = function (block) {
  var value_trap = Blockly.JavaScript.valueToCode(block, 'TRAP', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_trap.replace(/\'/g, "");

  var code = `
  break ` + value + `;
  `;
  return code;
};

// Javascript dans Skini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "exe_javascript",
    "message0": "JS Code %1",
    "args0": [
      {
        "type": "field_multilinetext",
        "name": "JScode",
        "spellcheck": false
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['exe_javascript'] = function (block) {
  var JScode = block.getFieldValue('JScode');
  JScode = JScode.replace(/'/g, "");

  var code = `
  host { `+ JScode + `}
  `;
  return code;
};

// ******************** Interface Z
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_await_interfaceZ_sensor",
    "message0": "wait %1 times for sensor %2 between %3 and %4",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "sensor",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "lowValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "highValue",
        "check": "Number",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "await_interfaceZ_sensor",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_await_interfaceZ_sensor'] = function (block) {
  let times = block.getFieldValue('TIMES');
  let sensor = block.getFieldValue('sensor');
  let lowValue = block.getFieldValue('lowValue');
  let highValue = block.getFieldValue('highValue');

  var code = `
    await count(` + times + `, INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
                  && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
                  && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `));
   `
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_loopeach_interfaceZ_sensor",
    "message0": "loopeach %1 sensor %2 between %3 and %4 %5 %6",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "sensor",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "lowValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "highValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "loopeach",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_loopeach_interfaceZ_sensor'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  let times = block.getFieldValue('TIMES');
  let sensor = block.getFieldValue('sensor');
  let lowValue = block.getFieldValue('lowValue');
  let highValue = block.getFieldValue('highValue');

  var code = `
  do{
    `+ statements_body + `
  } every count ( ` + times + `, INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `));
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_if_interfaceZ_sensor",
    "message0": "if sensor %1 between %2 and %3 %4 %5",
    "args0": [
      {
        "type": "field_number",
        "name": "sensor",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "lowValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "highValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "loopeach",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_if_interfaceZ_sensor'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  let sensor = block.getFieldValue('sensor');
  let lowValue = block.getFieldValue('lowValue');
  let highValue = block.getFieldValue('highValue');

  var code = `
  if (INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `)) {
            `+ statements_body + `
  }
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_every_interfaceZ_sensor",
    "message0": "every %1 sensor %2 between %3 and %4 %5 %6",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "sensor",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "lowValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "highValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "loopeach",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_every_interfaceZ_sensor'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  let times = block.getFieldValue('TIMES');
  let sensor = block.getFieldValue('sensor');
  let lowValue = block.getFieldValue('lowValue');
  let highValue = block.getFieldValue('highValue');

  var code = `
  every count( ` + times + `, INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `)) {
    `+ statements_body + `
  }
`;
  return code;
}

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_abort_interfaceZ_sensor",
    "message0": "abort %1 sensor %2 between %3 and %4 %5 %6",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 1,
        "check": "Number"
      },
      {
        "type": "field_number",
        "name": "sensor",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "lowValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "highValue",
        "check": "Number",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "BODY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 20,
    "tooltip": "loopeach",
    "helpUrl": ""
  }
]);

Blockly.JavaScript['hh_abort_interfaceZ_sensor'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  let times = block.getFieldValue('TIMES');
  let sensor = block.getFieldValue('sensor');
  let lowValue = block.getFieldValue('lowValue');
  let highValue = block.getFieldValue('highValue');

  var code = `
  abort {
    `+ statements_body + `
  } when count( ` + times + `, INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `));
`;
  return code;
}

