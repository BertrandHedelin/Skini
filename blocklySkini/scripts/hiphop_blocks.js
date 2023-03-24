
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

// Revu HH node
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
  hh.AWAIT(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":110},
        "%tag":"await",
        "immediate":false,
        "apply":function (){return ((() => {
          const `+ value + `IN =this["` + value + `IN"];
          return `+ value + `IN.now;})());},
        "countapply":function (){return `+ times + `;}
    },
    hh.SIGACCESS({"signame":"`+ value + `IN","pre":false,"val":false,"cnt":false})
  ),
`
  return code;
};

// Pour mémoire à passer en HH node
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

// Revu HH Node
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
    hh.AWAIT(
      {"%location":{"filename":"hiphop_blocks.js","pos":189},
      "%tag":"await","immediate":true,
      "apply":function (){
          return ((() => {
            const patternSignal=this["patternSignal"];
            return patternSignal.now && (patternSignal.nowval[1] === ` + value + `);
          })());
        }
      },
    hh.SIGACCESS({"signame":"patternSignal","pre":false,"val":false,"cnt":false})
    ),
  `
  return code;
};

// Revu HH Node
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
      hh.AWAIT(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"await",
          "immediate":false,
          "apply":function (){
            return ((() => {
              const ` + value + `=this["` + value + `"];
              return (` + value + `.now  && ` + value + `.nowval === ` + valueOfTheSignal + `);
            })());
          },
          "countapply":function (){ return ` + times + `;}
        },
        hh.SIGACCESS(
          {"signame":"` + value + `",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),
    `
  return code;
};

// Revu HH node
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
  let randomValue = block.getFieldValue('VALUE');
  var statements_name1 = Blockly.JavaScript.statementToCode(block, 'sequence1');
  var statements_name2 = Blockly.JavaScript.statementToCode(block, 'sequence2');

  if (statements_name1 === '' || statements_name2 === '') return '';

  var aleaRandomBlock281289 = Math.floor(Math.random() * Math.floor(2)) + 1;
  var code = `
      hh.IF(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":239},
          "%tag":"if",
          "apply":function (){
            return(Math.floor(Math.random() * Math.floor(2)) + 1) === 1;
          },
        },
        hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":245},"%tag":"sequence"},
          `+ statements_name1 + `
        ),
        hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":248},"%tag":"sequence"},
          `+ statements_name2 + `
        )
      ),
  `;
  return code;
};

// Pour mémoire, à passer en HH node
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

Blockly.JavaScript['random_block'] = function (block) {
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

// Tank HH node ===========================================================

function makeAwait(instrument, groupe) {
  var codeTotal = `
      hh.FORK( // debut du fork de makeAwait avec en premiere position:` + instrument[0] + `
      {
        "%location":{"filename":"hiphop_blocks.js","pos":304},
        "%tag":"fork"
      },
          ` +
    instrument.map(function (val) {
      var code = `
      hh.SEQUENCE( // Debut sequence pour ` + val + `
      {
        "%location":{"filename":"hiphop_blocks.js","pos":312},
        "%tag":"seq"
      },
        hh.AWAIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":317},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
              return ((() => {
                const ` + val + `IN  =this["` + val + `IN"];
                return ` + val + `IN.now;
              })());},
          },
          hh.SIGACCESS({"signame":"` + val + `IN",
          "pre":false,
          "val":false,
          "cnt":false})
        ), // Fin await ` + val + `IN
        hh.EMIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":333},
            "%tag":"emit",
            "` + val + `OUT" : "` + val + `OUT",
            "apply":function (){
              return ((() => {
                const ` + val + `OUT = this["` + val + `OUT"];
                return [false, ` + groupe + `];
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"` + val + `OUT",
            "pre":true,
            "val":true,
            "cnt":false
          }),
        ), // Fin emit ` + val + `OUT true
        hh.ATOM(
          {
          "%location":{"filename":"hiphop_blocks.js","pos":352},
          "%tag":"node",
          "apply":function () {
              //console.log("--! makeAwait:  atom:", "` + val + `OUT");
              gcs.informSelecteurOnMenuChange(` + groupe + ` , "` + val + `OUT", false);
            }
          }
        )
      ) // Fin sequence pour `+ val + `
`
      return code;
    });

  codeTotal += `    ), // Fin fork de make await avec en premiere position:` + instrument[0];
  return codeTotal;
}

function makeReservoir(name, instrument, groupe) {
  name = name.replace(/ /g, "");

  var codeTotal = ` 
  // Module tank `+ name + ` + ` + instrument[0] + `
  `+ name + ` = hh.MODULE({"id":"` + name + `","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
  `;
  for (var i = 0; i < instrument.length; i++) {
    codeTotal += `hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"` + instrument[i] + `IN"}),
    `
  }

  for (var i = 0; i < instrument.length; i++) {
    codeTotal += `hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"` + instrument[i] + `OUT"}),
    `
  }

  codeTotal += `hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
  hh.TRAP(
  {
    "EXIT":"EXIT",
    "%location":{},
    "%tag":"EXIT"
  },
    hh.ABORT({
      "%location":{"filename":"hiphop_blocks.js","pos":394},
      "%tag":"abort",
      "immediate":false,
      "apply":function (){return ((() => {
          const stopReservoir = this["stopReservoir"];
          return stopReservoir.now;
        })());
      }
    },
      hh.SIGACCESS({
         "signame":"stopReservoir",
         "pre":false,
         "val":false,
         "cnt":false
      }),
      hh.ATOM(
          {
          "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
          "%tag":"node",
          "apply":function () {
              console.log("-- MAKE RESERVOIR:", "` + instrument[0] + `" );
              var msg = {
                type: 'startTank',
                value:  "` + instrument[0] + `"
              }
              serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),` +
    instrument.map(function (val) {
      var code = `
      hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
              "%tag":"emit",
              "` + val + `OUT":"` + val + `OUT",
              "apply":function (){
                return ((() => {
                  const ` + val + ` = this["` + val + `OUT"];
                  return [true, ` + groupe + ` ];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"` + val + `OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
        ), // Fin emit ` + val + `OUT true
      hh.ATOM(
          {
          "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
          "%tag":"node",
          "apply":function () {
              //console.log("-- makeReservoir:  atom:", "` + val + `OUT");
              gcs.informSelecteurOnMenuChange(` + groupe + ` , "` + val + `OUT", true);
            }
          }
      )`;
      return code;
    })
    + `,`
    +
    makeAwait(instrument, groupe)
    + `
    hh.EXIT(
      {
          "EXIT":"EXIT",
          "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
          "%tag":"break"
      })
    ) // Fin Abort 
  ), // Fin Trap

  hh.PAUSE(
    {
      "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
      "%tag":"yield"
    }
  ),
    ` +
    instrument.map(function (val) {
      var code = `
  hh.EMIT(
      {
        "%location":{},
        "%tag":"emit",
        "` + val + `OUT":"` + val + `OUT",
        "apply":function (){
          return ((() => {
            const ` + val + ` = this["` + val + `OUT"];
            return [false, ` + groupe + ` ];
          })());
        }
      },
      hh.SIGACCESS({
        "signame":"` + val + `OUT",
        "pre":true,
        "val":true,
        "cnt":false
      })
  ), // Fin emit ` + val + `OUT false`
      return code;
    })
    + `
  hh.ATOM(
      {
      "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
      "%tag":"node",
      "apply":function () {
          gcs.informSelecteurOnMenuChange(` + groupe + ` , "` + instrument[0] + `", false);
          console.log("--- FIN RESERVOIR:", "` + instrument[0] + `");
          var msg = {
          type: 'killTank',
          value:  "` + instrument[0] + `"
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ) // Fin atom,
); // Fin module
`;
  return codeTotal;
}

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

  var code = "";

  for (var i = 0; i < listTanks.length; i++) {
    var theTank = listTanks[i].replace(/ /g, "");
    code +=
      ` 
hh.RUN({
    "%location":{"filename":"","pos":1},
    "%tag":"run",
    "module": hh.getModule("`+ listTanks[i] + `", {"filename":"","pos":2}),
    "autocomplete":true
  }),

/*  hh.PAUSE(
    {
      "%location":{},
      "%tag":"yield"
    }
  ),*/

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
  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  // A part l'appel a createRandomList ci-dessus c'est exactement la même chose qu'open_tank

  var code = `
hh.LOCAL(
  {
    "%location":{},
    "%tag":"signal"
  },
  hh.SIGNAL({
    "name":"stop` + varRandom + `"
  }),
`;

  code += `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },`;

  for (var i = 0; i < listTanks.length; i++) {
    var theTank = listTanks[i].replace(/ /g, "");
    code +=
      ` 
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.RUN(
                {
                  "%location":{"filename":"","pos":1},
                  "%tag":"run",
                  "module": hh.getModule("`+ listTanks[i] + `", {"filename":"","pos":2}),
                  "autocomplete":true,
                  "stopReservoir":"stop` + varRandom + `"
                }
              ),
            ),
            `;
  }
  code +=
    ` 
        )
      ),
      hh.SEQUENCE(
        {
          "%location":{},
          "%tag":"seq"
        },
        hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const tick =this["tick"];
                return tick.now;})());},
              "countapply":function (){return `+ times + `;}
          },
          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        ),
        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            //"stopReservoir":"stopReservoir",
            "stop` + varRandom + `" : "stop` + varRandom + `",
            "apply":function (){
              return ((() => {
                //const stopReservoir = this["stopReservoir"];
                const stop` + varRandom + ` = this["stop` + varRandom + `"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            //"signame":"stopReservoir",
            "signame":"stop` + varRandom + `",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ), // Fin emit

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        ),

        hh.EXIT(
        {
          "trap` + varRandom + `":"trap` + varRandom + `",
          "%location":{},
          "%tag":"break"
        }), // Exit
      ) // sequence
    ), // fork
  ), // trap

  hh.PAUSE(
    {
      "%location":{},
      "%tag":"yield"
    }
  )
),
`;
  return code;
};

// Revu HH node
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
  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  var code = `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },`;

  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "`+ theGroup + `OUT":"` + theGroup + `OUT",
              "apply":function (){
                return ((() => {
                  const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
                  return [true, ` + user_group + `];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"`+ theGroup + `OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true); }
          }
      ),
    `;
  }
  code += ` 
        ), // fin sequence 1
      hh.SEQUENCE(
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.AWAIT(
              {
                "%location":{},
                "%tag":"await",
                "immediate":false,
                "apply":function (){return ((() => {
                  const tick =this["tick"];
                  return tick.now;})());},
                "countapply":function (){return `+ times + `;}
            },
            hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
          ),

        `
  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "`+ theGroup + `OUT":"` + theGroup + `OUT",
              "apply":function (){
                return ((() => {
                  const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
                  return [false, ` + user_group + `];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"`+ theGroup + `OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false); }
          }
      ),
    `;
  }
  code += `
          hh.PAUSE(
            {
              "%location":{},
              "%tag":"yield"
            }
          ),
          hh.EXIT(
            {
              "trap` + varRandom + `":"trap` + varRandom + `",
              "%location":{},
              "%tag":"break"
            }
          ), // Exit
        ) // sequence
      ), // fork
    ), // trap
  hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
  ),
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
  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  var code = `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },`;

  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "`+ theGroup + `OUT":"` + theGroup + `OUT",
            "apply":function (){
              return ((() => {
                const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
                return [true, ` + user_group + `];
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"`+ theGroup + `OUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ), // Fin emit
		    hh.ATOM(
		      {
		      "%location":{},
		      "%tag":"node",
		      "apply":function () { 
              gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true);
            }
		      }
		 	  ),
	  `;
  }
  code += ` 
      	), // fin sequence 1
    	hh.SEQUENCE(
	        {
	          "%location":{},
	          "%tag":"seq"
	        },
	        hh.AWAIT(
	            {
	              "%location":{},
	              "%tag":"await",
	              "immediate":false,
	              "apply":function (){return ((() => {
	                const tick =this["tick"];
	                return tick.now;})());},
	              "countapply":function (){return `+ times + `;}
	          },
	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
	        ),

        `
  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
	        hh.EMIT(
	          {
	            "%location":{},
	            "%tag":"emit",
	            "`+ theGroup + `OUT":"` + theGroup + `OUT",
	            "apply":function (){
	              return ((() => {
	                const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
	                return [false, ` + user_group + `];
	              })());
	            }
	          },
	          hh.SIGACCESS({
	            "signame":"`+ theGroup + `OUT",
	            "pre":true,
	            "val":true,
	            "cnt":false
	          })
	        ), // Fin emit
		    hh.ATOM(
		      {
		      "%location":{},
		      "%tag":"node",
		      "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false); }
		      }
		 	),
		`;
  }
  code += `
	        hh.PAUSE(
	          {
	            "%location":{},
	            "%tag":"yield"
	          }
	        ),
	        hh.EXIT(
		        {
		          "trap` + varRandom + `":"trap` + varRandom + `",
		          "%location":{},
		          "%tag":"break"
		        }
	        ), // Exit
	      ) // sequence
    	), // fork
  	), // trap
	hh.PAUSE(
	    {
	      "%location":{},
	      "%tag":"yield"
	    }
	),
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

  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  var code = `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },`;

  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
	        hh.EMIT(
	          {
	            "%location":{},
	            "%tag":"emit",
	            "`+ theGroup + `OUT":"` + theGroup + `OUT",
	            "apply":function (){
	              return ((() => {
	                const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
	                return [true, ` + user_group + `];
	              })());
	            }
	          },
	          hh.SIGACCESS({
	            "signame":"`+ theGroup + `OUT",
	            "pre":true,
	            "val":true,
	            "cnt":false
	          })
	        ), // Fin emit
		    hh.ATOM(
		      {
		      "%location":{},
		      "%tag":"node",
		      "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true); }
		      }
		 	),
		`;
  }
  code += ` 
		), // fin sequence 1
    	hh.SEQUENCE(
	        {
	          "%location":{},
	          "%tag":"seq"
	        },
	        hh.AWAIT(
	            {
	              "%location":{},
	              "%tag":"await",
	              "immediate":false,
	              "apply":function (){return ((() => {
`
  for (var i = 0; i < in_listGroups.length; i++) {
    code += `                   const ` + in_listGroups[i] + `IN =this["` + in_listGroups[i] + `IN"];
`
  };

  code += `                 return ` + in_listGroups[0] + `IN.now`;
  for (var i = 1; i < in_listGroups.length; i++) {
    code += ` || ` + in_listGroups[i] + `IN.now`;
  };

  code += `;
                })());},
              "countapply":function (){return `+ number_of_patterns + `;}
          },
`
  for (var i = 0; i < in_listGroups.length; i++) {
    code += `             hh.SIGACCESS({"signame":"` + in_listGroups[i] + `IN","pre":false,"val":false,"cnt":false}),
`
  };
  code +=
    ` 	),`;

  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      `   hh.EMIT(
	          {
	            "%location":{},
	            "%tag":"emit",
	            "`+ theGroup + `OUT":"` + theGroup + `OUT",
	            "apply":function (){
	              return ((() => {
	                const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
	                return [false, ` + user_group + `];
	              })());
	            }
	          },
	          hh.SIGACCESS({
	            "signame":"`+ theGroup + `OUT",
	            "pre":true,
	            "val":true,
	            "cnt":false
	          })
	        ), // Fin emit
		    hh.ATOM(
		      {
		      "%location":{},
		      "%tag":"node",
		      "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false); }
		      }
		 	),
		`;
  }
  code += `
	        hh.PAUSE(
	          {
	            "%location":{},
	            "%tag":"yield"
	          }
	        ),
	        hh.EXIT(
		        {
		          "trap` + varRandom + `":"trap` + varRandom + `",
		          "%location":{},
		          "%tag":"break"
		        }
	        ), // Exit
	      ) // sequence
    	) // fork
  	), // trap
	hh.PAUSE(
	    {
	      "%location":{},
	      "%tag":"yield"
	    }
	),
`;
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

  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  var code = `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          }, // dans sequence1 : listGroups[0]: `+ listGroups[0];

  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` 
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "`+ theGroup + `OUT":"` + theGroup + `OUT",
              "apply":function (){
                return ((() => {
                  const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
                  return [true, ` + user_group + `];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"`+ theGroup + `OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", true); }
            }
          ),
    `;
  }
  code += ` 
    ), // fin sequence 1
    hh.SEQUENCE(
        {
          "%location":{},
          "%tag":"seq"
        },

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },
`;
  for (var i = 0; i < in_patterns_list.length; i++) {
    code += `
            hh.AWAIT(
              {"%location":{},
              "%tag":"await","immediate":false,
              "apply":function (){
                  return ((() => {
                    const patternSignal=this["patternSignal"];
                    return patternSignal.now && (patternSignal.nowval[1] === ` + in_patterns_list[i] + `);
                  })());
                }
              },
              hh.SIGACCESS({"signame":"patternSignal","pre":false,"val":false,"cnt":false})
            ), // Fin await`;
  }
  code +=
    `
          ), // fin fork
        `
  for (var i = 0; i < listGroups.length; i++) {
    var theGroup = listGroups[i].replace(/ /g, "");
    code +=
      ` hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "`+ theGroup + `OUT":"` + theGroup + `OUT",
              "apply":function (){
                return ((() => {
                  const `+ theGroup + `OUT = this["` + theGroup + `OUT"];
                  return [false, ` + user_group + `];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"`+ theGroup + `OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(` + user_group + `," ` + theGroup + `", false); }
            }
          ),
    `;
  }
  code += `
          hh.PAUSE(
            {
              "%location":{},
              "%tag":"yield"
            }
          ),
          hh.EXIT(
            {
              "trap` + varRandom + `":"trap` + varRandom + `",
              "%location":{},
              "%tag":"break"
            }
          ), // Exit
        ) // sequence
      ) // fork
    ), // trap
  hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
  ),
`;
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

Blockly.JavaScript['cleanqueues'] = function (block) {

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
hh.EMIT(
  {
    "%location":{},
    "%tag":"emit",
    "stopReservoir":"stopReservoir",
    "apply":function (){
      return ((() => {
        const stopReservoir = this["stopReservoir"];
        return 0;
      })());
    }
  },
),
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

Blockly.JavaScript['pauseQueues'] = function (block) {
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

Blockly.JavaScript['pauseOneQueue'] = function (block) {
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

Blockly.JavaScript['resumeQueues'] = function (block) {
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
Blockly.JavaScript['resumeOneQueue'] = function (block) {
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
    hh.AWAIT(
      {"%location":{},
      "%tag":"await","immediate":false,
      "apply":function (){
          return ((() => {
            const emptyQueueSignal=this["emptyQueueSignal"];
            return emptyQueueSignal.now && emptyQueueSignal.nowval == `+ number + `;
          })());
        }
      },
    hh.SIGACCESS({"signame":"emptyQueueSignal","pre":false,"val":false,"cnt":false})
    ),
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
  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        DAW.putPatternInQueue(` + value + `);
      }
    }
  ),
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

    code += `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit",
        "` + listGroupes[i] + `OUT": "` + listGroupes[i] + `OUT",
        "apply":function (){
          return ((() => {
            const ` + listGroupes[i] + `OUT = this["` + listGroupes[i] + `OUT"];
            return [true,` + groupeClient + `];
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
      "apply":function () { gcs.informSelecteurOnMenuChange(` + groupeClient + ` , "` + listGroupes[i] + `OUT",true); }
      }
 	),
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

  let value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';

  let statements_name = Blockly.JavaScript.valueToCode(block, 'GROUPS', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';
  let value = statements_name.replace(/;\n/g, "");
  let listGroupes = value.replace(/\[/, "").replace(/\]/, "").replace(/ /g, "").split(',');

  var code = "";
  for (var i = 0; i < listGroupes.length; i++) {
    code += `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit",
        "` + listGroupes[i] + `OUT": "` + listGroupes[i] + `OUT",
        "apply":function (){
          return ((() => {
            const ` + listGroupes[i] + `OUT = this["` + listGroupes[i] + `OUT"];
            return [false,` + groupeClient + `];
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
      "apply":function () { gcs.informSelecteurOnMenuChange(` + groupeClient + ` , "` + listGroupes[i] + `OUT",false); }
      }
  ),
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
`+ statements_body + `
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
  hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'removeSceneScore',
          value:` + number + `
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ),
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
  hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'addSceneScore',
          value:` + number + `
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ),
  hh.PAUSE(
    {
      "%location":{"filename":"hiphop_blocks.js","pos":2, "block":"addSceneScore"},
      "%tag":"yield"
    }
  ),
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
  hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'refreshSceneScore',
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ),
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
  hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'alertInfoScoreON',
          value:` + value + `
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ),
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
  hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'alertInfoScoreOFF',
        }
        serveur.broadcast(JSON.stringify(msg));
        }
      }
  ),
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
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      setTempo(` + number_tempo + `);
    }
  }
),
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
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      CCChannel= ` + number_channel + `;
      CCTempo  = ` + number_CC + `;
      tempoMax = ` + number_Max + `;
      tempoMin = ` + number_Min + `;
    }
  }
),
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
hh.ATOM(
  {
  "%location":{},
  "%tag":"node",
  "apply":function () {
    oscMidiLocal.sendOSCGame(
    "`+ message_value + `",
    {type: 'integer', value: `+ number_channel + `},
    {type: 'integer', value: `+ number_note + `},
    {type: 'integer', value: `+ number_value + `});
    }
  }
),
`;
  return code;
};


// Revu HH node
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

Blockly.JavaScript['send_midi_cc'] = function (block) {
  //var number_bus = block.getFieldValue('busMidi');
  var number_channel = block.getFieldValue('channelMidi');
  var number_CC = block.getFieldValue('CCMidi');
  var number_value = block.getFieldValue('valueMidi');

  var code = `
hh.ATOM(
  {
  "%location":{},
  "%tag":"node",
  "apply":function () {
    oscMidiLocal.sendControlChange( par.busMidiDAW,
    `+ number_channel + `,
    `+ number_CC + `,
    `+ number_value + `);
    }
  }
),
`;
  return code;
};


// Revu HH node
Blockly.defineBlocksWithJsonArray([
  {
    "type": "send_midi_command",
    "message0": "sendMidi ch. %1 note %2 vel. %3 ",
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
  var number_channel = block.getFieldValue('channelMidi');
  var number_Command = block.getFieldValue('CommandMidi');
  var number_value = block.getFieldValue('valueMidi');

  var code = `
hh.ATOM(
  {
  "%location":{},
  "%tag":"node",
  "apply":function () {
    oscMidiLocal.sendNoteOn( par.busMidiDAW,
    `+ number_channel + `,
    `+ number_Command + `,
    `+ number_value + `);
    }
  }
),
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
  var IpAddress = Blockly.JavaScript.valueToCode(block, 'IpAddress', Blockly.JavaScript.ORDER_ATOMIC);
  var OSCmessage = Blockly.JavaScript.valueToCode(block, 'OSCmessage', Blockly.JavaScript.ORDER_ATOMIC);
  var OSCValue1 = block.getFieldValue('OSCValue1');

  var code = `
  hh.ATOM(
    {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      oscMidiLocal.sendOSCRasp(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      par.raspOSCPort,
      `+ IpAddress + `);
      }
    }
  ),
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
  hh.ATOM(
    {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      oscMidiLocal.sendOSCRasp(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      par.raspOSCPort,
      `+ IpAddress + `);
      }
    }
  ),
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
  hh.ATOM(
    {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      oscMidiLocal.sendOSCGame(
      `+ OSCmessage + `,
      `+ OSCValue1 + `,
      par.portOSCToGame,
      par.remoteIPAddressGame);
      }
    }
  ),
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
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      ratioTranspose = ` + number_ratio + `;
      offsetTranspose = ` + number_offset + `;
      if(debug) console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
    }
  }
),
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
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      transposeValue = ` + number_valeur + `; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
      console.log("hiphop block transpose: transposeValue:", transposeValue ,` + number_channel + `,` + number_CC + `);
      oscMidiLocal.sendControlChange(par.busMidiDAW,` + number_channel + `,` + number_CC + `, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
    }
  }
),
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
hh.ATOM(
  {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      transposeValue = 0;
      oscMidiLocal.sendControlChange(par.busMidiDAW,` + number_channel + `,` + number_CC + `,64);
    }
  }
),
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
  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        var msg = {
          type: 'listeDesTypes',
          text:` + value + `
        }
        serveur.broadcast(JSON.stringify(msg));
      }
    }
  ),
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
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'setListeDesTypes',
          }
          serveur.broadcast(JSON.stringify(msg));
        }
      }
    ),
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
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'unsetListeDesTypes',
          }
          serveur.broadcast(JSON.stringify(msg));
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

Blockly.JavaScript['cleanChoiceList'] = function (block) {
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
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function (){
	    var msg = {
	      type: 'alertInfoScoreON',
	      value: " N°1 " + gcs.getWinnerPseudo(0) + " : " + gcs.getWinnerScore(0) + " "
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),
	hh.AWAIT(
		{
		  "%location":{},
		  "%tag":"await",
		  "immediate":false,
		  "apply":function (){return ((() => {
		    const tick =this["tick"];
		    return tick.now;})());},
		  "countapply":function (){return `+ number_ticks + `;}
		},
		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
	),
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function () {
	    var msg = {
	      type: 'alertInfoScoreOFF',
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),
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
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function (){
	    var msg = {
	      type: 'alertInfoScoreON',
	      value: " Total score for all " + gcs.getTotalGameScore() + " "
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),`
  } else {
    var code = `
    hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function (){
	    var msg = {
	      type: 'alertInfoScoreON',
	      value: " Total des points " + gcs.getTotalGameScore() + " "
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),`
  }
  code += `
	hh.AWAIT(
		{
		  "%location":{},
		  "%tag":"await",
		  "immediate":false,
		  "apply":function (){return ((() => {
		    const tick =this["tick"];
		    return tick.now;})());},
		  "countapply":function (){return `+ number_ticks + `;}
		},
		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
	),
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function () {
	    var msg = {
	      type: 'alertInfoScoreOFF',
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),
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
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function (){
	  	console.log("WARN: hiphop_blocks.js: displayScore : rank from 1, not 0");
	    }
	  }
	),
	`;
  }
  code += ` 
	hh.ATOM(
	{
	"%location":{},
	"%tag":"node",
	"apply":function (){
			var pseudoLoc = gcs.getWinnerPseudo(` + value_rank + `);
			if ( pseudoLoc !== ''){`;
  if (english) {
    code += `
			    var msg = {
			    type: 'alertInfoScoreON',
			    value:  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " with " + gcs.getWinnerScore(` + value_rank + `) + " "
			    }
			    serveur.broadcast(JSON.stringify(msg));
			`
  } else {
    code += `
			    var msg = {
			    type: 'alertInfoScoreON',
			    value:  " N° " + ` + (value_rank + 1) + ` + " " + pseudoLoc + " avec " + gcs.getWinnerScore(` + value_rank + `) + " "
			    }
			    serveur.broadcast(JSON.stringify(msg));
			`
  }
  code += `
			}else{
				console.log("WARN: hiphop_blocks.js: displayScore : no score for the rank ` + value_rank + `");
			}
		}
	}
	),
    `;
  code += `
	hh.AWAIT(
		{
		  "%location":{},
		  "%tag":"await",
		  "immediate":false,
		  "apply":function (){return ((() => {
		    const tick =this["tick"];
		    return tick.now;})());},
		  "countapply":function (){return `+ number_ticks + `;}
		},
		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
	),
	hh.ATOM(
	  {
	  "%location":{},
	  "%tag":"node",
	  "apply":function () {
	    var msg = {
	      type: 'alertInfoScoreOFF',
	    }
	    serveur.broadcast(JSON.stringify(msg));
	    }
	  }
	),
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
	hh.ATOM(
	  	{
			"%location":{},
			"%tag":"node",
			"apply":function (){
				console.log("WARN: hiphop_blocks.js: displayScore : rank from 1, not 0");
	    	}
		}
	),
	`;
  }
  code += ` 
	hh.ATOM(
		{
			"%location":{},
			"%tag":"node",
			"apply":function (){
`;
  if (english) {
    code += `
			    var msg = {
				    type: 'alertInfoScoreON',
				    value:   " Skini group N° " + ` + (value_rank + 1) + ` + " with " + gcs.getGroupScore(` + value_rank + `) + " "
			    }
			    serveur.broadcast(JSON.stringify(msg));
			`
  } else {
    code += `
			    var msg = {
				    type: 'alertInfoScoreON',
				    value:  " Groupe Skini N° " + ` + (value_rank + 1) + ` + " avec " + gcs.getGroupScore(` + value_rank + `) + " "
			    }
			    serveur.broadcast(JSON.stringify(msg));
			`
  }
  code += `
			}
		}
	),
    `;
  code += `
	hh.AWAIT(
		{
		  "%location":{},
		  "%tag":"await",
		  "immediate":false,
		  "apply":function (){return ((() => {
		    const tick =this["tick"];
		    return tick.now;})());},
		  "countapply":function (){return `+ number_ticks + `;}
		},
		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
	),
	hh.ATOM(
		{
			"%location":{},
			"%tag":"node",
			"apply":function () {
				var msg = {
				  type: 'alertInfoScoreOFF',
				}
				serveur.broadcast(JSON.stringify(msg));
			}
	 	}
	),
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

Blockly.JavaScript['set_score_class'] = function (block) {
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
  //let signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  var varRandom = Math.floor((Math.random() * 1000000) + 1);
  var code = `
hh.LOCAL(
  {
    "%location":{},
    "%tag":"signal"
  },
  hh.SIGNAL({
    "name":"stop` + varRandom + `"
  }),
`;

  code += `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },`;

  for (var i = 0; i < listTanks.length; i++) {
    var theTank = listTanks[i].replace(/ /g, "");
    code +=
      ` 
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.RUN(
                {
                  "%location":{"filename":"","pos":1},
                  "%tag":"run",
                  "module": hh.getModule("`+ listTanks[i] + `", {"filename":"","pos":2}),
                  "autocomplete":true,
                  "stopReservoir":"stop` + varRandom + `"
                }
              ),
            ),
            `;
  }
  code +=
    ` 
        )
      ),
      hh.SEQUENCE(
        {
          "%location":{},
          "%tag":"seq"
        },
        hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const tick =this["tick"];
                return tick.now;})());},
              "countapply":function (){return `+ times + `;}
          },
          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        ),
        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            //"stopReservoir":"stopReservoir",
            "stop` + varRandom + `" : "stop` + varRandom + `",
            "apply":function (){
              return ((() => {
                //const stopReservoir = this["stopReservoir"];
                const stop` + varRandom + ` = this["stop` + varRandom + `"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            //"signame":"stopReservoir",
            "signame":"stop` + varRandom + `",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ), // Fin emit

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        ),

        hh.EXIT(
        {
          "trap` + varRandom + `":"trap` + varRandom + `",
          "%location":{},
          "%tag":"break"
        }), // Exit
      ) // sequence
    ), // fork
  ), // trap

  hh.PAUSE(
    {
      "%location":{},
      "%tag":"yield"
    }
  )
),
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

  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  //var code = "";

  var code = `
hh.LOCAL(
  {
    "%location":{},
    "%tag":"signal"
  },
  hh.SIGNAL({
    "name":"stop` + varRandom + `"
  }),
`;

  code += `
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE(
          {
            "%location":{},
            "%tag":"seq"
          },
`;

  for (var i = 0; i < listTanks.length; i++) {
    var theTank = listTanks[i].replace(/ /g, "");
    code +=
      ` 
        hh.RUN(
          {
            "%location":{"filename":"","pos":1},
            "%tag":"run",
            "module": hh.getModule("`+ listTanks[i] + `", {"filename":"","pos":2}),
            "autocomplete":true,
            "stopReservoir":"stop` + varRandom + `"
          }
        ),
        `;
  }
  code +=
    ` 
      ),
      hh.SEQUENCE(
        {
          "%location":{},
          "%tag":"seq"
        },
        hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
`
  for (var i = 0; i < in_listGroups.length; i++) {
    code += `                   const ` + in_listGroups[i] + `IN =this["` + in_listGroups[i] + `IN"];
`
  };

  code += `                 return ` + in_listGroups[0] + `IN.now`;
  for (var i = 1; i < in_listGroups.length; i++) {
    code += ` || ` + in_listGroups[i] + `IN.now`;
  };

  code += `;
                })());},
              "countapply":function (){return `+ number_of_patterns + `;}
          },
`
  for (var i = 0; i < in_listGroups.length; i++) {
    code += `             hh.SIGACCESS({"signame":"` + in_listGroups[i] + `IN","pre":false,"val":false,"cnt":false}),
`
  };
  code +=
    `),
        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            //"stopReservoir":"stopReservoir",
            "stop` + varRandom + `" : "stop` + varRandom + `",
            "apply":function (){
              return ((() => {
                //const stopReservoir = this["stopReservoir"];
                const stop` + varRandom + ` = this["stop` + varRandom + `"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            //"signame":"stopReservoir",
            "signame":"stop` + varRandom + `",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ), // Fin emit
      )
    ),
  hh.PAUSE(
    {
      "%location":{},
      "%tag":"yield"
    }
  )
),
`;
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

  var varRandom = Math.floor((Math.random() * 1000000) + 1);

  var code = `
hh.LOCAL(
  {
    "%location":{},
    "%tag":"signal"
  },
  hh.SIGNAL({
    "name":"stop` + varRandom + `"
  }),
`;

  code += `
    hh.TRAP(
      {
        "trap`+ varRandom + `":"trap` + varRandom + `",
        "%location":{},
        "%tag":"trap`+ varRandom + `"
      },
      hh.FORK(
        {
          "%location":{},
          "%tag":"fork"
        },
        hh.SEQUENCE( // sequence 1
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },`;

  for (var i = 0; i < listTanks.length; i++) {
    var theTank = listTanks[i].replace(/ /g, "");
    code +=
      ` 
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.RUN(
                {
                  "%location":{"filename":"","pos":1},
                  "%tag":"run",
                  "module": hh.getModule("`+ listTanks[i] + `", {"filename":"","pos":2}),
                  "autocomplete":true,
                  "stopReservoir":"stop` + varRandom + `"
                }
              ),
            ),
            `;
  }
  code +=
    ` 
        )
      ),
      hh.SEQUENCE(
        {
          "%location":{},
          "%tag":"seq"
        },
        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },
`;
  for (var i = 0; i < in_patterns_list.length; i++) {
    code += `
              hh.AWAIT(
                {"%location":{},
                "%tag":"await","immediate":false,
                "apply":function (){
                    return ((() => {
                      const patternSignal=this["patternSignal"];
                      return patternSignal.now && (patternSignal.nowval[1] === ` + in_patterns_list[i] + `);
                    })());
                  }
                },
                hh.SIGACCESS({"signame":"patternSignal","pre":false,"val":false,"cnt":false})
              ),`;
  }
  code +=
    `
        ), // fin fork
        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "stop` + varRandom + `" : "stop` + varRandom + `",
            "apply":function (){
              return ((() => {
                const stop` + varRandom + ` = this["stop` + varRandom + `"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"stop` + varRandom + `",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ), // Fin emit

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        ),

        hh.EXIT(
        {
          "trap` + varRandom + `":"trap` + varRandom + `",
          "%location":{},
          "%tag":"break"
        }), // Exit
      ) // sequence


    ), // fork
  ), // trap

  hh.PAUSE(
    {
      "%location":{},
      "%tag":"yield"
    }
  )
),
`;
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
hh.ABORT(
  {
    "%location":{abort:stopMoveTempo},
    "%tag":"abort",
    "immediate":false,
    "apply": function (){return ((() => {
        const stopMoveTempo =this["stopMoveTempo"];
        return stopMoveTempo.now;
    })());},
  },
  hh.SIGACCESS({
    "signame":"stopMoveTempo",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  hh.EVERY(
    {
      "%location":{every: ` + signal + `},
      "%tag":"do/every",
      "immediate":false,
      "apply": function (){return ((() => {
          const ` + signal + `=this["` + signal + `"];
          return ` + signal + `.now;
      })());},
      "countapply":function (){ return  `+ every + `;}
    },
    hh.SIGACCESS({
      "signame":"` + signal + `",
      "pre":false,
      "val":false,
      "cnt":false
    }),
    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          moveTempo(`+ value + `, ` + limit + `);
        }
      }
    )
  )
),

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
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit", 
        "stopMoveTempo":"stopMoveTempo"
      },
      hh.SIGACCESS({
        "signame":"stopMoveTempo",
        "pre":true,
        "val":true,
        "cnt":false
      })
    ),
    `;
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
Blockly.JavaScript['hh_orchestration'] = function (block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_modules = Blockly.JavaScript.statementToCode(block, 'MODULES');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

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
Blockly.JavaScript['hh_ORCHESTRATION'] = function (block) {
  var number_trajet = block.getFieldValue('trajet');
  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');

  var statements_modules = Blockly.JavaScript.statementToCode(block, 'MODULES');

  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

  var code = `
"use strict";
var hh = require("../hiphop/hiphop.js");

// C'est la seule façon d'échanger les paramètres nécessaires à la compilation
// lors de la création des signaux.
var par = require('../serveur/skiniParametres');

var midimix;
var oscMidiLocal;

var gcs;
var DAW;
var serveur;

var debug = false;
var debug1 = true;

// Avec des valeurs initiales
var CCChannel = 1;
var CCTempo = 100;
var tempoMax = 160;
var tempoMin = 40;
var tempoGlobal = 60;

function setServ(ser, daw, groupeCS, oscMidi, mix){
  //console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}
exports.setServ = setServ;

function setTempo(value){
  tempoGlobal = value;

  if(midimix.getAbletonLinkStatus()) {
    if(debug) console.log("ORCHESTRATION: set tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }
  if ( value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  var tempo = Math.round(127/(tempoMax - tempoMin) * (value - tempoMin));
  if (debug) {
    console.log("Set tempo blockly:", value, par.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW() );
  }
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

var tempoValue = 0;
var tempoRythme = 0;
var tempoLimit = 0;
var tempoIncrease = true;
var transposeValue = 0;
var ratioTranspose = 1.763;
var offsetTranspose = 63.5;

function moveTempo(value, limit){

  if(tempoLimit >= limit){
    tempoLimit = 0;
    tempoIncrease = !tempoIncrease;
  }

  if(tempoIncrease){
    tempoGlobal += value;
  }else{
    tempoGlobal -= value;
  }
  if(debug) console.log("moveTempo:", tempoGlobal);
  setTempo(tempoGlobal);
  tempoLimit++;
}

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];
var halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
var tickCounter = 0;

for (var i=0; i < par.groupesDesSons.length; i++) {
  if(par.groupesDesSons[i][0] !== "") {
    var signalName = par.groupesDesSons[i][0] + "OUT";
    
    if(debug) console.log("Signal Orchestration:", signalName);

    var signal = hh.SIGNAL({
      "%location":{},
      "direction":"OUT",
      "name":signalName,
      "init_func":function (){return [false, -1];}
    });
    signals.push(signal);
  }
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  if(par.groupesDesSons[i][0] !== "") {
    var signalName = par.groupesDesSons[i][0] + "IN";
    
    if(debug) console.log("Signal Orchestration:", signalName);
    
    var signal = hh.SIGNAL({
      "%location":{},
      "direction":"IN",
      "name":signalName
    });
    signals.push(signal);
  }
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: Number of nets in Orchestration:",machine.nets.length);
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
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC0"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC1"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC2"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC3"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC4"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC5"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC6"}), 
    hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC7"}),
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopReservoir"}),
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopMoveTempo"}),

  ` + statements_signals + `
  hh.LOOP(
    {
     "%location":{loop: 1},
      "%tag":"loop"
    },
    hh.ABORT(
      {
        "%location":{abort: halt},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const halt=this["halt"];
            return halt.now;
        })());},
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"halt",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":true,
          "apply":function () {
            return ((() => {
              const start=this["start"];
              return start.now;
            })());
          },
        },
        hh.SIGACCESS({
          "signame":"start",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.FORK(
        {"%location":{},"%tag":"fork"},
        hh.SEQUENCE(
         {"%location":{},"%tag":"fork"},
        ` + statements_body + `
        ),
        hh.SEQUENCE(
        {"%location":{},"%tag":"fork"},
        hh.EVERY(
          {
            "%location":{},
            "%tag":"every",
            "immediate":false,
            "apply": function (){return ((() => {
                  const tick = this["tick"];
                  return tick.now;
            })());},
          },
          hh.SIGACCESS({
              "signame":"tick",
              "pre":false,
              "val":false,
              "cnt":false
          }),
            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  gcs.setTickOnControler(tickCounter);
                  tickCounter++;
                }
              }
            )
          )
        )
      )
    )
  )
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

Blockly.JavaScript['hh_module'] = function (block) {

  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  let name = value_name.replace(/\'/g, "");

  var statements_signals = Blockly.JavaScript.statementToCode(block, 'SIGNALS');
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';

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
hh.RUN({
  "%location":{},
  "%tag":"run",
  "module": hh.getModule(  "` + modulehh + `", {}),
  `
  for (var i = 0; i < listGroupes.length; i++) {
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

Blockly.JavaScript['hh_declare_signal'] = function (block) {
  var value_signal = Blockly.JavaScript.valueToCode(block, 'signal', Blockly.JavaScript.ORDER_ATOMIC);
  let value = value_signal.replace(/\'/g, "");

  var dropdown_type = block.getFieldValue('TYPE');

  var code = `
  hh.SIGNAL({
    "%location":{},
    "direction":"` + dropdown_type + `",
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

Blockly.JavaScript['hh_emit_value'] = function (block) {
  var number_signal_value = block.getFieldValue('Signal_Value');
  var value_signal = Blockly.JavaScript.valueToCode(block, 'SIGNAL', Blockly.JavaScript.ORDER_ATOMIC);

  let value = value_signal.replace(/\'|\(|\)/g, "");

  var code = `
    hh.EMIT(
      {
        "%location":{},
        "%tag":"emit", 
        "`+ value + `":"` + value + `",
        "apply":function (){
          return ((() => {
            //const `+ value + `=this["` + value + `"];
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
      hh.EMIT(
        {
          "%location":{},
          "%tag":"emit", 
          "`+ value + `":"` + value + `",
          "apply":function (){
            return ((() => {
              //const `+ value + `=this["` + value + `"];
              return `+ signal_value + `;
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
  hh.AWAIT(
    {
      "%location":{},
      "%tag":"await",
      "immediate":true,
      "apply":function () {
        return ((() => {
          const ` + value + `=this["` + value + `"];
          return ` + value + `.now;
        })());
      }
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

// NodeSkini
Blockly.defineBlocksWithJsonArray([
  {
    "type": "hh_wait_for_var",
    "message0": "wait for (var) %1 signal %2",
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
  times = signal_value.replace(/'/g, "");

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

Blockly.JavaScript['hh_print_serveur'] = function (block) {
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

Blockly.JavaScript['hh_pause'] = function (block) {
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

Blockly.JavaScript['hh_sequence'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
      hh.SEQUENCE(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
            "%tag":"seq"
          },
  
  `+ statements_body + `
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

Blockly.JavaScript['hh_fork'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
      hh.FORK(
          {
            "%location":{},
            "%tag":"fork"
          },
  
  `+ statements_body + `
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

Blockly.JavaScript['hh_loop'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
  var code = `
hh.LOOP(
    {
      "%location":{loop: 1},
      "%tag":"loop"
    },
    `+ statements_body + `
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

Blockly.JavaScript['hh_loopeach'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
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
  `+ statements_body + `
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

Blockly.JavaScript['hh_every'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
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
  `+ statements_body + `
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

Blockly.JavaScript['hh_abort'] = function (block) {
  var statements_body = Blockly.JavaScript.statementToCode(block, 'BODY');
  if (statements_body === '') return '';
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
  `+ statements_body + `
),
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
  hh.TRAP(
  {
    "`+ value + `":"` + value + `",
    "%location":{},
    "%tag":"`+ value + `"
  },
  `+ statements_body + `
),
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
  hh.EXIT(
  {
    "` + value + `":"` + value + `",
    "%location":{},
    "%tag":"break"
  }),
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
  hh.ATOM(
    {
    "%location":{},
    "%tag":"node",
    "apply":function () {
      // exe_javascript 
      `+ JScode + `;
      }
    }
  ),
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
      hh.AWAIT(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"await",
          "immediate":false,
          "apply":function (){
            return ((() => {
              const INTERFACEZ_RC` + sensor + ` = this["INTERFACEZ_RC` + sensor + `"];
              //console.log("*****", ` + sensor + `, ` + lowValue + `,` + highValue + `, INTERFACEZ_RC.nowval );
              if( INTERFACEZ_RC` + sensor + `.nowval !== undefined ) {
                return INTERFACEZ_RC` + sensor + `.now && ( INTERFACEZ_RC` + sensor + `.nowval[0] === ` + sensor + `
                  && INTERFACEZ_RC` + sensor + `.nowval[1] >` + lowValue + ` 
                  && INTERFACEZ_RC` + sensor + `.nowval[1] <` + highValue + `);
              }
            })());
          },
          "countapply":function (){ return ` + times + `;}
        },
        hh.SIGACCESS(
          {"signame":"INTERFACEZ_RC` + sensor + `",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),
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

hh.LOOPEACH(
  {
    "%location":{"filename":"hiphop_blocks.js","pos":189},
    "%tag":"do/every",
    "immediate":false,
    "apply": function (){return ((() => {
        const INTERFACEZ_RC = this["INTERFACEZ_RC"];
        if( INTERFACEZ_RC.nowval !== undefined ) {
          return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC.nowval[1] <` + highValue + `);
        }
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"INTERFACEZ_RC",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body + `
),
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

hh.EVERY(
  {
    "%location":{"filename":"hiphop_blocks.js","pos":189},
    "%tag":"do/every",
    "immediate":false,
    "apply": function (){return ((() => {
        const INTERFACEZ_RC = this["INTERFACEZ_RC"];
        if( INTERFACEZ_RC.nowval !== undefined ) {
          return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC.nowval[1] <` + highValue + `);
        }
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"INTERFACEZ_RC",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body + `
),
`;
  return code;
};

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

hh.ABORT(
  {
    "%location":{"filename":"hiphop_blocks.js","pos":189},
    "%tag":"do/every",
    "immediate":false,
    "apply": function (){return ((() => {
        const INTERFACEZ_RC = this["INTERFACEZ_RC"];
        if( INTERFACEZ_RC.nowval !== undefined ) {
          return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === ` + sensor + `
            && INTERFACEZ_RC.nowval[1] >` + lowValue + ` 
            && INTERFACEZ_RC.nowval[1] <` + highValue + `);
        }
    })());},
    "countapply":function (){ return ` + times + `;}
  },
  hh.SIGACCESS({
    "signame":"INTERFACEZ_RC",
    "pre":false,
    "val":false,
    "cnt":false
  }),
  `+ statements_body + `
),
`;
  return code;
};
