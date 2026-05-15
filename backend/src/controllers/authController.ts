import { Request, Response } from 'express';
import crypto from 'crypto';
import db from '../utils/db';

export const register = async (req: Request, res: Response) => {
    res.status(400).json({ success: false, message: 'Registration is now managed by Supabase. Please use the frontend.' });
};

export const login = async (req: Request, res: Response) => {
    res.status(400).json({ success: false, message: 'Login is now managed by Supabase. Please use the frontend.' });
};

export const logout = (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logout is managed by frontend via Supabase.' });
};

export const me = async (req: Request, res: Response) => {
    if (req.user) {
        try {
            const user = await db.getUserById(req.user.id);
            if (!user) return res.json({ loggedIn: false });
            
            return res.json({ 
                loggedIn: true, 
                username: user.username, 
                role: user.role,
                apiKey: user.apiKey 
            });
        } catch (error) {
            return res.json({ loggedIn: false });
        }
    } else {
        return res.json({ loggedIn: false });
    }
};

export const getApiKey = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false });
        const user = await db.getUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false });
        res.json({ apiKey: user.apiKey });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const rotateApiKey = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false });
        const newKey = crypto.randomBytes(24).toString('hex');
        await db.updateApiKey(req.user.id, newKey);
        res.json({ success: true, apiKey: newKey });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

