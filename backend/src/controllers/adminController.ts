import { Request, Response } from 'express';
import db from '../utils/db';

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await db.getGlobalStats();
        res.json({ success: true, stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.getAllUsers();
        // Add today's usage for each user
        const usersWithQuota = await Promise.all(users.map(async (u: any) => {
            const usage = await db.getTodayUserRequestCount(u.id);
            const planLimit = u.subscriptions?.[0]?.plan?.maxRequestsDay || 500;
            return { ...u, usage, planLimit };
        }));
        res.json({ success: true, users: usersWithQuota });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPlans = async (req: Request, res: Response) => {
    try {
        const plans = await db.getAllPlans();
        res.json({ success: true, plans });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const upsertPlan = async (req: Request, res: Response) => {
    try {
        const { id, name, price, maxRequestsDay, features } = req.body;
        const plan = await db.upsertPlan(id, { name, price, maxRequestsDay, features });
        res.json({ success: true, plan });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        await db.deletePlan(parseInt(req.params.id));
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await db.getAllSubscriptions();
        res.json({ success: true, subscriptions });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const setUserPlan = async (req: Request, res: Response) => {
    try {
        const { planName } = req.body;
        // The id passed might be an integer based on the old schema, but we changed to string
        await db.setUserPlan(req.params.id, planName);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

