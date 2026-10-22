# Online Library System

A small library app. Readers browse the catalog and ask to borrow a book. A librarian approves the request, and the reader gets a due date. When the book comes back, the librarian checks it in.

The front end is React (Vite + Tailwind) and the back end is Express with MySQL through Sequelize.

## What it does

**Readers can**

- search the catalog by title or author, filter by genre, or show only books that are on the shelf
- request a book (one at a time)
- see their due date and how many days are left
- mark a book as returned, or cancel a request that hasn't been approved yet
- look at their past loans

**Librarians (admins) can**

- approve or reject borrow requests
- confirm returns, and see which loans are overdue
- add and edit books. The cover image is optional: without one, the app draws a cover from the title.
- add genres
- read an activity log of every approval, rejection and return

Loans last 14 days by default. Once an hour the server checks for loans that are past their due date and marks them as overdue.

## Quick start with Docker

You only need [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

The first run takes a few minutes because it downloads images and installs packages. When the logs settle down, open:

| What | Address |
| --- | --- |
| The app | http://localhost:3000 |
| The API | http://localhost:8000/api |
| Test inbox (emails the app sends) | http://localhost:8025 |
| MySQL | `localhost:3307`, user `library`, password `library` |

You don't need a `.env` file for this. The defaults are already in `docker-compose.yml`.

On first start the database gets some demo data: 13 classic books, 6 genres and a few loans. All demo accounts use the password **`Password12`**:

| Username | Role | What's already set up |
| --- | --- | --- |
| `admin` | Librarian | sees one pending request and one overdue loan |
| `user1` | Reader | nothing yet, good for trying the borrow flow |
| `rina` | Reader | has an overdue book |
| `budi` | Reader | has a request waiting for approval |

The login page has two buttons that log you in as `admin` or `user1` in one click.

To stop the app, press `Ctrl+C`, or run `docker compose down`.

To wipe the database and start over:

```bash
docker compose down -v
docker compose up --build
```

## Changing settings

All settings live in one `.env` file at the root of the project. Make your own copy first:

```bash
cp .env.example .env
```

Then change what you need and run `docker compose up --build` again. The ones you're most likely to touch:

| Setting | Default | What it's for |
| --- | --- | --- |
| `CLIENT_PORT` | `3000` | where the website opens |
| `API_PORT` | `8000` | where the API listens |
| `DB_PORT` | `3307` | MySQL port on your machine (3307 so it doesn't clash with a local MySQL on 3306) |
| `JWT_SECRET` | dev value | secret used to sign login tokens. Use something long and random (`openssl rand -hex 32`). |
| `JWT_EXPIRES_IN` | `8h` | how long a login lasts |
| `LOAN_DAYS` | `14` | how long a loan lasts |
| `SEED_DEMO_DATA` | `true` | set to `false` to start with only the admin account and genres |

Seeders only run once per database. If you change `SEED_DEMO_DATA` after the first start, wipe the database (`docker compose down -v`) for it to take effect.

### Email

When someone signs up, the app sends them a welcome email. Locally, every email goes to [Mailpit](http://localhost:8025) instead of a real inbox, so you can see them without setting anything up.

To send real email, fill in the SMTP settings in `.env`. There's a Gmail example in `.env.example`. Gmail needs an [App Password](https://support.google.com/accounts/answer/185833), not your normal password. If email is broken or not set up, sign up still works. The server just logs that the email was skipped.

## Running without Docker (for development)

This gives you hot reload on both the client and the server. You'll need Node.js 22 or newer.

The easiest way to get MySQL is still Docker, so these steps start only the database and Mailpit in containers and run the code on your machine:

```bash
cp .env.example .env
npm run setup       # installs packages for root, server and client
npm run db          # starts MySQL and Mailpit in Docker
npm run db:setup    # creates the tables and adds the demo data
npm run dev         # starts the API and the React dev server
```

Then open http://localhost:5173. The Vite dev server forwards `/api` and `/uploads` to the API on port 8000, so you don't need to set up CORS or API URLs.

If you'd rather use a MySQL you already have, create an empty database and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` in `.env` before running `npm run db:setup`.

Other handy commands:

| Command | What it does |
| --- | --- |
| `npm run db:reset` | undoes every migration, then runs them and the seeders again |
| `npm run build` | builds the React app into `client/dist` |
| `npm start` | runs the API. If `client/dist` exists it serves the website too, all on port 8000. |

## Project layout

```
.
├── docker-compose.yml     MySQL, Mailpit, API and website
├── .env.example           every setting, with comments
├── client/                React app (Vite)
│   ├── src/pages/         one file per screen, split into admin/ and user/
│   ├── src/components/    shared pieces: book cover, tables, forms, layout
│   ├── src/lib/api.js     axios setup, adds the login token to every request
│   ├── nginx.conf         serves the built app and forwards /api in Docker
│   └── Dockerfile
└── server/                Express API
    ├── src/routes/        every endpoint, in one file
    ├── src/controllers/   what each endpoint does
    ├── src/middleware/    login checks, image uploads, input validation
    ├── src/models/        Sequelize models
    ├── src/migrations/    database changes, run in order
    ├── src/seeders/       demo data
    ├── src/schedule/      the hourly overdue check
    └── Dockerfile
```

Uploaded images are saved in `server/uploads` (or in the `uploads` Docker volume) and served from `/uploads/...`.

## API

Every endpoint is under `/api`. Endpoints that need a login expect an `Authorization: Bearer <token>` header. You get the token from `/api/auth/login`.

| Method | Path | Who | What it does |
| --- | --- | --- | --- |
| POST | `/auth/register` | anyone | create a reader account |
| POST | `/auth/login` | anyone | returns a token and the user |
| GET | `/auth/me` | logged in | the current user |
| GET | `/book` | anyone | list books. Query: `page`, `pageSize`, `book_title` (also matches author), `genre_id`, `available_only=true` |
| GET | `/book/:id` | anyone | one book |
| POST | `/book` | admin | add a book (multipart form, optional image in `imgBook`) |
| PATCH | `/book/:id` | admin | edit a book (same fields, all optional, `removeImage=true` to drop the cover) |
| GET | `/book/records` | logged in | loans. Admins see everyone's, readers see their own. Query: `status` (one or more, comma separated, or `Overdue`), `book_title`, `page` |
| GET | `/genre` | anyone | list genres (`/book/genre` still works too) |
| POST | `/genre` | admin | add a genre (optional image in `imgGenre`) |
| GET | `/users/profile` | reader | profile, current loan and a few numbers |
| POST | `/users/:bookId` | reader | ask to borrow a book |
| DELETE | `/users/requests/:id` | reader | cancel a request that isn't approved yet |
| PATCH | `/users/pending-return/:id` | reader | say you've returned a book |
| PATCH | `/admins/approve-borrow/:id` | admin | approve a request. This is when the due date gets set. |
| PATCH | `/admins/reject-borrow/:id` | admin | reject a request, with an optional `reason` |
| PATCH | `/admins/approve-return/:id` | admin | check a book back in |
| GET | `/admins/admin-action` | admin | activity log. Query: `action`, `book_title`, `page` |
| GET | `/admins/stats` | admin | counts for the dashboard |
| GET | `/health` | anyone | returns ok if the API can reach the database |

Errors always come back as `{ "message": "..." }`, and the message is written so it can be shown straight to the user.

## What changed in the 2026 update

This project was first built in late 2023. The update covers:

- **Client:** moved from Create React App (no longer maintained) to Vite. Also upgraded to React 19, React Router 7, Tailwind 4 and axios 1. Redux, Formik and Flowbite are gone. Login now uses a small React context, and forms use react-hook-form with zod.
- **UI:** full redesign. There's a sidebar layout, book covers, status badges and due dates that look like a library stamp. You can filter and paginate everywhere, edit books from the catalog, and notifications pop up as toasts. The pages work on a phone.
- **Login:** you stay logged in after a page refresh. Pages check your role, and an expired session sends you back to the login page. Before, the token was lost on refresh, and anyone could open the admin pages.
- **Server:** upgraded to Express 5, multer 2, nodemailer 7 and bcryptjs, which avoids native build problems in Docker. Added helmet and request logging.
- **Bug fixes:**
  - The admin actions and the borrow request left database transactions open when they returned early.
  - Requests with a malformed token header got no response and hung.
  - The overdue job crashed whenever it hit an error, and its updates weren't really in a transaction.
  - Editing a book without changing the title failed with "title already taken".
  - Changing a book's quantity could break the available count.
  - Genre images were never served.
  - Uploads were accepted before the login check ran.
  - A failed welcome email made sign up return an error even though the account had already been created.
- **Behaviour changes:**
  - The due date is set when the librarian approves a loan, not when it's requested.
  - Librarians can reject requests, and readers can cancel them.
  - Sign up accepts any email domain, not just Gmail and Hotmail.
  - Passwords can contain symbols.
  - Names can contain non-English letters.
- **Database:** a new migration fixes the `avalaible` column name, makes book covers optional and adds the "Rejected" status. Seeders are now tracked, so running them twice won't create duplicates.
- **Setup:** Docker Compose for everything, one `.env` file, and Mailpit for test emails.

**If you still have a database from the old version:** the new migration will update it, but the old seeders were never tracked, so they would try to add the admin account again and fail. It's easier to start with a fresh database.

## Troubleshooting

**"Port is already allocated" when starting Docker.** Something else is using that port. Change `CLIENT_PORT`, `API_PORT` or `DB_PORT` in `.env`.

**The login page says it can't reach the server.** The API is probably still starting, or it couldn't connect to MySQL. Check with `docker compose logs server`.

**I changed `.env` but nothing happened.** Run `docker compose up --build` again. The website is built once when its image is created, so it needs a rebuild to pick up changes.

**The demo data is missing, or I want it back.** Run `docker compose down -v` and start again.
