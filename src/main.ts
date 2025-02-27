import './style.css';
import kaplay from 'kaplay';

const k = kaplay({
  width: 320,
  height: 180,
  scale: 2,
  letterbox: true,
  buttons: {
    jump: {
      keyboard: ['space'],
    },
  },
});

k.scene('game', () => {
  k.add([
    k.rect(k.width(), 16),
    k.pos(0, 0),
    k.anchor('bot'),
    k.area(),
    k.body({ isStatic: true }),
  ]);
  k.add([
    k.rect(k.width(), 16),
    k.pos(0, k.height() - 16),
    k.area(),
    k.body({ isStatic: true }),
    k.color(127, 200, 255),
  ]);

  k.setGravity(200);

  const player = k.add([k.rect(20, 20), k.pos(100, 100), k.area(), k.body()]);
  player.move(0, 100);

  k.onButtonDown('jump', () => {
    player.jump(150);
  });
});

k.go('game');
