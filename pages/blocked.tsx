import Button from '@components/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setCookie, getCookie } from '@libs/client/utils';

export default function Blocked() {
  const [loading, setLoading] = useState<boolean>(false);
  const [cookieValue, setCookieValue] = useState<String>('');

  useEffect(() => {
    setCookieValue(getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME!));
  }, []);

  const saveCookie = async () => {
    setCookie(process.env.NEXT_PUBLIC_COOKIE_NAME!, 'hello', { path: '/' });
    setCookieValue('hello');
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-20">
      <div className="px-20 pt-20 text-center">
        <h1 className="pb-5 text-3xl text-gray-700">
          You have no cookie for access.
        </h1>
        <p className="prose leading-10 prose-code:text-purple-600">
          You&apos;re seeing this page because your cookie is not in your
          browser. Click below <code>Set Cookie Button</code> and go to the{' '}
          <Link href="/">
            <a className="no-underline">
              <code className="prose">homepage</code>
            </a>
          </Link>{' '}
          .
        </p>
      </div>
      <div className="w-full text-center">
        <Button onClick={saveCookie} loading={loading}>
          Set Cookie
        </Button>
      </div>
      {cookieValue ? (
        <div className="flex w-4/5 justify-between rounded-xl border border-dotted border-teal-500 text-gray-700 shadow-md">
          <span className="px-10 py-5">
            {process.env.NEXT_PUBLIC_COOKIE_NAME}
          </span>
          <span className="px-10 py-5">{cookieValue}</span>
        </div>
      ) : null}
    </div>
  );
}
