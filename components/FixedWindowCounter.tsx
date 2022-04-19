import { ReactNode } from 'react';

export interface RateLimitingData {
  apiPath: string;
}

export default function FixedWindowCounter({ apiPath }: RateLimitingData) {
  return (
    <div>
      <h1>FixedWindowCounter</h1>
    </div>
  );
}
