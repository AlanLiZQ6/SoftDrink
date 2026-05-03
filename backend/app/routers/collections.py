from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models import Collection, CollectionWork, User, Work

router = APIRouter(tags=["collections"])


class CollectionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=128)
    description: str = Field(default="", max_length=1000)
    image_url: str = Field(default="", max_length=500)


class CollectionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=128)
    description: str | None = Field(default=None, max_length=1000)
    image_url: str | None = Field(default=None, max_length=500)


class CollectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    description: str
    image_url: str
    work_count: int = 0


class CollectionWorkAdd(BaseModel):
    work_id: str
    note: str = Field(default="", max_length=255)


def _to_out(c: Collection, work_count: int) -> CollectionOut:
    return CollectionOut(
        id=c.id, user_id=c.user_id, title=c.title,
        description=c.description, image_url=c.image_url, work_count=work_count,
    )


@router.get("/collections", response_model=list[CollectionOut])
def my_collections(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    cs = db.query(Collection).filter(Collection.user_id == current.id).order_by(Collection.created_at.desc()).all()
    out = []
    for c in cs:
        count = db.query(CollectionWork).filter(CollectionWork.collection_id == c.id).count()
        out.append(_to_out(c, count))
    return out


@router.get("/users/{user_id}/collections", response_model=list[CollectionOut])
def user_collections(user_id: int, db: Session = Depends(get_db)):
    cs = db.query(Collection).filter(Collection.user_id == user_id).order_by(Collection.created_at.desc()).all()
    return [_to_out(c, db.query(CollectionWork).filter(CollectionWork.collection_id == c.id).count()) for c in cs]


@router.post("/collections", response_model=CollectionOut, status_code=status.HTTP_201_CREATED)
def create_collection(
    body: CollectionCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    c = Collection(user_id=current.id, title=body.title, description=body.description, image_url=body.image_url)
    db.add(c)
    db.commit()
    db.refresh(c)
    return _to_out(c, 0)


@router.put("/collections/{collection_id}", response_model=CollectionOut)
def update_collection(
    collection_id: int,
    body: CollectionUpdate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    c = db.get(Collection, collection_id)
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    if c.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your collection")
    if body.title is not None:
        c.title = body.title
    if body.description is not None:
        c.description = body.description
    if body.image_url is not None:
        c.image_url = body.image_url
    db.commit()
    db.refresh(c)
    count = db.query(CollectionWork).filter(CollectionWork.collection_id == c.id).count()
    return _to_out(c, count)


@router.delete("/collections/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    c = db.get(Collection, collection_id)
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    if c.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your collection")
    db.delete(c)
    db.commit()
    return None


@router.post("/collections/{collection_id}/works", status_code=status.HTTP_204_NO_CONTENT)
def add_work_to_collection(
    collection_id: int,
    body: CollectionWorkAdd,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    c = db.get(Collection, collection_id)
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    if c.user_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your collection")
    if not db.get(Work, body.work_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Work not found")
    existing = (
        db.query(CollectionWork)
        .filter(CollectionWork.collection_id == collection_id, CollectionWork.work_id == body.work_id)
        .first()
    )
    if existing:
        return None
    db.add(CollectionWork(collection_id=collection_id, work_id=body.work_id, note=body.note))
    db.commit()
    return None


@router.delete("/collections/{collection_id}/works/{work_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_work_from_collection(
    collection_id: int,
    work_id: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    c = db.get(Collection, collection_id)
    if not c or c.user_id != current.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    cw = (
        db.query(CollectionWork)
        .filter(CollectionWork.collection_id == collection_id, CollectionWork.work_id == work_id)
        .first()
    )
    if cw:
        db.delete(cw)
        db.commit()
    return None


@router.get("/collections/{collection_id}/works")
def list_collection_works(collection_id: int, db: Session = Depends(get_db)):
    c = db.get(Collection, collection_id)
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    rows = (
        db.query(CollectionWork, Work)
        .join(Work, Work.id == CollectionWork.work_id)
        .filter(CollectionWork.collection_id == collection_id)
        .order_by(CollectionWork.added_at.desc())
        .all()
    )
    return [
        {
            "work": {
                "id": w.id, "title": w.title, "creator": w.creator, "year": w.year,
                "genre": w.genre, "region": w.region, "type": w.type, "rating": w.rating,
                "blurb": w.blurb, "category": w.category,
                "cover_url": w.cover_url, "backdrop_url": w.backdrop_url,
            },
            "note": cw.note,
            "added_at": cw.added_at.isoformat(),
        }
        for cw, w in rows
    ]
