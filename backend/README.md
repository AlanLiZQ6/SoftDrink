# SoftDrink Backend

FastAPI + SQLAlchemy + JWT. SQLite for dev (swap `DATABASE_URL` for Postgres in prod).

## Run

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for the interactive API.

## Env vars

- `DATABASE_URL` — default `sqlite:///./softdrink.db`
- `JWT_SECRET` — **change in production**
- `CORS_ORIGINS` — comma-separated, default `*`

## Implemented

- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Profile**: `GET/PUT /profile`, `PUT /profile/avatar`, `PUT /profile/backdrop`, `GET /profile/stats`, `GET /users/{id}`
- **Works**: `GET /works` (filter by category/genre/year/region/type/min_rating + sort/paginate), `GET /works/{id}`, `GET /works/{id}/related`, `GET /categories`
- **Search**: `GET /search?q=&category=&limit=`
- **Reviews**: `POST/GET /works/{id}/reviews`, `PUT/DELETE /reviews/{id}`, `GET /works/{id}/rating-distribution`
- **Likes**: `POST/DELETE /reviews/{id}/like`
- **Follow-ups**: `POST/GET /reviews/{id}/followups`, `DELETE /followups/{id}`
- **Following**: `GET /users/suggested`, `POST/DELETE /users/{id}/follow`, `GET /users/{id}/followers`, `GET /users/{id}/following`
- **Collections**: `GET/POST /collections`, `PUT/DELETE /collections/{id}`, `POST /collections/{id}/works`, `DELETE /collections/{id}/works/{work_id}`, `GET /collections/{id}/works`, `GET /users/{id}/collections`
- **Activity**: `GET /users/{id}/reviews`, `GET /users/{id}/activity`

The works table is auto-seeded from the same data the frontend currently hardcodes (`app/seed.py`) so the existing pages keep rendering when wired to the API.
