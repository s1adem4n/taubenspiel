import k from '@/ctx';

export default function start() {
  k.add([k.sprite('title'), k.scale(0.5), k.pos(0, 0)]);
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

  k.onClick(() => {
    k.go('tutorial');
  });
  k.onKeyDown(() => {
    k.go('tutorial');
  });
}
