'use strict'

function  makeAwait(instrument, groupe) {
  var codeTotal = 
      `hh.FORK( // debut du fork de makeAwait  avec en premiere position:` +  instrument[0] + `
      {
        "%location":{},
        "%tag":"fork"
      },
      ` +
     instrument.map( function(val) {
      var code = `
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
	      "apply":function (){
	        return ((() => {
	          const ` +  val + `IN  =this["` +  val + `IN"];
	          return ` +  val + `IN.now;
	        })());},
	    }
	    ,
	    hh.SIGACCESS({"signame":"` +  val + `IN",
	      "pre":false,
	      "val":false,
	      "cnt":false})
	  ), // Fin await ` +  val + `IN
	  hh.EMIT(
	    {
	      "%location":{},
	      "%tag":"emit",
	      "` +  val + `OUT" : "` +  val + `OUT",
	      "apply":function (){
	        return ((() => {
	          const ` +  val + `OUT = this["` +  val + `OUT"];
	          return [true, ` + groupe + `];
	        })());
	      }
	    },
	    hh.SIGACCESS({
	      "signame":"` +  val + `OUT",
	      "pre":true,
	      "val":true,
	      "cnt":false
	    }),
	  ), // Fin emit ` +  val + `OUT true
	) // Fin sequence pour `+  val + `OUT true
`
    return code;
  });

  codeTotal += `), // Fin fork de make await avec en premiere position:` +  instrument[0];
  return codeTotal;
}

function makeReservoir(instrument, groupe) {
  var codeTotal = `
hh.TRAP(
{
	"EXIT":"EXIT",
	"%location":{},
	"%tag":"EXIT"
},

	hh.ABORT({
	  "%location":{},
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
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {
			    	console.log("--- MAKE RESERVOIR:", ` + instrument[0] + ` );
					var msg = {
						type: 'startTank',
						value:  ` + instrument[0] + `
					}
					serveur.broadcast(JSON.stringify(msg));
		    	}
		    }
		),

		` +
    	instrument.map( function(val) {
    	var code = `
		hh.EMIT(
	        {
	          "%location":{},
	          "%tag":"emit",
	          "` +  val + `OUT":"` +  val + `OUT",
	          "apply":function (){
	            return ((() => {
	              const ` +  val + ` = this["` +  val + `OUT"];
	              return [true, ` + groupe + ` ];
	            })());
	          }
	        },
	        hh.SIGACCESS({
	          "signame":"` +  val + `OUT",
	          "pre":true,
	          "val":true,
	          "cnt":false
	        })
	    ), // Fin emit ` +  val + `OUT true`
	    return code;
	})

	+ `
		hh.ATOM(
		    {
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {
		    		gcs.informSelecteurOnMenuChange(` + groupe + ` , ` + instrument[0] + `, true);
		    	}
		    }
		),
    ` +
	makeAwait(instrument, groupe)

	+ `
	hh.EXIT(
       {
            "EXIT":"EXIT",
            "%location":{},
            "%tag":"break"
        })
    ) // Fin Abort 
), // Fin Trap

    ` +
    instrument.map( function(val) {
	    var code = `
hh.EMIT(
    {
      "%location":{},
      "%tag":"emit",
      "` +  val + `OUT":"` +  val + `OUT",
      "apply":function (){
        return ((() => {
          const ` +  val + ` = this["` +  val + `OUT"];
          return [false, ` + groupe + ` ];
        })());
      }
    },
    hh.SIGACCESS({
      "signame":"` +  val + `OUT",
      "pre":true,
      "val":true,
      "cnt":false
    })
), // Fin emit ` +  val + `OUT false`
	return code;
	})
	 + `
hh.ATOM(
    {
    "%location":{},
    "%tag":"node",
    "apply":function () {
    		gcs.informSelecteurOnMenuChange(` + groupe + ` , ` + instrument[0] + `, false);
    		console.log("--- ABORT RESERVOIR:", ` + instrument[0] + `);
    		var msg = {
				type: 'killTank',
				value:  ` + instrument[0] + `
			}
			serveur.broadcast(JSON.stringify(msg));
    	}
    }
) // Fin atom,
`;
   return codeTotal;
}


//console.log(makeAwait( [ "violonsNoir1", "violonsNoir2"] , 1 ));
console.log(makeReservoir( [ "violonsNoir1", "violonsNoir2"] , 1 ));