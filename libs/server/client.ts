import { PrismaClient } from '@prisma/client';

declare global {
  var client: PrismaClient | undefined;
}

const getNewPrismaClient = () => {
  const newPrismaClient = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }],
  });

  newPrismaClient.$on('query', (e) => {
    // Query Logging
    // console.log('Query: ' + e.query);
    // console.log('Params: ' + e.params);
    // console.log('Duration: ' + e.duration + 'ms');
  });

  return newPrismaClient;
};

const client = global.client || getNewPrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.client = client;
}

export default client;
