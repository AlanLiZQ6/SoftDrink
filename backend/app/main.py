from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, SessionLocal, engine
from .routers import activity, auth, collections, follows, profile, reviews, works
from .seed import seed_works

Base.metadata.create_all(bind=engine)

with SessionLocal() as _session:
    seed_works(_session)

app = FastAPI(title="SoftDrink API", version="0.1.0")

origins = [o.strip() for o in settings.cors_origins.split(",")] if settings.cors_origins else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(works.router)
app.include_router(reviews.router)
app.include_router(follows.router)
app.include_router(collections.router)
app.include_router(activity.router)


@app.get("/")
def root():
    return {"service": "softdrink", "status": "ok"}
