'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db) => {

  return db.runSql(`
    CREATE TABLE "GalleryAccess"
    (
        type character varying(255) NOT NULL,
        PRIMARY KEY (type)
    );
    
    INSERT INTO "GalleryAccess" (type) 
      VALUES ('All'), ('Restricted');
    
    CREATE TABLE "GalleryItem"
    (
        id SERIAL NOT NULL,
        key character varying(512) NOT NULL,
        "partyId" integer NOT NULL,
        "lastModifiedAt" date,
        "access" character varying(255) NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "galleryitem_key_key" UNIQUE (key),
        FOREIGN KEY ("access")
          REFERENCES "GalleryAccess" (type) MATCH SIMPLE
          ON UPDATE CASCADE
          ON DELETE CASCADE
    );
    
    CREATE TABLE "GalleryItemRestrictedAccess"
    (
        "galleryItemId" integer NOT NULL,
        "userId" integer NOT NULL,
        PRIMARY KEY ("galleryItemId", "userId"),
        FOREIGN KEY ("galleryItemId")
            REFERENCES "GalleryItem" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "GallerySection"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        "partyId" integer NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "gallerysection_name_party_key" UNIQUE (name, "partyId"),
        FOREIGN KEY ("partyId")
            REFERENCES "Party" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP TABLE IF EXISTS "GalleryItemRestrictedAccess";
    DROP TABLE IF EXISTS "GalleryItem";
    DROP TABLE IF EXISTS "GallerySection";
    DROP TABLE IF EXISTS "GalleryAccess";
  `);
};

exports._meta = {
  "version": 1
};
