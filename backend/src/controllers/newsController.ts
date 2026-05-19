import { Request, Response } from 'express';
import feedid from '../index';
import NodeCache from 'node-cache';
import fetchArticleDetail from '../utils/detailCrawler';

const newsCache = new NodeCache({ stdTTL: 300 });

export const getSources = (req: Request, res: Response) => {
    const config = feedid.getConfig();
    const sourcesArray = Object.entries(config).map(([id, src]: any) => ({
        id,
        name: src.name,
        baseUrl: src.baseUrl,
        categories: src.categories,
        selectors: src.selectors
    }));
    res.json(sourcesArray);
};

export const getNews = async (req: Request, res: Response) => {
    const { source, category } = req.params as { source: string, category: string };
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
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSourceConfig = (req: Request, res: Response) => {
    const { source } = req.params as { source: string };
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

export const getArticleDetail = async (req: Request, res: Response) => {
    const { source } = req.params as { source: string };
    const { url } = req.query as { url: string };

    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    try {
        const config = feedid.getConfig();
        const sourceConfig = config[source];
        if (!sourceConfig) return res.status(404).json({ success: false, message: 'Source not found' });

        const details = await fetchArticleDetail(url, sourceConfig.selectors || {});
        res.json({
            success: true,
            data: {
                ...details,
                source: {
                    id: source,
                    name: sourceConfig.name,
                    baseUrl: sourceConfig.baseUrl,
                },
                articleUrl: url,
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

