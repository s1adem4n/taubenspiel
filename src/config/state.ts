import k from '@/ctx';
import { AudioPlay } from 'kaplay';
import constants from './constants';

class State {
  cancelFirstThrow = false;
  music: AudioPlay | undefined;
  timeMultiplier = 1;
  speed = constants.BASE_SPEED;
  score = 0;

  get gravity() {
    return k.getGravity();
  }
  set gravity(value: number) {
    k.setGravity(value);
  }
}

const state = new State();
export default state;
