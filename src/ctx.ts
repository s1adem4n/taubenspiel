import kaplay from 'kaplay';

const k = kaplay({
  width: 320,
  height: 180,
  scale: 3,
  letterbox: true,
  buttons: {
    jump: {
      keyboard: ['space'],
    },
    throw: {
      keyboard: ['enter'],
    },
  },
  maxFPS: 120,
});

export default k;
