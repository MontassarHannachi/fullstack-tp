# Full Stack Product Catalogue

Product catalogue with a REST API (Express, Prisma, PostgreSQL) and two front-ends
(Angular + Bootstrap, Next.js + Tailwind).

## Prerequisites

- Docker Desktop (to run everything with Docker)
- Node.js 24 and npm (to run without Docker)

## Run with Docker

    docker compose up --build

| Service | URL |
|---------|-----|
| Angular (ngapp) | http://localhost:4200/products |
| Angular admin page | http://localhost:4200/admin |
| Next.js (nxapp) | http://localhost:3000/products |
| API | http://localhost:4000/api/health |
| PostgreSQL | localhost:5432 (user app, password app, database shop) |

The API applies the migrations at startup. To fill the database with 100 products,
see "Seed the database" below. `docker compose down` keeps the data (volume pgdata);
`docker compose down -v` deletes it.

## Run without Docker

1. Database only: `docker compose up -d db`
2. API:

        cd api
        copy .env.example .env
        npm install
        npx prisma migrate deploy
        npx prisma generate
        npx prisma db seed
        npm run dev

3. Angular: `cd ngapp`, `npm install`, `npx ng serve` (http://localhost:4200)
4. Next.js: `cd nxapp`, `copy .env.example .env.local`, `npm install`, `npm run dev` (http://localhost:3000)

## Seed the database

With the database running and `api/.env` in place:

    cd api
    npx prisma db seed

The seed imports 100 products from dummyjson (it needs an Internet connection).

## Environment variables

| Variable | Where | Example |
|----------|-------|---------|
| DATABASE_URL | api/.env | postgresql://app:app@localhost:5432/shop?schema=public |
| PORT | api/.env | 4000 |
| API_URL | nxapp/.env.local (server side) | http://localhost:4000/api |
| apiUrl | ngapp/src/environments/*.ts | http://localhost:4000/api |

## API endpoints

| Verb and URL | Description | Success code |
|--------------|-------------|--------------|
| GET /api/health | health check | 200 |
| GET /api/products?limit=12&skip=0&q=text&category=name | paginated list, search and category filter | 200 |
| GET /api/products/:id | one product | 200 (404 if unknown) |
| POST /api/products | create (JSON body validated with Zod) | 201 (400 if invalid) |
| PATCH /api/products/:id | partial update | 200 |
| DELETE /api/products/:id | delete | 204 |
| GET /api/categories | categories with their number of products | 200 |

Note: Prisma serializes the `price` (Decimal) as a string, for example "9.5".
