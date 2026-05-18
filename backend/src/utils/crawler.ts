const { default: axios } = require('axios');
import responseCreator  from './responseCreator';

const crawler = async (rssUrl, cb, options) => {
  try {
    const { data } = await axios.get(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });
    return await cb(data, options);
  } catch (error: any) {
    return responseCreator(error?.message ?? 'Something went wrong');
  }
};

export default crawler;
