(function () {
  const e = React.createElement;

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeLookup(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  const categoryLabels = {
    movies: "电影",
    tv: "电视剧",
    music: "音乐",
    books: "书籍",
    events: "演出活动"
  };

  const categoryHeroImages = {
    movies: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80"
    ],
    tv: [
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=900&q=80"
    ],
    music: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=80"
    ],
    books: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80"
    ],
    events: [
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=80"
    ]
  };

  const categoryBackdropImages = {
    movies: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80",
    tv: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1800&q=80",
    music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
    books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=80",
    events: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=80"
  };

  const categoryConfigs = {
    movies: {
      title: "电影高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019", "2000 以前"] },
        { key: "genre", label: "分类", options: ["剧情", "悬疑", "爱情", "科幻", "动画", "纪录片"] },
        { key: "region", label: "地区", options: ["中国", "美国", "日本", "韩国", "欧洲", "其他"] },
        { key: "type", label: "类型", options: ["院线", "流媒体", "独立电影", "艺术电影", "经典修复"] }
      ]
    },
    tv: {
      title: "电视剧高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019", "2023", "2021"] },
        { key: "genre", label: "题材", options: ["悬疑", "都市", "古装", "爱情", "喜剧", "科幻", "奇幻"] },
        { key: "region", label: "地区", options: ["中国", "美国", "韩国", "日本", "英国"] },
        { key: "type", label: "平台", options: ["电视台", "Netflix", "HBO", "Apple TV+", "Disney+", "流媒体"] }
      ]
    },
    music: {
      title: "音乐高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019", "经典"] },
        { key: "genre", label: "流派", options: ["流行", "摇滚", "电子", "R&B", "民谣", "古典", "Soundtrack", "K-Pop", "Hip-Hop/Rap", "Country"] },
        { key: "region", label: "地区", options: ["中国", "欧美", "日本", "韩国", "独立厂牌", "美国"] },
        { key: "type", label: "形式", options: ["专辑", "EP", "单曲", "现场专辑", "艺人"] }
      ]
    },
    books: {
      title: "书籍高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019", "经典"] },
        { key: "genre", label: "分类", options: ["文学", "非虚构", "科幻", "悬疑", "艺术", "传记", "爱情", "诗歌"] },
        { key: "region", label: "地区", options: ["中国", "欧美", "日本", "韩国", "拉美", "欧洲", "美国"] },
        { key: "type", label: "类型", options: ["小说", "散文", "诗集", "漫画", "学术", "绘本"] }
      ]
    },
    events: {
      title: "演出高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["本周", "本月", "未来 3 个月", "今年"] },
        { key: "genre", label: "分类", options: ["演唱会", "音乐节", "舞台剧", "脱口秀", "展览", "Live House"] },
        { key: "region", label: "地区", options: ["上海", "北京", "广州", "深圳", "杭州", "成都", "美国"] },
        { key: "type", label: "类型", options: ["室内", "户外", "巡演", "驻场", "限时活动"] }
      ]
    }
  };

  function makeWorks(category, items) {
    return items.map(function (item, index) {
      const imagePool = categoryHeroImages[category];
      return Object.assign(
        {
          id: slugify(item.title),
          category: category,
          label: categoryLabels[category],
          cover: imagePool[index % imagePool.length],
          backdrop: categoryBackdropImages[category]
        },
        item
      );
    });
  }

  const allWorks = []
    .concat(makeWorks("movies", [
      { title: "Project Hail Mary", creator: "Ryan Gosling", year: "2026", genre: "科幻", region: "美国", type: "院线", rating: 8.4, blurb: "IMDb 当前热门电影榜前列作品，太空题材和高讨论度都很适合当作电影页主视觉。" },
      { title: "The Super Mario Galaxy Movie", creator: "Nintendo / Illumination", year: "2026", genre: "动画", region: "美国", type: "院线", rating: 6.5, blurb: "高辨识度 IP 作品，适合说明首页海报位如何承接大众关注。" },
      { title: "Crime 101", creator: "Halle Berry / Chris Hemsworth", year: "2026", genre: "悬疑", region: "美国", type: "院线", rating: 6.9, blurb: "犯罪题材新片，天然适合带出用户评分、分析帖和短评区。" },
      { title: "The Drama", creator: "Robert Pattinson / Zendaya", year: "2026", genre: "剧情", region: "美国", type: "院线", rating: 7.5, blurb: "阵容与话题度兼具，很适合做电影页的情绪型推荐卡。" },
      { title: "Pizza Movie", creator: "Ensemble Cast", year: "2026", genre: "喜剧", region: "美国", type: "流媒体", rating: 5.8, blurb: "具备轻松讨论感的流媒体新作，适合挂在热聊区里。" },
      { title: "The Housemaid", creator: "Amanda Seyfried / Sydney Sweeney", year: "2025", genre: "悬疑", region: "美国", type: "院线", rating: 6.8, blurb: "惊悚题材近期持续活跃，适合形成口碑分化型讨论。" },
      { title: "Anaconda", creator: "Jack Black / Paul Rudd", year: "2025", genre: "悬疑", region: "美国", type: "院线", rating: 5.6, blurb: "经典系列回归型作品，适合做怀旧和类型片专区示例。" },
      { title: "Mike & Nick & Nick & Alice", creator: "Vince Vaughn / James Marsden", year: "2026", genre: "剧情", region: "美国", type: "院线", rating: 6.2, blurb: "名字本身就有辨识度，很适合编辑推荐位的视觉实验。" },
      { title: "Dhurandhar The Revenge", creator: "Ranveer Singh", year: "2026", genre: "剧情", region: "其他", type: "院线", rating: 8.5, blurb: "国际向热门作品，能让电影页不只停留在英语内容。" },
      { title: "Peaky Blinders: The Immortal Man", creator: "Cillian Murphy", year: "2026", genre: "犯罪", region: "英国", type: "流媒体", rating: 6.6, blurb: "剧集宇宙向电影延展，适合老粉与新观众同时进入。" },
      { title: "Send Help", creator: "Rachel McAdams / Dylan O'Brien", year: "2026", genre: "剧情", region: "美国", type: "院线", rating: 6.9, blurb: "近期上映新片，最适合做想看按钮与短评区联动示范。" },
      { title: "Hoppers", creator: "Pixar / Disney", year: "2026", genre: "动画", region: "美国", type: "院线", rating: 7.5, blurb: "动画向内容能让电影页的整体气质更完整一些。" }
    ]))
    .concat(makeWorks("tv", [
      { title: "The Pitt", creator: "Noah Wyle", year: "2025", genre: "都市", region: "美国", type: "电视台", rating: 8.9, blurb: "IMDb 当前热门剧集榜前列作品，适合拿来做追更区主视觉。" },
      { title: "Something Very Bad Is Going to Happen", creator: "Camila Morrone", year: "2026", genre: "悬疑", region: "美国", type: "Netflix", rating: 6.8, blurb: "名字自带悬念感，很适合电视剧页的新剧入口。" },
      { title: "Invincible", creator: "Robert Kirkman", year: "2021", genre: "科幻", region: "美国", type: "流媒体", rating: 8.7, blurb: "持续高讨论度的动画剧集，适合扩展类型层次。" },
      { title: "Harry Hole", creator: "Jo Nesbo Universe", year: "2026", genre: "悬疑", region: "英国", type: "Netflix", rating: 7.8, blurb: "北欧犯罪感很强，适合悬疑迷直达。" },
      { title: "The Madison", creator: "Michelle Pfeiffer", year: "2026", genre: "都市", region: "美国", type: "流媒体", rating: 7.9, blurb: "适合都市向人群和角色关系讨论区。" },
      { title: "Paradise", creator: "Sterling K. Brown", year: "2025", genre: "悬疑", region: "美国", type: "HBO", rating: 7.9, blurb: "类型感与可讨论性并存，适合放在热门区。" },
      { title: "Daredevil: Born Again", creator: "Marvel Television", year: "2025", genre: "科幻", region: "美国", type: "Disney+", rating: 8.1, blurb: "知名 IP 回归，能快速拉高页面认知度。" },
      { title: "One Piece", creator: "Netflix", year: "2023", genre: "奇幻", region: "美国", type: "Netflix", rating: 8.3, blurb: "热度与大众认知度都很高，很适合做大入口。" },
      { title: "Jujutsu Kaisen", creator: "MAPPA", year: "2020", genre: "科幻", region: "日本", type: "流媒体", rating: 8.5, blurb: "2026 年仍保持高热度，适合动画向推荐示范。" },
      { title: "Andor", creator: "Tony Gilroy", year: "2025", genre: "科幻", region: "美国", type: "Disney+", rating: 8.6, blurb: "最终季热度回升，适合成熟向内容补位。" },
      { title: "The Lord of the Rings: The Rings of Power", creator: "Prime Video", year: "2022", genre: "奇幻", region: "美国", type: "流媒体", rating: 6.9, blurb: "大世界观剧集依然适合承担类型多样性。" },
      { title: "Harry Potter", creator: "Warner Bros. TV", year: "2026", genre: "奇幻", region: "英国", type: "流媒体", rating: 7.4, blurb: "新改编项目自带巨大关注度，很适合做效果比较。" }
    ]))
    .concat(makeWorks("music", [
      { title: "The Great Divide: The Last Of The Bugs", creator: "Noah Kahan", year: "2026", genre: "民谣", region: "欧美", type: "专辑", rating: 8.8, blurb: "Apple Music 当前热门专辑榜前列作品，能立刻带出真实榜单感。" },
      { title: "Kehlani", creator: "Kehlani", year: "2026", genre: "R&B", region: "欧美", type: "专辑", rating: 8.4, blurb: "同名专辑很适合说明艺人与作品页如何自然连接。" },
      { title: "Dandelion", creator: "Ella Langley", year: "2026", genre: "流行", region: "美国", type: "专辑", rating: 8.2, blurb: "当前热门新专辑之一，适合填充最新区。" },
      { title: "OCTANE", creator: "Don Toliver", year: "2026", genre: "Hip-Hop/Rap", region: "美国", type: "专辑", rating: 8.1, blurb: "名字和视觉都很强，放在首屏很抓眼。" },
      { title: "I'm The Problem", creator: "Morgan Wallen", year: "2026", genre: "Country", region: "美国", type: "专辑", rating: 8.0, blurb: "热门榜头部作品，很适合音乐页的热门示例。" },
      { title: "Thriller", creator: "Michael Jackson", year: "经典", genre: "Pop", region: "美国", type: "专辑", rating: 9.3, blurb: "经典专辑仍在当前榜单靠前，正好说明经典也能参与当下。" },
      { title: "ARIRANG", creator: "BTS", year: "2026", genre: "K-Pop", region: "韩国", type: "专辑", rating: 8.7, blurb: "高关注 K-Pop 专辑，适合增强风格广度。" },
      { title: "KPop Demon Hunters (Soundtrack from the Netflix Film)", creator: "HUNTR/X & Saja Boys", year: "2026", genre: "Soundtrack", region: "韩国", type: "专辑", rating: 8.1, blurb: "影视原声也在热榜前列，跨媒介感很强。" },
      { title: "SWAG II", creator: "Justin Bieber", year: "2026", genre: "Pop", region: "欧美", type: "专辑", rating: 8.0, blurb: "流行榜当前强势作品，适合挂在推荐区。" },
      { title: "Michael: Songs From The Motion Picture", creator: "Michael Jackson", year: "2026", genre: "Soundtrack", region: "美国", type: "专辑", rating: 7.9, blurb: "电影原声条目正好给音乐页带来影视联动感。" },
      { title: "The Art of Loving", creator: "Olivia Dean", year: "2026", genre: "Pop", region: "英国", type: "专辑", rating: 8.3, blurb: "偏唱作流行方向，适合丰富页面气质。" },
      { title: "The Life of a Showgirl", creator: "Taylor Swift", year: "2026", genre: "Pop", region: "美国", type: "专辑", rating: 8.5, blurb: "高关注度流行专辑，用于完整效果展示很直观。" }
    ]))
    .concat(makeWorks("books", [
      { title: "Heart the Lover", creator: "Lily King", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.8, blurb: "4 月 30 日独立书店虚构类畅销榜第一名，适合作为书籍页主视觉。" },
      { title: "I Who Have Never Known Men", creator: "Jacqueline Harpman", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.7, blurb: "当下讨论度很高，适合书评和摘录区联动。" },
      { title: "On the Calculation of Volume (Book I)", creator: "Solvej Balle", year: "2026", genre: "文学", region: "欧洲", type: "小说", rating: 8.6, blurb: "文学性和话题性都很强，适合展示长评氛围。" },
      { title: "On the Calculation of Volume (Book IV)", creator: "Solvej Balle", year: "2026", genre: "文学", region: "欧洲", type: "小说", rating: 8.5, blurb: "系列作品同时上榜，很适合做相关作品推荐。" },
      { title: "Small Things Like These", creator: "Claire Keegan", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.9, blurb: "持续热读的作品，很适合挂在热门区。" },
      { title: "The Odyssey", creator: "Homer / Emily Wilson", year: "经典", genre: "文学", region: "欧美", type: "小说", rating: 8.8, blurb: "经典文本的新译本依然很有热度，也适合专题区。" },
      { title: "Orbital", creator: "Samantha Harvey", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.4, blurb: "近年的高关注文学作品，能让书页更有当下感。" },
      { title: "You Better Be Lightning", creator: "Andrea Gibson", year: "2026", genre: "诗歌", region: "美国", type: "诗集", rating: 8.2, blurb: "诗歌类上榜作品会让页面质感更丰富。" },
      { title: "Love Overboard", creator: "Kandi Steiner", year: "2026", genre: "爱情", region: "美国", type: "小说", rating: 7.8, blurb: "通俗读者向作品也能说明书页的口味层次。" },
      { title: "Writers & Lovers", creator: "Lily King", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.4, blurb: "同作者另一部上榜作品，适合做作者延展。" },
      { title: "The Berry Pickers", creator: "Amanda Peters", year: "2026", genre: "文学", region: "欧美", type: "小说", rating: 8.2, blurb: "榜单前列作品，适合补足更多当下例子。" },
      { title: "Mona's Eyes", creator: "Thomas Schlesser", year: "2026", genre: "艺术", region: "欧洲", type: "小说", rating: 8.1, blurb: "偏艺术气质的作品，正好给书籍页增添变化。" }
    ]))
    .concat(makeWorks("events", [
      { title: "BTS WORLD TOUR 'ARIRANG'", creator: "BTS", year: "今年", genre: "演唱会", region: "美国", type: "巡演", rating: 8.9, blurb: "体育场级别的大型巡演，最适合当作活动页主海报。" },
      { title: "ROSALIA LUX TOUR 2026", creator: "ROSALIA", year: "未来 3 个月", genre: "演唱会", region: "美国", type: "巡演", rating: 8.6, blurb: "大型巡演主视觉感很强，适合做活动页头图。" },
      { title: "Noah Kahan: The Great Divide Tour", creator: "Noah Kahan", year: "未来 3 个月", genre: "演唱会", region: "美国", type: "巡演", rating: 8.5, blurb: "体育场级路线完整，适合做城市列表和想去系统。" },
      { title: "The Lumineers: Automatic World Tour", creator: "The Lumineers", year: "本月", genre: "演唱会", region: "美国", type: "巡演", rating: 8.3, blurb: "正在延续中的世界巡演，非常适合作为活动流示例。" },
      { title: "The Head And The Heart: 15th Anniversary Tour", creator: "The Head And The Heart", year: "本月", genre: "演唱会", region: "美国", type: "巡演", rating: 8.2, blurb: "周年巡演很适合挂歌单、回忆帖和老粉讨论。" },
      { title: "MercyMe - Wonder + Awe Tour", creator: "MercyMe", year: "本月", genre: "演唱会", region: "美国", type: "巡演", rating: 8.0, blurb: "持续开演中的巡演类活动，适合补足活动页的受众面。" },
      { title: "Curren$y: The Winners Circle Tour", creator: "Curren$y", year: "本月", genre: "演唱会", region: "美国", type: "巡演", rating: 7.8, blurb: "中型巡演很接近真实购票流，也适合做效果参考。" },
      { title: "Fantastic Cat", creator: "Fantastic Cat", year: "本月", genre: "Live House", region: "美国", type: "巡演", rating: 7.9, blurb: "小场巡演天然适合同城约看和现场分享。" },
      { title: "Intuit Dome Tours", creator: "Intuit Dome", year: "本周", genre: "展览", region: "美国", type: "限时活动", rating: 7.2, blurb: "场馆体验类活动能说明活动页并不只有音乐会。" },
      { title: "Nothing More w/ Catch Your Breath", creator: "Nothing More", year: "今年", genre: "演唱会", region: "美国", type: "巡演", rating: 7.7, blurb: "联演类活动适合展示阵容信息和观众互动。" },
      { title: "Afterglow Festival", creator: "SoftDrink Picks", year: "今年", genre: "音乐节", region: "广州", type: "户外", rating: 8.4, blurb: "保留你的原始示例，方便和当前真实活动混合查看效果。" },
      { title: "Lakeshore Music & Arts Festival", creator: "MRG Live", year: "未来 3 个月", genre: "音乐节", region: "其他", type: "户外", rating: 8.0, blurb: "新音乐节阵容曝光型活动，适合说明票务与阵容并列展示。" }
    ]));

  const workMap = new Map(allWorks.map(function (work) { return [work.id, work]; }));
  const titleMap = new Map(allWorks.map(function (work) { return [normalizeLookup(work.title), work]; }));

  const globalSearchSuggestions = [
    "搜索 Project Hail Mary",
    "搜索 The Pitt",
    "搜索 The Great Divide",
    "搜索 Heart the Lover",
    "搜索 BTS WORLD TOUR"
  ];

  function buildWorkHref(work) {
    return "./work-detail.html?id=" + encodeURIComponent(work.id);
  }

  function buildSearchIndex() {
    return allWorks.map(function (work) {
      return {
        title: work.title,
        type: categoryLabels[work.category],
        meta: [work.creator, work.year, work.genre].filter(Boolean).join(" · "),
        href: buildWorkHref(work)
      };
    });
  }

  const globalSearchIndex = buildSearchIndex();
  const REVIEW_STORAGE_KEY = "softdrink-review-state-v1";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function matchesRating(cardRating, filterRating) {
    if (filterRating === "全部" || !filterRating) {
      return true;
    }
    const cardValue = Number(String(cardRating).replace("+", ""));
    const filterValue = Number(String(filterRating).replace("+", ""));
    return cardValue >= filterValue;
  }

  function GlobalSearch() {
    const [value, setValue] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    React.useEffect(function () {
      const timer = window.setInterval(function () {
        setActiveIndex(function (prev) {
          return (prev + 1) % globalSearchSuggestions.length;
        });
      }, 2800);
      return function () {
        window.clearInterval(timer);
      };
    }, []);

    const query = value.trim().toLowerCase();
    const results = (query
      ? globalSearchIndex.filter(function (item) {
          return (item.title + " " + item.type + " " + item.meta).toLowerCase().includes(query);
        })
      : globalSearchIndex
    ).slice(0, 8);

    return e("div", { className: "global-search-wrap" }, [
      e("div", { className: "global-search", key: "bar" }, [
        e("span", { className: "global-search-icon", key: "icon" }, "⌕"),
        e("input", {
          key: "input",
          type: "text",
          value: value,
          placeholder: globalSearchSuggestions[activeIndex],
          "aria-label": "全站搜索",
          onFocus: function () {
            setOpen(true);
          },
          onChange: function (event) {
            setValue(event.target.value);
            setOpen(true);
          }
        }),
        e("button", {
          type: "button",
          className: "global-search-button",
          key: "button",
          onClick: function () {
            setOpen(true);
          }
        }, "全站搜索")
      ]),
      open ? e("div", { className: "global-search-panel", key: "panel" }, [
        e("div", { className: "global-search-panel-head", key: "head" }, [
          e("strong", { key: "title" }, query ? "匹配结果" : "热门搜索"),
          e("button", {
            type: "button",
            className: "panel-close-button",
            key: "close",
            onClick: function () {
              setOpen(false);
            }
          }, "收起")
        ]),
        e("div", { className: "search-chip-row", key: "chips" },
          ["电影", "电视剧", "音乐", "书籍", "演出活动"].map(function (chip) {
            return e("span", { className: "search-chip", key: chip }, chip);
          })
        ),
        results.length ? e("div", { className: "global-search-results", key: "results" },
          results.map(function (item) {
            return e("a", {
              key: item.title,
              href: item.href,
              className: "global-search-result transition-link"
            }, [
              e("div", { key: "copy" }, [
                e("strong", { key: "name" }, item.title),
                e("p", { key: "meta" }, item.meta)
              ]),
              e("span", { className: "result-type", key: "type" }, item.type)
            ]);
          })
        ) : e("div", { className: "global-search-empty", key: "empty" }, "没有找到对应结果，试试换一个关键词。")
      ]) : null
    ]);
  }

  function FilterGroup(props) {
    return e("div", { className: "advanced-group" }, [
      e("span", { className: "advanced-group-label", key: "label" }, props.label),
      e("div", { className: "advanced-options", key: "options" },
        props.options.map(function (option) {
          const selected = props.value === option;
          return e("button", {
            type: "button",
            key: option,
            className: selected ? "advanced-option is-active" : "advanced-option",
            onClick: function () {
              props.onChange(selected ? "" : option);
            }
          }, option);
        })
      )
    ]);
  }

  function AdvancedSearch(props) {
    const config = categoryConfigs[props.category] || categoryConfigs.movies;
    const initialState = config.fields.reduce(function (acc, field) {
      acc[field.key] = "";
      return acc;
    }, { rating: "7+", sort: "综合" });

    const [filters, setFilters] = React.useState(initialState);
    const [count, setCount] = React.useState(0);

    function setFilter(key, value) {
      setFilters(function (prev) {
        return Object.assign({}, prev, { [key]: value });
      });
    }

    function resetFilters() {
      setFilters(initialState);
    }

    React.useEffect(function () {
      const cards = Array.from(document.querySelectorAll(".media-card[data-title]"));
      let visibleCount = 0;

      cards.forEach(function (card) {
        const yearMatch = !filters.year || card.dataset.year === filters.year;
        const genreMatch = !filters.genre || card.dataset.genre === filters.genre;
        const regionMatch = !filters.region || card.dataset.region === filters.region;
        const typeMatch = !filters.type || card.dataset.type === filters.type;
        const ratingMatch = matchesRating(card.dataset.rating || "0+", filters.rating);
        const matches = yearMatch && genreMatch && regionMatch && typeMatch && ratingMatch;

        card.classList.toggle("is-filter-hidden", !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      setCount(visibleCount);
    }, [filters]);

    const summary = config.fields
      .map(function (field) {
        return filters[field.key] ? field.label + " · " + filters[field.key] : null;
      })
      .filter(Boolean)
      .concat(["评分 · " + filters.rating, "排序 · " + filters.sort]);

    return e("div", { className: "advanced-search-panel" }, [
      e("div", { className: "advanced-search-header", key: "header" }, [
        e("div", { key: "copy" }, [
          e("strong", { key: "title" }, config.title),
          e("p", { key: "text" }, "把年份、分类、地区、评分和排序组合起来，做更完整的筛选。")
        ]),
        e("div", { className: "advanced-search-actions", key: "actions" }, [
          e("div", { className: "results-count", key: "count" }, [
            e("span", { key: "label" }, "当前结果"),
            e("strong", { className: "results-count-value", key: "value" }, String(count))
          ]),
          e("button", { type: "button", className: "ghost-button", onClick: resetFilters, key: "reset" }, "重置"),
          e("button", { type: "button", className: "accent-button", key: "apply" }, "应用筛选")
        ])
      ]),
      e("div", { className: "advanced-search-grid", key: "grid" },
        config.fields.map(function (field) {
          return e(FilterGroup, {
            key: field.key,
            label: field.label,
            options: field.options,
            value: filters[field.key],
            onChange: function (value) {
              setFilter(field.key, value);
            }
          });
        })
      ),
      e("div", { className: "advanced-search-footer", key: "footer" }, [
        e(FilterGroup, {
          key: "rating",
          label: "评分",
          options: ["全部", "9+", "8+", "7+", "6+"],
          value: filters.rating,
          onChange: function (value) {
            setFilter("rating", value || "全部");
          }
        }),
        e(FilterGroup, {
          key: "sort",
          label: "排序",
          options: ["综合", "最新", "最热", "评分最高"],
          value: filters.sort,
          onChange: function (value) {
            setFilter("sort", value || "综合");
          }
        }),
        e("div", { className: "advanced-summary", key: "summary" },
          summary.map(function (item) {
            return e("span", { key: item }, item);
          })
        )
      ])
    ]);
  }

  function workFacts(work) {
    if (work.category === "events") {
      return [
        ["主办 / 艺人", work.creator],
        ["活动类型", work.genre],
        ["地区", work.region],
        ["形式", work.type],
        ["时间范围", work.year],
        ["热度标签", "当前热门活动样例"]
      ];
    }
    return [
      ["作者 / 主创", work.creator],
      ["分类", work.genre],
      ["地区", work.region],
      ["形式", work.type],
      ["年份", work.year],
      ["热度标签", "当前样例作品"]
    ];
  }

  function buildRatingBars(rating) {
    const score = Math.round(rating * 10) / 10;
    return [
      { label: "5 星", width: Math.min(86, Math.round(score * 8.6)), pct: Math.max(34, Math.round(score * 5)) + "%" },
      { label: "4 星", width: Math.min(70, Math.round(score * 7.2)), pct: Math.max(24, Math.round(score * 3.6)) + "%" },
      { label: "3 星", width: 24, pct: "12%" },
      { label: "2 星", width: 11, pct: "6%" },
      { label: "1 星", width: 6, pct: "3%" }
    ];
  }

  function buildShortReviews(work) {
    return [
      {
        id: "softdrink_notes",
        user: "softdrink_notes",
        score: "5 星",
        text: "这个条目很适合做 " + categoryLabels[work.category] + " 页的视觉中心，辨识度和讨论度都够高。",
        likes: 128,
        followUps: [
          { user: "glassradio", time: "2 小时前", text: "我也觉得这个作品特别适合挂在首页第一屏，点进去的欲望很强。" }
        ]
      },
      {
        id: "afterhours",
        user: "afterhours",
        score: "4 星",
        text: "看完之后很自然就会想去翻更多评价和相关作品，这点特别适合作品页。",
        likes: 76,
        followUps: [
          { user: "nightwalk", time: "昨晚", text: "是的，而且会想继续点同类推荐，很容易形成停留。" }
        ]
      },
      {
        id: "cityfeed",
        user: "cityfeed",
        score: "4 星",
        text: "无论是收藏、标记还是评论延展，都很适合挂在完整站点里做样例。",
        likes: 59,
        followUps: []
      }
    ];
  }

  function buildLongReviews(work) {
    return [
      {
        id: "longform_club",
        user: "longform_club",
        meta: "5 星 · 今天",
        text: work.title + " 这种作品最适合拿来测试完整详情页，因为主视觉、评分和相关推荐都很容易成立。",
        likes: 341,
        followUps: [
          { user: "scene_split", time: "35 分钟前", text: "尤其是它的封面、评分和相似推荐放在一起的时候，站点气质一下就出来了。" },
          { user: "Christopher", time: "刚刚", text: "这一条很适合放在长评区顶部，信息和情绪都兼顾到了。" }
        ]
      },
      {
        id: "nightwindow",
        user: "nightwindow",
        meta: "4 星 · 昨晚",
        text: "如果作品页是平台气质的核心，那么 " + work.title + " 这类条目正好能说明为什么用户会愿意留下长评和收藏。",
        likes: 214,
        followUps: [
          { user: "slowburn", time: "1 小时前", text: "而且它会让人很想去点作者页或者同主创作品，这个联动感特别重要。" }
        ]
      },
      {
        id: "profile_trace",
        user: "profile_trace",
        meta: "4 星 · 3 天前",
        text: "它不仅能在单页里成立，也很适合被放进个人中心的收藏夹和用户评价流里继续发酵。",
        likes: 167,
        followUps: [
          { user: "mellowtape", time: "昨天", text: "对，这种作品很适合被不同收藏夹二次整理，用户会更愿意留下自己的标签。" }
        ]
      }
    ];
  }

  function workMetaLine(work) {
    return [work.creator, work.year, work.genre].filter(Boolean).join(" · ");
  }

  function readStoredReviewState() {
    try {
      const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeStoredReviewState(nextState) {
    try {
      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      return;
    }
  }

  function mergeReviewState(workId, reviews) {
    const stored = readStoredReviewState();
    const workState = stored[workId] || {};

    return reviews.map(function (review) {
      const saved = workState[review.id] || {};
      return Object.assign({}, review, {
        likes: typeof saved.likes === "number" ? saved.likes : review.likes,
        liked: Boolean(saved.liked),
        followUps: review.followUps.concat(Array.isArray(saved.followUps) ? saved.followUps : [])
      });
    });
  }

  function persistReviewState(workId, reviewId, patch) {
    const stored = readStoredReviewState();
    const workState = stored[workId] || {};
    const reviewState = workState[reviewId] || {};
    stored[workId] = Object.assign({}, workState, {
      [reviewId]: Object.assign({}, reviewState, patch)
    });
    writeStoredReviewState(stored);
  }

  function ReviewInteraction(props) {
    const review = props.review;
    const [liked, setLiked] = React.useState(Boolean(review.liked));
    const [likes, setLikes] = React.useState(review.likes);
    const [expanded, setExpanded] = React.useState(Boolean(review.followUps.length));
    const [draft, setDraft] = React.useState("");
    const [followUps, setFollowUps] = React.useState(review.followUps);

    function toggleLike() {
      const nextLiked = !liked;
      const nextLikes = likes + (nextLiked ? 1 : -1);
      setLiked(nextLiked);
      setLikes(nextLikes);
      persistReviewState(props.workId, review.id, {
        liked: nextLiked,
        likes: nextLikes,
        followUps: followUps.filter(function (item) { return item.isUserCreated; })
      });
    }

    function submitFollowUp() {
      const value = draft.trim();
      if (!value) {
        return;
      }

      const nextFollowUps = followUps.concat([
        {
          user: "Christopher",
          time: "刚刚",
          text: value,
          isUserCreated: true
        }
      ]);

      setFollowUps(nextFollowUps);
      setDraft("");
      setExpanded(true);
      persistReviewState(props.workId, review.id, {
        liked: liked,
        likes: likes,
        followUps: nextFollowUps.filter(function (item) { return item.isUserCreated; })
      });
    }

    return e("div", { className: "review-interaction" }, [
      e("div", { className: "review-toolbar", key: "toolbar" }, [
        e("button", {
          type: "button",
          className: liked ? "review-action is-active" : "review-action",
          onClick: toggleLike,
          key: "like"
        }, liked ? "已赞 " + likes : "点赞 " + likes),
        e("button", {
          type: "button",
          className: expanded ? "review-action is-active" : "review-action",
          onClick: function () {
            setExpanded(!expanded);
          },
          key: "reply"
        }, (expanded ? "收起追评" : "追评") + " " + followUps.length)
      ]),
      expanded ? e("div", { className: "follow-up-thread", key: "thread" }, [
        followUps.length ? e("div", { className: "follow-up-list", key: "list" },
          followUps.map(function (item, index) {
            return e("article", { className: "follow-up-item", key: item.user + "-" + index + "-" + item.time }, [
              e("div", { className: "follow-up-head", key: "head" }, [
                e("strong", { key: "user" }, item.user),
                e("span", { key: "time" }, item.time)
              ]),
              e("p", { key: "text" }, item.text)
            ]);
          })
        ) : e("p", { className: "follow-up-empty", key: "empty" }, "还没有追评，你可以留下第一条。"),
        e("div", { className: "follow-up-compose", key: "compose" }, [
          e("textarea", {
            className: "follow-up-input",
            rows: 3,
            placeholder: "写一条追评，继续聊聊这个作品。",
            value: draft,
            onChange: function (event) {
              setDraft(event.target.value);
            },
            key: "input"
          }),
          e("div", { className: "follow-up-actions", key: "actions" }, [
            e("span", { className: "follow-up-hint", key: "hint" }, "追评会保存在当前浏览器里，方便你继续看效果。"),
            e("button", {
              type: "button",
              className: "accent-button review-submit",
              onClick: submitFollowUp,
              key: "submit"
            }, "发布追评")
          ])
        ])
      ]) : null
    ]);
  }

  function WorkDetailPage(props) {
    const work = props.work;
    const related = allWorks.filter(function (candidate) {
      return candidate.category === work.category && candidate.id !== work.id;
    }).slice(0, 3);
    const bars = buildRatingBars(work.rating);
    const facts = workFacts(work);
    const shortReviews = React.useMemo(function () {
      return mergeReviewState(work.id + "-short", buildShortReviews(work));
    }, [work]);
    const longReviews = React.useMemo(function () {
      return mergeReviewState(work.id + "-long", buildLongReviews(work));
    }, [work]);
    const totalReviewLikes = longReviews.reduce(function (sum, review) { return sum + review.likes; }, 0);
    const totalFollowUps = longReviews.reduce(function (sum, review) { return sum + review.followUps.length; }, 0);
    const backdropStyle = {
      backgroundImage:
        "linear-gradient(180deg, rgba(5, 12, 18, 0.16) 0%, rgba(5, 12, 18, 0.1) 34%, rgba(7, 19, 28, 0.92) 70%, #07131c 100%), url('" + work.backdrop + "')"
    };

    return e("div", null, [
      e("div", { className: "item-hero dynamic-work-hero", style: backdropStyle, key: "hero" }, [
        e("header", { className: "category-topbar", key: "topbar" }, [
          e("a", { className: "brand-link transition-link", href: "./index.html", key: "home" }, [
            e("span", { className: "brand-icon", "aria-hidden": "true", key: "icon" }),
            e("span", { key: "label" }, "返回主页")
          ]),
          e("div", { id: "global-search-root", className: "global-search-slot", "data-page": "detail", key: "search" }),
          e("a", { className: "profile-entry transition-link", href: "./profile.html", "aria-label": "个人信息入口", key: "profile" }, [
            e("span", { className: "avatar", key: "avatar" }, "C"),
            e("span", { key: "text" }, [
              e("strong", { key: "name" }, "Christopher"),
              e("small", { key: "meta" }, "个人主页")
            ])
          ])
        ]),
        e("section", { className: "item-hero-layout", key: "layout" }, [
          e("div", { className: "item-cover-wrap", key: "cover-wrap" },
            e("img", { className: "item-cover", src: work.cover, alt: work.title + " 封面" })
          ),
          e("div", { className: "item-main-info", key: "main" }, [
            e("p", { className: "eyebrow", key: "eyebrow" }, categoryLabels[work.category]),
            e("h1", { key: "title" }, work.title),
            e("p", { className: "item-logline", key: "blurb" }, work.blurb),
            e("div", { className: "item-meta-grid", key: "facts" },
              facts.map(function (fact) {
                return e("div", { key: fact[0] }, [
                  e("span", { key: "label" }, fact[0]),
                  e("strong", { key: "value" }, fact[1])
                ]);
              })
            ),
            e("div", { className: "item-tag-row", key: "tags" }, [
              e("span", { key: "rating" }, String(work.rating) + " 分"),
              e("span", { key: "type" }, work.type),
              e("span", { key: "genre" }, work.genre),
              e("span", { key: "meta" }, workMetaLine(work))
            ])
          ])
        ])
      ]),
      e("main", { className: "item-content", key: "content" }, [
        e("section", { className: "item-panel", key: "ratings" }, [
          e("div", { className: "section-heading", key: "heading" }, [
            e("div", { key: "copy" }, [
              e("p", { className: "eyebrow", key: "eyebrow" }, "评分情况"),
              e("h3", { key: "title" }, "口碑分布与用户反馈")
            ]),
            e("a", { className: "transition-link", href: "#all-reviews", key: "all" }, "查看全部评分和评价")
          ]),
          e("div", { className: "rating-overview", key: "overview" }, [
            e("div", { className: "rating-score-card", key: "score" }, [
              e("strong", { key: "value" }, String(work.rating)),
              e("span", { key: "label" }, "综合评分"),
              e("small", { key: "meta" }, "基于 " + (work.category === "events" ? "2.1k" : "8.4k") + " 次评分"),
              e("small", { className: "rating-supporting-meta", key: "engagement" }, totalReviewLikes + " 个赞 · " + totalFollowUps + " 条追评")
            ]),
            e("div", { className: "rating-bars", key: "bars" },
              bars.map(function (bar) {
                return e("div", { key: bar.label }, [
                  e("span", { key: "label" }, bar.label),
                  e("b", { key: "bar", style: { width: bar.width + "%" } }),
                  e("small", { key: "pct" }, bar.pct)
                ]);
              })
            )
          ]),
          e("div", { className: "review-grid", key: "short-reviews" },
            shortReviews.map(function (review) {
              return e("article", { className: "review-card", key: review.user }, [
                e("strong", { key: "user" }, review.user),
                e("span", { key: "score" }, review.score),
                e("p", { key: "text" }, review.text),
                e(ReviewInteraction, { key: "actions", review: review, workId: work.id + "-short" })
              ]);
            })
          )
        ]),
        e("section", { id: "all-reviews", className: "item-panel", key: "all-reviews" }, [
          e("div", { className: "section-heading", key: "heading" }, [
            e("div", { key: "copy" }, [
              e("p", { className: "eyebrow", key: "eyebrow" }, "评价详情"),
              e("h3", { key: "title" }, "全部评分与精选评价")
            ])
          ]),
          e("div", { className: "all-reviews-list", key: "list" },
            longReviews.map(function (review) {
              return e("article", { className: "long-review-card", key: review.user }, [
                e("div", { className: "long-review-head", key: "head" }, [
                  e("strong", { key: "user" }, review.user),
                  e("span", { key: "meta" }, review.meta)
                ]),
                e("p", { key: "text" }, review.text),
                e(ReviewInteraction, { key: "actions", review: review, workId: work.id + "-long" })
              ]);
            })
          )
        ]),
        e("section", { className: "item-panel", key: "similar" }, [
          e("div", { className: "section-heading", key: "heading" }, [
            e("div", { key: "copy" }, [
              e("p", { className: "eyebrow", key: "eyebrow" }, work.category === "music" ? "同艺人 / 相似推荐" : "相似推荐"),
              e("h3", { key: "title" }, "看完这个之后，还可以继续点开的作品")
            ])
          ]),
          e("div", { className: "card-grid", key: "grid" },
            related.map(function (candidate) {
              return e("article", { className: "media-card work-card", "data-work-slug": candidate.id, key: candidate.id }, [
                e("img", { src: candidate.cover, alt: candidate.title }),
                e("div", { className: "card-body" }, [
                  e("div", { className: "card-meta", key: "meta" }, [
                    e("span", { key: "left" }, candidate.genre),
                    e("span", { key: "right" }, String(candidate.rating) + " 分")
                  ]),
                  e("h4", { key: "title" },
                    e("a", { className: "transition-link", href: buildWorkHref(candidate) }, candidate.title)
                  ),
                  e("p", { key: "text" }, candidate.blurb)
                ])
              ]);
            })
          )
        ])
      ])
    ]);
  }

  function enhanceWorkLinks() {
    document.querySelectorAll(".media-card").forEach(function (card) {
      const titleNode = card.querySelector("h4");
      if (!titleNode) {
        return;
      }

      const title = titleNode.textContent.trim();
      const work = titleMap.get(normalizeLookup(title));
      if (!work) {
        return;
      }

      card.classList.add("work-card");
      card.dataset.workSlug = work.id;

      const existingLink = titleNode.querySelector("a");
      if (existingLink) {
        existingLink.href = buildWorkHref(work);
        existingLink.classList.add("transition-link");
      } else {
        titleNode.textContent = "";
        titleNode.appendChild(Object.assign(document.createElement("a"), {
          href: buildWorkHref(work),
          className: "transition-link",
          textContent: work.title
        }));
      }
    });

    document.querySelectorAll(".featured-poster-copy h2").forEach(function (heading) {
      const title = heading.textContent.trim();
      const work = titleMap.get(normalizeLookup(title));
      if (!work) {
        return;
      }

      const existingLink = heading.querySelector("a");
      if (existingLink) {
        existingLink.href = buildWorkHref(work);
        existingLink.classList.add("transition-link");
      } else {
        heading.textContent = "";
        heading.appendChild(Object.assign(document.createElement("a"), {
          href: buildWorkHref(work),
          className: "transition-link",
          textContent: work.title
        }));
      }
    });
  }

  function mountReactIslands() {
    const searchRoots = document.querySelectorAll("#global-search-root");
    searchRoots.forEach(function (root) {
      ReactDOM.createRoot(root).render(e(GlobalSearch));
    });

    const advancedRoot = document.querySelector(".advanced-search-root");
    if (advancedRoot) {
      ReactDOM.createRoot(advancedRoot).render(e(AdvancedSearch, {
        category: advancedRoot.dataset.category
      }));
    }
  }

  function mountWorkDetailPage() {
    const root = document.getElementById("work-detail-root");
    if (!root) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const work = workMap.get(params.get("id")) || allWorks[0];
    ReactDOM.createRoot(root).render(e(WorkDetailPage, { work: work }));
  }

  function extractBackgroundUrl(element) {
    const backgroundImage = window.getComputedStyle(element).backgroundImage || "";
    const matches = Array.from(backgroundImage.matchAll(/url\((['"]?)(.*?)\1\)/g));
    if (!matches.length) {
      return "";
    }
    return matches[matches.length - 1][2];
  }

  function getContrastSource(element) {
    const image = element.querySelector("img");
    if (image && (image.currentSrc || image.src)) {
      return image.currentSrc || image.src;
    }
    return extractBackgroundUrl(element);
  }

  function sampleImageBrightness(url, onDone) {
    if (!url) {
      onDone(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.referrerPolicy = "no-referrer";
    image.onload = function () {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          onDone(null);
          return;
        }

        const width = 36;
        const height = 36;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const pixels = context.getImageData(0, 0, width, height).data;
        let total = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          total += 0.2126 * red + 0.7152 * green + 0.0722 * blue;
        }

        onDone(total / (pixels.length / 4));
      } catch (error) {
        onDone(null);
      }
    };
    image.onerror = function () {
      onDone(null);
    };
    image.src = url;
  }

  function applyContrastValues(element, brightness) {
    const normalized = brightness == null ? 0.55 : clamp(brightness / 255, 0, 1);
    const topAlpha = clamp(0.1 + normalized * 0.2, 0.14, 0.34);
    const middleAlpha = clamp(0.2 + normalized * 0.28, 0.24, 0.48);
    const bottomAlpha = clamp(0.56 + normalized * 0.24, 0.62, 0.86);
    const glowAlpha = clamp(0.08 + normalized * 0.12, 0.08, 0.2);
    const titleShadow = clamp(0.38 + normalized * 0.2, 0.38, 0.62);
    const copyShadow = clamp(0.18 + normalized * 0.18, 0.18, 0.36);

    element.style.setProperty("--surface-overlay-top", "rgba(4, 10, 16, " + topAlpha.toFixed(3) + ")");
    element.style.setProperty("--surface-overlay-mid", "rgba(4, 10, 16, " + middleAlpha.toFixed(3) + ")");
    element.style.setProperty("--surface-overlay-bottom", "rgba(4, 10, 16, " + bottomAlpha.toFixed(3) + ")");
    element.style.setProperty("--surface-glow-color", "rgba(7, 19, 28, " + glowAlpha.toFixed(3) + ")");
    element.style.setProperty("--surface-title-shadow", "0 14px 32px rgba(0, 0, 0, " + titleShadow.toFixed(3) + "), 0 2px 8px rgba(0, 0, 0, " + (titleShadow + 0.12).toFixed(3) + ")");
    element.style.setProperty("--surface-copy-shadow", "0 8px 22px rgba(0, 0, 0, " + copyShadow.toFixed(3) + ")");
    element.dataset.contrastReady = "true";
  }

  function setupAdaptiveContrast() {
    const surfaces = document.querySelectorAll(".hero, .category-hero, .item-hero, .profile-hero");
    surfaces.forEach(function (surface) {
      applyContrastValues(surface, null);
      sampleImageBrightness(getContrastSource(surface), function (brightness) {
        applyContrastValues(surface, brightness);
      });
    });
  }

  function prepareMotionStagger() {
    const staggerTargets = document.querySelectorAll(
      ".media-section, .filter-strip, .item-panel, .media-card, .collection-card, .review-card, .long-review-card"
    );

    staggerTargets.forEach(function (element, index) {
      element.style.setProperty("--stagger-index", String(index % 12));
    });
  }

  function setupPageTransitions() {
    const overlay = document.querySelector(".page-transition-overlay");
    let navigating = false;

    function showReadyState() {
      document.body.classList.add("motion-primed");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          document.body.classList.add("page-ready");
        });
      });
    }

    function resetTransitionState() {
      navigating = false;
      document.body.classList.remove("is-transitioning");
      if (overlay) {
        overlay.classList.remove("is-visible");
      }
    }

    function navigateTo(href) {
      if (navigating) {
        return;
      }

      navigating = true;
      document.body.classList.add("is-transitioning");
      if (overlay) {
        overlay.classList.add("is-visible");
      }

      window.setTimeout(function () {
        window.location.href = href;
      }, 340);
    }

    prepareMotionStagger();
    showReadyState();

    window.addEventListener("pageshow", function () {
      resetTransitionState();
      document.body.classList.add("page-ready");
    });

    window.addEventListener("pagehide", resetTransitionState);
    window.addEventListener("popstate", resetTransitionState);
    window.addEventListener("focus", resetTransitionState);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        resetTransitionState();
      }
    });

    document.addEventListener("click", function (event) {
      const link = event.target.closest(".transition-link");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      navigateTo(href);
    });

    document.addEventListener("click", function (event) {
      const card = event.target.closest(".work-card");
      if (!card || event.target.closest("a, button")) {
        return;
      }

      const slug = card.dataset.workSlug;
      const work = workMap.get(slug);
      if (!work) {
        return;
      }

      navigateTo(buildWorkHref(work));
    });
  }

  function init() {
    mountWorkDetailPage();
    enhanceWorkLinks();
    mountReactIslands();
    setupAdaptiveContrast();
    setupPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
