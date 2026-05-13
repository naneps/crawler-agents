const createCrawler = require('./factory');
const db = require('./utils/db');

let crawlers = {};
let sourcesConfig = {};

async function initCrawlers() {
  console.log('🔄 Loading crawlers from Database...');
  const sources = await db.getAllSources();
  
  const newCrawlers = {};
  const newConfig = {};
  
  sources.forEach(source => {
    // Parse JSON fields if they are strings (MySQL JSON type might return object or string depending on driver config)
    const categories = typeof source.categories === 'string' ? JSON.parse(source.categories) : source.categories;
    const selectors = typeof source.selectors === 'string' ? JSON.parse(source.selectors) : source.selectors;
    
    newConfig[source.id] = {
      name: source.name,
      baseUrl: source.baseUrl,
      categories,
      selectors
    };
    
    newCrawlers[source.id] = createCrawler(newConfig[source.id]);
  });
  
  crawlers = newCrawlers;
  sourcesConfig = newConfig;
  console.log(`✅ Loaded ${Object.keys(crawlers).length} crawlers.`);
}

module.exports = {
  init: initCrawlers,
  get: (id) => crawlers[id],
  getAll: () => crawlers,
  getConfig: () => sourcesConfig
};
