import xmlParser  from './xmlParser';
import { cleanHtml, isObjIncludeKey, dateToISO }  from './utility';
import responseCreator  from './responseCreator';
import fetchArticleDetail  from './detailCrawler';

const parseRssItems = async ({ items, keys = {}, fetchDetail = false, detailSelector = {} }: any) => {
  const defaultKeys = {
    description: keys.description ?? 'description',
    thumbnail: keys.thumbnail ?? 'enclosure',
  };

  const parsedItems = items.map((item) => {
    return {
      link: item['link'],
      title: item['title'],
      pubDate: isObjIncludeKey(item, 'pubDate')
        ? dateToISO(item['pubDate'])
        : null,
      description: cleanHtml(item[defaultKeys.description]),
      thumbnail:
        item[defaultKeys.thumbnail]?.url ?? item[defaultKeys.thumbnail],
    };
  });

  if (fetchDetail) {
    const detailPromises = parsedItems.map(async (item) => {
      const details = await fetchArticleDetail(item.link, detailSelector);
      return { ...item, ...details };
    });
    return Promise.all(detailPromises);
  }

  return parsedItems;
};

const parseRssInfo = async ({ rssJson, itemParser, postKeys, additionalInfo, fetchDetail, detailSelector }) => {
  const rssInfoKeys = ['title', 'description', 'image', 'link', 'item'];

  const info = await rssInfoKeys.reduce(async (accPromise, key) => {
    const acc = await accPromise;
    if (key === 'image' && isObjIncludeKey(rssJson, key)) {
      return { ...acc, image: rssJson[key]['url'] ?? null };
    }

    if (key === 'item') {
      return {
        ...acc,
        posts: await itemParser({ 
          items: rssJson[key], 
          keys: postKeys,
          fetchDetail,
          detailSelector
        }),
      };
    }

    return { [key]: rssJson[key], ...acc, ...additionalInfo };
  }, Promise.resolve({}));

  return info;
};

const parseRss = async ({ xml, postKeys = {}, additionalInfo = {}, fetchDetail = false, detailSelector = {} }) => {
  return responseCreator(
    await parseRssInfo({
      rssJson: await xmlParser(xml),
      itemParser: parseRssItems,
      postKeys,
      additionalInfo,
      fetchDetail,
      detailSelector
    })
  );
};

export { parseRssInfo, parseRssItems, parseRss };
