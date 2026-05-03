from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models import Collection, Review, User, UserFollow
from ..schemas import UserOut

router = APIRouter(tags=["profile"])


class ProfileUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=2, max_length=64)
    intro: str | None = Field(default=None, max_length=500)
    city: str | None = Field(default=None, max_length=64)
    keywords: list[str] | None = Field(default=None, max_length=8)


class ImageUpdate(BaseModel):
    url: HttpUrl


class ProfileStats(BaseModel):
    review_count: int
    collection_count: int
    follower_count: int
    following_count: int


@router.get("/profile", response_model=UserOut)
def get_profile(current: User = Depends(get_current_user)):
    return current


@router.put("/profile", response_model=UserOut)
def update_profile(
    body: ProfileUpdate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.username is not None:
        current.username = body.username
    if body.intro is not None:
        current.intro = body.intro
    if body.city is not None:
        current.city = body.city
    if body.keywords is not None:
        current.keywords = [k.strip() for k in body.keywords if k.strip()][:8]
    db.commit()
    db.refresh(current)
    return current


@router.put("/profile/avatar", response_model=UserOut)
def update_avatar(
    body: ImageUpdate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current.avatar_url = str(body.url)
    db.commit()
    db.refresh(current)
    return current


@router.put("/profile/backdrop", response_model=UserOut)
def update_backdrop(
    body: ImageUpdate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current.backdrop_url = str(body.url)
    db.commit()
    db.refresh(current)
    return current


@router.get("/profile/stats", response_model=ProfileStats)
def profile_stats(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ProfileStats(
        review_count=db.query(Review).filter(Review.user_id == current.id).count(),
        collection_count=db.query(Collection).filter(Collection.user_id == current.id).count(),
        follower_count=db.query(UserFollow).filter(UserFollow.following_id == current.id).count(),
        following_count=db.query(UserFollow).filter(UserFollow.follower_id == current.id).count(),
    )


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return user
