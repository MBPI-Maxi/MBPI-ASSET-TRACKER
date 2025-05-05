DROP TABLE IF EXISTS application_asset CASCADE;
DROP TABLE IF EXISTS application_department CASCADE;
DROP TABLE IF EXISTS application_item CASCADE;
DELETE FROM django_migrations WHERE app = 'application';