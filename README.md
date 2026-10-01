# WatchMore 🎬
Streaming app (Netflix/Hotstar style): React + Node/Express + SQLite.

## Run
```bash
# terminal 1 - API on :5000
cd backend && npm install && cp .env.example .env && npm start
# terminal 2 - UI on :5173
cd frontend && npm install && npm run dev
```
Open http://localhost:5173, register, browse, search, play, add to My List.

## Features
JWT auth, hero banner + genre rows, search, My List, video player with resume-where-you-left-off.

## API
POST /api/auth/register | /api/auth/login
GET  /api/titles?genre=&q=   GET /api/titles/:id
GET/POST/DELETE /api/mylist(/:id)
GET/POST /api/progress/:id

## Going to production
- Swap SQLite for PostgreSQL, set a strong JWT_SECRET
- Serve real videos via HLS + CDN (S3/CloudFront); add profiles, subscriptions, payments
- `npm run build` in frontend, serve `dist/` with nginx or Express static
