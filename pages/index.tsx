import type { NextPage } from 'next';
import client from '@libs/server/client';

interface HomeProps {
  testData: { id: number; name: string };
}

const Home: NextPage<HomeProps> = ({ testData }: HomeProps) => {
  return (
    <div className="w-full p-20 text-center text-4xl font-medium text-cyan-700">
      Hello {`${testData.name}(${testData.id})`}
    </div>
  );
};

// * use ISR in NEXT.js
export const getStaticProps = async () => {
  let testData;
  console.log(`1. select testData`);
  testData = await client.test.findUnique({
    where: {
      id: 1,
    },
  });

  if (!testData) {
    console.log(`2. create testData`);
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
