const feedid = require('../index');
const NodeCache = require('node-cache');
const db = require('../utils/db');

const publicCache = new NodeCache({ stdTTL: 120 }); // 2-min cache

/**
 * GET /api/public/sources
 * Returns all configured sources with their categories (no auth)
 */
exports.getSources = async (req, res) => {
    const cached = publicCache.get('public-sources');
    if (cached) return res.json(cached);

    try {
        const config = feedid.getConfig();
        const sources = Object.entries(config).map(([id, src]) => ({
            id,
            name: src.name,
            baseUrl: src.baseUrl,
            categories: Object.keys(src.categories || {}),
            categoryCount: Object.keys(src.categories || {}).length,
        }));

        const result = { success: true, total: sources.length, sources };
        publicCache.set('public-sources', result);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/public/sample
 * Returns sample articles from a few sources (no auth)
 */
exports.getSample = async (req, res) => {
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
        const articles = [];

        for (const id of pickedIds) {
            try {
                const crawler = crawlers[id];
                if (!crawler) continue;
                const cats = Object.keys(crawler);
                const cat = cats.includes('terbaru') ? 'terbaru' : cats[0];
                if (!cat || !crawler[cat]) continue;
                const result = await crawler[cat]({ fetchDetail: false });
                const posts = result?.data?.posts || result?.posts || [];
                const top = posts.slice(0, 2).map(p => ({
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
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/public/register
 * Open self-serve registration (no auth)
 */
exports.register = async (req, res) => {
    const bcrypt = require('bcryptjs');
    const crypto = require('crypto');
    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    if (username.length < 3) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        const existing = await db.getUserByUsername(username);
        if (existing) return res.status(409).json({ success: false, message: 'Username already taken.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = 'cg_' + crypto.randomBytes(20).toString('hex');

        await db.createUser(username, hashedPassword, apiKey, 'user');
        res.json({ success: true, message: 'Account created! Redirecting to dashboard...' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
