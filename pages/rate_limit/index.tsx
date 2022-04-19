import Selector from '@components/Selector';
import Link from 'next/link';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import camelize from '@libs/server/camelize';
import { RateLimitingData } from '@components/FixedWindowCounter';

type RateLimiterAlgorithm =
  | 'Leaky Bucket'
  | 'Token Bucket'
  | 'Fixed Window Counter'
  | 'Sliding Window Log'
  | 'Sliding Window Counter';

export default function RateLimit() {
  const algorithms: RateLimiterAlgorithm[] = [
    'Leaky Bucket',
    'Token Bucket',
    'Fixed Window Counter',
    'Sliding Window Log',
    'Sliding Window Counter',
  ];
  const [rateLimiterAlgorithm, setRateLimiterAlgorithm] =
    useState<RateLimiterAlgorithm>(algorithms[0]);
  const apiPath = `api/rateLimit/${camelize(rateLimiterAlgorithm)}`;

  const DynamicComponent: React.ComponentType<RateLimitingData> = dynamic(
    () => {
      return import(
        `../../components/${rateLimiterAlgorithm.replace(/ /g, '')}`
      );
    },
    { ssr: false }
  );

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
      <div>
        <Selector setValue={setRateLimiterAlgorithm} list={algorithms} />
      </div>
      <DynamicComponent apiPath={apiPath} />
    </div>
  );
}
