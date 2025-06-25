import k from '@/ctx';
import type { GameObj, OpacityComp } from 'kaplay';

export function pulse(start: number, end: number, speed: number) {
  return {
    update(this: GameObj<OpacityComp>) {
      const t = (k.time() * speed) % 1;
      const opacity = k.lerp(start, end, Math.abs(Math.sin(t * Math.PI)));
      this.opacity = opacity;
    },
  };
}
