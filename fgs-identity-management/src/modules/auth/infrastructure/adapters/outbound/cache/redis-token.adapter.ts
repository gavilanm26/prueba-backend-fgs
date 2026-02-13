import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { from, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { internalLogger } from '../../../../../../commons/http-logger/httpLogger';
import { TokenCachePort } from '../../../../domain/ports';

@Injectable()
export class RedisTokenAdapter implements TokenCachePort {
    private readonly logger = new Logger(RedisTokenAdapter.name);

    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) { }

    async save(key: string, value: string, ttlSeconds: number): Promise<void> {
        await lastValueFrom(
            from(this.redis.set(key, value, 'EX', ttlSeconds)).pipe(
                map(res => ({ result: res })),
                internalLogger(
                    this.logger,
                    false,
                    undefined,
                    key,
                    { value },
                    undefined,
                    'REDIS_SAVE',
                ),
            ),
        );
    }

    async get(key: string): Promise<{ value: string | null; ttl: number }> {
        return lastValueFrom(
            from(this.redis.pipeline().get(key).ttl(key).exec()).pipe(
                map(results => {
                    if (!results) return { result: { value: null, ttl: -2 } };
                    const value = results[0][1] as string | null;
                    const ttl = results[1][1] as number;
                    return { result: { value, ttl } };
                }),
                internalLogger(
                    this.logger,
                    false,
                    undefined,
                    key,
                    undefined,
                    undefined,
                    'REDIS_GET_WITH_TTL',
                ),
            ),
        );
    }
}
