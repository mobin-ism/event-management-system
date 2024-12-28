import * as redisStore from 'cache-manager-redis-store'
export const CACHE_CONFIG = {
    isGlobal: true,
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: parseInt(process.env.TTL) // Time to live in seconds
}
