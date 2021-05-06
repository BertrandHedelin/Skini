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


      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('message serveur');}
        }
      ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "toto":"toto",
              "apply":function (){
                return ((() => {
                  //const toto=this["toto"];
                  return 25;
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"toto",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),

      ),

          hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },



      hh.LOOPEACH(
        {
          "%location":{},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const toto=this["toto"];
              return toto.now;
          })());},
          "countapply":function (){ return 2;}
        },
        hh.SIGACCESS({
          "signame":"toto",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('message serveur 2');}
          }
        ),

      ),

      ),

    ),


);

module.exports=prg;

prg.react();
prg.react();
prg.react();
console.log("1")
prg.react("toto");
console.log("2")
prg.react("toto");
console.log("3")