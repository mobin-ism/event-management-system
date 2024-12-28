export const THROTTLER_CONFIG = {
    useFactory: async () => ({
        throttlers: [
            {
                ttl:
                    parseInt(process.env.RATE_LIMITER_TIME_TO_LEAVE, 10) ||
                    60000, // default to 60000 if env variable not present
                limit: parseInt(process.env.RATE_LIMITER_MAX_TRY, 10) || 10 // default to 10 if env variable not present
            }
        ]
    })
}
