import k from '@/ctx';
import state from '@/config/state';
import { pulse } from '@/components';

export default function tutorial() {
  if (!state.music) {
    state.music = k.play('chippie', {
      loop: true,
    });
  }

  k.setBackground(k.Color.fromHex('#0C99D8'));
  k.onButtonPress('jump', () => {
    k.go('game');
  });
  k.onButtonPress('throw', () => {
    k.go('game');
    state.cancelFirstThrow = true;
  });

  const text = k.add([
    k.text(
      'Versuche, die Pakete in \nden grünen Zonen abzuliefern!\nDrücken, um zu starten',
      {
        size: 16,
        align: 'center',
      }
    ),
    k.anchor('center'),
    k.pos(k.width() / 2, 50),
  ]);

  const boxWidth = k.width() * 0.4;
  const boxHeight = k.height() / 2;
  const left = k.add([
    k.pos(8, k.height() / 2 - 8),
    k.anchor('topleft'),
    k.rect(boxWidth, boxHeight, { radius: 8 }),
    k.color(0, 0, 0),
    k.opacity(),
    pulse(0.3, 0.5, 0.5),
  ]);
  left.add([
    k.pos(k.width() * 0.2, 16),
    k.text('Fliegen', {
      size: 18,
    }),
    k.anchor('center'),
  ]);
  left.add([
    k.pos(left.width - 40, 45),
    k.sprite('prompts', {
      frame: 579,
      width: 28,
      height: 28,
    }),
  ]);

  // space bar
  const spaceBarPos = k.vec2(10, 47);
  const spaceBarSize = 20;
  left.add([
    k.pos(spaceBarPos.x, spaceBarPos.y),
    k.sprite('prompts', {
      frame: 235,
      width: spaceBarSize,
      height: spaceBarSize,
    }),
  ]);
  left.add([
    k.pos(spaceBarPos.x + spaceBarSize, spaceBarPos.y),
    k.sprite('prompts', {
      frame: 236,
      width: spaceBarSize,
      height: spaceBarSize,
    }),
  ]);
  left.add([
    k.pos(spaceBarPos.x + spaceBarSize * 2, spaceBarPos.y),
    k.sprite('prompts', {
      frame: 237,
      width: spaceBarSize,
      height: spaceBarSize,
    }),
  ]);

  const right = k.add([
    k.pos(k.width() / 2 + 24, k.height() / 2 - 8),
    k.anchor('topleft'),
    k.rect(boxWidth, boxHeight, { radius: 8 }),
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
    k.pos(right.width - 40, 45),
    k.sprite('prompts', {
      frame: 579,
      width: 28,
      height: 28,
    }),
  ]);

  // enter key
  const enterKeyPos = k.vec2(15, 35);
  const enterSize = 22;
  right.add([
    k.pos(enterKeyPos.x, enterKeyPos.y),
    k.sprite('prompts', {
      frame: 100,
      width: enterSize,
      height: enterSize,
    }),
  ]);
  right.add([
    k.pos(enterKeyPos.x + enterSize, enterKeyPos.y),
    k.sprite('prompts', {
      frame: 101,
      width: enterSize,
      height: enterSize,
    }),
  ]);
  right.add([
    k.pos(enterKeyPos.x, enterKeyPos.y + enterSize),
    k.sprite('prompts', {
      frame: 134,
      width: enterSize,
      height: enterSize,
    }),
  ]);
  right.add([
    k.pos(enterKeyPos.x + enterSize, enterKeyPos.y + enterSize),
    k.sprite('prompts', {
      frame: 135,
      width: enterSize,
      height: enterSize,
    }),
  ]);
}
