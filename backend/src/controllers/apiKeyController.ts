import { Request, Response } from 'express';
import crypto from 'crypto';
import db from '../utils/db';

export const getKeys = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const stats = await db.getApiKeyStats(req.user.id);
        res.json({ success: true, keys: stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createKey = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const key = 'CG-' + crypto.randomBytes(24).toString('hex');
        await db.createApiKey(req.user.id, name, key);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteKey = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        // id comes in as string from params, but db function expects number
        await db.deleteApiKey(req.user.id, parseInt(id));
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLogs = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const logs = await db.getApiKeyLogs(req.user.id, parseInt(id));
        res.json({ success: true, logs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getQuota = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const userId = req.user.id;
        const usage = await db.getTodayUserRequestCount(userId);
        const planName = await db.getUserPlan(userId);
        
        // Get plan details
        const plans = await db.getAllPlans();
        const currentPlan = plans.find((p: any) => p.name === planName);
        
        res.json({ 
            success: true, 
            usage, 
            limit: currentPlan?.maxRequestsDay || 500,
            plan: planName 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

