export interface RateLimitingData {
  [key: string]: any;
}

export default function FixedWindowCounter({ ...data }: RateLimitingData) {
  return (
    <div>
      <h1>FixedWindowCounter</h1>
    </div>
  );
}
