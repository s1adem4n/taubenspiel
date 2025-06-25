import './styles.css';
import k from '@/ctx';

import start from '@/scenes/start';
import game from '@/scenes/game';
import end from '@/scenes/end';

import addTouchControls from '@/utils/touch';

const assetBase = '/taubenspiel/assets';

k.loadSprite('pigeon', `${assetBase}/pigeon.png`, {
  sliceX: 4,
  sliceY: 1,
  anims: {
    fly: { from: 0, to: 3, loop: true },
  },
});
k.loadSprite('prompts', `${assetBase}/prompts.png`, {
  sliceX: 34,
  sliceY: 24,
});
k.loadSprite('heartBorder', `${assetBase}/heart/border.png`);
k.loadSprite('heart', `${assetBase}/heart/heart.png`);
k.loadSprite('heartBackground', `${assetBase}/heart/background.png`);

k.loadSound(
  'aintTalkinBout',
  `${assetBase}/music/aint_talkin_bout_dub.mp3`
);

k.setLayers(['bg', 'obj', 'ui'], 'obj');

addTouchControls();

k.scene('start', start);
k.scene('game', game);
k.scene('end', end);
k.go('start');
