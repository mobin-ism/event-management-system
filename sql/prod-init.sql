-- Ensure the database is created if it doesn't exist
DO $do$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'event-management') THEN
        CREATE DATABASE "event-management";
    END IF;
END $do$;

-- Switch to the created database (optional)
\c "event-management";
