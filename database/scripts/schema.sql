-- MySQL Schema scripts go here

ALTER TABLE documents ADD COLUMN admin_remark VARCHAR(255);
ALTER TABLE documents ADD COLUMN share_slug VARCHAR(255) UNIQUE;
