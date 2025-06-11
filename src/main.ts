import './styles.css';
import briefos from './Briefos.png';
import prompts from './prompts.png';
import kaplay, { GameObj, OpacityComp } from 'kaplay';

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
k.loadSprite('briefos', briefos, {
  sliceX: 4,
  sliceY: 1,
  anims: {
    fly: { from: 0, to: 3, loop: true },
  },
});
k.loadSprite('prompts', prompts, {
  sliceX: 34,
  sliceY: 24,
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

function pulse(start: number, end: number, speed: number) {
  return {
    update(this: GameObj<OpacityComp>) {
      const t = (k.time() * speed) % 1;
      const opacity = k.lerp(start, end, Math.abs(Math.sin(t * Math.PI)));
      this.opacity = opacity;
    },
  };
}

k.scene('start', () => {
  k.onClick(() => {
    k.go('game');
  });

  const left = k.add([
    k.pos(8, k.height() / 2 - 8),
    k.anchor('topleft'),
    k.rect(k.width() * 0.4, k.height() / 2, { radius: 8 }),
    k.color(0, 0, 0),
    k.opacity(),
    pulse(0.3, 0.5, 0.5),
  ]);
  left.add([
    k.pos((k.width() * 0.4) / 2, 16),
    k.text('Fliegen', {
      size: 18,
    }),
    k.anchor('center'),
  ]);
  left.add([
    k.pos((k.width() * 0.4) / 2, 50),
    k.sprite('prompts', {
      frame: 579,
      width: 24,
      height: 24,
    }),
    k.anchor('center'),
  ]);

  const right = k.add([
    k.pos(k.width() / 2 + 24, k.height() / 2 - 8),
    k.anchor('topleft'),
    k.rect(k.width() * 0.4, k.height() / 2, { radius: 8 }),
    k.color(0, 0, 0),
    k.opacity(),
    pulse(0.3, 0.5, 0.5),
  ]);
  right.add([
    k.pos((k.width() * 0.4) / 2, 16),
    k.text('Liefern', {
      size: 18,
    }),
    k.anchor('center'),
  ]);
  right.add([
    k.pos((k.width() * 0.4) / 2, 50),
    k.sprite('prompts', {
      frame: 579,
      width: 24,
      height: 24,
    }),
    k.anchor('center'),
  ]);
});

k.scene('game', () => {
  let timeMultiplier = 1;
  let speed = 60;
  let gravity = 400;
  const numTrajectoryPoints = 20;
  const trajectorySpacing = 0.05; // Time spacing between points
  const intensity = 250; // Initial velocity intensity
  const packageOffsetDistance = 35;
  k.setGravity(gravity * timeMultiplier);

  function spawnHoop() {
    const x = k.width();
    const y = Math.min(k.rand(0, 1) * k.height(), k.height() - 64);
    const hoop = k.add([
      k.pos(x, y),
      k.rect(32, 10),
      k.color(0, 127, 255),
      k.area(),
      k.body({ isStatic: true }),
      k.offscreen({ destroy: true }),
      'hoop',
    ]);
    hoop.onUpdate(() => {
      hoop.move(-speed * timeMultiplier, 0);
    });
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

  function spawnPackage() {
    const radians = k.deg2rad(player.angle);
    const startPos = k.vec2(
      player.pos.x + Math.cos(radians) * packageOffsetDistance,
      player.pos.y + Math.sin(radians) * packageOffsetDistance
    );
    const p = k.add([
      k.rect(10, 10),
      k.color(255, 0, 0),
      k.pos(startPos.x, startPos.y),
      k.body(),
      k.area(),
      k.offscreen({ destroy: true }),
      'package',
    ]);
    const impulseX = Math.cos(radians);
    const impulseY = Math.sin(radians);
    p.applyImpulse(k.vec2(impulseX, impulseY).scale(intensity));

    p.onCollide('hoopOpen', (h) => {
      k.addKaboom(h.parent!.pos.add(20, 0), { scale: 0.25 });
      h.parent!.destroy();
      p.destroy();
    });
    p.onCollide('ground', () => {
      k.go('gameOver');
    });
  }

  // ground
  k.add([
    'ground',
    k.rect(k.width(), 16),
    k.pos(0, k.height() - 16),
    k.area(),
    k.body({ isStatic: true }),
    k.color(127, 200, 255),
  ]);

  let throwHeld = false;
  const player = k.add([
    k.sprite('briefos'),
    k.pos(20, 100),
    k.area(),
    k.body(),
    k.rotate(0),
  ]);
  player.play('fly');

  player.onUpdate(() => {
    if (!throwHeld) {
      player.angle = k.lerp(player.angle, 0, 3 * k.dt() * timeMultiplier);
    }
  });
  player.onButtonDown('jump', () => {
    if (!throwHeld) {
      player.jump(100 * timeMultiplier);
    }
  });

  // Create the trajectory container
  const trajectoryContainer = k.add([k.pos(0, 0)]);

  player.onButtonDown('throw', () => {
    throwHeld = true;
    timeMultiplier = 0.5;

    trajectoryContainer.removeAll();

    // Calculate startPos based on player position and angle
    const radians = k.deg2rad(player.angle);
    const startPos = k.vec2(
      player.pos.x + Math.cos(radians) * packageOffsetDistance,
      player.pos.y + Math.sin(radians) * packageOffsetDistance
    );
    const impulseX = Math.cos(radians);
    const impulseY = Math.sin(radians);
    const velocity = k.vec2(impulseX, impulseY).scale(intensity * 0.75);

    for (let i = 0; i < numTrajectoryPoints; i++) {
      const t = i * trajectorySpacing;
      const gravity = k.vec2(0, 400 * timeMultiplier);

      // Position formula (uniform acceleration): p = p₀ + v₀t + ½at²
      const x = startPos.x + velocity.x * t;
      const y = startPos.y + velocity.y * t + 0.5 * gravity.y * t * t;

      // Add trajectory point
      trajectoryContainer.add([
        k.pos(x, y),
        k.circle(2),
        k.color(255, 0, 0),
        k.anchor('center'),
      ]);
    }

    k.setGravity(0);
    let targetAngel = -90;
    player.angle = k.lerp(
      player.angle,
      targetAngel,
      2 * k.dt() * timeMultiplier
    );
    player.vel.y = 10;
  });

  player.onButtonRelease('throw', () => {
    throwHeld = false;
    timeMultiplier = 1;

    spawnPackage();
    trajectoryContainer.removeAll();
    k.setGravity(gravity * timeMultiplier);
    player.angle = k.lerp(player.angle, 0, 3 * k.dt() * timeMultiplier);
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
    k.go('start');
  });
});

k.go('start');
