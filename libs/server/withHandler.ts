import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface configType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => any;
  isPrivate?: boolean;
}

const withHandler = ({ methods, handler, isPrivate = true }: configType) => {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }

    try {
      const resData = await handler(req, res);

      if (req.url?.includes('rateLimit')) {
        const { id, reqCount, requestLimit, timeFrame, start, resetTime } =
          resData.results;

        const remaining = requestLimit - reqCount;

        const latency = Date.now() - start;

        res.setHeader('x-redis-latency', `${latency}`);
        res.setHeader(`X-RateLimit-Limit`, `${requestLimit}`);
        res.setHeader(
          `X-RateLimit-Remaining`,
          `${remaining < 0 ? 0 : remaining}`
        );
        res.setHeader(`X-RateLimit-Reset`, `${resetTime}`);

        if (remaining < 0) {
          return res
            .status(429)
            .json({ ok: false, error: `API rate limit exceeded for ${id}` });
        }

        return res.status(200).json({
          ok: true,
          results: {
            latency,
            requestLimit,
            timeFrame,
            reqCount,
            remaining,
            resetTime,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
};
export default withHandler;
