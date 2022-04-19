import type { NextPage } from 'next';
import Link from 'next/link';
import client from '@libs/server/client';
import Button from '@components/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie, getCookie } from '@libs/client/utils';

interface HomeProps {
  testData: { id: number; name: string };
}

const Home: NextPage<HomeProps> = ({ testData }: HomeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [cookieValue, setCookieValue] = useState<String>('');

  useEffect(() => {
    setCookieValue(getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME!));
  }, []);

  const unSetCookie = async () => {
    setCookie(process.env.NEXT_PUBLIC_COOKIE_NAME!, '', {
      path: '/',
      maxAge: -1,
    });

    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-20">
      <div className="w-full pt-20 text-center text-4xl font-medium text-cyan-700">
        Hello, {`${testData.name}!`}
      </div>
      <div className="flex w-full items-center justify-center">
        <Button onClick={unSetCookie} loading={loading}>
          Unset Cookie
        </Button>
      </div>
      <div className="flex w-4/5 justify-between rounded-xl border border-dotted border-teal-500 text-gray-700 shadow-md">
        <span className="px-10 py-5">
          {process.env.NEXT_PUBLIC_COOKIE_NAME}
        </span>
        <span className="px-10 py-5">{cookieValue}</span>
      </div>
      <hr className="w-full border-teal-500" />
      <Link href="/rate_limit">
        <a>
          <Button>Test Api Rate Limiting</Button>
        </a>
      </Link>
    </div>
  );
};

// * use ISR in NEXT.js
export const getStaticProps = async () => {
  let testData;
  testData = await client.test.findUnique({
    where: {
      id: 1,
    },
  });

  if (!testData) {
    testData = await client.test.create({
      data: {
        id: 1,
        name: 'BALE',
      },
    });
  }

  return { props: { testData }, revalidate: 5 };
};

export default Home;
