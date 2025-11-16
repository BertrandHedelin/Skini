
"use strict"
"use hopscript"

// node ..\..\..\node_modules\@hop\hiphop\bin\hhc.mjs .\makeAwait.hh.js -o .\makeAwait.mjs

function makeAwait(instruments, groupeClient) {
  return hiphop fork ${
    instruments.map(val => hiphop {
      await(this[`${val}IN`].now);
     emit ${`${val}OUT`}([false, groupeClient]);
     host{ console.log("makeAwait", val)}
  })}
}