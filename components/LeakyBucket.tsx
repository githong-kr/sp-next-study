import { RateLimitingData } from './FixedWindowCounter';
import dynamic from 'next/dynamic';
import type p5Type from 'p5';

export default function LeakyBucket({ ...data }: RateLimitingData) {
  const Sketch = dynamic(import('react-p5'));
  return (
    <div className="bg-teal-300">
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        preload={preload}
      />
    </div>
  );
}

const timeFrame: number = 10;
let curRequestCount: number = 1;
const maxRequestCount: number = 5;

const basketXDiff: number = 50;
const basketX: number = 300;
const basketY: number = 200;

let waterImg: p5Type.Image;

let waterPosYTop: number = 0;
let velocityTop: number = 0;
let massTop: number = 24;
let accelTop: number = massTop * 0.02;

let waterPosYBottom: number = basketY * 2;
let velocityBottom: number = 0;
let massBottom: number = 24;
let accelBottom: number = massBottom * 0.02;

let timer: number;
let needLeak = false;

const preload = (p: p5Type) => {
  waterImg = p.loadImage('/water-drop.svg');
};

const setup = (p: p5Type, canvasParentRef: Element): void => {
  p.createCanvas(p.windowWidth, p.windowHeight / 2).parent(canvasParentRef);
  timer = Date.now() / 1000;
};

const windowResized = (p: p5Type) => {
  p.resizeCanvas(p.windowWidth, p.windowHeight / 2);
};

const draw = (p: p5Type): void => {
  p.background('#f0fdfa');

  if (Date.now() / 1000 >= timer + timeFrame / maxRequestCount) {
    timer = Date.now() / 1000;

    if (curRequestCount > 0) {
      curRequestCount--;
      needLeak = true;
    } else {
      curRequestCount = 0;
    }
  }

  p.stroke('#6638f0');
  p.translate((p.width - (basketX + basketXDiff * 2)) / 2, basketY);
  p.line(0, 0, basketXDiff, basketY);
  p.line(basketXDiff, basketY, basketX + basketXDiff, basketY);
  p.line(basketX + basketXDiff, basketY, basketX + basketXDiff * 2, 0);
  p.resetMatrix();

  if (waterPosYTop + waterImg.height >= basketY * 2) {
    velocityTop *= -0.6;
    waterPosYTop = p.height - massTop / 2;

    p.fill('#89CFF0');
    p.translate((p.width - (basketX + basketXDiff * 2)) / 2, basketY);

    p.quad(
      basketXDiff -
        basketY *
          (1 - (1 - curRequestCount / maxRequestCount)) *
          (basketXDiff / basketY),
      (basketY * (maxRequestCount - curRequestCount)) / maxRequestCount,
      basketXDiff,
      basketY,
      basketXDiff + basketX,
      basketY,
      basketXDiff +
        basketX +
        basketY *
          (1 - (1 - curRequestCount / maxRequestCount)) *
          (basketXDiff / basketY),
      (basketY * (maxRequestCount - curRequestCount)) / maxRequestCount
    );
    p.resetMatrix();

    if (needLeak) {
      leak(p);
    }
  } else {
    velocityTop += accelTop;
    waterPosYTop += velocityTop;
    p.image(waterImg, (p.width - waterImg.width) / 2, waterPosYTop - massTop);
  }
};

const leak = (p: p5Type) => {
  if (waterPosYBottom + waterImg.height >= p.windowHeight) {
    needLeak = false;
    waterPosYBottom = basketY * 2 - waterImg.height;
    velocityBottom = 0;
  } else {
    p.image(waterImg, (p.width - waterImg.width) / 2, waterPosYBottom);
    velocityBottom += accelBottom;
    waterPosYBottom += velocityBottom;
  }
};
