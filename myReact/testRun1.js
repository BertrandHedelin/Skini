var sub1, toto, titi;



hh = require("../hiphop/hiphop.js");


  sub1 = hh.MODULE({"id":"sub1","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"toto"
      }),


    hh.AWAIT(
      {
        "%location":{},
        "%tag":"await",
        "immediate":false,
        "apply":function () {
          return ((() => {
            const toto=this["toto"];
            return toto.now;
          })());
        },
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"toto",
        "pre":false,
        "val":false,
        "cnt":false
      })
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Sub1');}
      }
    ),

  );


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
          "%location":{every: toto},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const toto=this["toto"];
              return toto.now;
          })());},
          "countapply":function (){ return 1;}
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

            hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "sub1", {}),
            "toto":"",
              "titi":"",

          }),

      ),

      ),

    ),


);

module.exports=prg;

prg.react();
