import { Request, Response } from 'express';
import db from '../utils/db';
import feedid from '../index';

export const getAllSources = async (req: Request, res: Response) => {
    try {
        const sources = await db.getAllSources();
        res.json(sources);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const upsertSource = async (req: Request, res: Response) => {
    const { id, name, baseUrl, categories, selectors } = req.body;
    try {
        await db.upsertSource(id, name, baseUrl, categories, selectors);
        await feedid.init();
        res.json({ success: true, message: 'Source saved' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSource = async (req: Request, res: Response) => {
    try {
        await db.deleteSource(req.params.id as string);
        await feedid.init();
        res.json({ success: true, message: 'Source deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

