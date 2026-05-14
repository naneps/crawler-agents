const db = require('../utils/db');

// Check if user is logged in
const requireAuth = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ success: false, message: 'Authentication required' });
};

// Check if user is platform admin
const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') return next();
    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
};

// Hybrid: Check API Key OR Admin Session
const requireCredential = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const startTime = Date.now();
    
    // 1. Admin Session bypass
    if (req.session.userId && req.session.role === 'admin') return next();

    // 2. API Key Check
    if (apiKey) {
        let keyRecord = await db.getApiKeyByKey(apiKey);
        let user;

        if (keyRecord) {
            user = await db.getUserById(keyRecord.user_id);
            req.apiKeyId = keyRecord.id;
        } else {
            // Fallback to legacy single key in users table
            user = await db.getUserByApiKey(apiKey);
        }

        if (user) {
            req.user = user;
            req.userPlan = user.plan || 'free';
            
            // Log analytics after response is sent
            res.on('finish', () => {
                if (req.apiKeyId) {
                    db.logApiRequest(
                        req.apiKeyId,
                        req.originalUrl,
                        req.method,
                        res.statusCode,
                        Date.now() - startTime,
                        req.ip
                    ).catch(err => console.error('Logging error:', err));
                }
            });
            return next();
        }
    }

    res.status(401).json({ success: false, message: 'Valid API Key or Admin Login required' });
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireCredential
};
