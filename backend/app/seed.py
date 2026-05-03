"""Seed the works table from the same data the frontend currently hardcodes.

Idempotent: only inserts when the table is empty.
"""
from __future__ import annotations

import re

from sqlalchemy.orm import Session

from .models import Work

CATEGORY_HERO_IMAGES = {
    "movies": [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    ],
    "tv": [
        "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=900&q=80",
    ],
    "music": [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=80",
    ],
    "books": [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    ],
    "events": [
        "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=80",
    ],
}

CATEGORY_BACKDROPS = {
    "movies": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80",
    "tv": "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1800&q=80",
    "music": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
    "books": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=80",
    "events": "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=80",
}

WORKS_BY_CATEGORY: dict[str, list[dict]] = {
    "movies": [
        {"title": "Project Hail Mary", "creator": "Ryan Gosling", "year": "2026", "genre": "科幻", "region": "美国", "type": "院线", "rating": 8.4, "blurb": "IMDb 当前热门电影榜前列作品。"},
        {"title": "The Super Mario Galaxy Movie", "creator": "Nintendo / Illumination", "year": "2026", "genre": "动画", "region": "美国", "type": "院线", "rating": 6.5, "blurb": "高辨识度 IP 作品。"},
        {"title": "Crime 101", "creator": "Halle Berry / Chris Hemsworth", "year": "2026", "genre": "悬疑", "region": "美国", "type": "院线", "rating": 6.9, "blurb": "犯罪题材新片。"},
        {"title": "The Drama", "creator": "Robert Pattinson / Zendaya", "year": "2026", "genre": "剧情", "region": "美国", "type": "院线", "rating": 7.5, "blurb": "阵容与话题度兼具。"},
        {"title": "Pizza Movie", "creator": "Ensemble Cast", "year": "2026", "genre": "喜剧", "region": "美国", "type": "流媒体", "rating": 5.8, "blurb": "轻松讨论感的流媒体新作。"},
        {"title": "The Housemaid", "creator": "Amanda Seyfried / Sydney Sweeney", "year": "2025", "genre": "悬疑", "region": "美国", "type": "院线", "rating": 6.8, "blurb": "惊悚题材近期持续活跃。"},
        {"title": "Anaconda", "creator": "Jack Black / Paul Rudd", "year": "2025", "genre": "悬疑", "region": "美国", "type": "院线", "rating": 5.6, "blurb": "经典系列回归。"},
        {"title": "Mike & Nick & Nick & Alice", "creator": "Vince Vaughn / James Marsden", "year": "2026", "genre": "剧情", "region": "美国", "type": "院线", "rating": 6.2, "blurb": "名字本身就有辨识度。"},
        {"title": "Dhurandhar The Revenge", "creator": "Ranveer Singh", "year": "2026", "genre": "剧情", "region": "其他", "type": "院线", "rating": 8.5, "blurb": "国际向热门作品。"},
        {"title": "Peaky Blinders: The Immortal Man", "creator": "Cillian Murphy", "year": "2026", "genre": "犯罪", "region": "英国", "type": "流媒体", "rating": 6.6, "blurb": "剧集宇宙向电影延展。"},
        {"title": "Send Help", "creator": "Rachel McAdams / Dylan O'Brien", "year": "2026", "genre": "剧情", "region": "美国", "type": "院线", "rating": 6.9, "blurb": "近期上映新片。"},
        {"title": "Hoppers", "creator": "Pixar / Disney", "year": "2026", "genre": "动画", "region": "美国", "type": "院线", "rating": 7.5, "blurb": "动画向内容。"},
    ],
    "tv": [
        {"title": "The Pitt", "creator": "Noah Wyle", "year": "2025", "genre": "都市", "region": "美国", "type": "电视台", "rating": 8.9, "blurb": "IMDb 当前热门剧集榜前列作品。"},
        {"title": "Something Very Bad Is Going to Happen", "creator": "Camila Morrone", "year": "2026", "genre": "悬疑", "region": "美国", "type": "Netflix", "rating": 6.8, "blurb": "名字自带悬念感。"},
        {"title": "Invincible", "creator": "Robert Kirkman", "year": "2021", "genre": "科幻", "region": "美国", "type": "流媒体", "rating": 8.7, "blurb": "持续高讨论度的动画剧集。"},
        {"title": "Harry Hole", "creator": "Jo Nesbo Universe", "year": "2026", "genre": "悬疑", "region": "英国", "type": "Netflix", "rating": 7.8, "blurb": "北欧犯罪感很强。"},
        {"title": "The Madison", "creator": "Michelle Pfeiffer", "year": "2026", "genre": "都市", "region": "美国", "type": "流媒体", "rating": 7.9, "blurb": "都市向人群和角色关系讨论。"},
        {"title": "Paradise", "creator": "Sterling K. Brown", "year": "2025", "genre": "悬疑", "region": "美国", "type": "HBO", "rating": 7.9, "blurb": "类型感与可讨论性并存。"},
        {"title": "Daredevil: Born Again", "creator": "Marvel Television", "year": "2025", "genre": "科幻", "region": "美国", "type": "Disney+", "rating": 8.1, "blurb": "知名 IP 回归。"},
        {"title": "One Piece", "creator": "Netflix", "year": "2023", "genre": "奇幻", "region": "美国", "type": "Netflix", "rating": 8.3, "blurb": "热度与大众认知度都很高。"},
        {"title": "Jujutsu Kaisen", "creator": "MAPPA", "year": "2020", "genre": "科幻", "region": "日本", "type": "流媒体", "rating": 8.5, "blurb": "2026 年仍保持高热度。"},
        {"title": "Andor", "creator": "Tony Gilroy", "year": "2025", "genre": "科幻", "region": "美国", "type": "Disney+", "rating": 8.6, "blurb": "最终季热度回升。"},
        {"title": "The Lord of the Rings: The Rings of Power", "creator": "Prime Video", "year": "2022", "genre": "奇幻", "region": "美国", "type": "流媒体", "rating": 6.9, "blurb": "大世界观剧集。"},
        {"title": "Harry Potter", "creator": "Warner Bros. TV", "year": "2026", "genre": "奇幻", "region": "英国", "type": "流媒体", "rating": 7.4, "blurb": "新改编项目。"},
    ],
    "music": [
        {"title": "The Great Divide: The Last Of The Bugs", "creator": "Noah Kahan", "year": "2026", "genre": "民谣", "region": "欧美", "type": "专辑", "rating": 8.8, "blurb": "Apple Music 当前热门专辑榜前列。"},
        {"title": "Kehlani", "creator": "Kehlani", "year": "2026", "genre": "R&B", "region": "欧美", "type": "专辑", "rating": 8.4, "blurb": "同名专辑。"},
        {"title": "Dandelion", "creator": "Ella Langley", "year": "2026", "genre": "流行", "region": "美国", "type": "专辑", "rating": 8.2, "blurb": "当前热门新专辑之一。"},
        {"title": "OCTANE", "creator": "Don Toliver", "year": "2026", "genre": "Hip-Hop/Rap", "region": "美国", "type": "专辑", "rating": 8.1, "blurb": "名字和视觉都很强。"},
        {"title": "I'm The Problem", "creator": "Morgan Wallen", "year": "2026", "genre": "Country", "region": "美国", "type": "专辑", "rating": 8.0, "blurb": "热门榜头部作品。"},
        {"title": "Thriller", "creator": "Michael Jackson", "year": "经典", "genre": "Pop", "region": "美国", "type": "专辑", "rating": 9.3, "blurb": "经典专辑仍在当前榜单靠前。"},
        {"title": "ARIRANG", "creator": "BTS", "year": "2026", "genre": "K-Pop", "region": "韩国", "type": "专辑", "rating": 8.7, "blurb": "高关注 K-Pop 专辑。"},
        {"title": "KPop Demon Hunters (Soundtrack from the Netflix Film)", "creator": "HUNTR/X & Saja Boys", "year": "2026", "genre": "Soundtrack", "region": "韩国", "type": "专辑", "rating": 8.1, "blurb": "影视原声也在热榜前列。"},
        {"title": "SWAG II", "creator": "Justin Bieber", "year": "2026", "genre": "Pop", "region": "欧美", "type": "专辑", "rating": 8.0, "blurb": "流行榜当前强势作品。"},
        {"title": "Michael: Songs From The Motion Picture", "creator": "Michael Jackson", "year": "2026", "genre": "Soundtrack", "region": "美国", "type": "专辑", "rating": 7.9, "blurb": "电影原声条目。"},
        {"title": "The Art of Loving", "creator": "Olivia Dean", "year": "2026", "genre": "Pop", "region": "英国", "type": "专辑", "rating": 8.3, "blurb": "偏唱作流行方向。"},
        {"title": "The Life of a Showgirl", "creator": "Taylor Swift", "year": "2026", "genre": "Pop", "region": "美国", "type": "专辑", "rating": 8.5, "blurb": "高关注度流行专辑。"},
    ],
    "books": [
        {"title": "Heart the Lover", "creator": "Lily King", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.8, "blurb": "4 月 30 日独立书店虚构类畅销榜第一名。"},
        {"title": "I Who Have Never Known Men", "creator": "Jacqueline Harpman", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.7, "blurb": "当下讨论度很高。"},
        {"title": "On the Calculation of Volume (Book I)", "creator": "Solvej Balle", "year": "2026", "genre": "文学", "region": "欧洲", "type": "小说", "rating": 8.6, "blurb": "文学性和话题性都很强。"},
        {"title": "On the Calculation of Volume (Book IV)", "creator": "Solvej Balle", "year": "2026", "genre": "文学", "region": "欧洲", "type": "小说", "rating": 8.5, "blurb": "系列作品同时上榜。"},
        {"title": "Small Things Like These", "creator": "Claire Keegan", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.9, "blurb": "持续热读的作品。"},
        {"title": "The Odyssey", "creator": "Homer / Emily Wilson", "year": "经典", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.8, "blurb": "经典文本的新译本。"},
        {"title": "Orbital", "creator": "Samantha Harvey", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.4, "blurb": "近年的高关注文学作品。"},
        {"title": "You Better Be Lightning", "creator": "Andrea Gibson", "year": "2026", "genre": "诗歌", "region": "美国", "type": "诗集", "rating": 8.2, "blurb": "诗歌类上榜作品。"},
        {"title": "Love Overboard", "creator": "Kandi Steiner", "year": "2026", "genre": "爱情", "region": "美国", "type": "小说", "rating": 7.8, "blurb": "通俗读者向作品。"},
        {"title": "Writers & Lovers", "creator": "Lily King", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.4, "blurb": "同作者另一部上榜作品。"},
        {"title": "The Berry Pickers", "creator": "Amanda Peters", "year": "2026", "genre": "文学", "region": "欧美", "type": "小说", "rating": 8.2, "blurb": "榜单前列作品。"},
        {"title": "Mona's Eyes", "creator": "Thomas Schlesser", "year": "2026", "genre": "艺术", "region": "欧洲", "type": "小说", "rating": 8.1, "blurb": "偏艺术气质的作品。"},
    ],
    "events": [
        {"title": "BTS WORLD TOUR 'ARIRANG'", "creator": "BTS", "year": "今年", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.9, "blurb": "体育场级别的大型巡演。"},
        {"title": "ROSALIA LUX TOUR 2026", "creator": "ROSALIA", "year": "未来 3 个月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.6, "blurb": "大型巡演主视觉感很强。"},
        {"title": "Noah Kahan: The Great Divide Tour", "creator": "Noah Kahan", "year": "未来 3 个月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.5, "blurb": "体育场级路线完整。"},
        {"title": "The Lumineers: Automatic World Tour", "creator": "The Lumineers", "year": "本月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.3, "blurb": "正在延续中的世界巡演。"},
        {"title": "The Head And The Heart: 15th Anniversary Tour", "creator": "The Head And The Heart", "year": "本月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.2, "blurb": "周年巡演。"},
        {"title": "MercyMe - Wonder + Awe Tour", "creator": "MercyMe", "year": "本月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 8.0, "blurb": "持续开演中的巡演。"},
        {"title": "Curren$y: The Winners Circle Tour", "creator": "Curren$y", "year": "本月", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 7.8, "blurb": "中型巡演。"},
        {"title": "Fantastic Cat", "creator": "Fantastic Cat", "year": "本月", "genre": "Live House", "region": "美国", "type": "巡演", "rating": 7.9, "blurb": "小场巡演。"},
        {"title": "Intuit Dome Tours", "creator": "Intuit Dome", "year": "本周", "genre": "展览", "region": "美国", "type": "限时活动", "rating": 7.2, "blurb": "场馆体验类活动。"},
        {"title": "Nothing More w/ Catch Your Breath", "creator": "Nothing More", "year": "今年", "genre": "演唱会", "region": "美国", "type": "巡演", "rating": 7.7, "blurb": "联演类活动。"},
        {"title": "Afterglow Festival", "creator": "SoftDrink Picks", "year": "今年", "genre": "音乐节", "region": "广州", "type": "户外", "rating": 8.4, "blurb": "原始示例。"},
        {"title": "Lakeshore Music & Arts Festival", "creator": "MRG Live", "year": "未来 3 个月", "genre": "音乐节", "region": "其他", "type": "户外", "rating": 8.0, "blurb": "新音乐节阵容曝光型活动。"},
    ],
}


def slugify(text: str) -> str:
    return re.sub(r"-+|^-+|-+$", lambda m: "" if m.group() != "-" * len(m.group()) or m.start() == 0 or m.end() == len(text) else "-",
                  re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower())
    return s.strip("-")


def seed_works(db: Session) -> int:
    if db.query(Work).count() > 0:
        return 0
    inserted = 0
    for category, items in WORKS_BY_CATEGORY.items():
        pool = CATEGORY_HERO_IMAGES[category]
        backdrop = CATEGORY_BACKDROPS[category]
        for index, item in enumerate(items):
            db.add(Work(
                id=_slug(item["title"]),
                title=item["title"],
                creator=item.get("creator", ""),
                year=item.get("year", ""),
                genre=item.get("genre", ""),
                region=item.get("region", ""),
                type=item.get("type", ""),
                rating=float(item.get("rating", 0.0)),
                blurb=item.get("blurb", ""),
                category=category,
                cover_url=pool[index % len(pool)],
                backdrop_url=backdrop,
            ))
            inserted += 1
    db.commit()
    return inserted
