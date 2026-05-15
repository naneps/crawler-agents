import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import db from '../utils/db';

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userPlan?: string;
      planLimit?: number;
      apiKeyId?: number;
    }
  }
}

// Check if user is logged in via Supabase JWT
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required: Missing Bearer Token' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Attach Supabase user to request
    req.user = user;
    
    // Auto-sync user to Prisma DB if they don't exist
    // This is optional but recommended if you want to store roles/api keys locally
    let localUser = await db.getUserById(user.id);
    if (!localUser) {
       // Extract email or fallback
       const email = user.email || 'unknown@user.com';
       localUser = await db.createUser(user.id, email, null, null, 'user');
    }

    req.user.role = localUser?.role || 'user';
    return next();
};

// Check if user is platform admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    await requireAuth(req, res, async () => {
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ success: false, message: 'Access denied: Admin only' });
    });
};

// Hybrid: Check API Key OR Supabase JWT
export const requireCredential = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = (req.headers['x-api-key'] || req.query.apiKey) as string;
    const authHeader = req.headers.authorization;
    const startTime = Date.now();
    
    // 1. Supabase Token bypass
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
            const localUser = await db.getUserById(user.id);
            if (localUser && localUser.role === 'admin') {
                req.user = localUser;
                return next();
            }
        }
    }

    // 2. API Key Check
    if (apiKey) {
        let keyRecord = await db.getApiKeyByKey(apiKey);
        let user;

        if (keyRecord) {
            user = keyRecord.user;
            req.apiKeyId = keyRecord.id;
        } else {
            // Fallback to legacy single key in users table
            user = await db.getUserByApiKey(apiKey);
        }

        if (user) {
            req.user = user;
            // Get plan name from active subscription
            const activeSub = user.subscriptions && user.subscriptions[0];
            req.userPlan = activeSub ? activeSub.plan.name : 'free';
            req.planLimit = activeSub ? activeSub.plan.maxRequestsDay : 500;
            
            // Log analytics after response is sent
            res.on('finish', () => {
                if (req.apiKeyId) {
                    db.logApiRequest(
                        req.apiKeyId,
                        req.originalUrl,
                        req.method,
                        res.statusCode,
                        Date.now() - startTime,
                        req.ip || 'unknown'
                    ).catch(err => console.error('Logging error:', err));
                }
            });
            return next();
        }
    }

    res.status(401).json({ success: false, message: 'Valid API Key or Admin Login required' });
};

