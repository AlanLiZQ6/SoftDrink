(function () {
  const e = React.createElement;

  const globalSearchSuggestions = [
    "搜索《午夜放映》",
    "搜索 Christopher Nolan",
    "搜索 2026 演出活动",
    "搜索 日本悬疑剧",
    "搜索 独立流行专辑"
  ];

  const globalSearchIndex = [
    { title: "午夜放映", type: "电影", meta: "热映中 · 8.8 分", href: "./movies.html" },
    { title: "平行夏日", type: "电影", meta: "科幻爱情 · 最新上架", href: "./movies.html" },
    { title: "海岸线以北", type: "电视剧", meta: "更新中 · 9.1 分", href: "./tv.html" },
    { title: "双城雨季", type: "电视剧", meta: "社区热聊 · 都市群像", href: "./tv.html" },
    { title: "Velvet Static", type: "音乐", meta: "独立流行 · 新专辑", href: "./music.html" },
    { title: "夜航电台", type: "音乐", meta: "电子单曲 · 热门", href: "./music.html" },
    { title: "最后一页之前", type: "书籍", meta: "文学新作 · 8.9 分", href: "./books.html" },
    { title: "玻璃岛地图", type: "书籍", meta: "世界观小说 · 986 想读", href: "./books.html" },
    { title: "Afterglow Festival", type: "演出活动", meta: "广州 · 1.7k 想去", href: "./events.html" },
    { title: "夏夜现场 Vol.7", type: "演出活动", meta: "上海 · 今晚 20:00", href: "./events.html" }
  ];

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
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019"] },
        { key: "genre", label: "题材", options: ["悬疑", "都市", "古装", "爱情", "喜剧", "科幻"] },
        { key: "region", label: "地区", options: ["中国", "美国", "韩国", "日本", "英国"] },
        { key: "type", label: "平台", options: ["电视台", "Netflix", "HBO", "Apple TV+", "Disney+"] }
      ]
    },
    music: {
      title: "音乐高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019"] },
        { key: "genre", label: "流派", options: ["流行", "摇滚", "电子", "R&B", "民谣", "古典"] },
        { key: "region", label: "地区", options: ["中国", "欧美", "日本", "韩国", "独立厂牌"] },
        { key: "type", label: "形式", options: ["专辑", "EP", "单曲", "现场专辑", "艺人"] }
      ]
    },
    books: {
      title: "书籍高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["2026", "2025", "2020-2024", "2010-2019", "经典"] },
        { key: "genre", label: "分类", options: ["文学", "非虚构", "科幻", "悬疑", "艺术", "传记"] },
        { key: "region", label: "地区", options: ["中国", "欧美", "日本", "韩国", "拉美"] },
        { key: "type", label: "类型", options: ["小说", "散文", "诗集", "漫画", "学术", "绘本"] }
      ]
    },
    events: {
      title: "演出高级搜索",
      fields: [
        { key: "year", label: "年份", options: ["本周", "本月", "未来 3 个月", "今年"] },
        { key: "genre", label: "分类", options: ["演唱会", "音乐节", "舞台剧", "脱口秀", "展览", "Live House"] },
        { key: "region", label: "地区", options: ["上海", "北京", "广州", "深圳", "杭州", "成都"] },
        { key: "type", label: "类型", options: ["室内", "户外", "巡演", "驻场", "限时活动"] }
      ]
    }
  };

  function matchesRating(cardRating, filterRating) {
    if (filterRating === "全部" || !filterRating) {
      return true;
    }
    const cardValue = Number(cardRating.replace("+", ""));
    const filterValue = Number(filterRating.replace("+", ""));
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
    ).slice(0, 6);

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

  function mountReactIslands() {
    const searchRoot = document.getElementById("global-search-root");
    if (searchRoot) {
      ReactDOM.createRoot(searchRoot).render(e(GlobalSearch));
    }

    const advancedRoot = document.querySelector(".advanced-search-root");
    if (advancedRoot) {
      ReactDOM.createRoot(advancedRoot).render(e(AdvancedSearch, {
        category: advancedRoot.dataset.category
      }));
    }
  }

  function setupPageTransitions() {
    const overlay = document.querySelector(".page-transition-overlay");

    window.requestAnimationFrame(function () {
      document.body.classList.add("page-ready");
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
      document.body.classList.add("is-transitioning");
      if (overlay) {
        overlay.classList.add("is-visible");
      }

      window.setTimeout(function () {
        window.location.href = href;
      }, 260);
    });
  }

  function init() {
    mountReactIslands();
    setupPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
