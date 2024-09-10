-- Database: rt_saas_db

-- DROP DATABASE IF EXISTS rt_saas_db;

CREATE DATABASE rt_saas_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Connect to the database
\c rt_saas_db

-- Table: public.user_metadata

-- DROP TABLE IF EXISTS public.user_metadata;

CREATE TABLE IF NOT EXISTS public.user_metadata
(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    meta_creator JSONB,
    meta_content JSONB
);

ALTER TABLE IF EXISTS public.user_metadata
    OWNER to postgres;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_id
    ON public.user_metadata USING btree
    (user_id ASC NULLS LAST);

-- Grant necessary privileges
GRANT ALL ON TABLE public.user_metadata TO postgres;