import k from '@/ctx';

export default function end() {
  k.add([
    k.text('verloren o_o'),
    k.color(255, 0, 0),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor('center'),
  ]);
  k.onButtonPress('jump', () => {
    k.go('start');
  });
  k.onButtonPress('throw', () => {
    k.go('start');
  });
}
