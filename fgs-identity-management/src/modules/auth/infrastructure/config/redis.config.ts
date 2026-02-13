import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = registerAs('redis', (): RedisOptions => {
    const host = process.env.REDIS_HOST;
    const port = Number(process.env.REDIS_PORT);
    const password = process.env.REDIS_PASSWORD;

    const useTls = process.env.REDIS_TLS === 'true';

    return {
        host,
        port,
        password,
        ...(useTls && { tls: {} }),
    };
});
