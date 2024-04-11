import { ReactiveMachine } from "@hop/hiphop";

const HelloWorld = hiphop module() {
  in A, B, R;
  out O, P;
  do {
     fork {
      await(A.now);
        emit P();
    } par {
      await(B.now);
    }
     emit O();
     host{ console.log("aaaa"); }
  } every(R.now)
}

export function runHH() {
  const m = new ReactiveMachine(HelloWorld, "ABRO");
  m.addEventListener("O", e => console.log("got: ", e));
  m.addEventListener("P", e => console.log("got: ", e));
  m.react({ A: 1 });
  m.react({ B: 2 });
  m.react({ R: true });
  m.react({ A: 3, B: 4 });
}
