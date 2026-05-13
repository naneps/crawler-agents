const feedid = require('../index');
const NodeCache = require('node-cache');
const fetchArticleDetail = require('../utils/detailCrawler');
const newsCache = new NodeCache({ stdTTL: 300 });

exports.getConfig = (req, res) => {
    res.json(feedid.getConfig());
};

exports.getNews = async (req, res) => {
    const { source, category } = req.params;
    const { fetchDetail } = req.query;
    const cacheKey = `${source}-${category}-${fetchDetail}`;

    const cachedData = newsCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    try {
        const crawler = feedid.get(source);
        if (!crawler) return res.status(404).json({ success: false, message: 'Source not found' });

        const categories = Object.keys(crawler);
        const targetCategory = category || (crawler.terbaru ? 'terbaru' : categories[0]);
        const fetchMethod = crawler[targetCategory];
        
        if (!fetchMethod) return res.status(404).json({ success: false, message: `Category ${targetCategory} not found` });

        const result = await fetchMethod({ fetchDetail: fetchDetail === 'true' });
        newsCache.set(cacheKey, result);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSourceConfig = (req, res) => {
    const { source } = req.params;
    const config = feedid.getConfig();
    const sourceConfig = config[source];
    
    if (!sourceConfig) {
        return res.status(404).json({ success: false, message: 'Source not found' });
    }
    
    res.json({
        success: true,
        source: source,
        name: sourceConfig.name,
        baseUrl: sourceConfig.baseUrl,
        categories: Object.keys(sourceConfig.categories || {})
    });
};

exports.getArticleDetail = async (req, res) => {
    const { source } = req.params;
    const { url } = req.query;

    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    try {
        const config = feedid.getConfig();
        const sourceConfig = config[source];
        // Even if source is not found, we can try with default selectors, but better to enforce
        if (!sourceConfig) return res.status(404).json({ success: false, message: 'Source not found' });

        const details = await fetchArticleDetail(url, sourceConfig.selectors || {});
        res.json({
            success: true,
            data: details
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
