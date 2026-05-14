const db = require('../utils/db');
const crypto = require('crypto');

exports.getKeys = async (req, res) => {
    try {
        const stats = await db.getApiKeyStats(req.session.userId);
        res.json({ success: true, keys: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createKey = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    try {
        const key = 'CG-' + crypto.randomBytes(24).toString('hex');
        await db.createApiKey(req.session.userId, name, key);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteKey = async (req, res) => {
    const { id } = req.params;
    try {
        await db.deleteApiKey(req.session.userId, id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLogs = async (req, res) => {
    const { id } = req.params;
    try {
        const logs = await db.getApiKeyLogs(req.session.userId, id);
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQuota = async (req, res) => {
    try {
        const userId = req.session.userId;
        const usage = await db.getTodayUserRequestCount(userId);
        const planName = await db.getUserPlan(userId);
        
        // Get plan details
        const plans = await db.getAllPlans();
        const currentPlan = plans.find(p => p.name === planName);
        
        res.json({ 
            success: true, 
            usage, 
            limit: currentPlan?.maxRequestsDay || 500,
            plan: planName 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
