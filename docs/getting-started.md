# Getting Started — Rare (Local Development)

## Project Overview

Rare is a full-stack publishing platform. The backend is a Django + Django REST Framework API in `rare-api/`. The frontend is a React SPA in `rare-client/`. The database is PostgreSQL 16, run locally via Docker. The two servers run independently and communicate over HTTP/JSON — the frontend at `localhost:3000`, the backend at `localhost:8000`.

---

## Prerequisites

Install these before starting:

- **Python 3.x** — used to run Django
- **pipenv** — manages the Python virtualenv and dependencies (`pip install pipenv`)
- **Node.js and npm** — used to run the React app
- **Docker Desktop** — runs the PostgreSQL database container

---

## 1. Clone and orient

```
rare-project/
  rare-api/       ← Django backend
  rare-client/    ← React frontend
```

All backend commands below run from `rare-api/`. All frontend commands run from `rare-client/`.

---

## 2. Start the database

The database is defined in [`rare-api/docker-compose.yml`](../../rare-api/docker-compose.yml). It runs PostgreSQL 16 with these credentials (hardcoded in both `docker-compose.yml` and `settings.py` — there is no `.env` file):

| Setting  | Value           |
|----------|-----------------|
| Database | `rare`          |
| User     | `rare_user`     |
| Password | `rare_password` |
| Port     | `5432`          |

Start it:

```bash
cd rare-api
docker compose up -d
```

Verify it is running:

```bash
docker ps
```

To stop it later without removing data:

```bash
docker compose stop
```

To stop and remove all data (full reset):

```bash
docker compose down -v
```

---

## 3. Install backend dependencies

Dependencies are defined in [`rare-api/Pipfile`](../../rare-api/Pipfile).

```bash
cd rare-api
pipenv install
pipenv shell
```

After this your shell prompt should show the virtualenv name. All `python` and `pytest` commands below assume you are inside this shell.

---

## 4. Run migrations

Apply all migrations against the running PostgreSQL container:

```bash
python manage.py migrate
```

Database connection settings are hardcoded in [`rare-api/rareproject/settings.py`](../../rare-api/rareproject/settings.py) under `DATABASES`.

---

## 5. Load seed data

A fixture file exists at [`rare-api/rareapi/fixtures/initial_data.json`](../../rare-api/rareapi/fixtures/initial_data.json). Load it with:

```bash
python manage.py loaddata initial_data
```

### Seeded user accounts

The fixture defines the following usernames. All accounts share the same password hash — the plaintext is not documented in the repo. **Check the fixture file or ask a teammate for the password before using these accounts.**

| Username         | Role   |
|------------------|--------|
| `admin_sarah`    | Admin  |
| `admin_marcus`   | Admin  |
| `dev_diana`      | Author |
| `wanderlust_joe` | Author |
| `chef_maya`      | Author |
| `bookworm_alex`  | Author |
| `fit_jordan`     | Author |
| `gamer_priya`    | Author |
| `eco_oliver`     | Author |
| `music_luna`     | Author |
| `startup_raj`    | Author |
| `photo_emma`     | Author |

---

## 6. Start the backend server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`. The root URL (`/`) returns a 404 — that is expected because no root route is defined.

Verify the server is up and the database is reachable by sending a login request with intentionally wrong credentials. The `POST /login` endpoint requires no auth token and queries the database:

```bash
curl -s -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"x","password":"x"}'
```

Expected response:

```json
{"valid": false}
```

A `{"valid": false}` response confirms the server is running, routing is working, and the database is reachable. Any other response (connection refused, 500, HTML error) indicates a setup problem.

> **VS Code users:** [`rare-api/.vscode/launch.json`](../../rare-api/.vscode/launch.json) has a debugger configuration that starts Django on port `8088`, not `8000`. Do not use that configuration as your primary server — the frontend is wired to port `8000`. If you use the VS Code debugger, you will need to update the `API` constant in [`src/managers/api.js`](../src/managers/api.js) to match.

---

## 7. Install frontend dependencies

Dependencies are defined in [`rare-client/package.json`](../package.json).

```bash
cd rare-client
npm install
```

---

## 8. Start the frontend

```bash
npm start
```

The dev server starts at `http://localhost:3000` by default. The API base URL is hardcoded in [`src/managers/api.js`](../src/managers/api.js):

```js
export const API = "http://localhost:8000"
```

If your backend is on a different port for any reason, update this line.

---

## 9. Running tests

**Backend** (from inside `pipenv shell` in `rare-api/`):

```bash
pytest
```

Test discovery is configured in [`rare-api/pytest.ini`](../../rare-api/pytest.ini). Tests exist for auth views (`rareapi/tests/test_auth.py`) and admin actions (`rareapi/tests/test_admin_actions.py`).

**Frontend** (from `rare-client/`):

```bash
npm test
```

A test file exists for the Login component at `src/components/auth/Login.test.js`.

---

## 10. Full startup checklist

Run these in order from a fresh terminal:

```bash
# Terminal 1 — database (run once, leave running)
cd rare-api
docker compose up -d

# Terminal 2 — backend
cd rare-api
pipenv shell
python manage.py migrate              # first time only
python manage.py loaddata initial_data  # first time only
python manage.py runserver

# Terminal 3 — frontend
cd rare-client
npm install                           # first time only
npm start
```

---

## 11. Troubleshooting

**Database connection refused**
The Docker container is not running. Run `docker ps` to check, then `docker compose up -d` from `rare-api/`.

**`No module named 'tzdata'`**
Required on Windows with Python 3.9+. Install it into the virtualenv:
```bash
pip install tzdata
```
It is listed in `Pipfile` — if it is missing, your virtualenv may be out of date. Run `pipenv install` again.

**Registration or login does nothing on the frontend**
The most likely cause is the API URL pointing at the wrong port. Open `src/managers/api.js` and confirm the `API` constant reads `http://localhost:8000`, not `http://localhost:8088`.

**Django admin returns a 500 error**
Most likely caused by the missing `tzdata` package on Windows. See above.

**`django.db.utils.OperationalError` on migrate**
PostgreSQL is not running or the credentials do not match. Confirm Docker is up (`docker ps`) and that `settings.py` and `docker-compose.yml` agree — both hardcode database `rare`, user `rare_user`, password `rare_password`, port `5432`.

**`ALLOWED_HOSTS` error**
`DEBUG = True` in `settings.py` means Django automatically allows `localhost` and `127.0.0.1` in development. If you see this error, confirm `DEBUG` has not been changed to `False`.

**Port already in use**
The backend uses `8000` and the frontend uses `3000` by default. Find and stop any conflicting process before starting the servers.
