
var english = true;
var debug1 = true;

/**************************************

Avril 2021

Sur Node.js

Dans ce fichier HipHop.js est décrit commme
une extension de JavaScript. Il ne s'agit donc
pas d'un générateur indépendant de JavaScript.

© Copyright 2019-2021, B. Petit-Heidelein

****************************************/

/**************************

 FONCTIONS

***************************/
function entierAleatoire(min, max){
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInList(val, liste){
  for( var i=0; i < liste.length; i++){
    if( liste[i] === val) return true;
  }
  return false;
}

/******************************************************************************

 Créer une liste d'au maximum index éléments àa partir d'une liste de départ

*******************************************************************************/
function createRandomListe(index, liste){
  // Protection sur une erreur de saisie du nombre de réservoirs
  if(index > liste.length){
    index = liste.length;
  }
  var premierAlea = entierAleatoire(1, index);
  var deuxiemeAlea;
  var listeResultat = [];
  //console.log("premierAlea:", premierAlea);

  for( var i=0; i < premierAlea; i++){
    deuxiemeAlea = Math.floor(Math.random() * Math.floor(liste.length));
    if(listeResultat.length === 0){
      listeResultat.push(liste[deuxiemeAlea]);
    }else{
      while(true){
        if(isInList(liste[deuxiemeAlea], listeResultat)){
          deuxiemeAlea = Math.floor(Math.random() * Math.floor(liste.length));
          continue;
        }else{
          listeResultat.push(liste[deuxiemeAlea]);
          break;
        }
      }
    }
    //console.log("deuxiemeAlea:",deuxiemeAlea, " el :", uneListe[deuxiemeAlea]);
  }
  return listeResultat;
}

/**************************

 Les blocks myReact

***************************/

Blockly.defineBlocksWithJsonArray([
{
  "type": "sustain",
  "message0": "sustain %1",
  "args0": [
    {
      "type": "input_value",
      "name": "SIGNAL"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 20,
  "tooltip": "sustain",
  "helpUrl": ""
}
]);

Blockly.JavaScript['sustain'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';

  // Ceci n'est pas beau, mais on utilise des mécanismes pour la génération de code JS 
  // Nous allons retouver ce travail de filtrage assez souvent.
  // Dans le cas du développement d'un générteur propore à HH, ce sera au pire inutile
  // mais ne devrait pas poser de problème.
  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = 'sustain '+ value + '();\n';
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "emit_value",
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

Blockly.JavaScript['emit_value'] = function(block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");
  var code = '\nmr._emit("'+ value + '",' + number_signal_value + '),';
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "await_do",
  "message0": "await_do %1 count %2",
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
  "tooltip": "await_do",
  "helpUrl": ""
}
]);

Blockly.JavaScript['await_do'] = function(block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");
  var code = '\nmr._await_do("'+ value + '",' + number_signal_value + `,() => {console.log("await do ->` + value + `"); return true;}),`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "await_immediate",
  "message0": "await immediate %1 ",
  "args0": [
    {
      "type": "input_value",
      "name": "SIGNAL",
      "check": "String"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 15,
  "tooltip": "await",
  "helpUrl": ""
}
]);

Blockly.JavaScript['await_immediate'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'/g, "");
  var code = 'await immediate (' + value + '.now);\n';
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "wait_for",
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

Blockly.JavaScript['wait_for'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES'); 
  var code = `mr._await("` + value + `", `+ times + `),\n`;
  return code;
};

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

Blockly.JavaScript['wait_for_signal_in_group'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES'); 
  var code = 'await count (' + times + "," + value + 'IN.now);\n';
  return code;
};

/*Blockly.defineBlocksWithJsonArray([
{
  "type": "await",
  "message0": "await %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "SIGNAL",
      "check": "String"
    }
  ],
  "previousStatement": null,
  "nextStatement": "String",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}
]);

Blockly.JavaScript['await'] = function(block) {
  //var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  var value_signal = Blockly.JavaScript.statementToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  var code = 'await ' + value + ';\n';
  return code;
};
*/
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

Blockly.JavaScript['await'] = function(block) {
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
    if( conditionCode.includes("count") || conditionCode.includes("immediate")){
      code += 'await ' + conditionCode + ';';
    }else{
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
  "colour": 160,
  "tooltip": "await_pattern",
  "helpUrl": ""
}
]);

Blockly.JavaScript['await_pattern'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "await (patternSignal.now && (patternSignal.nowval[1] === " + value + "));\n"
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
 "type": "fork_body",
  "message0": "fork %1 par %2",
  "args0": [
    {
      "type": "input_statement",
      "name": "fork"
    },
    {
      "type": "input_statement",
      "name": "par"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "fork",
  "helpUrl": ""
}
]);

Blockly.JavaScript['fork_body'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'fork');
  console.log("statements fork :\n", statements_name);
  var statements_name2 = Blockly.JavaScript.statementToCode(block, 'par');
  console.log("statements par :\n", statements_name2);

  var code = 'fork{\n' + statements_name + '}par{\n' + statements_name2 + '}\n';
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
 "type": "random_body",
  "message0": "Choose randomly a block among %1 blocks %2 block 1 %3 block 2 %4",
  "args0": [
    {
      "type": "field_number",
      "name": "VALUE",
      "value": 2,
      "check": "Number"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "fork"
    },
    {
      "type": "input_statement",
      "name": "par"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "fork",
  "helpUrl": ""
}
]);

Blockly.JavaScript['random_body'] = function(block) {
  let randomValue = block.getFieldValue('VALUE');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'fork');
  var statements_name2 = Blockly.JavaScript.statementToCode(block, 'par');

  var code = "hop{ aleaRandomBlock281289 =  Math.floor(Math.random() * Math.floor(" + randomValue + ")) + 1;}"

  code += `
  if ( aleaRandomBlock281289 === 1 ){
    ` + statements_name + `
  }else if( aleaRandomBlock281289 === 2 ){
    ` + statements_name2 + `
  }`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "random_block",
  "message0": "random block %1 %2 %3",
  "args0": [
    {
      "type": "field_number",
      "name": "VALUE",
      "value": 3,
      "check": "Number"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "par",
  "helpUrl": ""
}
]);

Blockly.JavaScript['random_block'] = function(block) {
  let blocValue = block.getFieldValue('VALUE');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  console.log("statements body:\n", statements_name);

  var code = "";
  code += `
  if ( aleaRandomBlock281289 === `+ blocValue + `){
    ` + statements_name + `
  }
  `
  return code;
};


Blockly.defineBlocksWithJsonArray([
{
  "type": "seq_body",
  "message0": "seq %1",
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

Blockly.JavaScript['seq_body'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
  // Debut de seq
  mr._seq(
    [`+ statements_body +`]
  ),
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "par_body",
  "message0": "par %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "BODY"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "par",
  "helpUrl": ""
}
]);

Blockly.JavaScript['par_body'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
  // Debut de par
  mr._par(
    [`+ statements_body +`]
  ),
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "branch_body",
  "message0": "body %1",
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

Blockly.JavaScript['branch_body'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
  // Debut de body
  [`+ statements_body +`
  ],
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "declare_signal",
  "message0": "create signal %1",
  "args0": [
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

Blockly.JavaScript['declare_signal'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  var code = `mr.createSignal("` + value + `");\n`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "count_signal",
  "message0": "count %1 %2",
  "args0": [
    {
      "type": "field_number",
      "name": "count",
      "value": 1
    },
    {
      "type": "input_value",
      "name": "signal",
      "check": "String"
    }
  ],
  "inputsInline": false,
  //"previousStatement": null,
  //"nextStatement": null,
  "output": null,
  "colour": 15,
  "tooltip": "signal",
  "helpUrl": ""
}
]);

Blockly.JavaScript['count_signal'] = function(block) {
  var number_count = block.getFieldValue('count');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  // On récupère un block "text" de Blockly avec des "" à supprimer
  let value = value_signal.replace(/\(|\)|\'/g, "");
  var code = ' count ('+ number_count + ',' + value + ')';
  //return code;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "nowval",
  "message0": "nowval %1",
  "args0": [
    {
      "type": "input_value",
      "name": "signal",
      "check": "String"
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 15,
  "tooltip": "",
  "helpUrl": ""
}
]);

Blockly.JavaScript['nowval'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_signal.replace(/\'/g, "") + ".nowval";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "orchestration",
  "message0": "Orch. %1 %2 Sig. %3 Body %4 ",
  "args0": [
    {
      "type": "field_number",
      "name": "trajet",
      "value": 1,
      "check": "Number"
    },
    {
      "type": "input_dummy"
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
Blockly.JavaScript['orchestration'] = function(block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
  var mr = require("./myReact.min.js");
  ` + statements_signals + `
  var instructions = [` + statements_body + `];

  var prog = mr.createModule(instructions);

  console.log(" 1 ----------------");
  mr.runProg(prog);

  console.log(" 2 ----------------");
  mr.runProg(prog);

  mr.printProgram(prog, false);
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "module_myReact",
  "message0": "module %1 %2",
  "args0": [
     {
      "type": "input_value",
      "name": "NAME",
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

Blockly.JavaScript['module_myReact'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  let value = value_name.replace(/\'|\(|\)/g, "");

  var code = `
  // Debut de module
  ` + value + ` = [
    `+ statements_body +`
  ];
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "run_module",
  "message0": "run %1",
  "args0": [
     {
      "type": "input_value",
      "name": "NAME",
      "check": "String"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}
]);

Blockly.JavaScript['run_module'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_name.replace(/\'|\(|\)/g, "");

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
  // Debut de run module
    mr._run(`+ value +`),
  `;
  return code;
};

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

Blockly.JavaScript['tank'] = function(block) {
  let number_groupeClient = block.getFieldValue('groupeClient'); 
  let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');
  let value = statements_name.replace(/;/g, "").split('=');

  let code = '';
    code = "\n" + value[0] + "= hiphop module(tick,stopReservoir)\n"
    code += "implements ${opus4Int.creationInterfaces(par.groupesDesSons[trajet])}{";
    code += "  ${orch.makeReservoir( " + number_groupeClient + ",\n";
    code += value[1];
    code += "  )};"
    code += '\n}';
  return code;
};

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

Blockly.JavaScript['random_tank'] = function(block) {
  let number_of_tanks = block.getFieldValue('number_of_tanks'); 
  let times = block.getFieldValue('number_of_ticks'); 
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');

  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractère
  let listeStrings = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  var listTanks = createRandomListe(number_of_tanks,listeStrings);
  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  let code = "signal stop" + varRandom + ";\n";
  code += "trap" + varRandom + ":{ \n"
  code += `hop{console.log("--- RESERVOIRS SELECTIONNES AUTOMATIQUEMENT: ` + listTanks + `");}`;
  code += `
  fork{
    `+ "run ${" + listTanks[0] + `}(..., stopReservoir as stop` + varRandom + `);
  }`;

  for(var i=1; i < listTanks.length; i++){
    code += `
  par{
    `+ "run ${" + listTanks[i] + `}(..., stopReservoir as stop` + varRandom + `);
  }
  `
  }
  code += "par{\n";
  code += "    await count (" + times + "," + "tick.now);\n";
  code += "    emit stop" + varRandom + "();\n";
  code += "    break trap" + varRandom + ";\n";
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
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

Blockly.JavaScript['random_group'] = function(block) {
  let number_of_groups = block.getFieldValue('number_of_groups');
  let user_group = block.getFieldValue('user_group');
  let times = block.getFieldValue('number_of_ticks'); 
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');

  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractère
  let listeStrings = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  // Créer une liste à la compilation, en live il faut générer du code à la volée.
  // C'est en principe possible.
  var listGroups = createRandomListe(number_of_groups, listeStrings);

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  let code = "trap" + varRandom + ":{ \n"
  code += `hop{console.log("--- GROUPES SELECTIONNES AUTOMATIQUEMENT: ` + listGroups + `");}`;
  code += `
  fork{`;
  for(var i=0; i < listGroups.length; i++){
    code += `  
      emit ` + listGroups[i] + `OUT([true, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", true); };`;
  }
  code += "\n}par{\n";
  code += "    await count (" + times + "," + "tick.now);\n";
  for(var i=0; i < listGroups.length; i++){
    code += `emit ` + listGroups[i] + `OUT([false, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", false); };`;
  }
  code += "\n break trap" + varRandom + ";\n";
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

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

Blockly.JavaScript['set_group_during_ticks'] = function(block) {
  let user_group = block.getFieldValue('user_group');
  let times = block.getFieldValue('number_of_ticks'); 
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');

  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractères
  let listGroups = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  let code = "trap" + varRandom + ":{ \n"
  code += `hop{console.log("--- SET GROUPS : ` + listGroups + `");}`;
  code += `
  fork{`;
  for(var i=0; i < listGroups.length; i++){
    code += `  
      emit ` + listGroups[i] + `OUT([true, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", true); };`;
  }
  code += "\n}par{\n";
  code += "    await count (" + times + "," + "tick.now);\n";
  for(var i=0; i < listGroups.length; i++){
    code += `emit ` + listGroups[i] + `OUT([false, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", false); };
      `;
  }
  code += "\n break trap" + varRandom + ";\n";
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

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

Blockly.JavaScript['set_groups_during_patterns'] = function(block) {
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

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  let code = "trap" + varRandom + ":{ \n"
  code += `hop{console.log("--- SET GROUPS DURING PATTERNS : ` + listGroups + `");}`;
  code += `
  fork{`;
  for(var i=0; i < listGroups.length; i++){
    code += `  
      emit ` + listGroups[i] + `OUT([true, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", true); };`;
  }
  code += "\n}par{\n";
  code += "    await count (" + number_of_patterns + "," + in_listGroups[0] + "IN.now";

  for(var i=1; i < in_listGroups.length; i++){
    code += "|| " + in_listGroups[i] + "IN.now"
  }
  code += ");\n";

  for(var i=0; i < listGroups.length; i++){
    code += `
      emit ` + listGroups[i] + `OUT([false, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", false); };
      `;
  }
  code += "\n break trap" + varRandom + ";\n";
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

//set_groups_waiting_for_patterns, set_groups_during_patterns_in_groups
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

Blockly.JavaScript['set_groups_waiting_for_patterns'] = function(block) {
  let user_group = block.getFieldValue('user_group');
  let number_of_patterns = block.getFieldValue('number_of_patterns'); 
  //let statements_name = Blockly.JavaScript.statementToCode(block, 'SIGNAL');

  let groups = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = groups.replace(/;\n/g, "");
  // Parsing nécessaire pour pouvoir utiliser des variables dans la liste
  // et pas des chaines de caractères
  let listGroups = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let in_patterns_list = Blockly.JavaScript.valueToCode(block, 'IN_PATTERNS_LIST', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_patterns_list.replace(/;\n/g, "");
  in_patterns_list = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  let code = "trap" + varRandom + ":{ \n"
  code += `hop{console.log("--- SET GROUPS WAITING FOR PATTERNS : ` + listGroups + `");}`;
  code += `
  fork{`;
  for(var i=0; i < listGroups.length; i++){
    code += `  
      emit ` + listGroups[i] + `OUT([true, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", true); };`;
  }
  code += "\n}par{";
  code += "  await (patternSignal.now && (patternSignal.nowval[1] === " + in_patterns_list[0] + "));\n"

  for(var i=1; i < in_patterns_list.length; i++){
    code += "  }par{"
    code += "await (patternSignal.now && (patternSignal.nowval[1] === " + in_patterns_list[i] + "));\n"
  }
  code += "}\n";

  for(var i=0; i < listGroups.length; i++){
    code += `emit ` + listGroups[i] + `OUT([false, ` + user_group + `]);
      hop{ gcs.informSelecteurOnMenuChange(` + user_group + `," ` + listGroups[i] + `", false); };
      `;
  }
  code += "\n break trap" + varRandom + ";\n";
  code += "}\n";
  code += "yield;\n";
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

Blockly.JavaScript['reset_orchestration'] = function(block) {

  var code = `
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () { 
      gcs.resetMatrice();
    }
  }
),
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

Blockly.JavaScript['cleanqueues'] = function(block) {

 var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          DAW.cleanQueues();
          gcs.cleanChoiceList(255);
        }
      }
    ),
`
  return code;
};

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

Blockly.JavaScript['stopTanks'] = function(block) {
  var code = 'emit stopReservoir();\n';
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
Blockly.JavaScript['cleanOneQueue'] = function(block) {
  var number = block.getFieldValue('number');
  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          DAW.cleanQueue(` + number + `);
        }
      }
    ),
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

Blockly.JavaScript['pauseQueues'] = function(block) {
  var code = `
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () { 
      DAW.pauseQueues();
    }
  }
),
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

Blockly.JavaScript['pauseOneQueue'] = function(block) {
  var number = block.getFieldValue('number');

  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          DAW.pauseQueue(` + number + `);
        }
      }
    ),
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

Blockly.JavaScript['resumeQueues'] = function(block) {
  var code = `
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () { 
      DAW.resumeQueues();
    }
  }
),`
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
Blockly.JavaScript['resumeOneQueue'] = function(block) {
  var number = block.getFieldValue('number');
  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          DAW.resumeQueue(` + number + `);
        }
      }
    ),
`
  return code;
};

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
Blockly.JavaScript['waitForEmptyQueue'] = function(block) {
  var number = block.getFieldValue('number');
  var code = `await (emptyQueueSignal.now && emptyQueueSignal.nowval ==` + number + ");\n";
  return code;
};

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

Blockly.JavaScript['putPatternInQueue'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "hop{ableton.putPatternInQueue(" + value + ");}\n"
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

Blockly.JavaScript['set_group'] = function(block) {
  let groupeClient = block.getFieldValue('groupe');

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = "";
  for(var i=0; i < listGroupes.length; i++){

    code += `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit",
        "` + listGroupes[i] + `OUT": "` + listGroupes[i] + `OUT",
        "apply":function (){
          return ((() => {
            const ` + listGroupes[i] + `OUT = this["` + listGroupes[i] + `OUT"];
            return [true,` + groupeClient +`];
          })());
        }
      },
      hh.SIGACCESS({
        "signame": "` + listGroupes[i] + `OUT",
        "pre":true,
        "val":true,
        "cnt":false
      })
    ),
    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () { gcs.informSelecteurOnMenuChange(` + groupeClient +` , "` + listGroupes[i] + `OUT",true); }
      }
  ),
  `
  }
  return code;
};

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

Blockly.JavaScript['unset_group'] = function(block) {
  let groupeClient = block.getFieldValue('groupe');

  let value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = "";
  for(var i=0; i < listGroupes.length; i++){
    code += `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit",
        "` + listGroupes[i] + `OUT": "` + listGroupes[i] + `OUT",
        "apply":function (){
          return ((() => {
            const ` + listGroupes[i] + `OUT = this["` + listGroupes[i] + `OUT"];
            return [false,` + groupeClient +`];
          })());
        }
      },
      hh.SIGACCESS({
        "signame": "` + listGroupes[i] + `OUT",
        "pre":true,
        "val":true,
        "cnt":false
      })
    ),
    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () { gcs.informSelecteurOnMenuChange(` + groupeClient +` , "` + listGroupes[i] + `OUT",false); }
      }
  ),
  `
  }
  return code;
};

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

Blockly.JavaScript['run_tank'] = function(block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, ""); //.split('=');
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');
  var code = "";
  for(var i=0; i < listTanks.length; i++){
    code += "run ${" + listTanks[i] + "}(...);\n";
  }
  code += "yield;\n";
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "loop_body",
  "message0": "loop %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 250,
  "tooltip": "loop",
  "helpUrl": ""
}
]);

Blockly.JavaScript['loop_body'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  console.log("statements loop:\n", statements_name);
  var code = 'mr._loop( [' + statements_name + ']),\n';
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "yield",
  "lastDummyAlign0": "CENTRE",
  "message0": "yield",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "yield",
  "helpUrl": "yield"
}
]);

Blockly.JavaScript['yield'] = function(block) {
  var code = 'yield;\n';
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

Blockly.JavaScript['every'] = function(block) {
  let times = block.getFieldValue('TIMES');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `

hh.EVERY(
  {
      "%location":{},
      "%tag":"every",
      "immediate":false,
      "apply": function (){return ((() => {
            const ` + value + ` = this["` + value + `"];
            return ` + value + `.now;
      })());},
      "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
      "signame":"` + value + `",
      "pre":false,
      "val":false,
      "cnt":false
  }),
`+ statements_body +`
),
`;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "abort",
  "message0": "abort %1 signal %2 do %3",
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

Blockly.JavaScript['abort'] = function(block) {
  let times = block.getFieldValue('TIMES');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
  // Debut de abort
  mr._abort("` + value + `",` + times + `,
    [`+ statements_body +`]
  ),
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

Blockly.JavaScript['suspend'] = function(block) {
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
  if( conditionCode.includes("count") || conditionCode.includes("immediate") ){
    code += 'suspend ' + conditionCode + ' {\n' + branchCode + '}\n';
  }else{
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

Blockly.JavaScript['removeSceneScore'] = function(block) {
  var number = block.getFieldValue('number');
  var code = `hop {hop.broadcast('removeSceneScore',` + number + ");}\n";
  return code;
};

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

Blockly.JavaScript['addSceneScore'] = function(block) {
  var number = block.getFieldValue('number');
  var code = `hop{hop.broadcast('addSceneScore',` + number + ");}\n";
  return code;
};

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

Blockly.JavaScript['refreshSceneScore'] = function(block) {
  var code = `hop {hop.broadcast('refreshSceneScore');}
  `;
  return code;
};

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

Blockly.JavaScript['alertInfoScoreON'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `hop {hop.broadcast('alertInfoScoreON',` + value + ");}\n"
  return code;
};

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

Blockly.JavaScript['alertInfoScoreOFF'] = function(block) {
  var code = `hop {hop.broadcast('alertInfoScoreOFF');}
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

Blockly.JavaScript['logic_operationHH'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.JavaScript.ORDER_NONE  :
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
Blockly.defineBlocksWithJsonArray([
{
  "type": "JS_statement",
  "message0": "JS %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}
]);

Blockly.JavaScript['JS_statement'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  //let value = value_signal.replace(/\'/g, "");
  var code = 'hop{\n' + statements_name + '}\n';
  return code;
};

//NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "print_serveur",
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

Blockly.JavaScript['print_serveur'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '\nmr._atom( ()=> {console.log(' + value_text + ');} ),\n';
  return code;
};

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

Blockly.JavaScript['set_tempo'] = function(block) {
  var number_tempo = block.getFieldValue('tempo');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'hop{ setTempo(' + number_tempo + '); }\n';
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

Blockly.JavaScript['set_timer_division'] = function(block) {
  var number_timer = block.getFieldValue('timer');
  
  var code = `
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () { 
      gcs.setTimerDivision(` + number_timer + `);
    }
  }
),
`
   return code;
};

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

Blockly.JavaScript['tempo_parameters'] = function(block) {
  var number_channel = block.getFieldValue('channelTempo');
  var number_CC = block.getFieldValue('CCTempo');
  var number_Max = block.getFieldValue('MaxTempo');
  var number_Min = block.getFieldValue('MinTempo');
  var code = `hop{ 
    CCChannel= ` + number_channel + `;
    CCTempo  = ` + number_CC + `;
    tempoMax = ` + number_Max + `;
    tempoMin = ` + number_Min + `;
  }
  `;
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "send_midi_cc",
  "message0": "sendCC ch. %1 CC %2 val. %3 ",
  "args0": [
/*    {
      "type": "field_number",
      "name": "busMidi",
      "value": 6,
      "check": "Number"
    },*/
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

Blockly.JavaScript['send_midi_cc'] = function(block) {
  //var number_bus = block.getFieldValue('busMidi');
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCMidi');
  var number_value = block.getFieldValue('valueMidi');
  var code = "hop{\n";
  code += "  oscMidiLocal.controlChange( par.busMidiAbleton,";
  code += number_channel + ",";
  code += number_CC + ",";
  code += number_value + ");\n"
  code += "}\n";
  return code;
};

// Spécifique à l'outil chromatique d'Ableton
Blockly.defineBlocksWithJsonArray([
{
  "type": "transpose",
  "message0": "transpose ch. %1 CC Transpose Instr. %2 val. %3",
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

Blockly.JavaScript['transpose'] = function(block) {
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCInstr');
  var number_valeur = block.getFieldValue('valeur');

  var code = "hop{\n";
  code += "  transposeValue +=" + number_valeur + ";\n"
  code += "  oscMidiLocal.controlChange(par.busMidiAbleton, " + number_channel + "," + number_CC + ", Math.round(1.763 * transposeValue + 63.5));\n";
  code += "}\n";
  return code;
};

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

Blockly.JavaScript['reset_transpose'] = function(block) {
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCInstr');

  var code = "hop{\n";
  code += "  transposeValue = 0;\n"
  code += "  oscMidiLocal.controlChange(par.busMidiAbleton, " + number_channel + "," + number_CC + ", 64 );\n";
  code += "}\n";
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

Blockly.JavaScript['patternListLength'] = function(block) {
  var number_valeur = block.getFieldValue('valeur');
  var number_groupe = block.getFieldValue('groupe');
  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
           gcs.setpatternListLength([` + number_valeur + `,` + number_groupe + `]);
        }
      }
    ),
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

Blockly.JavaScript['cleanChoiceList'] = function(block) {
  var number_groupe = block.getFieldValue('groupe');
  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          gcs.cleanChoiceList(` + number_groupe + `);
        }
      }
    ),
`
  return code;
};

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

Blockly.JavaScript['bestScore'] = function(block) {
  var number_ticks = block.getFieldValue('ticks');
  if(english){
    var code = `
      hop {hop.broadcast('alertInfoScoreON', " N°1 " + gcs.getWinnerPseudo(0) + " with " + gcs.getWinnerScore(0) + " ");}
      `;
  }else{
    var code = `
      hop {hop.broadcast('alertInfoScoreON', " N°1 " + gcs.getWinnerPseudo(0) + " avec " + gcs.getWinnerScore(0) + " ");}
      `;
  }
    code += `await count(` + number_ticks + `, tick.now);
    hop {hop.broadcast('alertInfoScoreOFF');}
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

Blockly.JavaScript['totalGameScore'] = function(block) {
  var number_ticks = block.getFieldValue('ticks');
    if(english){
      var code = `
        hop {hop.broadcast('alertInfoScoreON', " Total score for all " + gcs.getTotalGameScore() + " ");}
        `;
    }else{
      var code = `
        hop {hop.broadcast('alertInfoScoreON', " Total des points " + gcs.getTotalGameScore() + " ");}
        `;
    }
    code += `
    await count(` + number_ticks + `, tick.now);
    hop {hop.broadcast('alertInfoScoreOFF');}
  `;
  return code;
};

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

Blockly.JavaScript['displayScore'] = function(block) {
  var value_rank = block.getFieldValue('rank');
  value_rank--;
  var code = '';

  if( value_rank < 0 ){
    value_rank = 0;
    code +=  ` hop{ console.log("WARN: hiphop_blocks.js: displayScore : rank from 1, not 0"); }
    `;
  }

  var number_ticks = block.getFieldValue('ticks');
  code += `
    hop {
      var pseudoLoc = gcs.getWinnerPseudo(` + value_rank + `);
      if ( pseudoLoc !== ''){`;
  if(english){
    code += `hop.broadcast('alertInfoScoreON',  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " with " + gcs.getWinnerScore(`+ value_rank + `) + " ");`;
  }else{
    code += `hop.broadcast('alertInfoScoreON',  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " avec " + gcs.getWinnerScore(`+ value_rank + `) + " ");`;
  }
  code += `
      }else{
        console.log("WARN: hiphop_blocks.js: displayScore : no score for the rank ` + value_rank + `");
      }
    }
    await count(` + number_ticks + `, tick.now);
    hop {hop.broadcast('alertInfoScoreOFF');}
  `;
  return code;
};

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

Blockly.JavaScript['displayScoreGroup'] = function(block) {
  var value_rank = block.getFieldValue('rank');
  value_rank--;
  var code = '';

  if( value_rank < 0 ){
    value_rank = 0;
    code +=  ` hop{ console.log("WARN: hiphop_blocks.js: displayScoreGroup : rank from 1, not 0"); }
    `;
  }

  var number_ticks = block.getFieldValue('ticks');
  if(english){
    code += `
    hop {
      hop.broadcast('alertInfoScoreON',  " Skini group N° " + ` + (value_rank + 1) + ` + " with " + gcs.getGroupScore(`+ value_rank + `) + " ");
    }`;
  }else{
    code += `
    hop {
      hop.broadcast('alertInfoScoreON',  " Groupe Skini N° " + ` + (value_rank + 1) + ` + " avec " + gcs.getGroupScore(`+ value_rank + `) + " ");
    }`;
  }
  code += `
    await count(` + number_ticks + `, tick.now);
    hop {hop.broadcast('alertInfoScoreOFF');}
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

Blockly.JavaScript['set_score_policy'] = function(block) {
  var number_policy = block.getFieldValue('policy');
  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          gcs.setComputeScorePolicy(` + number_policy + `);
        }
      }
    ),
`
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

Blockly.JavaScript['set_score_class'] = function(block) {
  var number_class = block.getFieldValue('class');

  var code = `
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () { 
          gcs.setComputeScoreClass(` + number_class + `);
        }
      }
    ),
`
  return code;
};

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

Blockly.JavaScript['open_tank'] = function(block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let times = block.getFieldValue('TIMES'); 
  let signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  //let code = 'hop{console.log: (\" open_tank: tank \",' + tank + ",\" time:\", " + times + ",\" signal\", " + signal + ");}\n" ;
  let code = "signal stop" + varRandom + ";\n";
  code += "trap" + varRandom + ":{ \n"
  code += "  fork{\n";
  for(var i=0; i < listTanks.length; i++){
    code += "run ${" + listTanks[i] + "}(..., stopReservoir as stop" + varRandom + ");\n";
  }
  code += "  }par{\n"
  code += "    await count (" + times + ", tick.now);\n"
  code += "    emit stop" + varRandom + "();\n"
  code += "    break trap" + varRandom + ";\n" ;
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

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

Blockly.JavaScript['run_tank_during_patterns_in_groups'] = function(block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let number_of_patterns = block.getFieldValue('number_of_patterns'); 

  let in_groups = Blockly.JavaScript.valueToCode(block, 'IN_GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_groups.replace(/;\n/g, "");
  let in_listGroups = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  //let code = 'hop{console.log: (\" open_tank: tank \",' + tank + ",\" time:\", " + times + ",\" signal\", " + signal + ");}\n" ;
  let code = "signal stop" + varRandom + ";\n";
  code += "trap" + varRandom + ":{ \n"
  code += "  fork{\n";
  for(var i=0; i < listTanks.length; i++){
    code += "run ${" + listTanks[i] + "}(..., stopReservoir as stop" + varRandom + ");\n";
  }
  code += "  }par{\n"
  code += "    await count (" + number_of_patterns + "," + in_listGroups[0] + "IN.now";

  for(var i=1; i < in_listGroups.length; i++){
    code += "|| " + in_listGroups[i] + "IN.now"
  }
  code += ");\n";
  code += "  emit stop" + varRandom + "();\n"
  code += "  break trap" + varRandom + ";\n";
  code += "  }\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "run_tank_waiting_for_patterns",
  "message0": "run tank(s) %1 waiting for pattern(s) %2",
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

Blockly.JavaScript['run_tank_waiting_for_patterns'] = function(block) {
  let statements_name = Blockly.JavaScript.valueToCode(block, 'TANKS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listTanks = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  let in_patterns_list = Blockly.JavaScript.valueToCode(block, 'IN_PATTERNS_LIST', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let in_value = in_patterns_list.replace(/;\n/g, "");
  in_patterns_list = in_value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var varRandom = Math.floor((Math.random() * 1000000) + 1 );

  //let code = 'hop{console.log: (\" open_tank: tank \",' + tank + ",\" time:\", " + times + ",\" signal\", " + signal + ");}\n" ;
  let code = "signal stop" + varRandom + ";\n";
  code += "trap" + varRandom + ":{ \n"
  code += "  fork{\n";
  for(var i=0; i < listTanks.length; i++){
    code += "run ${" + listTanks[i] + "}(..., stopReservoir as stop" + varRandom + ");\n";
  }
  code += "  }par{\n"
  code += "  await (patternSignal.now && (patternSignal.nowval[1] === " + in_patterns_list[0] + "));\n"
  for(var i=1; i < in_patterns_list.length; i++){
    code += "  }par{"
    code += "await (patternSignal.now && (patternSignal.nowval[1] === " + in_patterns_list[i] + "));\n"
  }
  code += "}\n";
  code += "  emit stop" + varRandom + "();\n"
  code += "  break trap" + varRandom + ";\n";
  code += "}\n";
  code += "yield;\n";
  return code;
};

Blockly.defineBlocksWithJsonArray([
{
  "type": "move_tempo",
  "message0": "bounce tempo of %1, every %2 and during %4 : signal %3 ",
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

Blockly.JavaScript['move_tempo'] = function(block) {
  let value = block.getFieldValue('VALUE'); 
  let every = block.getFieldValue('EVERY');
  let signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let limit = block.getFieldValue('LIMIT');

  //let code = 'hop{console.log: (\" move_tempo: \",' + value + ",\" every:\", " + every + ",\" signal\", " + signal + ");}\n" ;
  let code = `hop{  
    countInverseBougeTempo = ` + limit + `;
    bougeTempoRythme = ` + every +`;
    bougeTempoValue = `+ value + `;
  }
  `
  code += "run ${bougeTempo}(..., tick as " + signal + ");\n"
  return code;
};

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

Blockly.JavaScript['abort_move_tempo'] = function(block) {
  var code = 'emit abortBougeTempo();\n';
  return code;
};

/*******************************************************
*
* Blocs HipHop
*
********************************************************/

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "hh_orchestration",
  "message0": "Orch Test %1 %2 mod %3 sig %4 body %5 ",
  "args0": [
    {
      "type": "field_number",
      "name": "trajet",
      "value": 1,
      "check": "Number"
    },
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
Blockly.JavaScript['hh_orchestration'] = function(block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_modules = Blockly.JavaScript.statementToCode(block, 'MODULES');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  
  var code = `
hh = require("../hiphop/hiphop.js");

  ` + statements_modules + `

prg = hh.MACHINE({"id":"prg","%location":{},"%tag":"machine"},

  ` + statements_signals + `

  ` + statements_body + `

);

module.exports=prg;

prg.react();

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
Blockly.JavaScript['hh_ORCHESTRATION'] = function(block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_modules = Blockly.JavaScript.statementToCode(block, 'MODULES');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  
  var code = `
"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
var gcs;
var DAW;

var debug = false;
var debug1 = true;

//var serveur;

function setServ(ser, daw, groupeCS){
  console.log("setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
}
exports.setServ = setServ;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];

for (var i=0; i < par.groupesDesSons.length; i++) {
  var signalName = par.groupesDesSons[i][0] + "OUT";

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"OUT",
    "name":signalName,
    "init_func":function (){return [false, -1];}
  });
  signals.push(signal);
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  var signalName = par.groupesDesSons[i][0] + "IN";

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signalName
  });
  signals.push(signal);
}

function setSignals(){
  if(debug) console.log("orchestrationHH: setSignals: ", signals);
  var machine = new hh.ReactiveMachine( orchestration );
  return machine;
}
exports.setSignals = setSignals;

  ` + statements_modules + `

var orchestration = hh.MODULE(
    {"id":"Orchestration","%location":{},"%tag":"module"},
    signals,

    hh.SIGNAL({"%location":{},"direction":"IN","name":"start"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"halt"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"tick"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"DAWON"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"patternSignal"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"controlFromVideo"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"pulsation"}),
    hh.SIGNAL({"%location":{},"direction":"IN","name":"midiSignal"}),   
    hh.SIGNAL({"%location":{},"direction":"IN","name":"emptyQueueSignal"}), 

  ` + statements_signals + `

  ` + statements_body + `

);
exports.orchestration = orchestration;
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

Blockly.JavaScript['hh_module'] = function(block) {
  
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  let name = value_name.replace(/\'/g, "");

  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  
  var code = `
` + name + ` = hh.MODULE({"id":"` + name + `","%location":{},"%tag":"module"},
  ` + statements_signals + `
  ` + statements_body + `
);
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
  "colour": 270,
  "tooltip": "hh_run",
  "helpUrl": ""
}
]);

Blockly.JavaScript['hh_run'] = function(block) {
  var value_module = Blockly.JavaScript.valueToCode(block, 'MODULE', Blockly.JavaScript.ORDER_ATOMIC);
  let modulehh = value_module.replace(/\'/g, "");

  let signals_name = Blockly.JavaScript.valueToCode(block, 'SIGNALS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = signals_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = `
hh.RUN({
  "%location":{},
  "%tag":"run",
  "module": hh.getModule(  "` + modulehh + `", {}),
  `
    for(var i=0; i < listGroupes.length; i++){
      code += `"` + listGroupes[i] + `":"",
  `
    } 
    
   code += ` 
}),
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
          "INOUT",
          "INOUT",
        ],
        [
          "IN",
          "IN"
        ],
        [
          "OUT",
          "OUT"
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

Blockly.JavaScript['hh_declare_signal'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  var dropdown_type = block.getFieldValue('TYPE');

  var code = `
  hh.SIGNAL({
    "%location":{},
    "direction":"` + dropdown_type  + `",
    "name":"` + value + `"
  }),
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

Blockly.JavaScript['hh_emit_value'] = function(block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit", 
        "`+ value + `":"`+ value + `",
        "apply":function (){
          return ((() => {
            //const `+ value + `=this["`+ value + `"];
            return `+ number_signal_value + `;
          })());
        }
      },
      hh.SIGACCESS({
        "signame":"`+ value + `",
        "pre":true,
        "val":true,
        "cnt":false
      })
    ),
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

Blockly.JavaScript['hh_wait_for'] = function(block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES'); 

  var code = `
hh.AWAIT(
  {
    "%location":{},
    "%tag":"await",
    "immediate":false,
    "apply":function () {
      return ((() => {
        const ` + value + `=this["` + value + `"];
        return ` + value + `.now;
      })());
    },
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"` + value + `",
    "pre":false,
    "val":false,
    "cnt":false
  })
),
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

Blockly.JavaScript['hh_print_serveur'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {console.log(` + value_text + `);}
  }
),
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

Blockly.JavaScript['hh_pause'] = function(block) {
  var code = `
hh.PAUSE(
  {
    "%location":{},
    "%tag":"yield"
  }
),
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

Blockly.JavaScript['hh_sequence'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
      hh.SEQUENCE(
          {
            "%location":{},
            "%tag":"seq"
          },
  
  `+ statements_body +`
  ),
  `;
  return code;
};

// NodeSkini
Blockly.defineBlocksWithJsonArray([
{
  "type": "hh_fork",
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

Blockly.JavaScript['hh_fork'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
      hh.FORK(
          {
            "%location":{},
            "%tag":"fork"
          },
  
  `+ statements_body +`
  ),
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

Blockly.JavaScript['hh_loop'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var code = `
hh.LOOP(
    {
      "%location":{loop: 1},
      "%tag":"loop"
    },
    `+ statements_body +`
  ),
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

Blockly.JavaScript['hh_loopeach'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES'); 

  var code = `

hh.LOOPEACH(
  {
    "%location":{loopeach: ` + value + `},
    "%tag":"do/every",
    "immediate":false,
    "apply": function (){return ((() => {
        const ` + value + `=this["` + value + `"];
        return ` + value + `.now;
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"` + value + `",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body +`
),
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

Blockly.JavaScript['hh_every'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");
  let times = block.getFieldValue('TIMES'); 

  var code = `

hh.EVERY(
  {
    "%location":{every: ` + value + `},
    "%tag":"do/every",
    "immediate":false,
    "apply": function (){return ((() => {
        const ` + value + `=this["` + value + `"];
        return ` + value + `.now;
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"` + value + `",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body +`
),
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

Blockly.JavaScript['hh_abort'] = function(block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  let times = block.getFieldValue('TIMES'); 

  var code = `

hh.ABORT(
  {
    "%location":{abort: ` + value + `},
    "%tag":"abort",
    "immediate":false,
    "apply": function (){return ((() => {
        const ` + value + `=this["` + value + `"];
        return ` + value + `.now;
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"` + value + `",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body +`
),
`;
  return code;
};




