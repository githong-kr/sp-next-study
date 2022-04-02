import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import getNewRedisClient from '@libs/server/redis';

const cookie = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO REDIS 연동 완료!
  const redisClient = await getNewRedisClient();
  console.log(await redisClient.get('test'));

  try {
    switch (req.method) {
      case 'PUT': {
        return res
          .setHeader('Set-Cookie', [
            serialize('helloToken', 'hello', { path: '/' }),
          ])
          .status(200)
          .json({ done: 'ok' });
      }
      case 'DELETE': {
        return res
          .setHeader('Set-Cookie', [
            serialize('helloToken', '', { path: '/', maxAge: -1 }),
          ])
          .status(200)
          .json({ done: 'ok' });
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

export default cookie;
