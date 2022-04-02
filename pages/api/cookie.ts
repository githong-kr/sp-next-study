import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const cookie = (req: NextApiRequest, res: NextApiResponse) => {
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
