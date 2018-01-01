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
    CREATE TABLE "Artist"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "imageUrl" character varying,
        PRIMARY KEY (id),
        CONSTRAINT "artist_url_key" UNIQUE (url)
    );
    
    CREATE TABLE "Album"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "artistId" integer NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "album_url_key" UNIQUE (url),
        FOREIGN KEY ("artistId")
            REFERENCES "Artist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "Song"
    (
        id SERIAL NOT NULL,
        name character varying(255) NOT NULL,
        url character varying NOT NULL,
        "artistId" integer NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "song_url_key" UNIQUE (url),
        FOREIGN KEY ("artistId")
            REFERENCES "Artist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserArtist"
    (
        "userId" integer NOT NULL,
        "artistId" integer NOT NULL,
        PRIMARY KEY ("userId", "artistId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("artistId")
            REFERENCES "Artist" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserAlbum"
    (
        "userId" integer NOT NULL,
        "albumId" integer NOT NULL,
        PRIMARY KEY ("userId", "albumId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("albumId")
            REFERENCES "Album" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
    
    CREATE TABLE "UserSong"
    (
        "userId" integer NOT NULL,
        "songId" integer NOT NULL,
        PRIMARY KEY ("userId", "songId"),
        FOREIGN KEY ("userId")
            REFERENCES "User" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY ("songId")
            REFERENCES "Song" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP TABLE IF EXISTS "UserSong";
    DROP TABLE IF EXISTS "UserAlbum";
    DROP TABLE IF EXISTS "UserArtist";
    DROP TABLE IF EXISTS "Song";
    DROP TABLE IF EXISTS "Album";
    DROP TABLE IF EXISTS "Artist";
  `);
};

exports._meta = {
  "version": 1
};
