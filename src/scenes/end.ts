import state from '@/config/state';
import k from '@/ctx';

export default function end() {
  k.add([
    k.text(`Dein Score:\n${state.score.toFixed(0)}`, {
      align: 'center',
      size: 24,
    }),
    k.pos(k.width() / 2, 50),
    k.anchor('center'),
  ]);

  k.add([
    k.text('DRUECKEN ZUM STARTEN', {
      size: 16,
      transform: (idx) => {
        return {
          pos: k.vec2(0, k.wave(-2, 2, k.time() * 2 + idx * 0.5)),
        };
      },
    }),
    k.anchor('center'),
    k.pos(k.width() / 2, k.height() - 20),
  ]);

  k.onButtonPress('jump', () => {
    k.go('start');
  });
  k.onButtonPress('throw', () => {
    state.cancelFirstThrow = true;
    k.go('start');
  });
}
