import k from '@/ctx';
import state from '@/config/state';
import constants from '@/config/constants';
import type { GameObj, HealthComp, PosComp, RotateComp } from 'kaplay';

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
    hoop.move(-state.speed * state.timeMultiplier * state.baseTime, 0);
  });
  hoop.add([
    k.pos(4, -1),
    k.rect(24, 8),
    k.color(255, 0, 0),
    k.area(),
    'hoopOpen',
  ]);
}

function spawnPackage(player: GameObj<PosComp & RotateComp & HealthComp>) {
  const radians = k.deg2rad(player.angle);
  const startPos = k.vec2(
    player.pos.x + Math.cos(radians) * constants.PACKAGE_OFFSET_DISTANCE,
    player.pos.y + Math.sin(radians) * constants.PACKAGE_OFFSET_DISTANCE
  );
  const p = k.add([
    k.rect(10, 10),
    k.color(255, 0, 0),
    k.pos(startPos.x, startPos.y),
    k.body(),
    k.area(),
    k.offscreen({ destroy: true }),
    'package',
    {
      healthRemoved: false,
    },
  ]);
  const impulseX = Math.cos(radians);
  const impulseY = Math.sin(radians);
  p.applyImpulse(
    k.vec2(impulseX, impulseY).scale(constants.PACKAGE_INTENSITY)
  );

  p.onCollide('hoopOpen', (h) => {
    k.addKaboom(h.parent!.pos.add(20, 0), { scale: 0.25 });
    h.parent!.destroy();
    p.destroy();
  });
  p.onCollide('ground', () => {
    if (!p.healthRemoved) {
      player.hp--;
      p.healthRemoved = true;
    }
    p.vel.x = 0;
    p.vel.y = 0;
  });
}

export default function game() {
  if (!state.music) {
    state.music = k.play('aintTalkinBout', {
      loop: true,
      volume: 0.5,
    });
  }

  state.gravity =
    constants.GRAVITY * state.timeMultiplier * state.baseTime;

  k.onUpdate(() => {
    if (!state.music) return;
    state.music.speed = k.lerp(
      state.music.speed,
      state.timeMultiplier * state.baseTime,
      3 * k.dt()
    );
  });

  k.loop(3, () => {
    spawnHoop();
  });

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
    k.sprite('pigeon'),
    k.pos(20, 50),
    k.area(),
    k.body(),
    k.health(3),
    k.rotate(0),
  ]);
  player.play('fly');

  player.onCollide('ground', () => {
    player.hp = 0;
  });

  player.onDeath(() => {
    k.go('end');
  });

  player.onUpdate(() => {
    if (!throwHeld) {
      player.angle = k.lerp(
        player.angle,
        0,
        3 * k.dt() * state.timeMultiplier * state.baseTime
      );
    }
  });
  player.onButtonDown('jump', () => {
    if (!throwHeld) {
      player.jump(100 * state.timeMultiplier * state.baseTime);
    }
  });

  // Create the trajectory container
  const trajectoryContainer = k.add([k.pos(0, 0)]);

  player.onButtonDown('throw', () => {
    if (state.cancelFirstThrow) {
      return;
    }

    throwHeld = true;
    state.timeMultiplier = 0.5;

    trajectoryContainer.removeAll();

    // Calculate startPos based on player position and angle
    const radians = k.deg2rad(player.angle);
    const startPos = k.vec2(
      player.pos.x + Math.cos(radians) * constants.PACKAGE_OFFSET_DISTANCE,
      player.pos.y + Math.sin(radians) * constants.PACKAGE_OFFSET_DISTANCE
    );
    const impulseX = Math.cos(radians);
    const impulseY = Math.sin(radians);
    const velocity = k
      .vec2(impulseX, impulseY)
      .scale(constants.PACKAGE_INTENSITY * 0.75);

    for (let i = 0; i < constants.TRAJECTORY_POINTS; i++) {
      const t = i * constants.TRAJECTORY_SPACING;
      const gravity = k.vec2(
        0,
        constants.GRAVITY * state.timeMultiplier * state.baseTime
      );

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

    state.gravity = 0;
    let targetAngel = -90;
    player.angle = k.lerp(
      player.angle,
      targetAngel,
      2 * k.dt() * state.timeMultiplier * state.baseTime
    );
    player.vel.y = 10;
  });

  player.onButtonRelease('throw', () => {
    if (state.cancelFirstThrow) {
      state.cancelFirstThrow = false;
      return;
    }

    throwHeld = false;
    state.timeMultiplier = 1;

    trajectoryContainer.removeAll();
    state.gravity =
      constants.GRAVITY * state.timeMultiplier * state.baseTime;
    player.angle = k.lerp(
      player.angle,
      0,
      3 * k.dt() * state.timeMultiplier * state.baseTime
    );
    spawnPackage(player);
  });

  const hearts = k.add([
    k.pos(k.width() - 8, 8),
    k.anchor('topright'),
    k.layer('ui'),
    {
      gap: 2,
    },
  ]);
  updateHearts();
  function updateHearts() {
    hearts.removeAll();
    for (let i = 0; i < player.maxHP; i++) {
      const heart = hearts.add([
        k.sprite('heartBorder'),
        k.pos(-i * (16 + hearts.gap), 0),
        k.anchor('topright'),
        k.opacity(),
      ]);
      heart.add([
        k.sprite('heartBackground'),
        k.pos(0, 0),
        k.anchor('topright'),
      ]);
      if (i < player.hp) {
        heart.add([k.sprite('heart'), k.pos(0, 0), k.anchor('topright')]);
      }
    }
  }

  player.onHurt(() => {
    updateHearts();
  });
  player.onHeal(() => {
    updateHearts();
  });
}
