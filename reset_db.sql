-- DROP TABLE IF EXISTS application_asset CASCADE;
-- DROP TABLE IF EXISTS application_department CASCADE;
-- DROP TABLE IF EXISTS application_item CASCADE;
-- DROP TABLE IF EXISTS application_employee CASCADE;
-- DELETE FROM django_migrations WHERE app = 'application';


-- copy this into the dbshell to delete all tables
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Loop through all tables in the 'public' schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        -- Drop each table with CASCADE to remove foreign key dependencies
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
END $$;