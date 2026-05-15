const { default: axios } = require('axios');
import { Readability } from '@mozilla/readability';
import cheerio from 'cheerio';
import { JSDOM } from 'jsdom';

/**
 * Fetches article detail from a given URL.
 * @param {string} url - The article URL.
 * @param {Object} selectors - Object containing selectors for custom extraction.
 * @returns {Promise<Object>} - The extracted data.
 */
const fetchArticleDetail = async (url, selectors = {}) => {
  try {
    let currentUrl = url;
    let allContent = '';
    let allContentHtml = '';
    let firstPageData = null;
    let firstPageHtml = null;
    let visitedUrls = new Set();
    let pageCount = 0;

    while (currentUrl && !visitedUrls.has(currentUrl) && pageCount < 10) {
      visitedUrls.add(currentUrl);
      pageCount++;

      const { data } = await axios.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        },
        timeout: 30000,
      });

      if (!firstPageHtml) {
        firstPageHtml = data;
      }

      const dom = new JSDOM(data, { url: currentUrl });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!firstPageData) {
        firstPageData = article;
      }

      if (article?.textContent) {
        allContent += (allContent ? '\n\n' : '') + article.textContent.trim();
      }

      if (article?.content) {
        allContentHtml += (allContentHtml ? '<hr class="page-divider">' : '') + article.content;
      }

      // Detect next page
      const $ = cheerio.load(data);
      let nextUrl = null;

      // Special case for Tribun: often has "?page=all" which is better
      if (currentUrl.includes('tribunnews.com') && !currentUrl.includes('?page=all')) {
        nextUrl = currentUrl.includes('?') ? `${currentUrl}&page=all` : `${currentUrl}?page=all`;
      } else {
        const nextLink = $('a').filter((i, el) => {
          const text = $(el).text().toLowerCase();
          const href = $(el).attr('href');
          return (
            href &&
            (text.includes('selanjutnya') || 
             text.includes('next') || 
             (text.trim().match(/^\d+$/) && parseInt(text.trim()) === pageCount + 1))
          );
        }).first();

        if (nextLink.length > 0) {
          nextUrl = new URL(nextLink.attr('href'), currentUrl).href;
        }
      }

      if (nextUrl && !visitedUrls.has(nextUrl)) {
        currentUrl = nextUrl;
      } else {
        currentUrl = null;
      }
    }

    // Extract tags and refine author from the first page's raw HTML
    const $ = cheerio.load(firstPageHtml);
    const authorSelector = selectors.author || '.author, .writer, .byline, .text-muted, .penulis, .reporter, .author-name, #penulis, .by';
    const tagsSelector = selectors.tags || '.tags a, .tag-links a, [href*="/tag/"], .detail-tag a, .detail_tag a, .tag a';

    let author = firstPageData?.byline || $(authorSelector).first().text().trim() || null;
    if (author) {
      author = author.replace(/\t|\n/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const tags = [];
    $(tagsSelector).each((i, el) => {
      const tagText = $(el).text().trim();
      if (tagText && !tags.includes(tagText)) tags.push(tagText);
    });

    return {
      content: allContent.trim() || null,
      contentHtml: allContentHtml.trim() || null,
      excerpt: firstPageData?.excerpt || null,
      author,
      tags: tags.length > 0 ? tags : null,
    };
  } catch (error) {
    return {
      content: null,
      author: null,
      tags: null,
      error: error.response ? `${error.response.status} ${error.response.statusText}` : error.message,
    };
  }
};

export default fetchArticleDetail;
