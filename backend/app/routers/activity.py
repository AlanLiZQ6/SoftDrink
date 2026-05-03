from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Review, User, Work

router = APIRouter(tags=["activity"])


def _serialize(review: Review, work: Work):
    return {
        "id": review.id,
        "rating": review.rating,
        "text": review.text,
        "likes_count": review.likes_count,
        "followup_count": review.followup_count,
        "created_at": review.created_at.isoformat(),
        "work": {
            "id": work.id,
            "title": work.title,
            "category": work.category,
            "cover_url": work.cover_url,
        },
    }


@router.get("/users/{user_id}/reviews")
def user_reviews(
    user_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    if not db.get(User, user_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    rows = (
        db.query(Review, Work)
        .join(Work, Work.id == Review.work_id)
        .filter(Review.user_id == user_id)
        .order_by(Review.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [_serialize(r, w) for r, w in rows]


@router.get("/users/{user_id}/activity")
def user_activity(
    user_id: int,
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
):
    # MVP: activity feed = recent reviews. Extend with likes/follows/collections later.
    return user_reviews(user_id=user_id, db=db, limit=limit, offset=0)
