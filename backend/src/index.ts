import createCrawler from './factory';
import db from './utils/db';

let crawlers: any = {};
let sourcesConfig: any = {};

async function initCrawlers() {
  console.log('🔄 Loading crawlers from Database...');
  const sources = await db.getAllSources();
  
  const newCrawlers: any = {};
  const newConfig: any = {};
  
  sources.forEach((source: any) => {
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

const get = (id: string) => crawlers[id];
const getAll = () => crawlers;
const getConfig = () => sourcesConfig;

export default {
  init: initCrawlers,
  get,
  getAll,
  getConfig
};

