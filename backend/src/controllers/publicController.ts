import { Request, Response } from 'express';
import feedid from '../index';
import NodeCache from 'node-cache';
import db from '../utils/db';

const publicCache = new NodeCache({ stdTTL: 120 }); // 2-min cache

/**
 * GET /api/public/sources
 * Returns all configured sources with their categories (no auth)
 */
export const getSources = async (req: Request, res: Response) => {
    const cached = publicCache.get('public-sources');
    if (cached) return res.json(cached);

    try {
        const config = feedid.getConfig();
        const sources = Object.entries(config).map(([id, src]: any) => ({
            id,
            name: src.name,
            baseUrl: src.baseUrl,
            categories: Object.keys(src.categories || {}),
            categoryCount: Object.keys(src.categories || {}).length,
        }));

        const result = { success: true, total: sources.length, sources };
        publicCache.set('public-sources', result);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/public/sample
 * Returns sample articles from a few sources (no auth)
 */
export const getSample = async (req: Request, res: Response) => {
    const cached = publicCache.get('public-sample');
    if (cached) return res.json(cached);

    try {
        const config = feedid.getConfig();
        const sourceIds = Object.keys(config);
        const crawlers = feedid.getAll();

        if (sourceIds.length === 0) {
            return res.json({ success: true, articles: [] });
        }

        // Pick up to 3 sources to sample from
        const pickedIds = sourceIds.slice(0, 3);
        const articles: any[] = [];

        for (const id of pickedIds) {
            try {
                const crawler = crawlers[id];
                if (!crawler) continue;
                const cats = Object.keys(crawler);
                const cat = cats.includes('terbaru') ? 'terbaru' : cats[0];
                if (!cat || !crawler[cat]) continue;
                const result = await crawler[cat]({ fetchDetail: false });
                const posts = result?.data?.posts || result?.posts || [];
                const top = posts.slice(0, 2).map((p: any) => ({
                    ...p,
                    sourceName: config[id].name,
                    sourceId: id,
                }));
                articles.push(...top);
            } catch (_) {
                // Skip failing source silently
            }
        }

        const result = { success: true, total: articles.length, articles };
        publicCache.set('public-sample', result);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/public/register
 * Open self-serve registration (no auth)
 */
export const register = async (req: Request, res: Response) => {
    return res.status(400).json({ success: false, message: 'Registration is now managed by Supabase. Please use the frontend.' });
};

