import type { NextPage } from 'next';
import client from '@libs/server/client';
import Button from '@components/Button';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie, getCookie } from '@libs/client/utils';

interface HomeProps {
  testData: { id: number; name: string };
}

const Home: NextPage<HomeProps> = ({ testData }: HomeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const unSetCookie = async () => {
    // setLoading(true);
    // try {
    //   const data = await fetch('http://localhost:3000/api/cookie', {
    //     method: 'DELETE',
    //   });
    // } finally {
    //   setLoading(false);
    // }

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
      <div className="flex w-full items-center justify-center space-x-10">
        <Button onClick={unSetCookie} loading={loading}>
          Unset Cookie
        </Button>
      </div>
      <div className="w-4/5 border border-teal-500 flex justify-between border-dotted rounded-xl shadow-md text-gray-700">
        <span className="px-10 py-5">{process.env.NEXT_PUBLIC_COOKIE_NAME}</span>
        <span className="px-10 py-5">{getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME!)}</span>
      </div>
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
