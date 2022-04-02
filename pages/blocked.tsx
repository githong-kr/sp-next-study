import Button from '@components/Button';
import Link from 'next/link';
import { useState } from 'react';

export default function Blocked() {
  const [loading, setLoading] = useState<boolean>(false);

  const setCookie = async () => {
    setLoading(true);
    try {
      const data = await fetch('http://localhost:3000/api/cookie', {
        method: 'PUT',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="p-10 text-center">
        <h1 className="pb-5 text-3xl text-gray-700">
          You have no cookie for access.
        </h1>
        <p className="prose prose-code:text-purple-600">
          You&apos;re seeing this page because your cookie is not in your
          browser. Click below <code>Set Cookie button</code> and go to the{' '}
          <Link href="/">
            <a className="no-underline">
              <code className="prose">homepage</code>
            </a>
          </Link>{' '}
          .
        </p>
      </div>
      <div className="flex w-full items-center justify-center space-x-10">
        <Button onClick={setCookie} loading={loading}>
          Set Cookie
        </Button>
      </div>
    </>
  );
}
