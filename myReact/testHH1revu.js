var toto, titi;



hh = require("../hiphop/hiphop.js");

prg = hh.MACHINE({"id":"prg","%location":{},"%tag":"machine"},


    hh.SIGNAL({
      "%location":{},
      "direction":"IN",
      "name":"toto"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"OUT",
      "name":"titi"
    }),



  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('message serveur');}
    }
  ),

  hh.FORK(
    {"%location":{"filename":"emit-if2.hh.js","pos":95},"%tag":"fork"},
    hh.SEQUENCE(
          {"%location":{"filename":"emit-if2.hh.js","pos":168},"%tag":"seq"},

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "titi":"titi",
              "apply":function (){
                return ((() => {
                  //const titi=this["titi"];
                  return 25;
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"titi",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),

      hh.PAUSE(
        {
          "%location":{"filename":"emit-if2.hh.js","pos":148},
          "%tag":"yield"
        }
      ),
  ),
    hh.SEQUENCE(
          {"%location":{"filename":"emit-if2.hh.js","pos":168},"%tag":"seq"},

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":true,
          "apply":function () {
            return ((() => {
              const titi=this["titi"];
              return titi.now;
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"titi",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),
    ),
),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('message serveur 2');}
    }
  ),


);

module.exports=prg;

prg.react();
//prg.react("titi");
prg.react();
