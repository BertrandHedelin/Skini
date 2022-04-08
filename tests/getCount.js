const slowFunction = () => {
  let counter = 0;
  while (counter < 5000000000) {
    counter++;
  }

  return counter;
}

process.on('message', (message) => {
  if (message == 'START') {
    console.log('Child process received START message');
    let slowResult = slowFunction();
    let message = `{"totalCount":${slowResult}}`;
    process.send(message);
  }
});