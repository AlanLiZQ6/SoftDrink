from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Work

router = APIRouter(tags=["works"])


class WorkOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    creator: str
    year: str
    genre: str
    region: str
    type: str
    rating: float
    blurb: str
    category: str
    cover_url: str
    backdrop_url: str


class WorkList(BaseModel):
    items: list[WorkOut]
    total: int


SORT_OPTIONS = {
    "rating": Work.rating.desc(),
    "title": Work.title.asc(),
    "year": Work.year.desc(),
}


@router.get("/works", response_model=WorkList)
def list_works(
    db: Session = Depends(get_db),
    category: str | None = None,
    genre: str | None = None,
    year: str | None = None,
    region: str | None = None,
    type: str | None = None,
    min_rating: float | None = None,
    sort: str = "rating",
    limit: int = Query(default=24, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    q = db.query(Work)
    if category:
        q = q.filter(Work.category == category)
    if genre:
        q = q.filter(Work.genre == genre)
    if year:
        q = q.filter(Work.year == year)
    if region:
        q = q.filter(Work.region == region)
    if type:
        q = q.filter(Work.type == type)
    if min_rating is not None:
        q = q.filter(Work.rating >= min_rating)

    total = q.count()
    order = SORT_OPTIONS.get(sort, SORT_OPTIONS["rating"])
    items = q.order_by(order).offset(offset).limit(limit).all()
    return WorkList(items=[WorkOut.model_validate(w) for w in items], total=total)


@router.get("/works/{work_id}", response_model=WorkOut)
def get_work(work_id: str, db: Session = Depends(get_db)):
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Work not found")
    return work


@router.get("/works/{work_id}/related", response_model=list[WorkOut])
def related_works(work_id: str, db: Session = Depends(get_db), limit: int = 3):
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Work not found")
    items = (
        db.query(Work)
        .filter(Work.category == work.category, Work.id != work.id)
        .order_by(Work.rating.desc())
        .limit(limit)
        .all()
    )
    return [WorkOut.model_validate(w) for w in items]


@router.get("/categories")
def categories():
    return {
        "categories": [
            {"key": "movies", "label": "电影"},
            {"key": "tv", "label": "电视剧"},
            {"key": "music", "label": "音乐"},
            {"key": "books", "label": "书籍"},
            {"key": "events", "label": "演出活动"},
        ]
    }


@router.get("/search", response_model=WorkList)
def search(
    q: str = Query(min_length=1, max_length=100),
    category: str | None = None,
    limit: int = Query(default=8, ge=1, le=50),
    db: Session = Depends(get_db),
):
    pattern = f"%{q.lower()}%"
    query = db.query(Work).filter(
        or_(
            Work.title.ilike(pattern),
            Work.creator.ilike(pattern),
            Work.genre.ilike(pattern),
            Work.year.ilike(pattern),
        )
    )
    if category:
        query = query.filter(Work.category == category)
    total = query.count()
    items = query.order_by(Work.rating.desc()).limit(limit).all()
    return WorkList(items=[WorkOut.model_validate(w) for w in items], total=total)
