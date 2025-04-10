import './styles.css';
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
    throw: {
      keyboard: ['enter'],
    },
  },
});

let leftTouchId = -1;
let rightTouchId = -1;
window.addEventListener('pointerdown', (e) => {
  if (e.clientX < window.innerWidth / 2) {
    leftTouchId = e.pointerId;
    k.pressButton('jump');
  } else {
    rightTouchId = e.pointerId;
    k.pressButton('throw');
  }
});
window.addEventListener('pointerup', (e) => {
  if (e.pointerId === leftTouchId) {
    leftTouchId = -1;
    k.releaseButton('jump');
  } else if (e.pointerId === rightTouchId) {
    rightTouchId = -1;
    k.releaseButton('throw');
  }
});

k.scene('game', () => {
  let SPEED = 60;
  let score = 0;

  function spawnHoop() {
    score += 1;

    const x = k.width();
    const y = Math.min(k.rand(0, 1) * k.height(), k.height() - 64);
    const hoop = k.add([
      k.pos(x, y),
      k.rect(32, 10),
      k.color(0, 127, 255),
      k.area(),
      k.body({ isStatic: true }),
      k.move(k.LEFT, SPEED),
      k.offscreen({ destroy: true }),
      'hoop',
    ]);
    hoop.add([
      k.pos(4, -1),
      k.rect(24, 8),
      k.color(255, 0, 0),
      k.area(),
      'hoopOpen',
    ]);
  }

  k.loop(3, () => {
    spawnHoop();
  });

  k.add([
    k.rect(k.width(), 16),
    k.pos(0, k.height() - 16),
    k.area(),
    k.body({ isStatic: true }),
    k.color(127, 200, 255),
  ]);

  k.setGravity(400);

  const player = k.add([
    k.rect(20, 10),
    k.pos(20, 100),
    k.area(),
    k.body(),
    k.rotate(0),
  ]);

  let jumpHeld = false;
  player.onUpdate(() => {
    if (player.pos.y <= 0) {
      k.go('gameOver');
    }
    if (!jumpHeld) {
      player.angle = k.lerp(player.angle, 0, 3 * k.dt());
    }
  });

  let timeThrowHeld = 0;
  function spawnPackage() {
    const p = k.add([
      k.rect(10, 10),
      k.color(255, 0, 0),
      k.pos(player.pos.x + 20, player.pos.y - 20),
      k.body(),
      k.area(),
      k.offscreen({ destroy: true }),
      'package',
    ]);
    const radians = k.deg2rad(player.angle);
    const intensity = timeThrowHeld * 100 + 200;
    const impulseX = Math.cos(radians);
    const impulseY = Math.sin(radians);
    p.applyImpulse(k.vec2(impulseX, impulseY).scale(intensity));

    p.onCollide('hoopOpen', (h) => {
      h.parent!.destroy();
      p.destroy();
    });
  }

  const intensityText = k.add([
    k.text('0', { size: 16 }),
    k.color(255, 255, 255),
    k.pos(4, 4),
  ]);

  k.onButtonRelease('throw', () => {
    spawnPackage();
    timeThrowHeld = 0;
    intensityText.text = '0';
  });

  k.onButtonDown('throw', () => {
    timeThrowHeld += k.dt();
    intensityText.text = Math.floor(timeThrowHeld * 100).toString();
  });

  k.onButtonDown('jump', () => {
    player.jump(100);
    jumpHeld = true;
    player.angle = k.lerp(player.angle, -90, 5 * k.dt());
  });
  k.onButtonRelease('jump', () => {
    jumpHeld = false;
  });
});

k.scene('gameOver', () => {
  k.add([
    k.text('verloren o_o'),
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
