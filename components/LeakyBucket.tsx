import { RateLimitingData } from './FixedWindowCounter';
import type p5Type from 'p5';
import p5 from 'p5';
import React, { FocusEvent, useEffect, useState } from 'react';
import Button from './Button';
import useMutation from '@libs/client/useMutation';
import { useRef } from 'react';

let timeFrame: number;
let curRequestCount: number;
let maxRequestCount: number;
let remainTime: number;
let reqCount: number;

let needLeak: boolean = false;
let needPour: boolean = false;
let needDrawWater: boolean = false;

let showError: boolean = false;
let errorMessage: string = '';

interface RequestApiReq {
  requestLimit: number;
  timeFrame: number;
}

export default function LeakyBucket({ apiPath }: RateLimitingData) {
  const [requestApiReq, setRequestApiReq] = useState<RequestApiReq>({
    requestLimit: 5,
    timeFrame: 10,
  });

  const onChangerequestLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    let stringValue = e.currentTarget.value;
    if (isNaN(+stringValue)) return;
    if (+stringValue < 0) return;
    if (+stringValue > 500) return;

    setRequestApiReq((prev) => {
      return { ...prev, requestLimit: +stringValue };
    });
  };

  const onChangetimeFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    let stringValue = e.currentTarget.value;
    if (isNaN(+stringValue)) return;
    if (+stringValue < 0) return;
    if (+stringValue > 30) return;

    setRequestApiReq((prev) => {
      return { ...prev, timeFrame: +stringValue };
    });
  };

  const [requestApi, { data }] = useMutation(apiPath);

  const makeRequest = () => {
    requestApi(requestApiReq);
  };

  useEffect(() => {
    if (data && data.ok) {
      curRequestCount++;
      if (curRequestCount !== 0) {
        needPour = true;
      }
      remainTime = data.results.resetTime;
      reqCount = data.results.reqCount;
    } else if (data && !data.ok) {
      showError = true;
      errorMessage = data.error;
    }
  }, [data]);

  const p5ContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const p5Instance = new p5(sketch, p5ContainerRef.current!);

    timeFrame = requestApiReq.timeFrame;
    maxRequestCount = requestApiReq.requestLimit;
    curRequestCount = 0;
    reqCount = 0;
    remainTime = 0.0;

    return () => {
      p5Instance.remove();
    };
  }, [requestApiReq]);

  const selectValueOnFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-10">
      <div className="items-between flex w-full flex-col space-y-3">
        <div className="flex justify-start space-x-2 px-20">
          <input
            type="number"
            onFocus={selectValueOnFocus}
            className="w-12 appearance-none rounded-md border border-teal-500 px-2 text-center text-gray-500 caret-teal-500 focus:outline-none"
            placeholder="5"
            required
            value={requestApiReq.requestLimit}
            onChange={onChangerequestLimit}
          />
          <p className="text-lg tracking-widest text-gray-600">requests</p>
        </div>
        <div className="flex justify-end space-x-2 px-20">
          <p className="text-lg tracking-widest text-gray-600">every</p>
          <input
            type="number"
            onFocus={selectValueOnFocus}
            className="w-12 appearance-none rounded-md border border-teal-500 px-2 text-center text-gray-500 caret-teal-500 focus:outline-none"
            placeholder="10"
            required
            value={requestApiReq.timeFrame}
            onChange={onChangetimeFrame}
          />
          <p className="text-lg tracking-widest text-gray-600">seconds</p>
        </div>
      </div>
      <div>
        <Button onClick={makeRequest}>Make a request</Button>
      </div>

      <div
        className="border-2 border-teal-200 shadow-xl"
        ref={p5ContainerRef}
      />
    </div>
  );
}

export const sketch = (p: p5Type) => {
  let waterImg: p5Type.Image;

  let waterPosYTop: number = 0;
  let velocityTop: number = 0;
  let massTop: number = 24;
  let accelTop: number = massTop * 0.02;

  let basketXDiff: number;
  let basketX: number;
  let basketY: number;

  let waterPosYBottom: number;
  let velocityBottom: number = 0;
  let massBottom: number = 24;
  let accelBottom: number = massBottom * 0.02;

  let displayRemainTime: string;
  let waterHeight: number = 0;

  let beforeTimer: number = 0;
  let afterTimer: number = 0;

  p.preload = () => {
    waterImg = p.loadImage('/water-drop.svg');
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight / 2);

    basketXDiff = p.windowWidth / 10;
    basketX = p.windowWidth / 3;
    basketY = p.windowHeight / 6;

    waterPosYBottom = basketY * 2;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight / 2);
  };

  p.draw = () => {
    p.background('#f0fdfa');

    calcDisplayRemainTime();
    drawBasket(p);
    calcWaterHeight();
    drawText(p);

    if (needPour) {
      pour(p);
    }
    if (needDrawWater) {
      drawWater(p);
    }
    if (needLeak) {
      leak(p);
    }
  };

  const calcDisplayRemainTime = () => {
    displayRemainTime =
      remainTime - Date.now() / 1000 < 0
        ? Number(0).toFixed(2)
        : (Math.floor((remainTime - Date.now() / 1000) * 100) / 100).toFixed(2);
  };

  const drawText = (p: p5Type) => {
    p.fill('#13b8a6');

    p.textSize(p.width / 40);
    p.textAlign(p.RIGHT);
    p.text(
      `Max Request Limit : ${maxRequestCount}`,
      p.width / 2.5,
      p.height / 20
    );
    p.text(
      `Current Request : ${curRequestCount}`,
      p.width / 2.5,
      p.height / 20 + p.height / 25
    );
    p.text(
      `Possible Request : ${
        maxRequestCount < reqCount ? 0 : maxRequestCount - reqCount
      }`,
      p.width / 2.5,
      p.height / 20 + (p.height / 25) * 2
    );
    p.text(
      `Remain Time: ${displayRemainTime}`,
      p.width / 2.5,
      p.height / 20 + (p.height / 25) * 3
    );

    if (showError) {
      p.textAlign(p.CENTER);
      p.textStyle(p.BOLD);
      p.noFill();
      p.fill('#ee4444');
      p.text(errorMessage, p.width / 2, p.height * 0.9);
    }

    p.noFill();
  };

  const calcWaterHeight = () => {
    if (Number(displayRemainTime) <= 0) {
      reqCount = 0;
      showError = false;
    }

    afterTimer = Math.floor(
      (timeFrame - Number(displayRemainTime)) / (timeFrame / maxRequestCount)
    );

    if (beforeTimer < afterTimer) {
      if (curRequestCount > 0) {
        curRequestCount--;
        needLeak = true;
      }
    }

    beforeTimer = Math.floor(
      (timeFrame - Number(displayRemainTime)) / (timeFrame / maxRequestCount)
    );
  };

  const drawBasket = (p: p5Type) => {
    p.stroke('#13b8a6');
    p.translate((p.width - (basketX + basketXDiff * 2)) / 2, basketY);
    p.line(0, 0, basketXDiff, basketY);
    p.line(basketXDiff, basketY, basketX + basketXDiff, basketY);
    p.line(basketX + basketXDiff, basketY, basketX + basketXDiff * 2, 0);
    p.resetMatrix();
  };

  const pour = (p: p5Type) => {
    if (waterPosYTop + waterImg.height >= basketY * 2) {
      needPour = false;
      needDrawWater = true;
      waterHeight = curRequestCount;

      velocityTop = 0;
      waterPosYTop = 0;
    } else {
      velocityTop += accelTop;
      waterPosYTop += velocityTop;
      p.image(waterImg, (p.width - waterImg.width) / 2, waterPosYTop - massTop);
    }
  };

  const drawWater = (p: p5Type) => {
    p.fill('#89CFF0');
    p.translate((p.width - (basketX + basketXDiff * 2)) / 2, basketY);

    p.quad(
      basketXDiff -
        basketY *
          (1 - (1 - waterHeight / maxRequestCount)) *
          (basketXDiff / basketY),
      (basketY * (maxRequestCount - waterHeight)) / maxRequestCount,
      basketXDiff,
      basketY,
      basketXDiff + basketX,
      basketY,
      basketXDiff +
        basketX +
        basketY *
          (1 - (1 - waterHeight / maxRequestCount)) *
          (basketXDiff / basketY),
      (basketY * (maxRequestCount - waterHeight)) / maxRequestCount
    );
    p.resetMatrix();
  };

  const leak = (p: p5Type) => {
    if (waterPosYBottom + waterImg.height >= p.windowHeight) {
      needLeak = false;
      waterPosYBottom = basketY * 2;
      velocityBottom = 0;
    } else {
      p.image(waterImg, (p.width - waterImg.width) / 2, waterPosYBottom);
      waterHeight = curRequestCount;
      velocityBottom += accelBottom;
      waterPosYBottom += velocityBottom;
    }
  };
};
