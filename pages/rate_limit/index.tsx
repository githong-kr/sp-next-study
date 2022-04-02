import Button from '@components/Button';
import Link from 'next/link';
import React, { useState } from 'react';

export default function RateLimit() {
  const [requests, setRequests] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(10);

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
          <Button>Make a request</Button>
      </div>
    </div>
  );
}