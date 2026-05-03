from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models import User, UserFollow

router = APIRouter(tags=["follows"])


class UserBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    uid: str
    username: str
    avatar_url: str
    intro: str
    city: str
    keywords: list[str]


@router.get("/users/suggested", response_model=list[UserBrief])
def suggested_users(
    db: Session = Depends(get_db),
    limit: int = Query(default=4, ge=1, le=20),
    current: User = Depends(get_current_user),
):
    already_following = {
        f.following_id
        for f in db.query(UserFollow).filter(UserFollow.follower_id == current.id).all()
    }
    already_following.add(current.id)
    users = (
        db.query(User)
        .filter(~User.id.in_(already_following))
        .order_by(User.created_at.desc())
        .limit(limit)
        .all()
    )
    return [UserBrief.model_validate(u) for u in users]


@router.post("/users/{user_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if user_id == current.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cannot follow yourself")
    if not db.get(User, user_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    existing = (
        db.query(UserFollow)
        .filter(UserFollow.follower_id == current.id, UserFollow.following_id == user_id)
        .first()
    )
    if existing:
        return None
    db.add(UserFollow(follower_id=current.id, following_id=user_id))
    db.commit()
    return None


@router.delete("/users/{user_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    existing = (
        db.query(UserFollow)
        .filter(UserFollow.follower_id == current.id, UserFollow.following_id == user_id)
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
    return None


@router.get("/users/{user_id}/followers", response_model=list[UserBrief])
def followers(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(User)
        .join(UserFollow, UserFollow.follower_id == User.id)
        .filter(UserFollow.following_id == user_id)
        .all()
    )
    return [UserBrief.model_validate(u) for u in rows]


@router.get("/users/{user_id}/following", response_model=list[UserBrief])
def following(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(User)
        .join(UserFollow, UserFollow.following_id == User.id)
        .filter(UserFollow.follower_id == user_id)
        .all()
    )
    return [UserBrief.model_validate(u) for u in rows]
