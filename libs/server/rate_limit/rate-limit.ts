import { NextRequest } from 'next/server';

export const initRateLimit = (fn: any) =>
  async function isRateLimited(request: NextRequest) {
    const ctx = await fn(request);

    return rateLimit({
      ...ctx,
      request: ctx.request ?? request,
      headers: getHeaders(ctx.headers),
      onRateLimit: ctx.onRateLimit ?? rateLimited,
    });
  };

function getHeaders(nameOrHeaders?: any) {
  nameOrHeaders = nameOrHeaders ?? 'RateLimit';
  return !nameOrHeaders || typeof nameOrHeaders === 'string'
    ? ([
        `X-${nameOrHeaders}-Limit`,
        `X-${nameOrHeaders}-Remaining`,
        `X-${nameOrHeaders}-Reset`,
      ] as const)
    : nameOrHeaders;
}

const rateLimited = ({ id }: any) => {
  return new Response(
    JSON.stringify({
      error: { message: `API rate limit exceeded for ${id}` },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

interface incrementPrams {
  key: string;
  timeframe: number;
}

async function rateLimit(context: any) {
  let { headers, id, limit, timeframe, reqCount, start, onRateLimit } = context;

  const time = Math.floor(Date.now() / 1000 / timeframe);
  const key = `${id}:${time}`;
  let countOrRes: number | Response;

  try {
    countOrRes = reqCount;
  } catch (err) {
    console.error('Rate limit `count` failed with:', err);
    return new Response(null);
  }

  const h = countOrRes instanceof Response ? countOrRes.headers : new Headers();
  const remaining = countOrRes instanceof Response ? 0 : limit - countOrRes;
  const reset = (time + 1) * timeframe;

  const latency = Date.now() - start;
  h.set('x-redis-latency', `${latency}`);

  if (headers[0]) h.set(headers[0], `${limit}`);
  if (headers[1]) h.set(headers[1], `${remaining < 0 ? 0 : remaining}`);
  if (headers[2]) h.set(headers[2], `${reset}`);
  if (countOrRes instanceof Response) return countOrRes;
  if (remaining < 0) {
    const res = await onRateLimit(context);

    // Concat the rate limiting headers
    headers.concat('x-redis-latency').forEach((key: string) => {
      if (key) res.headers.set(key, h.get(key)!);
    });

    return res;
  }
  return new Response(null, { headers: h });
}
