import Button from '@components/Button';
import { cls } from '@libs/client/utils';
import getNewRedisClient from '@libs/server/redis';
import Link from 'next/link';
import React, { useState } from 'react';

interface ApiResponse {
  path: string;
  latency: string | null;
  status: string | null;
  headers: {};
  data: {} | null;
}

interface ApiRequest {
  requests: number;
  seconds: number;
}

export default function RateLimit() {
  const [requests, setRequests] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const path = '/api';
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    path,
    latency: null,
    status: null,
    headers: {
      'X-redis-latency': '',
      'X-RateLimit-Limit': '',
      'X-RateLimit-Remaining': '',
      'X-RateLimit-Reset': '',
    },
    data: null,
  });

  const onChangeRequests = (e: React.ChangeEvent<HTMLInputElement>) => {
    let stringValue = e.currentTarget.value;
    if (isNaN(+stringValue)) return;
    if (+stringValue < 0) return;
    if (+stringValue > 500) return;

    setRequests(+stringValue);
  };

  const onChangeSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
    let stringValue = e.currentTarget.value;
    if (isNaN(+stringValue)) return;
    if (+stringValue < 0) return;
    if (+stringValue > 30) return;

    setSeconds(+stringValue);
  };

  const makeRequest = async () => {
    const start = Date.now();
    setLoading(true);
    try {
      const redisRes: any = await fetch('/api/redis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seconds }),
      });
      const dataAsU8Array = await redisRes.body.getReader().read();
      const jsonString = Buffer.from(dataAsU8Array?.value!).toString('utf8');
      const parsedData = JSON.parse(jsonString);

      if (parsedData.results[1]) {
        const res = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reqCount: parsedData.results[0],
            requests,
            seconds,
            start,
          }),
        });
        setApiResponse({
          path,
          latency: `~${Math.round(Date.now() - start)}ms`,
          status: `${res.status}`,
          headers: {
            'X-redis-latency': `${res.headers.get('X-redis-latency')}ms`,
            'X-RateLimit-Limit': res.headers.get('X-RateLimit-Limit'),
            'X-RateLimit-Remaining': res.headers.get('x-RateLimit-Remaining'),
            'X-RateLimit-Reset': res.headers.get('x-RateLimit-Reset'),
          },
          data: res.headers.get('Content-Type')?.includes('application/json')
            ? await res.json()
            : null,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      <div className="px-20 pt-20 text-center">
        <h1 className="pb-5 text-3xl text-gray-700">API Rate Limiting Test</h1>
        <p className="prose leading-10 prose-code:text-purple-600">
          You can test rate limitted API call. Please set below input boxes. If
          you stop testing, you can go to the{' '}
          <Link href="/">
            <a className="no-underline">
              <code className="prose">homepage</code>
            </a>
          </Link>{' '}
          .
        </p>
      </div>
      <div className="flex w-full justify-center space-x-2 px-20 text-center">
        <input
          className="w-12 appearance-none rounded-md border border-teal-500 px-2 text-center text-gray-500"
          placeholder="5"
          required
          value={requests}
          onChange={onChangeRequests}
        />
        <p className="text-lg tracking-widest text-gray-600">requests every </p>
        <input
          className="w-12 appearance-none rounded-md border border-teal-500 px-2 text-center text-gray-500"
          placeholder="10"
          required
          value={seconds}
          onChange={onChangeSeconds}
        />
        <p className="text-lg tracking-widest text-gray-600">seconds</p>
      </div>
      <div>
        <Button onClick={makeRequest}>Make a request</Button>
      </div>
      <div
        className={cls(
          {
            classNames:
              'w-4/5 border border-teal-500 p-10 leading-7 text-gray-600 shadow-md',
          },
          loading
            ? { classNames: 'border-double border-gray-500 opacity-40' }
            : {}
        )}
      >
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  await getNewRedisClient();

  return { props: {} };
}
