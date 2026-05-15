import crawler  from './utils/crawler';
import { parseRss }  from './utils/parseRssInfo';

/**
 * Creates a crawler object based on the site configuration.
 * @param {Object} config - The site configuration from sources.js.
 * @returns {Object} - An object containing methods for each category.
 */
const createCrawler = (config) => {
  const methods = {};

  const parser = async (xml, options) =>
    parseRss({
      xml,
      fetchDetail: options?.fetchDetail,
      detailSelector: config.selectors,
      postKeys: config.postKeys || {},
      additionalInfo: {
        sourceName: config.name,
        ...(config.additionalInfo || {})
      },
    });

  Object.entries(config.categories).forEach(([name, path]) => {
    const rssUrl = config.baseUrl + path;
    methods[name] = (options) => crawler(rssUrl, parser, options);
  });

  return methods;
};

export default createCrawler;
