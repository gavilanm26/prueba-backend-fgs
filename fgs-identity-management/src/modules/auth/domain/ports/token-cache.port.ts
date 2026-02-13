export const TOKEN_CACHE_PORT = 'TOKEN_CACHE_PORT';

export interface TokenCachePort {
    save(key: string, value: string, ttlSeconds: number): Promise<void>;
    get(key: string): Promise<{ value: string | null; ttl: number }>;
}
