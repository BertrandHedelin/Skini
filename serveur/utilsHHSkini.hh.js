/**
 * @fileOverview Utilitaires en hiphop.js pour Skini
 *
 *  node ../node_modules/@hop/hiphop/bin/hhc.mjs utilsHHSkini.hh.js -o utilsHHSkini.mjs
 *
 * @copyright (C) 2019-2025 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.0
 */
import { ReactiveMachine } from "@hop/hiphop";

// Création réservoir ***********************************************************
function makeAwait(instruments, groupeClient) {
  return hiphop fork ${
    instruments.map(val => hiphop {
      await(this[`${val}IN`].now);
      emit ${`${val}OUT`}([false, groupeClient]);
     //host{ console.log("---------------------------- makeAwait", instruments, groupeClient)}
  })}
}

function makeReservoir(groupeClient, instrument) {
  return hiphop ${hiphop {
      laTrappe: {
        abort immediate(stopReservoir.now) { // To kill  the tank
            host {
              console.log("--- MAKE RESERVOIR:", instrument[0], ", groupeClient: ", groupeClient);
              var msg = {
                type: 'startTank',
                value: instrument[0]
              }
              serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
            }
            ${
                instrument.map(val => hiphop {
                emit ${`${val}OUT`} ([true, groupeClient])
                })
            }
            host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], true); }
            ${ makeAwait(instrument, groupeClient) }
            host { console.log("--- FIN NATURELLE RESERVOIR:", instrument[0]); }
            break  laTrappe;
        }

        host { console.log("--- FIN FORCEE DU RESERVOIR:", instrument[0]); }
        ${
          instrument.map(val => hiphop {
          emit ${`${val}OUT`} ([false, groupeClient])})
        }

        host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], false); }
        host {
          console.log("--- ABORT RESERVOIR:", instrument[0]);
          var msg = {
            type: 'killTank',
            value: instrument[0]
          }
          serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
        }
      }
    }
  }
}

