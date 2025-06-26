import k from '@/ctx';
import state from '@/config/state';
import constants from '@/config/constants';
import type { GameObj, HealthComp, PosComp, RotateComp } from 'kaplay';
import { pulse } from '@/components';

function spawnPackage(player: GameObj<PosComp & RotateComp & HealthComp>) {
  const radians = k.deg2rad(
    player.angle + constants.PACKAGE_RELATIVE_ANGLE
  );
  const startPos = k.vec2(
    player.pos.x + Math.cos(radians) * constants.PACKAGE_OFFSET_DISTANCE,
    player.pos.y + Math.sin(radians) * constants.PACKAGE_OFFSET_DISTANCE
  );
  const p = k.add([
    k.sprite('package', { frame: 0 }),
    k.pos(startPos.x, startPos.y),
    k.body(),
    k.area({
      shape: new k.Rect(k.vec2(9, 22), 14, 10),
    }),
    k.offscreen({ destroy: true }),
    'package',
    {
      shouldExplode: true,
      targetReached: false,
      isOnGround: false,
    },
  ]);
  const impulseX = Math.cos(radians);
  const impulseY = Math.sin(radians);
  p.applyImpulse(
    k.vec2(impulseX, impulseY).scale(constants.PACKAGE_INTENSITY)
  );

  p.onUpdate(() => {
    if (p.isOnGround) {
      p.move(-state.speed * state.timeMultiplier, 0);
    }
  });

  p.onCollide('ground', () => {
    if (!p.isOnGround) {
      p.vel.x = 0;
      p.isOnGround = true;
    }
    p.vel.y = 0;

    const colTarget = p.getCollisions().find((c) => c.target.is('target'));
    const colSource = p.getCollisions().find((c) => c.source.is('target'));
    const target = colTarget?.target || colSource?.source;

    if (!p.targetReached && target) {
      k.play('klingel', { volume: 0.7 });
      p.targetReached = true;
      p.shouldExplode = false;
      target.hit = true;
      state.score += constants.PACKAGE_SCORE;
    } else if (p.shouldExplode) {
      player.hp--;
      k.play('troete', { volume: 0.7 });
      p.play('explode');
      p.shouldExplode = false;
    }
  });
}

function tileToScaledPx(tile: number): number {
  return tile * constants.TILE_SIZE * constants.HOUSE_SCALE;
}
function tileToPx(tile: number): number {
  return tile * constants.TILE_SIZE;
}

interface House {
  sprite: string;
  w: number;
  h: number;
  target: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

const houses: House[] = [
  {
    sprite: 'houseNormal',
    w: tileToScaledPx(18),
    h: tileToScaledPx(9),
    target: {
      x: tileToPx(5),
      y: tileToPx(8),
      w: tileToPx(2),
      h: tileToPx(1),
    },
  },
  {
    sprite: 'houseHotel',
    w: tileToScaledPx(9),
    h: tileToScaledPx(10),
    target: {
      x: tileToPx(4),
      y: tileToPx(9),
      w: tileToPx(2),
      h: tileToPx(1),
    },
  },
  {
    sprite: 'houseDoppel',
    w: tileToScaledPx(40),
    h: tileToScaledPx(10),
    target: {
      x: tileToPx(18),
      y: tileToPx(8),
      w: tileToPx(4),
      h: tileToPx(2),
    },
  },
  {
    sprite: 'houseBramstedt',
    w: tileToScaledPx(26),
    h: tileToScaledPx(15),
    target: {
      x: tileToPx(5),
      y: tileToPx(14),
      w: tileToPx(4),
      h: tileToPx(1),
    },
  },
  {
    sprite: 'housePunk',
    w: tileToScaledPx(30),
    h: tileToScaledPx(15),
    target: {
      x: tileToPx(16),
      y: tileToPx(13),
      w: tileToPx(1),
      h: tileToPx(2),
    },
  },
];

function spawnHouses(player: GameObj) {
  const house = houses[k.randi(0, houses.length)];

  const obj = k.add([
    k.sprite(house.sprite),
    k.pos(k.width(), k.height() - house.h - constants.GROUND_HEIGHT),
    k.scale(constants.HOUSE_SCALE),
    k.z(-10),
    k.area({
      shape: new k.Rect(
        k.vec2(0, 0),
        house.w / constants.HOUSE_SCALE,
        house.h / constants.HOUSE_SCALE
      ),
    }),
  ]);

  let houseSpawned = false;
  obj.onUpdate(() => {
    obj.move(-state.speed * state.timeMultiplier, 0);
    if (
      !houseSpawned &&
      obj.pos.x < k.width() - house.w - constants.HOUSE_GAP
    ) {
      spawnHouses(player);
      houseSpawned = true;
    }

    if (obj.pos.x < -house.w) {
      obj.destroy();
    }
  });

  const target = obj.add([
    k.rect(house.target.w, house.target.h, { radius: 2, fill: false }),
    k.outline(4, k.Color.fromHex('#00c950')),
    k.pos(house.target.x, house.target.y),
    k.area(),
    pulse(0.5, 1, 0.8),
    'target',
    {
      hit: false,
    },
  ]);
  target.onDestroy(() => {
    if (!target.hit) {
      k.play('hit', { volume: 0.7 });
      player.hp--;
    }
  });
}

function showBackground() {
  const bgScale = 0.14;
  const bgWidth = 1920 * bgScale; // Assuming background sprite is 1920px wide

  const bg1 = k.add([
    k.sprite('background'),
    k.pos(0, 0),
    k.layer('bg'),
    k.scale(bgScale),
  ]);

  const bg2 = k.add([
    k.sprite('background'),
    k.pos(bgWidth, 0),
    k.layer('bg'),
    k.scale(bgScale),
  ]);

  const backgrounds = [bg1, bg2];

  k.onUpdate(() => {
    backgrounds.forEach((bg) => {
      // Move background to the left
      bg.move(-state.speed * state.timeMultiplier * 0.3, 0); // 0.3 for parallax effect

      // Reset position when it goes off screen
      if (bg.pos.x <= -bgWidth) {
        bg.pos.x = bgWidth;
      }
    });
  });
}

export default function game() {
  state.gravity = constants.GRAVITY * state.timeMultiplier;
  state.speed = constants.BASE_SPEED;
  state.score = 0;

  showBackground();

  k.onUpdate(() => {
    if (!state.music) return;
    state.music.speed = k.lerp(
      state.music.speed,
      state.timeMultiplier,
      3 * k.dt()
    );
  });

  k.onUpdate(() => {
    state.score += 0.1 * state.speed * state.timeMultiplier * k.dt();
    state.speed += 2 * state.timeMultiplier * k.dt();
  });

  // ground
  k.add([
    'ground',
    k.rect(k.width(), 16),
    k.pos(0, k.height() - 16),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.Color.fromHex('#d6d3d1')),
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
    player.hp--;
    player.jump(300);
    k.play('hit', { volume: 0.7 });
  });

  player.onDeath(() => {
    state.cancelFirstThrow = false;
    state.timeMultiplier = 1;
    if (state.music) {
      state.music.speed = 1;
    }
    k.go('end');
  });

  player.onUpdate(() => {
    if (!throwHeld) {
      player.angle = k.lerp(
        player.angle,
        0,
        3 * k.dt() * state.timeMultiplier
      );
    }
  });
  player.onButtonDown('jump', () => {
    if (!throwHeld) {
      player.jump(100 * state.timeMultiplier);
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
    const radians = k.deg2rad(
      player.angle + constants.PACKAGE_RELATIVE_ANGLE
    );
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
      const gravity = k.vec2(0, constants.GRAVITY * state.timeMultiplier);

      // Position formula (uniform acceleration): p = p₀ + v₀t + ½at²
      const x = startPos.x + velocity.x * t;
      const y = startPos.y + velocity.y * t + 0.5 * gravity.y * t * t;
      if (y > k.height() - constants.GROUND_HEIGHT) {
        break;
      }

      // Add trajectory point
      const opacity = k.lerp(1, 0, i / constants.TRAJECTORY_POINTS);
      trajectoryContainer.add([
        k.pos(x, y),
        k.circle(2),
        k.color(k.Color.fromHex('#fb2c36')),
        k.opacity(opacity),
        k.anchor('center'),
      ]);
    }

    state.gravity = 0;
    player.angle = k.lerp(
      player.angle,
      constants.PLAYER_MAX_ANGLE,
      5 * k.dt() * state.timeMultiplier
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
    state.gravity = constants.GRAVITY * state.timeMultiplier;
    player.angle = k.lerp(
      player.angle,
      0,
      3 * k.dt() * state.timeMultiplier
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

  const scoreText = k.add([
    k.text('0', { size: 16 }),
    k.pos(k.width() - 8, 32),
    k.anchor('topright'),
    k.layer('ui'),
  ]);
  k.onUpdate(() => {
    scoreText.text = Math.floor(state.score).toString();
  });

  spawnHouses(player);
}
