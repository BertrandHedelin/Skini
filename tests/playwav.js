const player = require('node-wav-player');
player.play({
  path: './polarwind.wav',
}).then(() => {
  console.log('The wav file started to be played successfully.');
}).catch((error) => {
  console.error(error);
});