import k from '@/ctx';

export default function addTouchControls() {
  let leftTouchId = -1;
  let rightTouchId = -1;
  window.addEventListener('pointerdown', (e) => {
    if (e.clientX < window.innerWidth / 2) {
      leftTouchId = e.pointerId;
      k.pressButton('jump');
    } else {
      rightTouchId = e.pointerId;
      k.pressButton('throw');
    }
  });
  window.addEventListener('pointerup', (e) => {
    if (e.pointerId === leftTouchId) {
      leftTouchId = -1;
      k.releaseButton('jump');
    } else if (e.pointerId === rightTouchId) {
      rightTouchId = -1;
      k.releaseButton('throw');
    }
  });
}
