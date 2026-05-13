const db = require('../utils/db');
const feedid = require('../index');

exports.getAllSources = async (req, res) => {
    try {
        const sources = await db.getAllSources();
        res.json(sources);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.upsertSource = async (req, res) => {
    const { id, name, baseUrl, categories, selectors } = req.body;
    try {
        await db.upsertSource(id, name, baseUrl, categories, selectors);
        await feedid.init();
        res.json({ success: true, message: 'Source saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSource = async (req, res) => {
    try {
        await db.deleteSource(req.params.id);
        await feedid.init();
        res.json({ success: true, message: 'Source deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
