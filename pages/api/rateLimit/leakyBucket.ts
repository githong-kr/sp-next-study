import getIP from '@libs/server/getIp';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import getNewRedisClient from '@libs/server/redis';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  await getNewRedisClient();
  switch (req.method) {
    case 'POST': {
      const { requestLimit, timeFrame } = req.body;

      const start = Date.now();
      const time = start / 1000 / timeFrame;
      const reset = (time + 1) * timeFrame;
      const ip = getIP(req);
      const key = `ip:${ip}:resetTime:reqCount`;
      let reqCount: number;
      let resetTime: string;

      const [isExists, ttl] = await Promise.all([
        globalRedisClient.get(key),
        globalRedisClient.ttl(key),
      ]);
      if (isExists) {
        resetTime = isExists?.split(':')[0];
        reqCount = +isExists?.split(':')[1] + 1;

        const [_] = await Promise.all([
          globalRedisClient.set(key, `${resetTime}:${reqCount}`),
          globalRedisClient.expire(key, ttl),
        ]);
      } else {
        const [_, getRow, __] = await Promise.all([
          globalRedisClient.set(key, `${reset}:${1}`),
          globalRedisClient.get(key),
          globalRedisClient.expire(key, timeFrame),
        ]);

        resetTime = getRow?.split(':')[0]!;
        reqCount = +getRow?.split(':')[1]!;
      }

      return {
        results: {
          id: `ip:${ip}`,
          reqCount,
          requestLimit,
          timeFrame,
          start,
          resetTime,
        },
      };
    }
  }
};

export default withHandler({ methods: ['POST'], handler });
