## Copilot repo — AI assistant instructions

Aim: Help an AI code agent become productive quickly in this Django repo (minimal scaffold).

- Project root: repository root contains a Django project under `backend/Copilot/` and a Python virtualenv at `backend/DS_Copilot/`.
- Django project package: `backend/Copilot/Copilot/` (settings: `Copilot/settings.py`).
- App scaffold: `backend/Copilot/api/` (models/views/tests are present but the app is not registered by default).

Quick commands (PowerShell, repo root):

1. Activate virtualenv (PowerShell):

   .\backend\DS_Copilot\Scripts\Activate.ps1

2. Run dev server:

   python .\backend\Copilot\manage.py runserver

3. Run migrations / create DB (uses sqlite by default):

   python .\backend\Copilot\manage.py migrate

4. Run tests:

   python .\backend\Copilot\manage.py test

Key facts the agent should know (discovered from code):

- Settings: `backend/Copilot/Copilot/settings.py` uses Django 5.2.8, DEBUG=True and an on-repo SECRET_KEY (dev-only). The SQLite DB file is `backend/Copilot/db.sqlite3` (BASE_DIR is `backend/Copilot`).
- INSTALLED_APPS currently contains only Django contrib apps; the `api` app folder exists but is not present in `INSTALLED_APPS`. To enable it, add `'api',` to INSTALLED_APPS and wire `api.urls` into `Copilot/urls.py`.
- URLs: `backend/Copilot/Copilot/urls.py` currently exposes only `admin/`.
- Virtual environment: `backend/DS_Copilot/` contains the venv (use the provided Activate scripts on Windows).
- Dependencies: project has Django and DRF available in the venv (see `Lib/site-packages/` in the venv); there is also `psycopg2` in the venv, so production may expect PostgreSQL if settings are switched.

Patterns & small examples (apply these changes when implementing features):

- Register the API app:

  1. add `'api',` to `INSTALLED_APPS` in `backend/Copilot/Copilot/settings.py`
  2. create `backend/Copilot/api/urls.py` and add `path('api/', include('api.urls'))` to `backend/Copilot/Copilot/urls.py` (remember to `from django.urls import include, path`).

- Where to look for dev/test code: `backend/Copilot/api/tests.py` (currently a skeleton). Prefer adding small, focused unit tests using Django TestCase.

Debugging notes:

- Use `runserver` for quick debugging. Settings use `DEBUG=True` by default.
- Database is local sqlite; inspect `backend/Copilot/db.sqlite3` directly or via Django ORM.

What not to change without asking:

- The existing `SECRET_KEY` is in settings.py for convenience; do not commit a production secret or replace it without coordinating environment handling.

Files to reference when making changes:

- `backend/Copilot/Copilot/settings.py` — central config
- `backend/Copilot/Copilot/urls.py` — URL routing
- `backend/Copilot/manage.py` — entrypoint for commands
- `backend/Copilot/api/*` — app code to extend

If something is missing or you need repository-specific conventions not inferable from files (CI, external services, or required settings), ask the maintainers before making infra or security-related changes.

---
If you want, I can: (a) register the `api` app and add a minimal `api/urls.py`, (b) add a tiny smoke test that asserts the dev server returns 200 for `/admin/`, or (c update settings to load sensitive values from environment.
