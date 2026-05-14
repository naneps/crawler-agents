const db = require('../utils/db');

exports.getStats = async (req, res) => {
    try {
        const stats = await db.getGlobalStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await db.getAllPlans();
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.upsertPlan = async (req, res) => {
    try {
        const { id, name, price, maxRequestsDay, features } = req.body;
        const plan = await db.upsertPlan(id, { name, price, maxRequestsDay, features });
        res.json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        await db.deletePlan(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await db.getAllSubscriptions();
        res.json({ success: true, subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.setUserPlan = async (req, res) => {
    try {
        const { planName } = req.body;
        await db.setUserPlan(req.params.id, planName);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
