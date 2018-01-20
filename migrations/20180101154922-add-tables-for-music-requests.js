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
    CREATE TABLE "RequestedArtist"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "imageUrl" character varying,
        PRIMARY KEY (id),
        CONSTRAINT "artist_url_key" UNIQUE (url)
    );
    
    CREATE TABLE "RequestedAlbum"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "imageUrl" character varying,
        "artistId" integer NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "album_url_key" UNIQUE (url),
        FOREIGN KEY ("artistId")
            REFERENCES "RequestedArtist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "RequestedSong"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "artistId" integer NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "song_url_key" UNIQUE (url),
        FOREIGN KEY ("artistId")
            REFERENCES "RequestedArtist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserRequestedArtist"
    (
        "userId" integer NOT NULL,
        "artistId" integer NOT NULL,
        PRIMARY KEY ("userId", "artistId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("artistId")
            REFERENCES "RequestedArtist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserRequestedAlbum"
    (
        "userId" integer NOT NULL,
        "albumId" integer NOT NULL,
        PRIMARY KEY ("userId", "albumId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("albumId")
            REFERENCES "RequestedAlbum" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserRequestedSong"
    (
        "userId" integer NOT NULL,
        "songId" integer NOT NULL,
        PRIMARY KEY ("userId", "songId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("songId")
            REFERENCES "RequestedSong" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP TABLE IF EXISTS "UserRequestedSong";
    DROP TABLE IF EXISTS "UserRequestedAlbum";
    DROP TABLE IF EXISTS "UserRequestedArtist";
    DROP TABLE IF EXISTS "RequestedSong";
    DROP TABLE IF EXISTS "RequestedAlbum";
    DROP TABLE IF EXISTS "RequestedArtist";
  `);
};

exports._meta = {
  "version": 1
};
