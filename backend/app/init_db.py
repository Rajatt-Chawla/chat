import asyncio
import os
import sys
from urllib.parse import urlparse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Add the parent directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.database import engine, Base
from app import models

async def init_postgres_db():
    db_url = settings.DATABASE_URL
    if not db_url.startswith("postgresql"):
        print(f"Skipping PostgreSQL initialization: DATABASE_URL is set to SQLite or non-Postgres.")
        return False
        
    print("Checking / creating PostgreSQL database...")
    parsed = urlparse(db_url)
    
    # We need to connect to 'postgres' system database to check and create the target database
    netloc_without_db = parsed.netloc
    system_url = f"postgresql+asyncpg://{netloc_without_db}/postgres"
    target_db_name = parsed.path.lstrip('/')
    
    if not target_db_name:
        print("Error: No database name specified in DATABASE_URL")
        return False
        
    # Connect to system database
    system_engine = create_async_engine(system_url, isolation_level="AUTOCOMMIT")
    async with system_engine.connect() as conn:
        # Check if database exists
        result = await conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
            {"dbname": target_db_name}
        )
        exists = result.scalar()
        
        if not exists:
            print(f"Database '{target_db_name}' does not exist. Creating...")
            await conn.execute(text(f"CREATE DATABASE {target_db_name}"))
            print(f"Database '{target_db_name}' created successfully.")
        else:
            print(f"Database '{target_db_name}' already exists.")
            
    await system_engine.dispose()
    return True

async def run_schema():
    sql_file_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "sql",
        "postgresql_schema.sql"
    )
    
    if not os.path.exists(sql_file_path):
        print(f"Error: Schema file not found at {sql_file_path}")
        return
        
    print(f"Executing schema from {sql_file_path}...")
    with open(sql_file_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
        
    # Connect to target database
    async with engine.begin() as conn:
        await conn.execute(text(schema_sql))
        
    print("Schema executed and tables initialized successfully.")

async def main():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql"):
        success = await init_postgres_db()
        if success:
            await run_schema()
    else:
        # Fallback for SQLite
        print("Initializing local SQLite database...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("SQLite database tables initialized successfully.")

if __name__ == "__main__":
    asyncio.run(main())
