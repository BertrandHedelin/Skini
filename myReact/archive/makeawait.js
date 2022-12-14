

var violon = hh.MODULE({"id":"violon","%location":{},"%tag":"module"},
	hh.SIGNAL({"%location":{},"direction":"IN", "name":"violonsNoir1IN"}),
	hh.SIGNAL({"%location":{},"direction":"IN", "name":"violonsNoir2IN"}),
	hh.SIGNAL({"%location":{},"direction":"IN", "name":"stopReservoir"}),
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
				    	console.log("--- MAKE RESERVOIR:", violonsNoir1 );
						var msg = {
							type: 'startTank',
							value:  violonsNoir1
						}
						serveur.broadcast(JSON.stringify(msg));
			    	}
			    }
			),
			hh.EMIT(
		        {
		          "%location":{},
		          "%tag":"emit",
		          "violonsNoir1OUT":"violonsNoir1OUT",
		          "apply":function (){
		            return ((() => {
		              const violonsNoir1 = this["violonsNoir1OUT"];
		              return [true, 1 ];
		            })());
		          }
		        },
		        hh.SIGACCESS({
		          "signame":"violonsNoir1OUT",
		          "pre":true,
		          "val":true,
		          "cnt":false
		        })
		    ), // Fin emit violonsNoir1OUT true,
			hh.EMIT(
		        {
		          "%location":{},
		          "%tag":"emit",
		          "violonsNoir2OUT":"violonsNoir2OUT",
		          "apply":function (){
		            return ((() => {
		              const violonsNoir2 = this["violonsNoir2OUT"];
		              return [true, 1 ];
		            })());
		          }
		        },
		        hh.SIGACCESS({
		          "signame":"violonsNoir2OUT",
		          "pre":true,
		          "val":true,
		          "cnt":false
		        })
		    ), // Fin emit violonsNoir2OUT true
			hh.ATOM(
			    {
			    "%location":{},
			    "%tag":"node",
			    "apply":function () {
			    		gcs.informSelecteurOnMenuChange(1 , violonsNoir1, true);
			    	}
			    }
			),
	    
			hh.FORK( // debut du fork de makeAwait avec en premiere position:violonsNoir1
			{
				"%location":{},
				"%tag":"fork"
			},
		      
			hh.SEQUENCE( // Debut sequence pour violonsNoir1
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
			          const violonsNoir1IN  =this["violonsNoir1IN"];
			          return violonsNoir1IN.now;
			        })());},
			    },
			    hh.SIGACCESS({"signame":"violonsNoir1IN",
					"pre":false,
					"val":false,
					"cnt":false})
				), // Fin await violonsNoir1IN
				hh.EMIT(
				{
				  "%location":{},
				  "%tag":"emit",
				  "violonsNoir1OUT" : "violonsNoir1OUT",
				  "apply":function (){
				    return ((() => {
				      const violonsNoir1OUT = this["violonsNoir1OUT"];
				      return [true, 1];
				    })());
				  }
			    },
			    hh.SIGACCESS({
			      "signame":"violonsNoir1OUT",
			      "pre":true,
			      "val":true,
			      "cnt":false
			    }),
			 	), // Fin emit violonsNoir1OUT true
			) // Fin sequence pour violonsNoir1
,
			hh.SEQUENCE( // Debut sequence pour violonsNoir2
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
			          const violonsNoir2IN  =this["violonsNoir2IN"];
			          return violonsNoir2IN.now;
			        })());},
			    },
			    hh.SIGACCESS({"signame":"violonsNoir2IN",
					"pre":false,
					"val":false,
					"cnt":false})
				), // Fin await violonsNoir2IN
				hh.EMIT(
				{
				  "%location":{},
				  "%tag":"emit",
				  "violonsNoir2OUT" : "violonsNoir2OUT",
				  "apply":function (){
				    return ((() => {
				      const violonsNoir2OUT = this["violonsNoir2OUT"];
				      return [true, 1];
				    })());
				  }
			    },
			    hh.SIGACCESS({
			      "signame":"violonsNoir2OUT",
			      "pre":true,
			      "val":true,
			      "cnt":false
			    }),
			 	), // Fin emit violonsNoir2OUT true
			) // Fin sequence pour violonsNoir2
		), // Fin fork de make await avec en premiere position:violonsNoir1
		hh.EXIT(
			{
			    "EXIT":"EXIT",
			    "%location":{},
			    "%tag":"break"
			})
		) // Fin Abort 
	), // Fin Trap

    
	hh.EMIT(
	    {
	      "%location":{},
	      "%tag":"emit",
	      "violonsNoir1OUT":"violonsNoir1OUT",
	      "apply":function (){
	        return ((() => {
	          const violonsNoir1 = this["violonsNoir1OUT"];
	          return [false, 1 ];
	        })());
	      }
	    },
	    hh.SIGACCESS({
	      "signame":"violonsNoir1OUT",
	      "pre":true,
	      "val":true,
	      "cnt":false
	    })
	), // Fin emit violonsNoir1OUT false,
	hh.EMIT(
	    {
	      "%location":{},
	      "%tag":"emit",
	      "violonsNoir2OUT":"violonsNoir2OUT",
	      "apply":function (){
	        return ((() => {
	          const violonsNoir2 = this["violonsNoir2OUT"];
	          return [false, 1 ];
	        })());
	      }
	    },
	    hh.SIGACCESS({
	      "signame":"violonsNoir2OUT",
	      "pre":true,
	      "val":true,
	      "cnt":false
	    })
	), // Fin emit violonsNoir2OUT false
	hh.ATOM(
	    {
	    "%location":{},
	    "%tag":"node",
	    "apply":function () {
	    		gcs.informSelecteurOnMenuChange(1 , violonsNoir1, false);
	    		console.log("--- ABORT RESERVOIR:", violonsNoir1);
	    		var msg = {
					type: 'killTank',
					value:  violonsNoir1
				}
				serveur.broadcast(JSON.stringify(msg));
	    	}
	    }
	) // Fin atom,
); // Fin module

