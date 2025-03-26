import "./styles.css";
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
  let PIPE_OPEN = 80;
  const PIPE_MIN = 40;
  let SPEED = 150;
  let score = 0;

  function spawnPipe() {
    score += 1;
    const topHeight = k.rand(PIPE_MIN, PIPE_OPEN - PIPE_MIN);
    const bottomHeight = k.height() - PIPE_OPEN - topHeight;

    k.add([
      k.pos(k.width(), 0),
      k.rect(64, topHeight),
      k.color(0, 127, 255),
      k.area(),
      k.move(k.LEFT, SPEED),
      k.offscreen({ destroy: true }),
      'pipe',
    ]);
    k.add([
      k.pos(k.width(), topHeight + PIPE_OPEN),
      k.rect(64, bottomHeight),
      k.color(0, 127, 255),
      k.area(),
      k.move(k.LEFT, SPEED),
      k.offscreen({ destroy: true }),
      'pipe',
    ]);
    k.add([
      k.text(score.toString()),
      k.pos(k.width() + 30, k.height() - 20),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.move(k.LEFT, SPEED),
      k.offscreen({ destroy: true }),
    ]);
  }

  k.loop(1, () => {
    spawnPipe();
    if (PIPE_OPEN > PIPE_MIN) {
      PIPE_OPEN -= 1;
      SPEED += 5;
    }
  });

  k.add([
    k.rect(k.width(), 16),
    k.pos(0, k.height() - 16),
    k.area(),
    k.body({ isStatic: true }),
    k.color(127, 200, 255),
  ]);

  k.setGravity(400);

  const player = k.add([k.rect(20, 20), k.pos(100, 100), k.area(), k.body()]);

  player.onCollide('pipe', () => {
    k.go('gameOver');
  });

  player.onUpdate(() => {
    if (player.pos.y <= 0) {
      k.go('gameOver');
    }
  });

  k.onButtonDown('jump', () => {
    player.jump(100);
  });
});

k.scene('gameOver', () => {
  k.add([
    k.text('Du bist vol kage hahah'),
    k.color(255, 0, 0),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor('center'),
  ]);
  k.onClick(() => {
    k.go('game');
  });
  k.onButtonDown('jump', () => {
    k.go('game');
  });
});

k.go('game');
