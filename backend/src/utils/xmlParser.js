const xml2js = require('xml2js');

const xmlParser = async (xml) => {
  try {
    // Fix common XML entity issues like unescaped ampersands
    let cleanedXml = xml.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[a-fA-F\d]+);)/g, '&amp;');
    
    // Remove other potentially problematic characters in tag names or attributes
    cleanedXml = cleanedXml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    const parsed = await xml2js.parseStringPromise(cleanedXml, {
      trim: true,
      explicitArray: false,
      attrkey: false,
      mergeAttrs: true,
      normalize: true,
    });

    if (!parsed || !parsed.rss || !parsed.rss.channel) {
      throw new Error('Invalid RSS structure');
    }

    return parsed.rss.channel;
  } catch (error) {
    throw new Error(`XML Parsing Error: ${error.message}`);
  }
};

module.exports = xmlParser;
