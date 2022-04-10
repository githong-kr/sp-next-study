import { NextRequest } from 'next/server';
import { start } from 'repl';
import getIP from '../getIp';
import { initRateLimit } from './rate-limit';

export const ipRateLimit = initRateLimit(async (request: NextRequest) => {
  const dataAsU8Array = await request.body?.getReader().read();
  const jsonString = Buffer.from(dataAsU8Array?.value!).toString('utf8');
  const parsedData = JSON.parse(jsonString);

  return {
    id: `ip:${getIP(request)}`,
    limit: parsedData.requests,
    timeframe: parsedData.seconds,
    reqCount: parsedData.reqCount,
    start: parsedData.start,
  };
});
