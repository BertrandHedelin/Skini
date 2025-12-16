
"use strict"
"use hopscript"
// node ..\..\node_modules\@hop\hiphop\bin\hhc.mjs .\makeReservoir.hh.js -o .\makeReservoir.mjs

let serveur;
let gcs;
export function initMakeReservoir(_gcs, _serveur) {
  gcs = _gcs;
  serveur = _serveur;
}

export function makeAwait(instruments, groupeClient) {
  return hiphop fork ${
    instruments.map(val => hiphop {
    await(this[`${val}IN`].now);
    emit ${`${val}OUT`}([false, groupeClient]);
  })}
}

export function makeReservoir(groupeClient, instrument) {
    return hiphop ${hiphop {
        laTrappe: {
        abort { // To kill  the tank
          host {
            console.log("--- MAKE RESERVOIR:", instrument[0]);
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
          host { console.log("--- FIN NATURELLE RESERVOIR:", instrument[0]); }
          break  laTrappe;
        } when (stopReservoir.now);

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
