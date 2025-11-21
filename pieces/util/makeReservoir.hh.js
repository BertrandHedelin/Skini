
"use strict"
"use hopscript"

// node ..\..\..\node_modules\@hop\hiphop\bin\hhc.mjs .\makeReservoir.hh.js -o .\makeReservoir.mjs
function makeAwait(instruments, groupeClient) {
  return hiphop fork ${
    instruments.map(val => hiphop {
    await(this[`${val}IN`].now);
    emit ${`${val}OUT`}([false, groupeClient]);
    host{ console.log("makeAwait", val)}
  })}
}

function makeReservoir(groupeClient, instrument, gcs, serveur) {
    return hiphop ${hiphop {
        laTrappe: {
        abort immediate(stopReservoir.now) { // To kill  the tank
          host {
            console.log("--- MAKE RESERVOIR V2:", instrument[0], ", groupeClient: ", groupeClient, serveur);
            serveur.broadcast(JSON.stringify({
              type: 'startTank',
              value: instrument[0]
            })); // Pour les gestions des tanks dans l'affichage de la partition "score"
          }
          ${
            instrument.map(val => hiphop {
            emit ${`${val}OUT`} ([true, groupeClient])})
          }
          host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], true); }
          ${ makeAwait(instrument, groupeClient) }
          host { console.log("--- FIN NATURELLE RESERVOIR V2:", instrument[0]); }
          break  laTrappe;
        } 

        ${
          instrument.map(val => hiphop {
            emit ${`${val}OUT`} ([false, groupeClient])})
        }

        host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], false); }
        host {
          console.log("--- ABORT RESERVOIR:", instrument[0]);
          serveur.broadcast(JSON.stringify({
            type: 'killTank',
            value: instrument[0]
          }));  // Pour les gestions des tanks dans l'affichage de la partition "score"
        }
      }
    }
  }
}

