import constants from '@/config/constants';
import state from '@/config/state';
import k from '@/ctx';

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

function tileToScaledPx(tile: number): number {
  return tile * constants.TILE_SIZE * constants.HOUSE_SCALE;
}
function tileToPx(tile: number): number {
  return tile * constants.TILE_SIZE;
}

const houses: House[] = [
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
];

function spawnHouses() {
  const house = houses[k.rand(0, houses.length - 1)];

  const obj = k.add([
    k.sprite(house.sprite),
    k.pos(0, k.height() - house.h),
    k.scale(constants.HOUSE_SCALE),
  ]);

  const target = obj.add([
    k.rect(house.target.w, house.target.h),
    k.pos(house.target.x, house.target.y),
    k.color(255, 0, 0),
    k.area(),
    k.body({ isStatic: true }),
  ]);
}

export default function test() {
  spawnHouses();
}
