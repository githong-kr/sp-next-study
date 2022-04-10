import { ipRateLimit } from '@libs/server/rate_limit/ip-rate-limit';
import { NextRequest, NextFetchEvent } from 'next/server';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  if (req.nextUrl.pathname === '/api') {
    const res = await ipRateLimit(req);
    if (res.status !== 200) return res;

    res.headers.set('content-type', 'application/json');

    return new Response(JSON.stringify({ done: true }), {
      status: 200,
      headers: res.headers,
    });
  }
};
