from collections import Counter

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models import FollowUp, Review, ReviewLike, User, Work

router = APIRouter(tags=["reviews"])


class AuthorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    avatar_url: str


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    text: str = Field(default="", max_length=4000)


class ReviewUpdate(BaseModel):
    rating: int | None = Field(default=None, ge=1, le=5)
    text: str | None = Field(default=None, max_length=4000)


class FollowUpOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    review_id: int
    text: str
    created_at: str
    author: AuthorOut


class ReviewOut(BaseModel):
    id: int
    work_id: str
    rating: int
    text: str
    likes_count: int
    followup_count: int
    liked_by_me: bool
    created_at: str
    author: AuthorOut


class FollowUpCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class RatingDistribution(BaseModel):
    total: int
    average: float
    distribution: dict[int, int]  # rating -> count


def _serialize_review(review: Review, author: User, liked_by_me: bool) -> ReviewOut:
    return ReviewOut(
        id=review.id,
        work_id=review.work_id,
        rating=review.rating,
        text=review.text,
        likes_count=review.likes_count,
        followup_count=review.followup_count,
        liked_by_me=liked_by_me,
        created_at=review.created_at.isoformat(),
        author=AuthorOut.model_validate(author),
    )


@router.post("/works/{work_id}/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    work_id: str,
    body: ReviewCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if not db.get(Work, work_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Work not found")
    review = Review(work_id=work_id, user_id=current.id, rating=body.rating, text=body.text)
    db.add(review)
    db.commit()
    db.refresh(review)
    return _serialize_review(review, current, liked_by_me=False)


@router.get("/works/{work_id}/reviews", response_model=list[ReviewOut])
def list_reviews(
    work_id: str,
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    rows = (
        db.query(Review, User)
        .join(User, User.id == Review.user_id)
        .filter(Review.work_id == work_id)
        .order_by(Review.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [_serialize_review(r, u, liked_by_me=False) for r, u in rows]


@router.get("/works/{work_id}/rating-distribution", response_model=RatingDistribution)
def rating_distribution(work_id: str, db: Session = Depends(get_db)):
    ratings = [r for (r,) in db.query(Review.rating).filter(Review.work_id == work_id).all()]
    if not ratings:
        return RatingDistribution(total=0, average=0.0, distribution={i: 0 for i in range(1, 6)})
    counts = Counter(ratings)
    return RatingDistribution(
        total=len(ratings),
        average=round(sum(ratings) / len(ratings), 2),
        distribution={i: counts.get(i, 0) for i in range(1, 6)},
    )


@router.put("/reviews/{review_id}", response_model=ReviewOut)
def update_review(
    review_id: int,
    body: ReviewUpdate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    if review.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your review")
    if body.rating is not None:
        review.rating = body.rating
    if body.text is not None:
        review.text = body.text
    db.commit()
    db.refresh(review)
    return _serialize_review(review, current, liked_by_me=False)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    if review.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your review")
    db.delete(review)
    db.commit()
    return None


@router.post("/reviews/{review_id}/like", status_code=status.HTTP_204_NO_CONTENT)
def like_review(
    review_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    existing = (
        db.query(ReviewLike)
        .filter(ReviewLike.review_id == review_id, ReviewLike.user_id == current.id)
        .first()
    )
    if existing:
        return None
    db.add(ReviewLike(review_id=review_id, user_id=current.id))
    review.likes_count += 1
    db.commit()
    return None


@router.delete("/reviews/{review_id}/like", status_code=status.HTTP_204_NO_CONTENT)
def unlike_review(
    review_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    existing = (
        db.query(ReviewLike)
        .filter(ReviewLike.review_id == review_id, ReviewLike.user_id == current.id)
        .first()
    )
    if not existing:
        return None
    db.delete(existing)
    if review.likes_count > 0:
        review.likes_count -= 1
    db.commit()
    return None


@router.post("/reviews/{review_id}/followups", response_model=FollowUpOut, status_code=status.HTTP_201_CREATED)
def add_followup(
    review_id: int,
    body: FollowUpCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    fu = FollowUp(review_id=review_id, user_id=current.id, text=body.text)
    db.add(fu)
    review.followup_count += 1
    db.commit()
    db.refresh(fu)
    return FollowUpOut(
        id=fu.id, review_id=fu.review_id, text=fu.text,
        created_at=fu.created_at.isoformat(),
        author=AuthorOut.model_validate(current),
    )


@router.get("/reviews/{review_id}/followups", response_model=list[FollowUpOut])
def list_followups(review_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(FollowUp, User)
        .join(User, User.id == FollowUp.user_id)
        .filter(FollowUp.review_id == review_id)
        .order_by(FollowUp.created_at.asc())
        .all()
    )
    return [
        FollowUpOut(
            id=fu.id, review_id=fu.review_id, text=fu.text,
            created_at=fu.created_at.isoformat(),
            author=AuthorOut.model_validate(u),
        )
        for fu, u in rows
    ]


@router.delete("/followups/{followup_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_followup(
    followup_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    fu = db.get(FollowUp, followup_id)
    if not fu:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Follow-up not found")
    if fu.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your follow-up")
    review = db.get(Review, fu.review_id)
    db.delete(fu)
    if review and review.followup_count > 0:
        review.followup_count -= 1
    db.commit()
    return None
