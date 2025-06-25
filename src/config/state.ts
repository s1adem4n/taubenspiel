import k from '@/ctx';
import { AudioPlay } from 'kaplay';

class State {
  cancelFirstThrow = false;
  music: AudioPlay | undefined;
  baseTime = 1;
  timeMultiplier = 1;
  speed = 60;

  get gravity() {
    return k.getGravity();
  }
  set gravity(value: number) {
    k.setGravity(value);
  }
}

const state = new State();
export default state;
