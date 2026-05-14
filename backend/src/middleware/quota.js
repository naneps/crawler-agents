const db = require('../utils/db');

const DAILY_LIMITS = {
    free: 500,
    pro: 50000,
    enterprise: Infinity,
};

/**
 * Middleware: Check daily API quota per key.
 * Must be used after requireCredential (which sets req.apiKeyId and req.userPlan).
 */
module.exports = async function quotaMiddleware(req, res, next) {
    try {
        const keyId = req.apiKeyId;
        if (!keyId) return next(); // session-based (dashboard user), no quota

        const plan = req.userPlan || 'free';
        const limit = DAILY_LIMITS[plan] ?? DAILY_LIMITS.free;

        if (limit === Infinity) return next();

        const count = await db.getTodayRequestCount(keyId);
        if (count >= limit) {
            return res.status(429).json({
                success: false,
                message: `Daily quota exceeded. Your ${plan} plan allows ${limit} requests/day.`,
                quota: { used: count, limit, plan },
            });
        }

        // Attach quota info to response headers
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count - 1));

        next();
    } catch (error) {
        // Don't block request if quota check fails
        console.error('[quota] Failed to check quota:', error.message);
        next();
    }
};
