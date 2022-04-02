import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

declare global {
  var globalRedisClient: RedisClientType;
}

const getNewRedisClient = async () => {
  const newRedisClient = createClient({ url: process.env.REDIS_URL });

  newRedisClient.on('error', (err) => console.log('Redis Client Error', err));

  await newRedisClient.connect();

  const redisClient = global.globalRedisClient || newRedisClient;
  if (process.env.NODE_ENV === 'development') {
    global.globalRedisClient = redisClient;
  }

  return redisClient;
};

export default getNewRedisClient;
