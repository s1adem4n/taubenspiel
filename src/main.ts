import './styles.css';
import k from '@/ctx';

import tutorial from '@/scenes/tutorial';
import game from '@/scenes/game';
import end from '@/scenes/end';
import test from '@/scenes/test';
import start from '@/scenes/start';

import addTouchControls from '@/utils/touch';

const assetBase = '/taubenspiel/assets';

if (window.screen.orientation.type !== 'landscape-primary') {
  alert('Bitte drehe dein Gerät in den Querformat-Modus.');
}

k.loadSprite('pigeon', `${assetBase}/pigeon.png`, {
  sliceX: 4,
  sliceY: 1,
  anims: {
    fly: { from: 0, to: 3, loop: true },
  },
});
k.loadSprite('package', `${assetBase}/package.png`, {
  sliceX: 7,
  sliceY: 1,
  anims: {
    explode: { from: 0, to: 6, loop: false },
  },
});

k.loadSprite('prompts', `${assetBase}/prompts.png`, {
  sliceX: 34,
  sliceY: 24,
});

k.loadSprite('heartBorder', `${assetBase}/heart/border.png`);
k.loadSprite('heart', `${assetBase}/heart/heart.png`);
k.loadSprite('heartBackground', `${assetBase}/heart/background.png`);

k.loadSprite('houseNormal', `${assetBase}/houses/normal.png`);
k.loadSprite('houseHotel', `${assetBase}/houses/hotel.png`);
k.loadSprite('houseDoppel', `${assetBase}/houses/doppel.png`);
k.loadSprite('houseBramstedt', `${assetBase}/houses/bramstedt.png`);
k.loadSprite('housePunk', `${assetBase}/houses/punk.png`);

k.loadSprite('background', `${assetBase}/background.png`);
k.loadSprite('title', `${assetBase}/title.png`);

k.loadSound('chippie', `${assetBase}/music/chippie.mp3`);
k.loadSound('troete', `${assetBase}/sounds/troete.mp3`);
k.loadSound('klingel', `${assetBase}/sounds/klingel.mp3`);
k.loadSound('hit', `${assetBase}/sounds/hit.wav`);

k.setLayers(['bg', 'obj', 'ui'], 'obj');

addTouchControls();

k.scene('start', start);
k.scene('tutorial', tutorial);
k.scene('game', game);
k.scene('end', end);
k.scene('test', test);
k.go('start');
