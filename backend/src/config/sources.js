module.exports = {
  antara: {
    name: 'Antara News',
    baseUrl: 'https://www.antaranews.com/rss/',
    categories: {
      terbaru: 'terkini.xml',
      politik: 'politik.xml',
      ekonomi: 'ekonomi.xml',
      bola: 'sepakbola.xml',
      tekno: 'tekno.xml',
      otomotif: 'otomotif.xml',
      hiburan: 'hiburan.xml',
      lifestyle: 'lifestyle.xml'
    },
    selectors: {
      content: 'article, .post-content, .entry-content, .detail-content',
      author: '.author, .writer, .byline, .text-muted, .reporter',
      tags: '.tags a, .tag-links a, .detail-tag a'
    }
  },
  cnn: {
    name: 'CNN Indonesia',
    baseUrl: 'https://www.cnnindonesia.com/',
    categories: {
      terbaru: 'rss',
      nasional: 'nasional/rss',
      internasional: 'internasional/rss',
      ekonomi: 'ekonomi/rss',
      olahraga: 'olahraga/rss',
      teknologi: 'teknologi/rss',
      hiburan: 'hiburan/rss',
      gaya_hidup: 'gaya-hidup/rss'
    },
    selectors: {
      content: '.detail-text, #detikdetailtext',
      author: '.author, .writer',
      tags: '.detail-tag a'
    }
  },
  cnbc: {
    name: 'CNBC Indonesia',
    baseUrl: 'https://www.cnbcindonesia.com/',
    categories: {
      terbaru: 'news/rss',
      investment: 'investment/rss',
      market: 'market/rss',
      entrepreneur: 'entrepreneur/rss',
      syariah: 'syariah/rss',
      tech: 'tech/rss',
      lifestyle: 'lifestyle/rss'
    },
    selectors: {
      content: '.detail_text',
      author: '.author, .writer',
      tags: '.detail_tag a'
    }
  },
  republika: {
    name: 'Republika',
    baseUrl: 'https://www.republika.co.id/rss/',
    categories: {
      terbaru: '',
      nasional: 'nasional',
      internasional: 'internasional',
      ekonomi: 'ekonomi',
      sepakbola: 'sepakbola',
      leisure: 'leisure',
      khazanah: 'khazanah'
    },
    selectors: {
      content: '.detail-konten, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },
  tempo: {
    name: 'Tempo',
    baseUrl: 'https://rss.tempo.co/',
    categories: {
      nasional: 'nasional',
      bisnis: 'bisnis',
      metro: 'metro',
      dunia: 'dunia',
      bola: 'bola',
      cantik: 'cantik',
      tekno: 'tekno',
      otomotif: 'otomotif',
      seleb: 'seleb',
      gaya: 'gaya',
      travel: 'travel',
      difabel: 'difabel',
      creativelab: 'creativelab',
      inggris: 'inggris'
    },
    selectors: {
      content: '.detail-konten, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },
  merdeka: {
    name: 'Merdeka',
    baseUrl: 'https://www.merdeka.com/feed/',
    categories: {
      terbaru: '',
      jakarta: 'jakarta',
      dunia: 'dunia',
      gaya: 'gaya',
      olahraga: 'olahraga',
      teknologi: 'teknologi',
      otomotif: 'otomotif',
      sehat: 'sehat'
    },
    selectors: {
      content: '.mdk-body-artikel, .article-content',
      author: '.reporter, .writer',
      tags: '.tag a'
    }
  },
  okezone: {
    name: 'Okezone',
    baseUrl: 'https://sindikasi.okezone.com/index.php/rss/',
    categories: {
      terbaru: '0/RSS2.0',
      celebrity: '13/RSS2.0',
      sports: '2/RSS2.0',
      otomotif: '15/RSS2.0',
      economy: '11/RSS2.0',
      techno: '16/RSS2.0',
      lifestyle: '12/RSS2.0',
      bola: '14/RSS2.0'
    },
    selectors: {
      content: '.read, .content-read, .detail-text',
      author: '.reporter, .writer',
      tags: '.tag a'
    },
    postKeys: { thumbnail: 'imglink' }
  },
  sindonews: {
    name: 'Sindonews',
    baseUrl: 'https://www.sindonews.com/feed/',
    categories: {
      terbaru: '',
      nasional: 'nasional',
      metro: 'metro',
      ekonomi: 'ekonomi',
      international: 'international',
      daerah: 'daerah',
      sports: 'sports',
      otomotif: 'otomotif',
      tekno: 'tekno',
      lifestyle: 'lifestyle'
    },
    selectors: {
      content: '#content, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },
  suara: {
    name: 'Suara.com',
    baseUrl: 'https://www.suara.com/rss/',
    categories: {
      terbaru: '',
      bisnis: 'bisnis',
      bola: 'bola',
      lifestyle: 'lifestyle',
      entertainment: 'entertainment',
      otomotif: 'otomotif',
      tekno: 'tekno',
      health: 'health'
    },
    selectors: {
      content: '.detail-content, .article-content',
      author: '.author-name, .writer',
      tags: '.tag a'
    }
  },
  tribun: {
    name: 'Tribun News',
    baseUrl: 'https://www.tribunnews.com/rss/',
    categories: {
      terbaru: '',
      bisnis: 'bisnis',
      superskor: 'superskor',
      sport: 'sport',
      seleb: 'seleb',
      lifestyle: 'lifestyle',
      travel: 'travel',
      parapuan: 'parapuan',
      otomotif: 'otomotif',
      techno: 'techno',
      kesehatan: 'kesehatan'
    },
    selectors: {
      content: '.txt-article, .article-content',
      author: '#penulis, .writer',
      tags: '.tag a'
    }
  },
  kumparan: {
    name: 'Kumparan',
    baseUrl: 'https://lapi.kumparan.com/v3.0/rss/',
    categories: {
      terbaru: ''
    },
    selectors: {
      content: '.detail-content, .article-content',
      author: '.author-name, .writer',
      tags: '.tag a'
    }
  },
  jpnn: {
    name: 'JPNN',
    baseUrl: 'https://www.jpnn.com/index.php?mib=rss',
    categories: {
      terbaru: ''
    },
    selectors: {
      content: '.content, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },
  koreanTimes: {
    name: 'Korea Times',
    baseUrl: 'https://feed.koreatimes.co.kr/k/',
    categories: {
      terbaru: 'allnews.xml',
      nasional: 'southkorea.xml',
      bisnis: 'business.xml',
      ekonomi: 'economy.xml',
      hiburan: 'entertainment.xml',
      lifestyle: 'lifestyle.xml',
      olahraga: 'sports.xml',
      dunia: 'world.xml'
    },
    selectors: {
      content: 'div[class*="View_article"]',
      author: 'a[class*="ReporterInfo_name"]',
      tags: '[class*="TopicFollowButton_btn-text"]'
    }
  },
  yonhap: {
    name: 'Yonhap News',
    baseUrl: 'https://en.yna.co.kr/RSS/',
    categories: {
      terbaru: 'news.xml',
      top: 'topnews.xml',
      politik: 'politics.xml',
      ekonomi: 'economy.xml',
      olahraga: 'sports.xml',
      hiburan: 'entertainment.xml',
      lifestyle: 'culture.xml',
      north_korea: 'northkorea.xml'
    },
    selectors: {
      content: 'article.story-news',
      author: 'p.p_writer',
      tags: '.kwd-lst a'
    }
  },
  koreaHerald: {
    name: 'The Korea Herald',
    baseUrl: 'https://www.koreaherald.com/rss/',
    categories: {
      terbaru: 'newsAll',
      nasional: '0201010000',
      bisnis: '0201020000',
      lifestyle: '0201030000',
      hiburan: '0201040000',
      olahraga: '0201050000',
      dunia: '0201060000'
    },
    selectors: {
      content: '#articleBody',
      author: 'em.editor_name, .view_editors .name',
      tags: '.view_tag a'
    }
  },
  kcna: {
    name: 'KCNA Watch',
    baseUrl: 'https://kcnawatch.org/',
    categories: {
      terbaru: 'feed/'
    },
    selectors: {
      content: '.col-lg-9',
      author: '',
      tags: ''
    }
  }
};
