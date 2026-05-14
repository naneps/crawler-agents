const db = require('../utils/db');



/**
 * Middleware: Check daily API quota per key.
 * Must be used after requireCredential (which sets req.apiKeyId and req.userPlan).
 */
module.exports = async function quotaMiddleware(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) return next(); // session-based or unknown

        const plan = req.userPlan || 'free';
        const limit = req.planLimit ?? 500;

        if (limit >= 999999) return next(); // Enterprise/Unlimited

        const count = await db.getTodayUserRequestCount(userId);
        if (count >= limit) {
            return res.status(429).json({
                success: false,
                message: `Daily quota exceeded for your account. Your ${plan} plan allows ${limit} requests/day across all keys.`,
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
