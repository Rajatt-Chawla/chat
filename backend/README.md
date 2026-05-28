# Aetheria Backend Service Engine

FastAPI asynchronous API backend providing JWT locks, threads, memory RAG banking, sentiment analytics, and agent workflows.

## Quick Start Guide

### 1. Requirements

Ensure Python 3.10+ is installed on your local terminal console.

### 2. Environment Configurations

Create a `.env` file under the `backend/` directory.

For PostgreSQL:

```env
PROJECT_NAME="Aetheria Companion Core Engine"
SECRET_KEY="change-this-to-a-long-random-secret"
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/aetheria"
GEMINI_API_KEY=""
```

Create the database first:

```bash
createdb -U postgres aetheria
```

The FastAPI startup hook creates the SQLAlchemy tables automatically. If you prefer a manual SQL bootstrap, run:

```bash
psql -U postgres -d aetheria -f backend/sql/postgresql_schema.sql
```

For lightweight local debugging only, SQLite is also supported:

```env
PROJECT_NAME="Aetheria Companion Core Engine"
SECRET_KEY="aetheria-super-secret-crypto-elliptic-quantum-key-2026"
DATABASE_URL="sqlite+aiosqlite:///./aetheria.db"
```

### 3. Setup Virtual Environment & Boot

```bash
# Initialize and activate env
python -m venv venv
venv\Scripts\activate

# Install package dependencies
pip install -r requirements.txt

# Boot the engine
uvicorn app.main:app --reload --port 8000
```

On Windows or restricted shells, if `--reload` hits multiprocessing permissions, run:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Once running, explore the interactive documentation dashboard at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**
