import getIP from '@libs/server/getIp';
import { NextApiRequest, NextApiResponse } from 'next';

const redis = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST': {
        const { seconds } = req.body;
        const time = Math.floor(Date.now() / 1000 / seconds);
        const ip = getIP(req);
        const key = `ip:${ip}:${time}`;

        const results = await Promise.all([
          globalRedisClient.incr(key),
          globalRedisClient.expire(key, seconds),
        ]);

        return res.status(200).json({ results });
      }
      default: {
        return res
          .status(405)
          .json({ error: { message: 'Method not allowed.' } });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: `An error ocurred, ${err}`,
    });
  }
};

export default redis;
