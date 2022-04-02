import type { NextPage } from 'next';
import client from '@libs/server/client';
import Button from '@components/Button';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface HomeProps {
  testData: { id: number; name: string };
}

const Home: NextPage<HomeProps> = ({ testData }: HomeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const unSetCookie = async () => {
    setLoading(true);
    try {
      const data = await fetch('http://localhost:3000/api/cookie', {
        method: 'DELETE',
      });
    } finally {
      setLoading(false);
    }
    router.push('/');
  };

  return (
    <>
      <div className="w-full p-20 text-center text-4xl font-medium text-cyan-700">
        Hello {`${testData.name}(${testData.id})`}
      </div>
      <div className="flex w-full items-center justify-center space-x-10">
        <Button onClick={unSetCookie} loading={loading}>
          Unset Cookie
        </Button>
      </div>
    </>
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
