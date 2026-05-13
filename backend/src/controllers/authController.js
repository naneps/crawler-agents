const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../utils/db');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await db.getUserByUsername(username);
        if (existing) return res.status(400).json({ success: false, message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = crypto.randomBytes(24).toString('hex');
        
        await db.createUser(username, hashedPassword, apiKey, 'user');
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`🔑 Login attempt for: [${username}]`);
    try {
        const user = await db.getUserByUsername(username);
        if (!user) {
            console.log(`❌ User not found: [${username}]`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log(`🔍 Password match: ${match}`);
        
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        res.json({ 
            success: true, 
            message: 'Login successful', 
            user: { 
                username: user.username, 
                role: user.role,
                apiKey: user.api_key
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ success: true });
};

exports.me = async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await db.getUserByUsername(req.session.username);
            res.json({ 
                loggedIn: true, 
                username: user.username, 
                role: user.role,
                apiKey: user.api_key 
            });
        } catch (error) {
            res.json({ loggedIn: false });
        }
    } else {
        res.json({ loggedIn: false });
    }
};

exports.getApiKey = async (req, res) => {
    try {
        const user = await db.getUserByUsername(req.session.username);
        res.json({ apiKey: user.api_key });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

exports.rotateApiKey = async (req, res) => {
    try {
        const newKey = crypto.randomBytes(24).toString('hex');
        await db.updateApiKey(req.session.userId, newKey);
        res.json({ success: true, apiKey: newKey });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
